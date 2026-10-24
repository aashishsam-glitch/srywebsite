# A Little Universe for Wynne 💗
### An immersive 3D apology experience built with love, honesty, and intention

> *“Some moments deserve more of our attention than we give them. I'm sorry I didn't give ours enough.”*

---

## 🌟 Overview

**A Little Universe for Wynne** is a bespoke, production-ready 3D interactive web application built as a sincere, heartfelt apology for not being present and attentive on **October 18**. 

Rather than sending a flat text message, this website translates reflection, vulnerability, and genuine care into a sequence of quiet, cinematic 3D spaces—blending a dreamy nighttime garden, an interactive memory constellation, a translucent digital letter, and drifting starlight.

The experience is emotionally honest, warm, and personal without ever placing pressure or emotional burden on her.

---

## 🌌 The Six Emotional Scenes

1. **Scene 1: "A Little World for Wynne" (The Opening)**
   - Deep midnight-blue and plum cosmos with delicate nebula dust and drifting star layers.
   - An artisan 3D glass heart that magnetically tracks the cursor or finger touch.
   - Gentle reveal: *"Hey, Wynne."* $\to$ *"I made a little something for you."*
   - Frosted-glass interactive button: **“Step inside ♡”** with realistic 3D tilt response.

2. **Scene 2: "The Floating Garden" (Suspended in the Night Sky)**
   - The camera glides through a ring of glowing stardust into a suspended night garden.
   - Bioluminescent flowers, drifting rose petals, companion crystal hearts, and cursor-reactive fireflies above a reflective glass pond.
   - Understated narrative reveal leading to: **“There's something I owe you”**.

3. **Scene 3: "October 18 — The Moment I Want to Acknowledge" (The Memory Constellation)**
   - Centered on the date **October 18**.
   - 4 glowing celestial stars connected by fine starlight beams.
   - Exploring each star reveals sincere reflections:
     1. *“I keep thinking about how I could have been more present.”*
     2. *“You deserved more of my attention than I gave you.”*
     3. *“I wish I had been more thoughtful in that moment.”*
     4. *“I can't go back and change that day, but I can be honest about it.”*
   - When all stars are touched, they link into a luminous heart constellation, unlocking the path to the letter.

4. **Scene 4: "The Letter — The Emotional Center"**
   - Quiet, intimate atmosphere with an imperceptibly soft, warm heartbeat in the background.
   - A floating translucent glass letter that unfolds paragraph by paragraph.
   - Reader controls: **Play / Pause**, **Next paragraph**, and **“Show all”** for instant reading without waiting.
   - Preserves the authentic apology text with complete fidelity and dignity.

5. **Scene 5: "A Garden of Unsaid Things" (Orbiting Petals)**
   - 5 translucent 3D petals gently orbiting the central glowing heart:
     - **Listening**
     - **Being present**
     - **Noticing the little things**
     - **Making time count**
     - **Showing care through actions**
   - Clicking any petal unfolds an illuminated frosted card with its thoughtful reflection.

6. **Scene 6: "The Final Message & Starlight Drift"**
   - Calmer horizon with the final sincere words:
     > *“That's all I wanted you to know, Wynne. I'm sorry I didn't give you the attention I should have that day. No pressure to say anything or respond in a particular way. I just wanted you to know that I've thought about it, that I care, and that I'm sorry. ♡”*
   - Button **“Let the little stars drift”**: Triggers the central heart to dissolve into a swarm of luminous ascending particles that briefly form a heart constellation before dispersing into the starry night sky.
   - Culminates in: **“For Wynne, with sincerity. ♡”**
   - Unobtrusive **“Experience from the beginning”** button to replay the story seamlessly.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router, React Server Components & Client Components)
- **UI & Transitions:** React 19, Tailwind CSS, Framer Motion
- **3D Graphics:** Three.js (r174), React Three Fiber (`@react-three/fiber`), `@react-three/drei`
- **Typography:** Cormorant Garamond (Serif), Inter (Sans-serif)
- **Audio Engine:** Embedded procedural **Web Audio API synthesizer** (generates soothing ambient pentatonic pads and chime resonances on user click; 0 external audio dependencies)
- **Resilience:**
  - **WebGL Fallback:** Dedicated CSS 3D fallback for devices without WebGL support.
  - **Motion Accessibility:** Automatically respects `prefers-reduced-motion` with an in-app toggle.
  - **Mobile Optimized:** Responsive layouts, scaled particle budgets, and touch-first button hitboxes.
- **Backend API:**
  - `GET /api/content`: Validated configuration endpoint serving typed story content.
  - `GET /api/health`: Health status endpoint.

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- **Node.js:** v18.18+ or v20+ (tested on Node v24)
- **npm:** v9+

### 2. Installation
Clone or navigate to the project directory:
```bash
cd e:\work\forher
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Vercel / Netlify

This project is 100% deployment-ready for standard Next.js hosting platforms:

### Deploy to Vercel
1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and select the repository.
3. Keep default settings (`Next.js` preset) and click **Deploy**.
4. The site will be live on an HTTPS domain within ~60 seconds.

---

## 📝 Customization

All website text, dates, paragraphs, and thoughts are cleanly organized in:
- [src/config/experienceContent.ts](file:///e:/work/forher/src/config/experienceContent.ts)

You can easily adjust the recipient name, date, letter text, or petal quotes without touching any 3D shaders or layout code.

---

Built with sincerity, care, and intention for Wynne. ♡
