/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, VolumeX, Volume2, CloudLightning, Info, Sliders } from 'lucide-react';
import { Shot } from '../types';
import { synth, AtmosphereType } from '../audioSynth';

interface TheatreModeProps {
  currentTime: number;
  activeShot: Shot | null;
  activeActId: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function TheatreMode({
  currentTime,
  activeShot,
  activeActId,
  isPlaying,
  onPlayPause,
}: TheatreModeProps) {
  const [synthEnabled, setSynthEnabled] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.6);
  const [isFlashing, setIsFlashing] = useState(false);

  // Map Act ID to general sound atmosphere
  const getAtmosphereForAct = (actId: string): AtmosphereType => {
    switch (actId) {
      case 'act-1':
        return 'morning';
      case 'act-2':
        return 'grind';
      case 'act-3':
        return 'storm';
      case 'act-4':
        return 'tea';
      case 'act-5':
        return 'resilience';
      default:
        return 'silent';
    }
  };

  // Sync atmosphere with synthesizer when current scene/act shifts
  useEffect(() => {
    if (synthEnabled && isPlaying) {
      const atmos = getAtmosphereForAct(activeActId);
      synth.playAtmosphere(atmos);
    } else {
      synth.stopAll();
    }
  }, [activeActId, synthEnabled, isPlaying]);

  // Handle master play pause triggers
  useEffect(() => {
    if (!isPlaying) {
      synth.stopAll();
    } else if (synthEnabled) {
      const atmos = getAtmosphereForAct(activeActId);
      synth.playAtmosphere(atmos);
    }
  }, [isPlaying]);

  // Handle slide volume shifts
  useEffect(() => {
    if (synthEnabled) {
      synth.setChannelVolumes(musicVolume, sfxVolume);
    }
  }, [musicVolume, sfxVolume, synthEnabled]);

  const toggleSoundEngine = () => {
    if (!synthEnabled) {
      synth.init();
      synth.resume();
      setSynthEnabled(true);
      if (isPlaying) {
        const atmos = getAtmosphereForAct(activeActId);
        synth.playAtmosphere(atmos);
      }
    } else {
      setSynthEnabled(false);
      synth.stopAll();
    }
  };

