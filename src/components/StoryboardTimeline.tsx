/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Clock, FastForward } from 'lucide-react';
import { CustomMarker, Act } from '../types';

interface StoryboardTimelineProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackSpeed: number;
  acts: Act[];
  markers: CustomMarker[];
  onPlayPause: () => void;
  onStop: () => void;
  onScrub: (time: number) => void;
  onSpeedChange: (speed: number) => void;
  onAddMarker: (time: number, label: string, color: string) => void;
  onDeleteMarker: (id: string) => void;
}

export default function StoryboardTimeline({
  currentTime,
  duration,
  isPlaying,
  playbackSpeed,
  acts,
  markers,
  onPlayPause,
  onStop,
  onScrub,
  onSpeedChange,
  onAddMarker,
  onDeleteMarker,
}: StoryboardTimelineProps) {
  const [markerText, setMarkerText] = useState('');
  const [markerColor, setMarkerColor] = useState('#f59e0b'); // amber

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScrub(parseFloat(e.target.value));
  };

  const submitMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markerText.trim()) return;
    onAddMarker(currentTime, markerText.trim(), markerColor);
    setMarkerText('');
  };

  return (
    <div className="bg-brand-panel border border-brand-border rounded-xl p-4 md:p-6 shadow-xl" id="storyboard-timeline-container">
      {/* Dynamic Progress Engine */}
      <div className="space-y-4">
        {/* Time Labels */}
        <div className="flex justify-between items-center text-xs font-mono text-brand-muted">
          <div className="flex items-center gap-2 bg-brand-bg-darker px-2.5 py-1.5 rounded-md border border-brand-border">
            <Clock className="w-3 h-3 text-brand-gold" />
            <span className="text-brand-text font-bold">{formatTime(currentTime)}</span>
            <span className="text-brand-border">/</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex gap-2">
            {[0.5, 1, 1.5, 2].map((sp) => (
              <button
                key={sp}
                onClick={() => onSpeedChange(sp)}
                className={`px-2 py-0.5 rounded text-xxs border transition font-bold cursor-pointer ${
                  playbackSpeed === sp
                    ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/40'
                    : 'bg-brand-bg-darker text-brand-muted border-brand-border hover:text-brand-text hover:border-brand-muted'
                }`}
                title={`Speed x${sp}`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

        {/* Linear Track Scrub */}
        <div className="relative pt-1.5 pb-2">
          {/* Custom Marker Flags */}
          {markers.map((marker) => {
            const percent = (marker.time / duration) * 100;
            return (
              <div
                key={marker.id}
                className="absolute top-0 w-2 h-2 rounded-full cursor-pointer group z-10 -translate-x-1/2 transition transform hover:scale-125 hover:shadow-md"
                style={{ left: `${percent}%`, backgroundColor: marker.color }}
                onClick={() => onScrub(marker.time)}
              >
                <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0A0C10] text-[10px] text-brand-text font-mono py-1 px-2.5 rounded border border-brand-border whitespace-nowrap shadow-lg">
                  <span className="font-bold text-brand-gold">[{formatTime(marker.time)}]</span> {marker.label}
                </div>
              </div>
            );
          })}

          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSliderChange}
            className="w-full h-2 bg-brand-bg-darker rounded-lg appearance-none cursor-pointer accent-[#E3B341] focus:outline-none focus:ring-1 focus:ring-brand-gold/40"
            id="timeline-scrubber"
          />

          {/* Acts segment bounds indicator overlay */}
          <div className="absolute left-0 right-0 h-1.5 pointer-events-none flex justify-between px-1" style={{ top: '10px' }}>
            {acts.map((act, idx) => {
              const startPct = (act.startTime / duration) * 100;
              const endPct = (act.endTime / duration) * 100;
              return (
                <div
                  key={act.id}
                  className="absolute h-1.5 border-r border-[#30363D]/40"
                  style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
                >
                  <span className="hidden md:inline absolute left-1 top-2.5 text-[9px] uppercase tracking-wider text-[#8B949E]/40 font-mono select-none">
                    ACT {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control Nodes Layout */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mt-6 pt-4 border-t border-brand-border">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onPlayPause}
            className="p-3 bg-brand-gold hover:bg-brand-gold/95 active:bg-brand-gold/90 text-brand-dark rounded-full shadow-lg transition duration-200 flex items-center justify-center cursor-pointer"
            id="play-pause-btn"
            title={isPlaying ? "Pause Timeline" : "Play Timeline"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-brand-dark" /> : <Play className="w-5 h-5 fill-brand-dark ml-0.5" />}
          </button>

          <button
            onClick={onStop}
            className="p-3 bg-brand-bg-darker hover:bg-brand-panel text-brand-muted border border-brand-border rounded-full transition cursor-pointer"
            title="Reset to Beginning"
            id="control-reset-btn"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="hidden lg:flex flex-wrap items-center gap-2 text-xxs text-brand-muted font-mono">
            <span>Or spacebar. Active:</span>
            {acts.map((act) => {
              const isActive = currentTime >= act.startTime && currentTime < act.endTime;
              return (
                <button
                  key={act.id}
                  onClick={() => onScrub(act.startTime)}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    isActive ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/30' : 'hover:text-brand-text'
                  }`}
                >
                  {act.title.split(':')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drop Marker Form */}
        <form onSubmit={submitMarker} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Add marker at current frame..."
            value={markerText}
            onChange={(e) => setMarkerText(e.target.value)}
            className="flex-1 md:w-56 bg-brand-bg-darker placeholder-brand-muted/50 border border-brand-border rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-brand-gold text-brand-text"
            id="custom-marker-input"
          />

          <div className="flex gap-1.5">
            {['#E3B341', '#ec4899', '#58A6FF', '#7EE787'].map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setMarkerColor(c)}
                className={`w-4 h-4 rounded-full border-2 transition cursor-pointer ${
                  markerColor === c ? 'border-brand-text scale-110 shadow' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="p-2 bg-brand-bg-darker text-brand-muted hover:text-brand-text hover:bg-brand-panel transition border border-brand-border rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Drop Marker"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Embedded Marker Manager Drawer */}
      {markers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#30363D]/40">
          <p className="text-[10px] uppercase tracking-wider text-brand-muted font-mono font-bold mb-2">Saved Timelines Markers</p>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {markers.map((marker) => (
              <div
                key={marker.id}
                className="flex items-center gap-1.5 bg-brand-bg-darker/60 border border-brand-border rounded-md py-1 px-2.5 text-xxs font-mono text-brand-text shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: marker.color }} />
                <button
                  type="button"
                  onClick={() => onScrub(marker.time)}
                  className="font-bold text-brand-gold hover:underline cursor-pointer"
                >
                  [{formatTime(marker.time)}]
                </button>
                <span className="truncate max-w-32 text-brand-muted">{marker.label}</span>
                <button
                  onClick={() => onDeleteMarker(marker.id)}
                  className="text-brand-muted hover:text-red-400 transition ml-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
