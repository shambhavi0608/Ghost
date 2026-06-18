<div align="center">

<!-- PROJECT LOGO / BANNER -->

<br /><br />

# 👻 Ghost

### *See Your Digital Shadow. Take It Back.*

**Ghost is a privacy exposure analyzer that reveals exactly what your browser silently tells every website you visit — and shows you how to fight back.**

<br />

[![MIT License](https://img.shields.io/badge/License-MIT-7c3aed?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-00c896?style=for-the-badge)](CONTRIBUTING.md)

<br />

[🚀 Live Demo](#) · [📸 Screenshots](#screenshots) · [📖 Docs](#technical-deep-dive) · [🐛 Report Bug](issues) · [✨ Request Feature](issues)

<br />

---

</div>

## 🧠 The Problem

> **"I have nothing to hide, so I don't care about privacy."**

This is the most dangerous sentence on the internet.

Every time you open a browser, you leak a unique digital fingerprint composed of your hardware specs, fonts, timezone, GPU model, canvas rendering patterns, and dozens of other signals — **without ever clicking a single button.**

Advertisers, data brokers, and trackers don't need your name. They need your fingerprint.

**And yours is already out there.**

Most privacy tools tell you to *worry*. Ghost shows you *exactly* what's exposed — and gives you the power to act.

<br />

---

## 💡 Why It Matters

| Fact | Impact |
|------|--------|
| 🌐 98% of websites load third-party trackers | Your behavior is catalogued across the entire web |
| 🖼️ Canvas fingerprinting identifies users with **99.9% accuracy** | Incognito mode provides no protection |
| 🔬 Browser fingerprints are unique for **1 in 286,777 users** | You're never truly anonymous |
| 📍 Most users unknowingly grant persistent location access | Real-time tracking without your knowledge |
| 🍪 The average website sets **43 cookies** on first visit | Your data is sold before you scroll |

Ghost was built because **understanding is the first step to protection.**

<br />

---

## ✨ What Ghost Does

Ghost performs a **real-time, client-side browser audit** — no account, no signup, no data collected — and generates a **Privacy Exposure Score** with actionable remediation steps.

```
┌─────────────────────────────────────────────────────────────┐
│                    THE GHOST EXPERIENCE                     │
│                                                             │
│    SHOCK          UNDERSTANDING          ACTION             │
│      │                  │                  │                │
│  "My GPU is        "Here's how         "Install             │
│   visible?"      fingerprinting        uBlock +             │
│                    works..."          enable RFP"           │
└─────────────────────────────────────────────────────────────┘
```

<br />

---

## 🔥 Core Features

<details open>
<summary><strong>🧬 Browser Fingerprinting Engine</strong></summary>
<br />

Ghost harvests the same data points websites use to silently identify you:

| Signal | What It Reveals |
|--------|-----------------|
| `User-Agent` | Browser version, OS, architecture |
| `Screen Resolution + Color Depth` | Unique hardware configuration |
| `Timezone + Language` | Geographic origin |
| `CPU Core Count` | Device class fingerprint |
| `Device Memory` | RAM tier (0.25–8GB buckets) |
| `Touch Support` | Mobile vs desktop classification |

All values are combined into a **uniqueness entropy score** — showing statistically how rare your fingerprint is in the global pool.

</details>

<details>
<summary><strong>🎨 Canvas Fingerprinting Detection</strong></summary>
<br />

Ghost renders a hidden `<canvas>` element with text, gradients, and geometric shapes, then extracts the raw pixel data and generates a **SHA-256 hash** — demonstrating exactly how websites silently tag your browser based on GPU rendering differences invisible to the naked eye.

```
Canvas Text Rendered → GPU Pixel Differences → Unique Hash → You're Tagged
```

</details>

<details>
<summary><strong>🖥️ WebGL Hardware Exposure</strong></summary>
<br />

One of the **most shocking moments** in the Ghost experience. Using `WEBGL_debug_renderer_info`, Ghost reads your exact GPU model from the browser:

> `NVIDIA GeForce RTX 4080 SUPER / PCIe / SSE2`

> `Apple M3 Pro — Apple GPU`

> `AMD Radeon RX 7900 XT`

Websites can use this to identify premium devices, narrow demographics, and create persistent cross-session identifiers.

</details>

<details>
<summary><strong>🕵️ Tracker Detection</strong></summary>
<br />

Using the `PerformanceResourceTiming API`, Ghost analyzes all network requests on the current page and cross-references against known tracker domains:

- **Analytics**: Google Analytics, Mixpanel, Amplitude
- **Advertising**: Meta Pixel, Google Ads, DoubleClick
- **Session Recording**: Hotjar, FullStory, Microsoft Clarity
- **A/B Testing**: Optimizely, VWO

Each tracker is classified with a **risk level** (Low / Medium / High / Critical).

</details>

<details>
<summary><strong>🔐 Permissions Audit</strong></summary>
<br />

Ghost queries the Permissions API to surface every sensitive capability your browser has silently granted to sites:

| Permission | Risk Level |
|------------|------------|
| 📍 Geolocation | 🔴 Critical |
| 🎤 Microphone | 🔴 Critical |
| 📷 Camera | 🔴 Critical |
| 🔔 Notifications | 🟡 Medium |
| 📋 Clipboard Read | 🟡 Medium |

Status: `granted` · `prompt` · `denied` — displayed with clear remediation steps.

</details>

<details>
<summary><strong>💾 Storage Exposure Audit</strong></summary>
<br />

Ghost inspects every persistence mechanism in your browser:

- **Cookies** — session vs persistent, third-party scope
- **LocalStorage** — persistent key-value data across sessions
- **SessionStorage** — tab-scoped temporary data

Displays total item count, estimated data volume, and identifies any suspicious keys matching known tracker patterns.

</details>

<details>
<summary><strong>📊 Privacy Exposure Score (0–100)</strong></summary>
<br />

Ghost synthesizes every signal into a single weighted score:

```
Score = (Tracker Risk × 0.30) + (Fingerprint Uniqueness × 0.35)
      + (Permissions Risk × 0.20) + (Storage Exposure × 0.15)
```

| Score | Grade | Meaning |
|-------|-------|---------|
| 0–20 | 🟢 Protected | Strong privacy posture |
| 21–45 | 🟡 Moderate | Some exposure present |
| 46–70 | 🟠 Exposed | Significant risk |
| 71–100 | 🔴 Critical | Severely compromised |

</details>

<details>
<summary><strong>🛠️ Personalized Recommendation Engine</strong></summary>
<br />

Ghost doesn't just scare you — it fixes you. Every scan generates **ranked, actionable recommendations**:

| Recommendation | Severity | Direct Action |
|----------------|----------|---------------|
| Install uBlock Origin | 🔴 High | [Install →](https://ublockorigin.com) |
| Enable Firefox RFP | 🟠 Medium | `privacy.resistFingerprinting = true` |
| Revoke Camera Permission | 🔴 High | Browser settings → Permissions |
| Clear tracking cookies | 🟡 Medium | DevTools → Application → Storage |
| Switch to Firefox/Brave | 🟠 Medium | Better fingerprint protection |

</details>

<details>
<summary><strong>🤖 AI Privacy Verdict (Powered by Claude)</strong></summary>
<br />

After the scan, Ghost sends aggregated (never personal) scan metadata to Claude API, which generates a **plain-English privacy verdict**:

> *"Your browser is highly trackable. Your unique GPU signature and 6 active advertising trackers on this page make you easily identifiable across sessions — even in incognito mode. Your most urgent action is to install uBlock Origin and enable Firefox's Resist Fingerprinting mode."*

Human. Specific. Actionable.

</details>

<br />

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                                │
│                                                                        │
│  ┌──────────────┐    ┌─────────────────────────────────────────────┐   │
│  │              │    │           GHOST SCAN ENGINE                 │   │
│  │   React UI   │◄──►│                                             │   │
│  │   (Vite +    │    │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │   │
│  │  Tailwind)   │    │  │  Finger- │  │  Canvas  │  │  WebGL   │   │   │
│  │              │    │  │  print   │  │  Hash    │  │  GPU     │   │   │
│  │  ┌─────────┐ │    │  │  Engine  │  │  Engine  │  │  Probe   │   │   │
│  │  │ Score   │ │    │  └──────────┘  └──────────┘  └──────────┘   │   │
│  │  │ Gauge   │ │    │                                             │   │
│  │  └─────────┘ │    │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │   │
│  │  ┌─────────┐ │    │  │ Tracker  │  │ Perms    │  │ Storage  │   │   │
│  │  │ Recs    │ │    │  │ Detector │  │ Auditor  │  │ Auditor  │   │   │
│  │  └─────────┘ │    │  └──────────┘  └──────────┘  └──────────┘   │   │
│  └──────────────┘    └─────────────────────────────────────────────┘   │
│          │                              │                              │
└──────────┼──────────────────────────────┼────────────────────────────  ┘
           │                              │
           │         Scan Results         │
           ▼         (No PII sent)        ▼
┌──────────────────┐              ┌───────────────────┐
│   Express.js     │              │   Score Engine    │
│   Backend        │◄─────────────│   + Risk Weights  │
│                  │              └───────────────────┘
│  ┌────────────┐  │
│  │  /scan     │  │                        │
│  │  /verdict  │  │                        ▼
│  │  /score    │  │              ┌───────────────────┐
│  └────────────┘  │              │   Recommendation  │
│         │        │              │   Engine          │
└─────────┼────────┘              └───────────────────┘
          │
          ▼
┌──────────────────┐
│   Claude API     │
│   (Anthropic)    │
│                  │
│  AI Verdict      │
│  Generation      │
└──────────────────┘
```

<br />

---

## 🔒 Privacy By Design

> Ghost is a privacy tool. It would be deeply hypocritical to violate yours.

We designed Ghost around six hard privacy commitments:

```
╔══════════════════════════════════════════════════════════════╗
║                  GHOST PRIVACY PRINCIPLES                    ║
╠══════════════════════════════════════════════════════════════╣
║  ✅  No user accounts required                               ║
║  ✅  No email addresses collected                            ║
║  ✅  No fingerprints stored server-side                      ║
║  ✅  No personal data leaves your browser                    ║
║  ✅  Local-first analysis (all scanning in-browser)          ║
║  ✅  Ghost itself performs zero tracking                     ║
╚══════════════════════════════════════════════════════════════╝
```

**What we send to the AI backend:**
Only aggregated, anonymized scan metadata — tracker count, score, risk flags. Never fingerprint data, never device identifiers, never IP-associated payloads.

**Verify it yourself** — the scan engine is fully open source. You can audit every byte.

<br />

---

## 🛤️ User Journey

```
1. LANDING
   ├── Hero: "See Your Digital Shadow. Take It Back."
   └── Single CTA: "Scan My Browser"
           │
           ▼
2. SCANNING (animated)
   ├── Fingerprint collection  ──► ~0.2s
   ├── Canvas render + hash    ──► ~0.3s
   ├── WebGL GPU probe         ──► ~0.1s
   ├── Tracker detection       ──► ~0.5s
   ├── Permissions audit       ──► ~0.2s
   └── Storage analysis        ──► ~0.1s
           │
           ▼
3. VERDICT DASHBOARD
   ├── Privacy Exposure Score (animated gauge)
   ├── Risk breakdown by category
   ├── "Most Shocking" reveal (your GPU, canvas hash)
   ├── Active trackers list
   └── AI Verdict paragraph
           │
           ▼
4. ACTION PLAN
   ├── Ranked recommendations
   ├── Severity badges
   ├── One-click links to tools/settings
   └── "Re-scan after fixing" CTA
```

<br />

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Component-based UI, fast HMR |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first design system |
| **Animations** | Framer Motion | Smooth reveal animations |
| **Backend** | Node.js + Express.js | API layer, AI proxying |
| **AI** | Claude API (Anthropic) | Natural language privacy verdicts |
| **Browser APIs** | Navigator, Canvas, WebGL | Raw fingerprint collection |
| **Browser APIs** | Permissions, Performance Timing | Permission + tracker auditing |
| **Deployment** | Vercel / Railway | Frontend + backend hosting |

<br />

---

## 📁 Project Structure

```
ghost/
├── client/                         # React frontend (Vite)
│   ├── public/
│   │   └── ghost-logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero/               # Landing page hero
│   │   │   ├── Scanner/            # Animated scan progress
│   │   │   ├── Dashboard/          # Results dashboard
│   │   │   │   ├── ScoreGauge.jsx  # Circular exposure score
│   │   │   │   ├── RiskCards.jsx   # Category breakdowns
│   │   │   │   ├── TrackerList.jsx # Detected trackers
│   │   │   │   └── AIVerdict.jsx   # Claude verdict card
│   │   │   └── ActionPlan/         # Recommendations
│   │   ├── lib/
│   │   │   ├── fingerprint.js      # Browser fingerprint engine
│   │   │   ├── canvas.js           # Canvas hash generator
│   │   │   ├── webgl.js            # WebGL GPU probe
│   │   │   ├── trackers.js         # PerformanceResourceTiming analysis
│   │   │   ├── permissions.js      # Permissions API audit
│   │   │   └── storage.js          # Cookie/LS/SS audit
│   │   ├── hooks/
│   │   │   └── useScan.js          # Orchestrates full scan pipeline
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Express.js backend
│   ├── routes/
│   │   ├── verdict.js              # Claude AI integration
│   │   └── health.js
│   ├── lib/
│   │   ├── scoreEngine.js          # Privacy score calculator
│   │   ├── recommendations.js      # Recommendation generator
│   │   └── claudeClient.js         # Anthropic SDK wrapper
│   ├── index.js
│   └── package.json
│
├── .env.example
├── docker-compose.yml
└── README.md
```

<br />

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.x`
- npm or yarn
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ghost.git
cd ghost

# Install frontend dependencies
cd client && npm install

# Install backend dependencies
cd ../server && npm install
```

### Environment Setup

```bash
# Copy example env files
cp .env.example .env

# Add your Anthropic API key
echo "ANTHROPIC_API_KEY=your_key_here" >> server/.env
echo "VITE_API_URL=http://localhost:3001" >> client/.env
```

### Running Locally

```bash
# Terminal 1 — Start the backend
cd server
npm run dev
# Backend running at http://localhost:3001

# Terminal 2 — Start the frontend
cd client
npm run dev
# Frontend running at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and click **Scan My Browser**.

### Docker (Optional)

```bash
docker-compose up --build
```

<br />

---

## 📸 Screenshots

> *Screenshots coming soon — demo video linked below.*

| Landing Page | Scanning Animation |
|:---:|:---:|
| ![Landing](https://placehold.co/500x300/0a0a0f/7c3aed?text=Landing+Page) | ![Scan](https://placehold.co/500x300/0a0a0f/ff6b6b?text=Scanning...) |

| Score Dashboard | Action Plan |
|:---:|:---:|
| ![Dashboard](https://placehold.co/500x300/0a0a0f/06b6d4?text=Privacy+Score+Dashboard) | ![Actions](https://placehold.co/500x300/0a0a0f/00c896?text=Action+Plan) |

<br />

---

## 🧪 Technical Deep Dive

### Fingerprint Entropy Calculation

We estimate fingerprint uniqueness using **Shannon entropy** across all collected signals. Each attribute contributes a weighted entropy value based on known population distributions:

```javascript
// Simplified entropy estimation
const entropy = signals.reduce((acc, signal) => {
  return acc + (signal.value * Math.log2(1 / signal.populationFrequency));
}, 0);

// "1 in X users" estimation
const uniquenessRatio = Math.pow(2, entropy);
```

A typical unprotected Chrome browser scores **~18 bits of entropy** — making it distinguishable among ~260,000 other browsers.

### Canvas Fingerprint Hash

```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Render vendor-specific text with emoji (maximizes GPU variation)
ctx.textBaseline = 'alphabetic';
ctx.fillStyle = '#f60';
ctx.fillRect(125, 1, 62, 20);
ctx.fillStyle = '#069';
ctx.font = '11pt "Times New Roman"';
ctx.fillText('Ghost Privacy Analyzer 🔍', 2, 15);

const dataUrl = canvas.toDataURL();
// Hash the pixel data → unique device fingerprint
```

### Privacy Score Formula

```
PrivacyScore = Σ(componentScore × weight)

Components:
  trackerRisk        = min(trackerCount / 10, 1) × 100   [weight: 0.30]
  fingerprintRisk    = (entropyBits / 24) × 100           [weight: 0.35]
  permissionsRisk    = (grantedCount / totalCount) × 100  [weight: 0.20]
  storageRisk        = min(storageItems / 50, 1) × 100    [weight: 0.15]
```

<br />

---

## 🗺️ Roadmap

| Milestone | Status | Description |
|-----------|--------|-------------|
| Core scan engine | ✅ Done | Fingerprint, canvas, WebGL, trackers |
| Privacy score | ✅ Done | Weighted multi-factor scoring |
| AI Verdict | ✅ Done | Claude-powered human summary |
| Recommendation engine | ✅ Done | Personalized action plans |
| Historical scan comparison | 🔄 Planned | Track privacy improvement over time |
| Browser extension | 🔄 Planned | Persistent per-site tracker blocking |
| PDF Privacy Report export | 🔄 Planned | Shareable audit document |
| API for developers | 🔄 Planned | Embed Ghost scans in your own apps |
| VPN + DNS leak detection | 💭 Idea | Detect IP leaks through WebRTC |
| Community tracker blocklist | 💭 Idea | Crowd-sourced tracker signatures |

<br />

---

## 👥 Team

| Team Member | Role | Contributions |
|-------------|------|--------------|
| **Person 1** | Frontend & UI | Landing page, dashboard, score gauge, animations, mobile responsiveness |
| **Person 2** | Scan Engine | Fingerprinting, entropy calculation, tracker detection, permissions audit, storage audit |
| **Person 3** | Backend & AI | Express API, Claude integration, infrastructure, deployment |
| **Person 4** | Risk & Recommendations | Score formula, recommendation engine, checklists, action plans |

<br />

---

## 🆚 Why Ghost Is Different

Most privacy tools in this space fall into one of two traps: they either **overwhelm you with jargon** or they **do nothing actionable**.

| Feature | Ghost | Browser DevTools | Privacy Badger | Lightbeam |
|---------|:-----:|:---------------:|:--------------:|:---------:|
| Zero signup required | ✅ | ✅ | ✅ | ✅ |
| Canvas fingerprint demo | ✅ | ❌ | ❌ | ❌ |
| WebGL GPU exposure | ✅ | ❌ | ❌ | ❌ |
| Entropy uniqueness score | ✅ | ❌ | ❌ | ❌ |
| AI plain-language verdict | ✅ | ❌ | ❌ | ❌ |
| Personalized action plan | ✅ | ❌ | ❌ | ❌ |
| Privacy-first (zero data) | ✅ | ✅ | ✅ | ❌ |
| Educational "shock" moment | ✅ | ❌ | ❌ | ❌ |

Ghost is the only tool that combines **technical depth**, **emotional storytelling**, and **immediate actionability** in a single, zero-friction experience.

<br />

---

## 🤝 Contributing

We welcome contributions from privacy advocates, browser engineers, and curious developers.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

**Good first issues:**

- Add new tracker domain signatures to `trackers.js`
- Improve entropy calculation accuracy
- Add new recommendation types
- Improve mobile UI
- Write tests for the scan engine

Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a PR.

<br />

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

You are free to use, modify, and distribute Ghost. We only ask that you preserve the privacy-first principles it was built on.

<br />

---

<div align="center">

**Built with 🔮 and a genuine belief that privacy is a human right.**

*Ghost — See Your Digital Shadow. Take It Back.*

[![GitHub Stars](https://img.shields.io/github/stars/your-org/ghost?style=social)](https://github.com/your-org/ghost)
[![Twitter Follow](https://img.shields.io/twitter/follow/ghostprivacy?style=social)](https://twitter.com/ghostprivacy)

</div>
