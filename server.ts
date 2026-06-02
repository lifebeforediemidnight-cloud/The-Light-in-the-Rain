import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client with standard environment keys and required options
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined. Gemini features will run in mock mode.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API Endpoint: Enrich Storyboard Prompts using Gemini
app.post('/api/gemini/enrich', async (req, res) => {
  const { shotId, description, visualPrompt, camera, lighting, audioText, type, customQuery } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    // Elegant fallback simulation if API key is missing during workspace review
    return res.json({
      success: true,
      data: `#### [Mock Director Assistant]
(Set GEMINI_API_KEY in Secrets panel to unlock live generation)

**Suggested for Shot ${shotId}:**
Here is a creative expansion for this shot focusing on **${type}**:

1. **Enhanced Composition**: Create detailed depth-of-field splits, placing the central emotional element slightly off-center under a Rule of Thirds grid.
2. **Keyframe Suggestions**: Slowly smooth down the motion path (bezier curve setup) to ease the animation and allow the audience to dwell on the atmospheric weight of ${lighting}.
3. **Pacing Guidance**: Keep the pacing at a slow, deliberate speed. Perfect for giving breathing room to the narrative.
4. **Keyword Palette**: *2D detailed anime cell, wet reflections, glowing embers, soft atmospheric fog, Makoto Shinkai style, emotional, cinematic light leaks, 8k background.*`
    });
  }

  try {
    let systemInstruction = "You are an elite, highly experienced animation director and storyboard consultant working on 2D high-fidelity anime titles (reminiscent of Makoto Shinkai and Mamoru Hosoda's films). Your goal is to help an animator, visual compositor, and voice director execute each individual shot with masterpieces levels of detail, color theory, light physics, and soundscapes.";
    
    let prompt = "";
    if (type === 'visual_prompt') {
      prompt = `Expand this animation storyboard scene description into a highly precise visual and artistic prompt suitable for reference artists or AI generators (like Midjourney or Imagen):
- **Scene Context**: ${description}
- **Camera Blueprint**: ${camera}
- **Lighting Palette**: ${lighting}
- **Original Visual Prompt**: ${visualPrompt}
- **Custom Director Comments**: ${customQuery || "None"}

Please structure your response with:
1. **Scenic Composition & Focal Point**: Describe the objects, background depth, and framing layers.
2. **Color Palette & Light Physics**: Analyze how the light bounces, wet surfaces shine, or shadows frame the emotional tone.
3. **Anime Technical Specifications**: List specific render styling inputs (e.g. detailed cell shading, light leaks, watercolor texture overlays, dynamic range). 
Provide a clear, cohesive markdown response.`;
    } else if (type === 'voiceover_guide') {
      prompt = `Create a meticulous audio delivery and voiceover/dialogue coaching guide for the voice actor (Hari or Anna):
- **Shot Context**: ${description}
- **Character / Speaker**: ${req.body.audioChar || "Hari"}
- **Line to Deliver**: "${audioText || "No lines defined."}"
- **Original Acoustic Cues**: ${JSON.stringify(req.body.acousticCues || [])}
- **Custom Director Comments**: ${customQuery || "None"}

Please provide:
1. **Emotional Beats & Psychological State**: What are they feeling? How does this translate to voice?
2. **Subtext & Internal Voice**: What is left unsaid underneath the words?
3. **Enunciation & Pronunciation Helpers**: Provide clear guidance (especially for Kannada expressions like 'maga', 'Kudi', 'bega' if present).
4. **Pacing, Pauses, and Breaths**: Draw a timeline diagram/instruction of where to breathe (e.g., [sigh], [long pause], [soft chuckle]).`;
    } else if (type === 'animator_notes') {
      prompt = `Draft technical animation keyframe instructions for the lead animator and technical compositor:
- **Scene Context**: ${description}
- **Camera Movement**: ${camera}
- **Lighting setup**: ${lighting}
- **Original Visual Prompt**: ${visualPrompt}
- **Custom Director Comments**: ${customQuery || "None"}

Please formulate:
1. **Keyframe Breakdown & Bezier Curves**: Specify camera panning velocity curves, ease-in/ease-out values, or parallax layer separation.
2. **Particle & Atmospheric FX Systems**: How to animate details like falling mist, dust dancing, lens flares, or pouring rain droplets (e.g. droplet distortion, impact ripples).
3. **Lighting & Compositing Passes**: Details for the layout compositor on glows, bloom filters, and specular multipliers on wet surfaces to create an authentic 2D masterpiece look.`;
    } else {
      prompt = `Review the following shot and provide general animation prep:
${description}
Camera: ${camera}
Lighting: ${lighting}
Query: ${customQuery || "How can we make this shot look more cinematic?"}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
      }
    });

    const markdownText = response.text || "No response received from Gemini.";
    res.json({ success: true, data: markdownText });
  } catch (error: any) {
    console.error("Gemini enriched API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve health status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Configure Vite or Static production server middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Joined Vite development server middleware.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Serving static distribution directory: ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express application successfully listening on port ${PORT}`);
  });
}

startServer();
