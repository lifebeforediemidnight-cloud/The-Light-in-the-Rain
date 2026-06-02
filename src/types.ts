export interface Shot {
  id: string; // e.g. "shot-1"
  number: number;
  description: string;
  camera: string;
  lighting: string;
  audioText?: string; // Voiceover or Dialogue
  audioChar?: string; // e.g. "Hari", "Anna", "Manager"
  audioType: 'voiceover' | 'dialogue' | 'ambient' | 'silent';
  acousticCues: string[];
  visualPrompt: string;
  imageKey?: string; // maps to one of our generated images
}

export interface Scene {
  id: string; // e.g. "scene-1.1"
  title: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  shots: Shot[];
}

export interface Act {
  id: string; // e.g. "act-1"
  title: string;
  subtitle: string;
  startTime: number;
  endTime: number;
  scenes: Scene[];
}

export interface DirectorNote {
  shotId: string;
  customVisualPrompt: string;
  actorInstruction: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
}

export interface AISuggestion {
  shotId: string;
  expandedPrompt?: string;
  voiceoverGuide?: string;
  animatorNotes?: string;
  loading?: boolean;
  error?: string;
}

export interface CustomMarker {
  id: string;
  time: number;
  label: string;
  color: string;
}
