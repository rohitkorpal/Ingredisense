import React, { useState } from 'react';
import { AnalysisStatus, AnalysisResult } from './types';
import { analyzeImageOrText } from './services/gemini';
import { InputSection } from './components/InputSection';
import { ThinkingIndicator } from './components/ThinkingIndicator';
import { ResultsView } from './components/ResultsView';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (type: 'image' | 'text', data: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    try {
      const dataResult = await analyzeImageOrText({ type, data });
      setResult(dataResult);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
      // In a real app, show a toast or error modal
      alert("Analysis failed. Please try again with a clearer image or text.");
      setStatus(AnalysisStatus.IDLE);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
             <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
               I
             </div>
             <span className="font-bold text-lg tracking-tight text-slate-800">IngrediSense</span>
          </div>
          <div>
            <a 
              href="https://ai.google.dev/gemini-api/docs" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs font-medium text-slate-400 hover:text-brand-600 transition-colors"
            >
              Powered by Gemini 3
            </a>
          </div>
        </div>
      </nav>

      <main className="py-12">
        {status === AnalysisStatus.IDLE && (
          <div className="animate-in fade-in zoom-in duration-500">
            <InputSection onAnalyze={handleAnalyze} isProcessing={false} />
          </div>
        )}

        {status === AnalysisStatus.ANALYZING && (
          <ThinkingIndicator />
        )}

        {status === AnalysisStatus.COMPLETE && result && (
          <ResultsView result={result} onReset={handleReset} />
        )}
      </main>
      
    </div>
  );
};

export default App;
