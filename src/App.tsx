/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, BookOpen, Sparkles, MapPin, Cloudy, Calendar, Info, Volume2, CloudRain } from 'lucide-react';

import { STORYBOARD_DATA } from './data';
import { Act, Shot, DirectorNote, CustomMarker } from './types';
import { synth } from './audioSynth';

import StoryboardTimeline from './components/StoryboardTimeline';
import TheatreMode from './components/TheatreMode';
import DirectorStudio from './components/DirectorStudio';
import Notebook from './components/Notebook';

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'ai' | 'script'>('ai');

  // Load custom markers from localStorage or default
  const [markers, setMarkers] = useState<CustomMarker[]>(() => {
    try {
      const saved = localStorage.getItem('storyboard_markers');
      return saved ? JSON.parse(saved) : [
        { id: 'm1', time: 8.5, label: 'Cut to Tabebuia Flower', color: '#f59e0b' },
        { id: 'm2', time: 100.0, label: 'Shift Begins - Cafe Ambience', color: '#ec4899' },
        { id: 'm3', time: 177.0, label: 'Bicycle Fall Sound Trigger', color: '#3b82f6' },
        { id: 'm4', time: 215.0, label: 'Acoustic Piano Entrance', color: '#10b981' },
      ];
    } catch {
      return [];
    }
  });

  // Load director notes from localStorage
  const [notes, setNotes] = useState<Record<string, DirectorNote>>(() => {
    try {
      const saved = localStorage.getItem('storyboard_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Flat list of all shots for matching / search
  const allShots = STORYBOARD_DATA.flatMap((act) =>
    act.scenes.flatMap((scene) => scene.shots)
  );

  const duration = 300.0; // 5 minutes in seconds

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('storyboard_markers', JSON.stringify(markers));
  }, [markers]);

  useEffect(() => {
    localStorage.setItem('storyboard_notes', JSON.stringify(notes));
  }, [notes]);

  // High performance game-loop style frame tickers for smooth playback sync
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const tick = () => {
        const now = performance.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= duration) {
            setIsPlaying(false);
            return 0; // Return to start
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(tick);
      };
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Bind Spacebar key input for playback toggling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is entering inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine active Act, Scene, and Shot based on currentTime boundary
  const getActiveState = () => {
    let activeAct: Act | null = null;
    let activeShot: Shot | null = null;

    // Search and match Acts
    for (const act of STORYBOARD_DATA) {
      if (currentTime >= act.startTime && currentTime <= act.endTime) {
        activeAct = act;
        break;
      }
    }
    // Deep match default backstop
    if (!activeAct) activeAct = STORYBOARD_DATA[0];

    // Build timeline of shots
    let aggregatedTime = 0;
    // Map shot lengths roughly to segments spread
    // We have 28 shots spread evenly across the 300s
    const secondsPerShot = duration / allShots.length;

    const shotIndex = Math.floor(currentTime / secondsPerShot);
    activeShot = allShots[Math.min(shotIndex, allShots.length - 1)];

    return { activeAct, activeShot };
  };

  const { activeAct, activeShot } = getActiveState();

  // Storyboard play controls handlers
  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    synth.stopAll();
  };

  const handleScrub = (time: number) => {
    setCurrentTime(time);
  };

  const handleSpeedChange = (spd: number) => {
    setPlaybackSpeed(spd);
  };

  // Marker Operations
  const handleAddMarker = (time: number, label: string, color: string) => {
    const fresh: CustomMarker = {
      id: `m_${Date.now()}`,
      time,
      label,
      color,
    };
    setMarkers((prev) => [...prev, fresh].sort((a, b) => a.time - b.time));
  };

  const handleDeleteMarker = (id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  // Jump timeline to specific Shot selected from Notebook script
  const handleSelectShot = (shotId: string, shotNum: number) => {
    const index = allShots.findIndex((s) => s.id === shotId);
    if (index !== -1) {
      const secondsPerShot = duration / allShots.length;
      const targetTime = index * secondsPerShot + 0.1;
      setCurrentTime(targetTime);
    }
  };

  // Notebook update hooks
  const handleUpdateNote = (shotId: string, updated: Partial<DirectorNote>) => {
    setNotes((prev) => {
      const current = prev[shotId] || {
        shotId,
        customVisualPrompt: '',
        actorInstruction: '',
        status: 'pending',
        notes: '',
      };
      return {
        ...prev,
        [shotId]: { ...current, ...updated },
      };
    });
  };

  const handleSaveToNotebook = (shotId: string, text: string) => {
    handleUpdateNote(shotId, {
      notes: text,
      status: 'in-progress',
    });
    // Swap tab automatically to notebooks checklist
    setActiveTab('script');
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text flex flex-col font-sans antialiased lg:border-[12px] border-brand-panel p-4 md:p-6 lg:p-8" id="storyboard-app-root">
      {/* Editorial Artistic Banner Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-border pb-6 mb-6 gap-4" id="artistic-header">
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-brand-gold font-normal">Maleya Belaku</h1>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em] text-brand-muted mt-2">
            The Light in the Rain • Video Production Blueprint
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex space-x-3">
            <div className="text-[10px] font-mono px-2 py-1 bg-brand-panel rounded border border-brand-border text-brand-muted">
              RUN TIME: <span className="text-brand-gold font-bold">5:00</span>
            </div>
            <div className="text-[10px] font-mono px-2 py-1 bg-brand-panel rounded border border-brand-border text-brand-muted">
              FPS: <span className="text-brand-gold font-bold">24 (Anime Style)</span>
            </div>
          </div>
          
          {/* Weather & Location Ticker (Bangalore themed) */}
          <div className="flex items-center gap-3 bg-brand-bg-darker border border-brand-border px-3 py-1.5 rounded-lg text-xxs font-mono text-brand-muted">
            <span className="flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" /> Jayanagar, Bangalore
            </span>
            <span className="text-brand-border">|</span>
            <span className="flex items-center gap-1.5 shrink-0 text-brand-blue">
              <CloudRain className="w-3.5 h-3.5" /> Misty Drizzle
            </span>
          </div>
        </div>
      </header>

      {/* Main Sandbox Layout container */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full">
        {/* Left column (7 grid sizes on desktop) - Theater screen and playback control bars */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <TheatreMode
            currentTime={currentTime}
            activeShot={activeShot}
            activeActId={activeAct.id}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />

          <StoryboardTimeline
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            acts={STORYBOARD_DATA}
            markers={markers}
            onPlayPause={handlePlayPause}
            onStop={handleStop}
            onScrub={handleScrub}
            onSpeedChange={handleSpeedChange}
            onAddMarker={handleAddMarker}
            onDeleteMarker={handleDeleteMarker}
          />

          {/* Core scene card summaries */}
          <div className="bg-brand-panel border border-brand-border rounded-xl p-4 flex gap-4 items-center">
            <div className="p-3 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-widest">{activeAct.title}</span>
              <h2 className="text-xs font-bold text-brand-text font-serif italic mt-0.5">{activeAct.subtitle}</h2>
              <p className="text-[10px] text-brand-muted leading-normal mt-1">
                Each timeline coordinate syncs dynamic lighting patterns, audio synthesis, and key camera guidelines automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Right column (5 grid sizes) - Inspector Workspace tabs */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-4">
          {/* Tab selector pill navigation */}
          <div className="flex bg-brand-panel border border-brand-border p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2.5 rounded-lg text-xxs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-brand-gold text-brand-dark shadow-md font-bold'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg-darker'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Director Studio
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`flex-1 py-2.5 rounded-lg text-xxs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'script'
                  ? 'bg-brand-gold text-brand-dark shadow-md font-bold'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg-darker'
              }`}
            >
              <FileTextIcon className="w-3.5 h-3.5" />
              Script Checklist
            </button>
          </div>

          {/* Active tab rendered cleanly */}
          <div className="flex-1 min-h-[350px]">
            {activeTab === 'ai' ? (
              <DirectorStudio
                activeShot={activeShot}
                activeActTitle={activeAct.title}
                onSaveToNotebook={handleSaveToNotebook}
              />
            ) : (
              <Notebook
                shots={allShots}
                notes={notes}
                activeShotId={activeShot ? activeShot.id : null}
                onSelectShot={handleSelectShot}
                onUpdateNote={handleUpdateNote}
              />
            )}
          </div>
        </div>
      </main>

      {/* High-End Production Footer */}
      <footer className="mt-8 pt-4 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center text-[10px] text-brand-muted uppercase tracking-[0.15em] gap-2">
        <div>Director: A. Sharma</div>
        <div>Visual Consultant: M. Rao</div>
        <div>Blueprint Stage: Production Ready - Final Rev</div>
      </footer>
    </div>
  );
}

// Inline fallback for FileTextIcon to keep things cleanly contained
function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
