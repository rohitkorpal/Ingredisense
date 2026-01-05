import React, { useState, useRef } from 'react';
import { Camera, Type, Upload, AlertCircle } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (type: 'image' | 'text', data: string) => void;
  isProcessing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isProcessing }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'text'>('camera');
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix for Gemini API (usually optional for some SDKs but good practice to be clean)
      const base64Data = base64String.split(',')[1];
      onAnalyze('image', base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim().length > 3) {
      onAnalyze('text', textInput);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-3 tracking-tight">
          IngrediSense
        </h1>
        <p className="text-lg text-slate-500 max-w-lg mx-auto">
          Understand food ingredients instantly — without thinking twice.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="flex border-b border-slate-100">
          <button
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'camera' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-500' : 'text-slate-500 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('camera')}
          >
            <Camera className="w-4 h-4" /> Upload Label
          </button>
          <button
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'text' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-500' : 'text-slate-500 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('text')}
          >
            <Type className="w-4 h-4" /> Paste Ingredients
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'camera' ? (
            <div 
              className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${
                dragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <div className="bg-brand-100 p-4 rounded-full mb-4">
                <Upload className="w-8 h-8 text-brand-600" />
              </div>
              <p className="text-slate-600 font-medium">Click to upload or drag & drop</p>
              <p className="text-slate-400 text-sm mt-1">Supports JPG, PNG</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste ingredient list here (e.g., 'Water, Sugar, Citric Acid...')"
                className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center">
                 <div className="flex items-center text-xs text-slate-400 gap-1">
                   <AlertCircle className="w-3 h-3" />
                   <span>AI inference may vary</span>
                 </div>
                 <button
                  onClick={handleTextSubmit}
                  disabled={textInput.length < 3 || isProcessing}
                  className="bg-brand-600 text-white px-8 py-3 rounded-full font-medium hover:bg-brand-700 transition-all shadow-md disabled:opacity-50 disabled:shadow-none"
                >
                  Analyze Text
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-50">
          <div className="text-2xl mb-2">⚡️</div>
          <h3 className="font-semibold text-slate-700 text-sm">Instant Insight</h3>
          <p className="text-xs text-slate-500 mt-1">No complex filters. Just answers.</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-50">
          <div className="text-2xl mb-2">🧠</div>
          <h3 className="font-semibold text-slate-700 text-sm">AI Reasoning</h3>
          <p className="text-xs text-slate-500 mt-1">Understands context & trade-offs.</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-50">
          <div className="text-2xl mb-2">🛡️</div>
          <h3 className="font-semibold text-slate-700 text-sm">Honest Science</h3>
          <p className="text-xs text-slate-500 mt-1">Clear about what is uncertain.</p>
        </div>
      </div>
    </div>
  );
};