  const handleThunderClick = () => {
    if (!synthEnabled) return;
    synth.triggerThunder();
    // Trigger visual lightning flash overlay
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);
    setTimeout(() => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 80);
    }, 280);
  };

  // Scene ambient glowing gradient classes corresponding to acts
  const getAmbientGlowClasses = (actId: string) => {
    switch (actId) {
      case 'act-1': // Morning dawn
        return 'from-purple-950/45 via-amber-950/20 to-zinc-950';
      case 'act-2': // Harsh Midday glare
        return 'from-orange-950/25 via-zinc-900/40 to-zinc-950';
      case 'act-3': // Severe storm
        return 'from-violet-950/50 via-zinc-900/60 to-zinc-950';
      case 'act-4': // Safe tea shop
        return 'from-amber-950/50 via-zinc-900/50 to-zinc-950';
      case 'act-5': // Green park rays
        return 'from-emerald-950/25 via-amber-950/15 to-zinc-950';
      default:
        return 'from-zinc-900/50 to-zinc-950';
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-brand-dark border border-brand-border rounded-xl overflow-hidden shadow-2xl relative flex flex-col justify-between group md:h-[500px]" id="theatre-stage-outer">
      {/* Visual background atmospheric backlighting */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getAmbientGlowClasses(activeActId)} transition-all duration-1000 -z-10`} />

      {/* Lightning Flash overlay */}
      <div className={`absolute inset-0 bg-zinc-100 pointer-events-none transition-opacity duration-75 z-20 ${isFlashing ? 'opacity-85' : 'opacity-0'}`} />

      {/* Screen Header Frame */}
      <div className="p-3.5 flex justify-between items-center bg-gradient-to-b from-brand-dark to-transparent relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-bold font-mono tracking-widest text-[#E3B341] uppercase">Live Animatic Theater</span>
          {activeShot && (
            <span className="bg-brand-panel px-2 py-0.5 rounded text-[9px] font-mono font-bold text-brand-text border border-brand-border uppercase">
              ACT {activeActId.replace('act-', '')} • SHOT {activeShot.number}
            </span>
          )}
        </div>

        {/* Real-time Synth Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSoundEngine}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xxs font-mono font-bold border transition duration-200 cursor-pointer ${
              synthEnabled
                ? 'bg-brand-gold text-brand-dark border-brand-gold shadow'
                : 'bg-brand-panel text-brand-muted border-brand-border hover:text-brand-text'
            }`}
          >
            {synthEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {synthEnabled ? "Synth ON" : "Muted"}
          </button>
        </div>
      </div>

      {/* Cinema Screen Core Canvas */}
      <div className="flex-1 min-h-[220px] md:min-h-[280px] relative overflow-hidden flex items-center justify-center">
        {/* Artistic Director Frame Overlays (Visual Guidelines) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Big background transparent script mark */}
          <div className="absolute top-6 left-6 text-5xl font-serif italic text-white opacity-[0.035] select-none uppercase tracking-wider">
            {activeShot ? `SHOT ${activeShot.number}` : "STANDBY"}
          </div>
          {/* Rule of thirds / visual bounding border */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] h-[68%] border border-dashed border-white/15 rounded"></div>
        </div>

        <AnimatePresence mode="wait">
          {activeShot && activeShot.imageKey ? (
            <motion.div
              key={activeShot.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Ken Burns subtle zoom and slide animation */}
              <motion.img
                src={(synth as any)[activeShot.imageKey] || (requireImage(activeShot.imageKey))}
                alt={activeShot.visualPrompt}
                referrerPolicy="no-referrer"
                animate={{
                  scale: isPlaying ? [1.02, 1.07] : 1.04,
                  x: isPlaying ? [-4, 4] : 0,
                }}
                transition={{
                  duration: 8,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="w-full h-full object-cover shadow-inner select-none brightness-[0.88]"
              />
            </motion.div>
          ) : (
            <div className="text-center p-6 text-brand-muted font-mono space-y-1">
              <span className="text-xs uppercase tracking-wider block">No Artwork Cached</span>
              <span className="text-[10px] text-brand-muted/70 block">Frame rate synchronized timeline</span>
            </div>
          )}
        </AnimatePresence>

        {/* Subtitle Teleprompter HUD overlay at the bottom of video screen */}
        {activeShot && activeShot.audioText && (
          <div className="absolute bottom-4 left-4 right-4 bg-[#0A0C10]/85 backdrop-blur-md rounded-lg border border-[#30363D] p-3.5 flex flex-col justify-start z-10">
            <div className="flex justify-between items-center mb-1 border-b border-[#30363D] pb-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-gold font-mono">
                {activeShot.audioChar || "Acoustic Cue"}
              </span>
              <span className="text-[9px] text-[#8B949E] font-mono uppercase tracking-wider">
                {activeShot.audioType.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-brand-text font-medium leading-relaxed italic">
              "{activeShot.audioText}"
            </p>
          </div>
        )}

        {/* Extra Thunder button overlay when Storm scene is running */}
        {activeActId === 'act-3' && synthEnabled && (
          <button
            onClick={handleThunderClick}
            className="absolute top-4 left-4 bg-[#E3B341] hover:bg-[#E3B341]/85 text-[#0A0C10] p-2.5 rounded-full shadow-lg border border-brand-gold/40 opacity-80 hover:opacity-100 transition duration-150 z-10 flex items-center justify-center cursor-pointer shake-hover animate-bounce"
            title="Manual Thunder trigger! Web Audio synthesis"
          >
            <CloudLightning className="w-4 h-4 fill-[#0A0C10]" />
          </button>
        )}
      </div>

      {/* Screen Footer Metadata Controls overlay */}
      <div className="bg-[#0D1117] border-t border-brand-border p-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active scene descriptions */}
          <div className="space-y-1.5 border-b md:border-b-0 pb-3 md:pb-0 md:border-r border-[#30363D] pr-4">
            <div className="flex items-center gap-1.5 text-xxs text-brand-muted font-mono uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-brand-gold" />
              Production Layout Notes
            </div>
            {activeShot ? (
              <div className="space-y-1">
                <p className="text-xxs font-semibold text-brand-text leading-snug line-clamp-2">
                  <span className="text-brand-gold uppercase font-mono">Screen: </span>
                  {activeShot.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px]">
                  <span className="text-brand-blue">
                    <strong className="text-brand-muted uppercase">Camera:</strong> {activeShot.camera}
                  </span>
                  <span className="text-brand-green">
                    <strong className="text-brand-muted uppercase">Light:</strong> {activeShot.lighting}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xxs text-brand-muted font-mono">Select a shot to lay out production metadata.</p>
            )}
          </div>

          {/* Synthesizer volume dashboards controls */}
          <div className="space-y-2 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xxs font-mono text-brand-muted">
              <span className="flex items-center gap-1 uppercase tracking-wider">
                <Sliders className="w-3 h-3 text-[#58A6FF]" />
                Procedural Levels
              </span>
              <span>{synthEnabled ? "Connected & Live" : "Synth Engine Offline"}</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8B949E]">
                <label htmlFor="music-vol-slider">Synthesized BGM</label>
                <span>{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                id="music-vol-slider"
                type="range"
                min="0"
                max="1.0"
                step="0.05"
                value={musicVolume}
                disabled={!synthEnabled}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-brand-panel rounded cursor-pointer accent-[#E3B341] disabled:opacity-20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8B949E]">
                <label htmlFor="sfx-vol-slider">Acoustic SFX</label>
                <span>{Math.round(sfxVolume * 100)}%</span>
              </div>
              <input
                id="sfx-vol-slider"
                type="range"
                min="0"
                max="1.0"
                step="0.05"
                value={sfxVolume}
                disabled={!synthEnabled}
                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-brand-panel rounded cursor-pointer accent-[#E3B341] disabled:opacity-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to secure relative path import fallback bindings in React
function requireImage(key: string): string {
  // Map strings directly
  const images: Record<string, string> = {
    dawnSkyline: "/src/assets/images/dawn_bangalore_skyline_1780395231248.png",
    hariGrind: "/src/assets/images/hari_crowded_grind_1780395246492.png",
    rainyFall: "/src/assets/images/rainy_fall_accident_1780395260149.png",
    cozyTeaStall: "/src/assets/images/cozy_bangalore_tea_stall_1780395274204.png",
    sunnyPark: "/src/assets/images/sunny_cubbon_park_1780395290428.png"
  };
  return images[key] || "https://picsum.photos/seed/anime/1920/1080?blur=2";
}
