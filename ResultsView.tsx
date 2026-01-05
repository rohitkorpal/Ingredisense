import React, { useState } from 'react';
import { AnalysisResult, IngredientRisk } from '../types';
import { CheckCircle, AlertTriangle, AlertOctagon, HelpCircle, ChevronDown, ChevronUp, RefreshCw, ArrowLeft } from 'lucide-react';
import { ChatBot } from './ChatBot';

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const [showIngredients, setShowIngredients] = useState(false);

  const getVerdictColor = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'safe': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'caution': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'avoid': return <AlertOctagon className="w-4 h-4 text-red-500" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-24">
      <button 
        onClick={onReset}
        className="mb-6 flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Analyze another
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-5 fade-in duration-500">
        
        {/* Header / Verdict Section */}
        <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-start justify-between mb-4">
             <div>
               <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Product Context</span>
               <h2 className="text-xl font-bold text-slate-800">{result.productName || "Analyzed Product"}</h2>
             </div>
             <div className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${getVerdictColor(result.verdict)}`}>
               {result.verdict}
             </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm font-medium text-brand-600 mb-1">{result.intentInference}</p>
            <p className="text-lg text-slate-700 leading-relaxed">{result.summary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
               <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                 <span className="text-blue-500">ℹ️</span> Key Insights
               </h3>
               <ul className="space-y-2">
                 {result.keyInsights.map((insight, idx) => (
                   <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                     <span className="mt-1.5 w-1 h-1 bg-slate-400 rounded-full flex-shrink-0"></span>
                     {insight}
                   </li>
                 ))}
               </ul>
             </div>
             
             <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
               <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                 <span className="text-orange-500">⚠️</span> Uncertainty & Trade-offs
               </h3>
               <p className="text-sm text-slate-600 italic">
                 "{result.uncertainty}"
               </p>
             </div>
          </div>
        </div>

        {/* Ingredients Accordion */}
        <div className="bg-white">
          <button 
            onClick={() => setShowIngredients(!showIngredients)}
            className="w-full px-8 py-4 flex items-center justify-between text-slate-600 hover:bg-slate-50 transition-colors border-b border-slate-50"
          >
            <span className="font-semibold">Ingredient Breakdown ({result.ingredients.length})</span>
            {showIngredients ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {showIngredients && (
            <div className="px-8 py-4 space-y-3 bg-slate-50/50">
              {result.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <div className="mt-0.5">{getRiskIcon(ing.riskLevel)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{ing.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold ${
                        ing.riskLevel === 'safe' ? 'bg-green-50 text-green-700 border-green-100' :
                        ing.riskLevel === 'caution' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                        ing.riskLevel === 'avoid' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-gray-50 text-gray-700 border-gray-100'
                      }`}>
                        {ing.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{ing.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Bot Integration */}
      <ChatBot context={result} />
    </div>
  );
};
