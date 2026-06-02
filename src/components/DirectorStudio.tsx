/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Copy, BookOpen, AlertCircle, RefreshCw, Layers, Volume2, Film } from 'lucide-react';
import { Shot, AISuggestion } from '../types';

interface DirectorStudioProps {
  activeShot: Shot | null;
  activeActTitle: string;
  onSaveToNotebook: (shotId: string, text: string) => void;
}

export default function DirectorStudio({ activeShot, activeActTitle, onSaveToNotebook }: DirectorStudioProps) {
  const [enrichType, setEnrichType] = useState<'visual_prompt' | 'voiceover_guide' | 'animator_notes'>('visual_prompt');
  const [customComment, setCustomComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Local cache of suggestions mapped by shotId + type
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Parse raw markdown safely to standard Tailwind HTML layout
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-brand-text mt-4 mb-2 border-b border-brand-border pb-1 font-sans uppercase tracking-wider">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-serif italic text-brand-gold mt-5 mb-2 border-b border-brand-border pb-1 flex items-center gap-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-serif italic font-black text-brand-gold mt-6 mb-3 border-b-2 border-brand-border pb-1">{line.replace('# ', '')}</h2>;
      }
      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const cleaned = line.replace(/^[-*]\s+/, '');
        // Bold parsing inside list
        return (
          <ul key={idx} className="list-disc list-inside text-xs text-[#E0E2E6] space-y-1 pl-2">
            <li>{parseBoldText(cleaned)}</li>
          </ul>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        const cleaned = line.replace(/^\d+\.\s+/, '');
        return (
          <ol key={idx} className="list-decimal list-inside text-xs text-[#E0E2E6] space-y-1 pl-2">
            <li>{parseBoldText(cleaned)}</li>
          </ol>
        );
      }
      // General text or bolded text
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-xs text-[#C9D1D9] leading-relaxed my-1.5">{parseBoldText(line)}</p>;
    });
  };

  const parseBoldText = (txt: string) => {
    const parts = txt.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-brand-gold font-bold">{part}</strong>;
      }
      // Handle inline code tick
      const codeParts = part.split(/`(.*?)`/g);
      return codeParts.map((sub, j) => {
        if (j % 2 === 1) {
          return <code key={j} className="bg-brand-panel font-mono text-[10px] text-brand-muted border border-brand-border rounded px-1 py-0.5">{sub}</code>;
        }
        return sub;
      });
    });
  };

  const executeEnrichment = async () => {
    if (!activeShot) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shotId: activeShot.id,
          description: activeShot.description,
          visualPrompt: activeShot.visualPrompt,
          camera: activeShot.camera,
          lighting: activeShot.lighting,
          audioText: activeShot.audioText,
          audioChar: activeShot.audioChar,
          acousticCues: activeShot.acousticCues,
          type: enrichType,
          customQuery: customComment.trim() || undefined,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const cacheKey = `${activeShot.id}_${enrichType}`;
        setSuggestions((prev) => ({
          ...prev,
          [cacheKey]: resData.data,
        }));
      } else {
        setError(resData.error || "Failed to process enrichment request.");
      }
    } catch (err: any) {
      setError(err?.message || "Internal network error contacting our director core.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const currentText = activeShot ? suggestions[`${activeShot.id}_${enrichType}`] : '';
    if (!currentText) return;
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNotebookSave = () => {
    if (!activeShot) return;
    const currentText = suggestions[`${activeShot.id}_${enrichType}`];
    if (!currentText) return;
    onSaveToNotebook(activeShot.id, currentText);
  };

  const getActiveText = () => {
    if (!activeShot) return '';
    return suggestions[`${activeShot.id}_${enrichType}`] || '';
  };

  return (
    <div className="bg-brand-panel border border-brand-border rounded-xl p-5 shadow-xl flex flex-col h-full" id="director-studio-root">
      {/* Header Info */}
      <div className="flex justify-between items-start border-b border-brand-border pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E3B341] uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini Director Studio
          </div>
          <h3 className="text-sm font-bold text-brand-text truncate max-w-72 font-serif italic">
            {activeShot ? `Shot ${activeShot.number}: ${activeShot.camera.split(',')[0]}` : "No Shot Selected"}
          </h3>
          <p className="text-xxs text-brand-muted font-mono mt-0.5">{activeActTitle}</p>
        </div>

        {/* Strategy pill pickers */}
        <div className="flex bg-brand-bg-darker p-1 rounded-lg border border-brand-border">
          <button
            onClick={() => setEnrichType('visual_prompt')}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              enrichType === 'visual_prompt' ? 'bg-[#1F2937] text-brand-gold shadow border border-brand-border/40' : 'text-[#8B949E] hover:text-[#E0E2E6]'
            }`}
            title="Visual Prompt Expansion"
          >
            <Film className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEnrichType('voiceover_guide')}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              enrichType === 'voiceover_guide' ? 'bg-[#1F2937] text-brand-gold shadow border border-brand-border/40' : 'text-[#8B949E] hover:text-[#E0E2E6]'
            }`}
            title="Voice acting pacing card"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEnrichType('animator_notes')}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              enrichType === 'animator_notes' ? 'bg-[#1F2937] text-brand-gold shadow border border-brand-border/40' : 'text-[#8B949E] hover:text-[#E0E2E6]'
            }`}
            title="Mechanical animator sheet"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {activeShot ? (
        <div className="flex-1 flex flex-col space-y-4">
          {/* Settings area */}
          <div className="space-y-3 bg-brand-bg-darker/50 p-3.5 rounded-lg border border-brand-border">
            <div className="flex justify-between text-xxs font-mono">
              <span className="text-brand-muted uppercase tracking-wider">Enriching Focus</span>
              <span className="text-brand-gold font-bold uppercase tracking-wider">
                {enrichType === 'visual_prompt' && "Scenic Illustration Card"}
                {enrichType === 'voiceover_guide' && "Actor Dialogue Coaching"}
                {enrichType === 'animator_notes' && "Keyframe Physics Sheet"}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8B949E] font-mono block uppercase">Director Notes & Prompters</label>
              <textarea
                placeholder="Add director instructions (e.g., 'Make lights neon glow,' 'Slow pacing,' or leave blank)..."
                value={customComment}
                onChange={(e) => setCustomComment(e.target.value)}
                className="w-full h-14 max-h-20 bg-brand-panel border border-brand-border placeholder-brand-muted/30 rounded px-2.5 py-1.5 text-xxs focus:outline-none focus:border-brand-gold text-brand-text"
              />
            </div>

            <button
              onClick={executeEnrichment}
              disabled={loading}
              className={`w-full py-2 px-4 rounded font-mono font-bold text-xs flex justify-center items-center gap-2 cursor-pointer transition ${
                loading
                  ? 'bg-brand-panel text-brand-muted border border-brand-border'
                  : 'bg-brand-gold hover:bg-brand-gold/95 text-brand-dark font-bold hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating Guidelines...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze and Enrich Shot
                </>
              )}
            </button>
          </div>

          {/* Prompt output or empty pane */}
          <div className="flex-1 bg-[#0A0C10]/80 border border-brand-border rounded-lg p-4 min-h-[160px] md:min-h-[200px] overflow-y-auto relative flex flex-col justify-between">
            {error && (
              <div className="bg-red-950/30 border border-red-900/50 text-[#F85149] text-xxs rounded p-3 flex gap-2 items-start mb-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold font-mono">Error Processing Blueprint</p>
                  <p className="text-zinc-400 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {getActiveText() ? (
              <div className="space-y-1 pb-4 flex-1">
                {renderMarkdown(getActiveText())}
              </div>
            ) : (
              <div className="my-auto text-center py-6 px-4">
                <Sparkles className="w-8 h-8 text-[#30363D] mx-auto mb-3" />
                <p className="text-xs font-mono font-bold text-brand-muted">Blueprint Workspace Ready</p>
                <p className="text-xxs text-brand-muted/70 max-w-xs mx-auto mt-1 leading-normal">
                  Connect your API key to access live Gemini directions, or tap the button above to view simulated technical guides.
                </p>
              </div>
            )}

            {/* Quick action triggers */}
            {getActiveText() && (
              <div className="flex gap-2 mt-4 pt-3 border-t border-brand-border justify-end shrink-0 sticky bottom-0 bg-brand-bg-darker py-1">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-brand-panel hover:bg-brand-bg-darker text-brand-text border border-brand-border rounded text-xxs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Copy Blueprint text"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "Copied!" : "Copy Sheet"}
                </button>
                <button
                  onClick={handleNotebookSave}
                  className="px-3 py-1.5 bg-[#E3B341]/10 hover:bg-[#E3B341]/20 text-brand-gold rounded text-xxs font-mono font-bold flex items-center gap-1.5 transition border border-brand-gold/20 cursor-pointer"
                  title="Save to production notes"
                >
                  <BookOpen className="w-3 h-3" />
                  Apply to Notebook
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-brand-border rounded-lg">
          <Film className="w-10 h-10 text-[#30363D] mb-2" />
          <p className="text-xs font-mono text-brand-muted">Pick any Shot to invoke the Gemini Director Studio</p>
        </div>
      )}
    </div>
  );
}
