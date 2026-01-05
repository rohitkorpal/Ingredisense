import { GoogleGenAI, Type, Schema, DynamicRetrievalConfig } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured output from the analysis model
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING, description: "Inferred product name or category" },
    verdict: { type: Type.STRING, enum: ['Excellent', 'Good', 'Fair', 'Poor'], description: "Overall health verdict" },
    summary: { type: Type.STRING, description: "A concise, human-readable summary of the findings (2-3 sentences)" },
    intentInference: { type: Type.STRING, description: "Inferred context (e.g., 'This appears to be a sugary snack aimed at children')" },
    keyInsights: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3-4 bullet points on the most important takeaways (trade-offs, benefits)"
    },
    uncertainty: { type: Type.STRING, description: "Honest statement about what is unclear or mixed scientific evidence" },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          riskLevel: { type: Type.STRING, enum: ['safe', 'caution', 'avoid', 'unknown'] },
          reasoning: { type: Type.STRING, description: "Why this classification was given" }
        },
        required: ["name", "riskLevel", "reasoning"]
      }
    }
  },
  required: ["verdict", "summary", "intentInference", "keyInsights", "uncertainty", "ingredients"]
};

export const analyzeImageOrText = async (
  input: { type: 'image' | 'text', data: string }
): Promise<AnalysisResult> => {
  
  const model = "gemini-3-pro-preview"; // Using Pro for deep reasoning/image analysis
  
  const systemInstruction = `
    You are IngrediSense, an expert AI food scientist and consumer health advocate. 
    Your goal is to interpret ingredient labels for laypeople to reduce cognitive load.
    
    CRITICAL INSTRUCTIONS:
    1. **Intent-First:** Infer who this product is for (e.g., athletes, kids, weight-loss) and judge it in that context.
    2. **Reasoning:** Do not just list facts. Explain trade-offs. (e.g., "X is safe but high calorie").
    3. **Uncertainty:** Be honest. If evidence is mixed (e.g., aspartame, seed oils), say so. Do not be overconfident.
    4. **Clarity:** Use simple, direct language. Avoid jargon unless explained.
  `;

  const promptText = input.type === 'text' 
    ? `Analyze this ingredient list: "${input.data}"`
    : "Analyze this image of a food label. Extract the ingredients and provide a health assessment.";

  const parts: any[] = [{ text: promptText }];
  
  if (input.type === 'image') {
    // data is base64 string
    parts.unshift({
      inlineData: {
        mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or we could detect
        data: input.data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 10240 }, // Enable thinking for reasoning quality (Pro model only)
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const chatWithAgent = async (
  history: { role: 'user' | 'model', text: string }[],
  newMessage: string,
  context?: AnalysisResult
) => {
  const model = "gemini-3-flash-preview"; // Flash is faster for chat
  
  let systemContext = `You are a helpful AI assistant for IngrediSense. You answer follow-up questions about food ingredients.`;
  
  if (context) {
    systemContext += `\n\nCURRENT CONTEXT:\nThe user is looking at a product: ${context.productName || 'Unknown Product'}.
    Verdict: ${context.verdict}.
    Summary: ${context.summary}.
    Ingredients: ${context.ingredients.map(i => i.name).join(', ')}.
    `;
  }

  // Construct previous history for context
  const historyContent = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  try {
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: systemContext,
        tools: [{ googleSearch: {} }], // Enable search for up-to-date info
      },
      history: historyContent
    });

    const response = await chat.sendMessage({ message: newMessage });
    
    // Extract grounding if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let sources: { uri: string; title: string }[] = [];
    
    if (groundingChunks) {
      groundingChunks.forEach(chunk => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    return {
      text: response.text || "I'm sorry, I couldn't generate a response.",
      sources
    };

  } catch (error) {
    console.error("Chat failed:", error);
    throw error;
  }
};
