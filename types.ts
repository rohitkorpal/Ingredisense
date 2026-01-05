export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface IngredientRisk {
  name: string;
  riskLevel: 'safe' | 'caution' | 'avoid' | 'unknown';
  reasoning: string;
}

export interface AnalysisResult {
  productName?: string;
  verdict: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  summary: string;
  intentInference: string; // e.g. "Likely a snack for children"
  keyInsights: string[];
  uncertainty: string; // Explanation of what is not fully known
  ingredients: IngredientRisk[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  sources?: { uri: string; title: string }[];
}

export enum AppMode {
  INPUT = 'INPUT',
  RESULTS = 'RESULTS'
}
