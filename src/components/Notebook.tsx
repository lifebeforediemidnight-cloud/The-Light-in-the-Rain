/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, HelpCircle, Edit3, Clipboard, FileText } from 'lucide-react';
import { Shot, DirectorNote } from '../types';

interface NotebookProps {
  shots: Shot[];
  notes: Record<string, DirectorNote>;
  activeShotId: string | null;
  onSelectShot: (id: string, time: number) => void;
  onUpdateNote: (shotId: string, updated: Partial<DirectorNote>) => void;
}

export default function Notebook({
  shots,
  notes,
  activeShotId,
  onSelectShot,
  onUpdateNote,
}: NotebookProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [editingShotId, setEditingShotId] = useState<string | null>(null);

  // Form states
  const [customVisual, setCustomVisual] = useState('');
  const [actorInstr, setActorInstr] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [noteStatus, setNoteStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const startEditing = (shot: Shot) => {
    const defaultNote = notes[shot.id] || {
      shotId: shot.id,
      customVisualPrompt: '',
      actorInstruction: '',
      status: 'pending',
      notes: '',
    };
    setEditingShotId(shot.id);
    setCustomVisual(defaultNote.customVisualPrompt);
    setActorInstr(defaultNote.actorInstruction);
    setCustomNotes(defaultNote.notes);
    setNoteStatus(defaultNote.status);
  };

  const saveNote = (shotId: string) => {
    onUpdateNote(shotId, {
      customVisualPrompt: customVisual,
      actorInstruction: actorInstr,
      status: noteStatus,
      notes: customNotes,
    });
    setEditingShotId(null);
  };

  // Filter & Search shots
  const filteredShots = shots.filter((shot) => {
    const note = notes[shot.id] || { status: 'pending', notes: '', customVisualPrompt: '' };
    
    // Status filter
    if (statusFilter !== 'all' && note.status !== statusFilter) return false;

    // Search query
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      shot.description.toLowerCase().includes(term) ||
      shot.camera.toLowerCase().includes(term) ||
      (shot.audioText && shot.audioText.toLowerCase().includes(term)) ||
      note.notes.toLowerCase().includes(term)
    );
  });

  const getStatusIcon = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'pending':
      default:
        return <HelpCircle className="w-4 h-4 text-zinc-650" />;
    }
  };

  const getStatusPillClasses = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'in-progress':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'pending':
      default:
        return 'bg-zinc-800 text-zinc-500 border border-zinc-700/50';
    }
  };

  return (
    <div className="bg-brand-panel border border-brand-border rounded-xl p-5 shadow-xl flex flex-col h-full" id="director-notebook-root">
      {/* Label Title */}
      <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#8B949E] uppercase tracking-widest mb-1">
            <Clipboard className="w-3.5 h-3.5 text-brand-gold" />
            Script Binder
          </div>
          <h3 className="text-sm font-bold text-brand-text font-serif italic">Production Checklist</h3>
        </div>
        <div className="text-[10px] font-mono text-brand-muted bg-brand-bg-darker border border-brand-border px-2 py-0.5 rounded">
          {Object.values(notes).filter((n) => n.status === 'completed').length} / {shots.length} Done
        </div>
      </div>

      {/* Searching & Query Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search scenes or dialogue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-bg-darker border border-brand-border rounded-lg text-xxs py-2 pl-9 pr-4 focus:outline-none focus:border-brand-gold text-brand-text"
            id="notebook-search"
          />
        </div>

        <div className="flex gap-1.5">
          {(['all', 'pending', 'in-progress', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 py-1 px-1 rounded-md text-[10px] font-mono font-bold capitalize border transition cursor-pointer ${
                statusFilter === filter
                  ? 'bg-[#1F2937] border-brand-border text-brand-gold shadow'
                  : 'bg-brand-bg-darker border-brand-border text-brand-muted hover:text-brand-text'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Script list layout */}
      <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[480px] pr-1" id="notebook-scripts-scroller">
        {filteredShots.map((shot) => {
          const note = notes[shot.id] || { status: 'pending', notes: '', customVisualPrompt: '', actorInstruction: '' };
          const isActive = activeShotId === shot.id;
          const isEditing = editingShotId === shot.id;

          return (
            <div
              key={shot.id}
              className={`border rounded-lg p-3.5 transition duration-200 relative ${
                isActive
                  ? 'bg-[#1F2937]/50 border-brand-gold/55 shadow-md'
                  : 'bg-brand-bg-darker/35 border-brand-border/80 hover:bg-brand-bg-darker/60'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono font-bold text-brand-muted">
                  SHOT {shot.number}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded capitalize ${getStatusPillClasses(note.status)}`}>
                    {note.status}
                  </span>
                  {getStatusIcon(note.status)}
                </div>
              </div>

              {/* Clicking shot scrolls to frame time */}
              <button
                type="button"
                onClick={() => {
                  onSelectShot(shot.id, shot.number);
                }}
                className="text-left group cursor-pointer block w-full"
              >
                <p className="text-xxs font-semibold text-[#E0E2E6] group-hover:text-brand-gold transition leading-relaxed">
                  {shot.description}
                </p>
              </button>

              {/* Show dialogue line in script */}
              {shot.audioText && (
                <div className="mt-2 bg-[#0D1117] p-2.5 rounded border border-brand-border border-l-2 border-l-brand-gold font-mono text-[10px] text-brand-muted">
                  <strong className="text-brand-gold uppercase">{shot.audioChar}: </strong>"{shot.audioText}"
                </div>
              )}

              {/* Editable values summary or active edit form */}
              {isEditing ? (
                <div className="mt-4 pt-3 border-t border-brand-border space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-brand-muted block uppercase">Manual Art Correction</label>
                    <input
                      type="text"
                      value={customVisual}
                      onChange={(e) => setCustomVisual(e.target.value)}
                      placeholder="Add custom visual prompt keywords..."
                      className="w-full bg-brand-panel border border-brand-border text-xxs py-1.5 px-2 focus:outline-none focus:border-brand-gold text-brand-text rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-brand-muted block uppercase">Director Notes & Memo</label>
                    <textarea
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="Animate dynamic particles, sync lighting, etc..."
                      className="w-full h-12 bg-brand-panel border border-brand-border text-xxs py-1.5 px-2 focus:outline-none focus:border-brand-gold text-brand-text rounded"
                    />
                  </div>

                  <div className="flex gap-2 items-center justify-between">
                    <div>
                      <label className="text-[9px] font-mono text-brand-muted block uppercase mb-1">State</label>
                      <div className="flex gap-1.5">
                        {(['pending', 'in-progress', 'completed'] as const).map((st) => (
                          <button
                            type="button"
                            key={st}
                            onClick={() => setNoteStatus(st)}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono capitalize border cursor-pointer ${
                              noteStatus === st
                                ? 'bg-brand-gold text-brand-dark border-brand-gold font-extrabold'
                                : 'bg-brand-bg-darker text-brand-muted border-brand-border hover:text-brand-text'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 self-end">
                      <button
                        onClick={() => setEditingShotId(null)}
                        className="px-2.5 py-1 text-xxs border border-brand-border hover:bg-brand-bg-darker text-brand-muted rounded transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveNote(shot.id)}
                        className="px-2.5 py-1 text-xxs bg-brand-gold text-brand-dark font-bold hover:bg-brand-gold/90 rounded transition cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex gap-1 justify-between items-center">
                  {/* Summary markers if present */}
                  <div className="flex-1">
                    {note.customVisualPrompt && (
                      <p className="text-[9px] text-[#58A6FF] truncate font-mono">
                        🎨 {note.customVisualPrompt}
                      </p>
                    )}
                    {note.notes && (
                      <p className="text-[9px] text-brand-muted truncate mt-0.5 italic">
                        📝 {note.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => startEditing(shot)}
                    className="p-1 px-2.5 border border-brand-border/40 hover:bg-brand-panel text-brand-muted hover:text-brand-text rounded text-[10px] font-mono font-bold flex items-center gap-1.5 transition ml-auto cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit Memo
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredShots.length === 0 && (
          <div className="text-center py-8 text-brand-muted font-mono space-y-1">
            <FileText className="w-8 h-8 text-[#30363D] mx-auto mb-2" />
            <p className="text-xxs">No matches in binder.</p>
          </div>
        )}
      </div>
    </div>
  );
}
