import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

const messages = [
  "Scanning ingredient list...",
  "Inferring product intent...",
  "Analyzing health trade-offs...",
  "Checking for allergens and additives...",
  "Synthesizing final verdict...",
];

export const ThinkingIndicator: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-brand-500 opacity-20 blur-xl rounded-full animate-pulse-slow"></div>
        <div className="bg-white p-4 rounded-full shadow-xl relative z-10 border border-brand-100">
            <BrainCircuit className="w-12 h-12 text-brand-600 animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        IngrediSense is thinking
      </h3>
      <p className="text-slate-500 h-6 overflow-hidden transition-all duration-300">
        {messages[messageIndex]}
      </p>
    </div>
  );
};
