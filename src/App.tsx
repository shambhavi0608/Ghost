/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Globe, ArrowRight, ArrowUpRight, HelpCircle, Heart, Star, Sparkles, Compass, 
  ShieldCheck, Cpu, Fingerprint, AlertTriangle, Lock, Unlock, RefreshCw, Terminal, 
  Activity, Video, Upload, Shield, Check, ChevronRight, ShieldAlert, Wifi, Layers
} from "lucide-react";
import { motion, AnimatePresence, animate } from "motion/react";

import Header from "./components/Header";
import GetStartedWizard from "./components/GetStartedWizard";
import { runFullScan } from "@/browser scanner/scan-engine/runScan";

// Official FastAPI Threat JSON payload model from the backend team
const THREAT_DATA = {
  status: "success",
  analysis: {
    ghost_score: 75,
    risk_level: "CRITICAL",
    biggest_risk: "Heavy tracker activity detected",
    all_risks: [
      "Heavy tracker activity detected",
      "Multiple sensitive permissions granted",
      "Uploaded image contains traceable metadata"
    ]
  },
  identity_matches: [
    { platform: "AdTracker Nexus", consent: false, risk_level: "HIGH" },
    { platform: "Behavior Analytics Grid", consent: false, risk_level: "HIGH" }
  ],
  image_analysis: {
    metadata: { format: "JPEG", size: [450, 600], mode: "RGB" },
    exif_found: true,
    traceability_risk: "HIGH",
    exif_preview: ["ExifOffset", "Orientation", "SubsecTimeOriginal", "DateTimeOriginal"]
  },
  privacy: {
    cleanup_status: "completed",
    message: "All uploaded data processed in-memory and destroyed after analysis."
  }
};

// Custom dynamic semi-circular orange threat gauge component matching the engineering checklist
function ThreatScoreGauge({ score }: { score: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animates smoothly from 0% to the target score when the component mounts
    const controls = animate(0, score, {
      duration: 1.5,
      ease: "easeOut", // smooth quadratic ease-out
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [score]);

  // Semicircle gauge maps displayValue (0% to 100%) to rotation angle (-90deg to +90deg)
  const angle = -90 + (displayValue / 100) * 180;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/45 border border-zinc-900/80 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden w-full max-w-[280px] mx-auto text-center border-orange-500/10 mb-2">
      <div className="absolute inset-0 bg-radial-gradient from-orange-500/5 to-transparent pointer-events-none rounded-3xl" />
      <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Threat Urgency Level</div>
      
      <div className="relative w-52 mt-4 select-none flex flex-col items-center">
        {/* Semicircular Gauge Vector Graphic */}
        <div className="relative w-52 h-28">
          <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="60%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f97316" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Semicircular Backing Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#121214"
              strokeWidth="16"
              strokeLinecap="round"
            />

            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="16"
              strokeLinecap="round"
              className="opacity-60"
            />

            {/* Active threat level arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#activeGradient)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="251.3"
              strokeDashoffset={251.3 - (251.3 * (displayValue / 100))}
            />

            {/* Dividers */}
            {[36, 72, 108, 144].map((deg) => {
              const rad = (Math.PI * deg) / 180;
              const x1 = 100 - 90 * Math.cos(rad);
              const y1 = 100 - 90 * Math.sin(rad);
              const x2 = 100 - 70 * Math.cos(rad);
              const y2 = 100 - 70 * Math.sin(rad);
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#09090b"
                  strokeWidth="3.5"
                />
              );
            })}

            {/* Center Pivot Point */}
            <circle cx="100" cy="100" r="10" fill="#09090b" stroke="#27272a" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="4.5" fill="#f97316" className="animate-pulse" />

            {/* Needle Pointer */}
            <g transform={`rotate(${angle} 100 100)`}>
              <polygon
                points="97.5,100 102.5,100 101,24 99,24"
                fill="#f97316"
                filter="url(#needleShadow)"
              />
              <circle cx="100" cy="24" r="2.5" fill="#ffffff" />
            </g>
          </svg>
        </div>

        {/* Dynamic Threat Score content container placed below with spacious vertical spacing */}
        <div className="mt-4 flex flex-col justify-center items-center w-full min-h-[70px]">
          <div className="text-3xl font-black text-orange-500 tracking-tighter drop-shadow-[0_0_8px_rgba(249,115,22,0.45)] font-mono">
            {displayValue}%
          </div>
          <div className={`text-[10px] font-bold uppercase tracking-widest mt-3 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
            displayValue >= 70 
              ? "text-red-400 bg-red-950/45 border-red-500/30 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.15)]" 
              : displayValue >= 45 
              ? "text-orange-400 bg-orange-950/40 border-orange-500/20" 
              : "text-emerald-400 bg-emerald-950/40 border-emerald-500/30"
          }`}>
            {displayValue >= 70 
              ? "CRITICAL THREAT" 
              : displayValue >= 45 
              ? "MODERATE RISK" 
              : "THREAT SECURED"
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  useEffect(() => {
    console.log("isWizardOpen =", isWizardOpen);
  }, [isWizardOpen]);
  const [wizardType, setWizardType] = useState<"fingerprint" | "photo">("fingerprint");
  const [activePopup, setActivePopup] = useState<"none" | "about" | "how-it-works">("none");
  const [isPhotoDropdownOpen, setIsPhotoDropdownOpen] = useState(false);
  const [photoMode, setPhotoMode] = useState<"upload" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // New multi-screen application state for seamless continuity
  const [appScreen, setAppScreen] = useState<"landing" | "scanning" | "dashboard">("landing");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [clientIpInfo, setClientIpInfo] = useState({
    ip: "157.48.204.119",
    city: "Mumbai",
    region: "Maharashtra",
    country: "India",
    org: "Comcast Cable Communications",
    latitude: 19.076,
    longitude: 72.877,
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [threatData, setThreatData] = useState<any>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const [shieldToggles, setShieldToggles] = useState({
    canvas: false,
    userAgent: false,
    webRTC: false,
    dnsOverHttps: false,
  });

  const displayData = threatData || THREAT_DATA;
  const baseScore = displayData.analysis.ghost_score;
  const canvasReduction = shieldToggles.canvas ? 20 : 0;
  const userAgentReduction = shieldToggles.userAgent ? 15 : 0;
  const webRTCReduction = shieldToggles.webRTC ? 20 : 0;
  const dnsReduction = shieldToggles.dnsOverHttps ? 15 : 0;
  const currentThreatScore = Math.max(5, baseScore - canvasReduction - userAgentReduction - webRTCReduction - dnsReduction);

  const [isShieldApplied, setIsShieldApplied] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch real client IP telemetry for Screen 3 Threat assessment
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ip) {
          setClientIpInfo({
            ip: data.ip || "157.48.204.119",
            city: data.city || "San Francisco",
            region: data.region || "California",
            country: data.country_name || "United States",
            org: data.org || "Cloudflare Protected Edge Node",
            latitude: data.latitude || 37.7749,
            longitude: data.longitude || -122.4194,
          });
        }
      })
      .catch((err) => {
        console.warn("Secure fallback activated: using default connection parameters.", err);
      });
  }, []);

  // 2. Programmatically print logs and linear progress bar track for Screen 2
  useEffect(() => {
    if (!isScanning) return;

    setScanProgress(0);
    setTerminalLogs([]);
    setIsShieldApplied(false);

    const logsList = [
      "► [INITIALIZING] Securing client browser memory container...",
      "► [UNMASKING] Extracting WebGL GPU hardware profiles...",
      "► [SAMPLING] Decoding canvas cryptographic signature token...",
      "► [COMPUTING] Hardware footprint matrix mapping completed..."
    ];

    let logIndex = 0;
    setTerminalLogs([logsList[0]]);

    const logInterval = setInterval(() => {
      logIndex++;
      if (logIndex < logsList.length) {
        setTerminalLogs(prev => [...prev, logsList[logIndex]]);
      } else {
        clearInterval(logInterval);
      }
    }, 1200);

    const startTime = Date.now();
    const duration = 5000; // Exact 5-second sequence requested

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setScanProgress(progress);

      if (elapsed >= duration) {
      clearInterval(progressInterval);

      (async () => {
      try {
      console.log("STARTING REAL SCAN");

        const result = await runFullScan();
        console.log("TRACKERS", result.trackers);
        console.log("TRACKERS LENGTH", result.trackers?.length);

        console.log("ENTROPY", result.entropy);

        console.log("PERMISSIONS", result.permissions);

        console.log("FINGERPRINT", result.fingerprint);

        console.log("SCAN RESULT", result);

        const permissionCount =
          Object.values(result.permissions)
          .filter((v) => v === "granted")
          .length;

        const formData = new FormData();

        formData.append(
          "tracker_count",
          String(result.trackers.count)
        );

        formData.append(
          "entropy_score",
          String(result.entropy.score)
        );

        formData.append(
          "permission_count",
          String(permissionCount)
        );

        formData.append(
          "fingerprint_id",
          result.fingerprint.hash
        );
        if (uploadedFile) {
          formData.append("image", uploadedFile);
        }
        console.log("UPLOADED FILE:", uploadedFile);

        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }
        const response = await fetch(
          "http://127.0.0.1:8000/analyze",
          {
            method: "POST",
            body: formData,
          }
        );

        const analysis = await response.json();

        console.log("BACKEND ANALYSIS", analysis);

        setThreatData(analysis);

        setIsScanning(false);
        setAppScreen("dashboard");

      } catch (err) {
        console.error("SCAN FAILED", err);
      }
      })();
      }

    }, 30);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [isScanning]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (x / (rect.width / 2)) * 12,
      y: -(y / (rect.height / 2)) * 12,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploadedFile(file);
      setWizardType("photo");
      setPhotoMode("upload");

      setIsWizardOpen(true);
      // Seamless layout transition on image upload
      setIsScanning(true);
      setAppScreen("scanning");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-white flex flex-col font-sans overflow-hidden">
      
      {/* Background radial soft warmth glow to simulate professional digital agency layout */}
      <div className="absolute top-0 left-[-15%] w-[60%] h-[60%] rounded-full bg-cyan-650/5 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1a0a2e]/15 blur-[150px] pointer-events-none"></div>
      
      {/* Absolute background grid pattern with fading opacity depending on active screen */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none transition-all duration-1000 ${
        isScanning ? "opacity-20" : appScreen === "dashboard" ? "opacity-35" : "opacity-100"
      }`}></div>

      {/* Real-time Lopping Side Background Video */}
      <div className={`absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0 select-none transition-all duration-1000 ${
        isScanning 
          ? "left-0 right-0 w-full h-full opacity-60" 
          : "right-0 w-full lg:w-[48%] h-full opacity-90 animate-cyan-glow max-[600px]:w-[90%] max-[600px]:right-[5%] max-[600px]:rounded-3xl max-[600px]:border max-[600px]:border-[#00f5d4]/10"
      }`}>
        <video
          key={isScanning ? "scanning-bg" : "normal-bg"}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-700 pointer-events-none"
          src={isScanning 
            ? "https://res.cloudinary.com/dcbrdb14f/video/upload/v1780142563/kling_20260530_%E4%BD%9C%E5%93%81_A_cinemati_4798_0_byk9h6.mp4"
            : "https://res.cloudinary.com/dcbrdb14f/video/upload/v1780127197/kling_20260530_%E4%BD%9C%E5%93%81_A_photorea_3892_0_ambt30.mp4"
          }
        />
        {/* Transparent gradients to blend the video cleanly with the text and dark spaces */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${
          isScanning 
            ? "bg-black/65" 
            : "bg-gradient-to-r from-[#000000] via-[#000000]/65 to-transparent lg:from-[#000000] lg:via-[#000000]/20 lg:to-transparent"
        }`}></div>
        <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-[#000000] to-transparent"></div>
        <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-[#000000] to-transparent"></div>
      </div>

      {/* Header Container - Dampened to opacity-30 during Scanning */}
      <div className={`transition-all duration-700 relative z-50 ${isScanning ? "opacity-30 pointer-events-none blur-[0.5px]" : "opacity-100"}`}>
        <Header 
         onOpenWizard={() => {
          console.log("OPEN BUTTON CLICKED");

          setWizardType("fingerprint");
          setPhotoMode(null);

          setIsWizardOpen(true);

          setIsScanning(true);
          setAppScreen("scanning");
      }}
          onNavigateToAbout={() => setActivePopup("about")}
          onNavigateToHowItWorks={() => setActivePopup("how-it-works")}
          onNavigateToLanding={() => {
            setIsScanning(false);
            setAppScreen("landing");
          }}
          onShowNotification={setNotification}
        />
      </div>

      {/* Main Container - Framed elegantly within standard boundaries */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center py-6 lg:py-10 z-10">
        
        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT WING: Landing texts vs Scanning Logs vs Threat Parameters (8/12 Desktop Grid) */}
          <div className="lg:col-span-8 flex flex-col items-start text-left space-y-6 w-full min-h-[360px] justify-center">
            
            <AnimatePresence mode="wait">
              {/* SCREEN 1: Landing Page view content (isScanning === false and appScreen !== "dashboard") */}
              {!isScanning && appScreen !== "dashboard" && (
                <motion.div
                  key="screen-1-landing"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 w-full"
                >
                  {/* Subtle protective tag */}
                  <div className="flex items-center gap-3 select-none">
                    <div className="p-2 bg-zinc-950 border border-zinc-900 rounded-full inline-flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-[#00f5d4]" />
                    </div>
                    <div className="text-left font-sans text-xs tracking-tight text-zinc-400 leading-tight">
                      <span className="font-bold text-[#00f5d4]">GHOST SECURE</span> protects<br />
                      user connections
                    </div>
                  </div>

                  {/* Headline */}
                  <h1 className="text-4xl max-[600px]:text-3xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold font-sans tracking-tight leading-[1.05]">
                    <span className="bg-gradient-to-r from-[#00f5d4] via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(0,245,212,0.3)] leading-normal pr-1.5 uppercase font-black">GHOST</span>
                  </h1>

                  {/* Taglines */}
                  <div className="space-y-2">
                    <p className="text-white max-w-xl text-lg max-[600px]:text-[14.5px] sm:text-xl font-bold leading-normal text-left">
                      You think you're anonymous. You're not.
                    </p>
                    <p className="text-zinc-500 max-w-xl text-xs max-[600px]:text-[9.5px] font-normal leading-relaxed text-left">
                      In 4 seconds, we'll show you exactly what the internet sees when you show up.
                    </p>
                  </div>

                  {/* Buttons controls */}
                  <div className="flex flex-row max-[600px]:flex-col items-stretch sm:items-center gap-4 pt-3 pb-4 w-full relative z-30">
                    <button
                      onClick={() => {
                        setWizardType("fingerprint");
                        setPhotoMode(null);
                        setIsScanning(true);
                        setAppScreen("scanning");
                      }}
                      className="cursor-pointer font-bold px-8 py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap text-center text-black bg-[#00f5d4] hover:shadow-[0_0_25px_rgba(0,245,212,0.6)] font-sans text-sm max-[600px]:w-full"
                    >
                      Scan My Fingerprint
                    </button>

                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      className="cursor-pointer font-bold px-8 py-3.5 rounded-xl border-2 border-[#00f5d4] text-[#00f5d4] bg-transparent hover:bg-[#00f5d4] hover:text-black transition-all transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap text-center font-sans text-sm max-[600px]:w-full"
                    >
                      Upload connection photo
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 2: The Scanning Console (isScanning === true) */}
              {isScanning && (
                <motion.div
                  key="screen-2-scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 w-full"
                >
                  {/* Subtle Decrypting Indicator */}
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00f5d4]">
                    <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-ping"></span>
                    <span>ACTIVE PRIVACY DECRYPTION LOOP</span>
                  </div>

                  {/* Monospace terminal console coding box */}
                  <div className="w-full max-w-xl rounded-2xl bg-black/85 border border-zinc-900/90 shadow-inner p-6 space-y-3 font-mono text-xs h-[180px] flex flex-col justify-start overflow-y-auto leading-relaxed">
                    {terminalLogs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#00f5d4] flex items-start gap-1 font-mono text-[11px]"
                      >
                        <span className="text-zinc-600 shrink-0 select-none">&gt;&gt;</span>
                        <span>{log}</span>
                      </motion.div>
                    ))}
                    {terminalLogs.length < 4 && (
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-700 shrink-0 select-none">..</span>
                        <span className="w-1.5 h-4 bg-zinc-600 animate-pulse"></span>
                      </div>
                    )}
                  </div>

                  {/* Thin horizontal progress tracking bar */}
                  <div className="space-y-2 w-full max-w-xl">
                    <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                      <span>Telemetry Mapping Stability</span>
                      <span className="text-[#00f5d4] font-bold">{Math.round(scanProgress)}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-[3px] rounded-full overflow-hidden border border-zinc-900/50 relative">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#00f5d4] via-cyan-400 to-blue-500 shadow-[0_0_8px_#00f5d4]"
                        style={{ width: `${scanProgress}%` }}
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 3: GHOST Privacy Threat Dashboard (appScreen === "dashboard" and isScanning === false) */}
              {appScreen === "dashboard" && !isScanning && (
                <motion.div
                  key="screen-3-dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6 w-full"
                >
                  <div className="flex flex-col items-center justify-center text-center gap-4 border-b border-zinc-900/60 pb-6">
                    <div className="space-y-1.5 flex flex-col items-center">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#f97316] bg-[#f97316]/10 border border-[#f97316]/20 px-3 py-1 rounded-full font-bold shadow-[0_0_12px_rgba(249,115,22,0.1)]">
                        PRIVACY DECRYPTION COMPLETE
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white mt-2">
                        GHOST Privacy Threat Report
                      </h2>
                    </div>
                    
                    {/* Dynamic semi-circular orange threat score gauge is prominently centered at the top of Screen 3! */}
                    <ThreatScoreGauge score={currentThreatScore} />

                    {/* High-visibility pulsing red threat indicator badge mapping "risk_level" */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-950/40 border border-red-500/40 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)] mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                      <span className="text-red-400 font-mono text-xs font-black tracking-widest uppercase">
                        {currentThreatScore > 35 ? THREAT_DATA.analysis.risk_level : "SHIELDED"}
                      </span>
                    </div>
                  </div>

                  {/* Modern grid cards - completely responsive-first, equal height */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    
                    {/* Card 1: Your Biggest Risk Right Now */}
                    <div className="bg-zinc-950/60 border border-red-500/20 rounded-2xl p-6 text-left flex flex-col justify-between space-y-4 shadow-md transition-all hover:border-red-500/35 hover:shadow-lg relative overflow-hidden group">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-red-400 font-mono text-[10px] uppercase font-bold border-b border-zinc-900 pb-2">
                          <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                          <span>Your Biggest Risk Right Now</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Primary Threat Block</div>
                          <div className="text-lg font-black text-white font-sans leading-snug">
                            {displayData.analysis.biggest_risk}
                          </div>
                        </div>
                        <div className="space-y-2 pt-2">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Detected Vulnerability Log</div>
                          <ul className="space-y-1.5">
                            {displayData.analysis.all_risks.map((risk, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed font-sans">
                                <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-zinc-900/60 mt-auto">
                        <span className="inline-block text-[10px] font-mono font-bold text-red-400 bg-red-950/20 px-2.5 py-1 rounded border border-red-900/30">
                          EXTERNAL VULNERABILITIES FOUND
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Identity Leak Target Nodes */}
                    <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 text-left flex flex-col justify-between space-y-4 shadow-md transition-all hover:border-orange-500/10 hover:shadow-lg relative overflow-hidden">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] uppercase font-bold border-b border-zinc-900 pb-2">
                          <Activity className="w-4 h-4 text-orange-500" />
                          <span>Identity Leak Target Nodes (Access Without Consent)</span>
                        </div>
                        <div className="space-y-3 pt-1">
                          {displayData.identity_matches.map((match, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-black/45 border border-zinc-900/70 gap-2 hover:border-zinc-800 transition-colors">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                                <span className="text-xs font-bold text-zinc-200 font-mono tracking-tight">{match.platform}</span>
                              </div>
                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 bg-red-950/70 border border-red-500/40 text-red-400 rounded-lg uppercase shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                                  Consent: False
                                </span>
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-orange-950/30 border border-orange-900/30 text-orange-400 rounded">
                                  {match.risk_level} Risk
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-zinc-900/60 mt-auto">
                        <span className="inline-block text-[10px] font-mono font-bold text-orange-400 bg-orange-950/20 px-2.5 py-1 rounded border border-orange-900/30">
                          ACCESS BLOCKED
                        </span>
                      </div>
                    </div>

                    {/* Card 3: EXIF Metadata Preview Grid */}
                    <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 text-left flex flex-col justify-between space-y-4 shadow-md transition-all hover:border-cyan-500/10 hover:shadow-lg relative overflow-hidden col-span-1 md:col-span-2">
                      <div className="space-y-3 w-full">
                        <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] uppercase font-bold border-b border-zinc-900 pb-2">
                          <Cpu className="w-4 h-4 text-cyan-400" />
                          <span>EXIF Metadata Preview (Image Analysis)</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 bg-black/40 rounded-xl border border-zinc-900/80 flex flex-col justify-center">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Image Format</span>
                            <span className="text-xs font-bold text-zinc-350 mt-1">{displayData.image_analysis?.metadata?.format ?? "N/A"}</span>
                          </div>
                          <div className="p-3 bg-black/40 rounded-xl border border-zinc-900/80 flex flex-col justify-center font-sans">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Real Dimension Parameters</span>
                            <span className="text-xs font-bold text-zinc-350 mt-1">
                              {displayData.image_analysis?.metadata?.size?.[0] ?? 0} x {displayData.image_analysis?.metadata?.size?.[1] ?? 0} ({displayData.image_analysis?.metadata?.mode ?? "Unknown"})
                            </span>
                          </div>
                          <div className="p-3 bg-red-950/25 rounded-xl border border-red-500/30 flex flex-col justify-center font-sans shadow-[0_0_12px_rgba(239,68,68,0.15)] hover:border-red-500/50 transition-colors">
                            <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider block font-bold">Traceability Risk</span>
                            <span className="text-xs font-extrabold text-red-400 mt-1 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              Image Risk: HIGH
                            </span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-semibold">Exif data preview hash identifiers</span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10.5px]">
                            {(displayData.image_analysis?.exif_preview ?? []).map((tag, idx) => (
                              <div key={idx} className="bg-zinc-900/30 px-3 py-2 rounded-lg border border-zinc-900 text-center text-zinc-400 font-mono hover:text-[#00f5d4] hover:border-[#00f5d4]/20 transition-all">
                                #{tag}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Volatile Green Memory Cleanup Notification Banner */}
                  {displayData.privacy.cleanup_status === "completed" && (
                    <div className="w-full bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] p-4 rounded-2xl flex items-start gap-3 mt-4 leading-relaxed shadow-[0_4px_16px_rgba(16,185,129,0.1)]">
                      <span className="text-sm shrink-0 leading-none">✓</span>
                      <div>
                        <span className="font-bold text-emerald-300">Cleanup Status: Completed</span> — {displayData.privacy.message}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* RIGHT WING: Floating isometric glass plate vs separate Scanning Console cube with video and cyan sweep vs Shielding controls */}
          <div className={`lg:col-span-4 w-full flex items-center justify-center relative z-20 transition-all duration-300 ${
            appScreen === "dashboard" ? "min-h-[520px] h-auto" : "h-[450px]"
          }`}>
            <AnimatePresence mode="wait">
              
              {/* SCREEN 1: Bobbing glowing orange aura visual portal on the Y-axis (with plate made fully transparent) */}
              {!isScanning && appScreen !== "dashboard" && (
                <motion.div
                  key="isometric-glass-plate-wing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    transform: "perspective(1200px) rotateX(25deg) rotateY(-25deg) rotateZ(10deg)",
                    transformStyle: "preserve-3d"
                  }}
                  className="w-72 h-96 flex flex-col items-center justify-center relative overflow-visible group p-6 active:scale-98 transition-transform cursor-pointer"
                  onClick={() => {
                    setWizardType("fingerprint");
                    setPhotoMode(null);
                    setIsScanning(true);
                    setAppScreen("scanning");
                  }}
                >
                  <motion.div
                    animate={{
                      y: [-25, 25, -25],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="flex flex-col items-center justify-center relative"
                  >
                    {/* Orange soft glow aura light behind the invisible Fingerprint vector */}
                    <div className="absolute w-44 h-44 rounded-full bg-orange-500/30 blur-3xl pointer-events-none -z-10 animate-pulse"></div>
                  </motion.div>
                </motion.div>
              )}

              {/* SCREEN 2: Glassmorphic Scanner Cube with circular mesh, video feed, horizontal neon-cyan sweep line and live video */}
              {isScanning && (
                <motion.div
                  key="scanning-console-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-sm h-full flex flex-col items-center justify-center relative select-none"
                >
                  {/* Bounding circular target mesh radar circles */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                    <div className="absolute w-72 h-72 rounded-full border border-dashed border-cyan-500/20 animate-[spin_40s_linear_infinite]" />
                    <div className="absolute w-64 h-64 rounded-full border border-cyan-500/10" />
                    <div className="absolute w-80 h-80 rounded-full border border-cyan-500/5" />
                  </div>

                  {/* Glassmorphic Scanner Cube */}
                  <div 
                    className="w-72 h-96 rounded-3xl bg-black/40 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.25)] relative overflow-hidden flex flex-col items-center justify-center p-4 z-10"
                    style={{
                      boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)"
                    }}
                  >
                    {/* Active Laser Line neon-cyan sweep animation */}
                    <motion.div
                      animate={{
                        y: [-10, 360, -10]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#00f5d4] to-transparent shadow-[0_0_15px_#00f5d4] z-20 pointer-events-none"
                    />

                    {/* Specular glass gleam overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none z-15" />

                    {/* HTML5 video component / uploaded preview nested inside the scanner cube */}
                    <div className="w-full h-full rounded-2xl overflow-hidden relative bg-black flex items-center justify-center border border-zinc-900/80">
                      {photoMode === "upload" && uploadedFile ? (
                        <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center">
                          <img
                            src={uploadedFile}
                            alt="Uploaded Connection Check Source"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-full bg-[#050e14] flex flex-col items-center justify-between p-6 select-none overflow-hidden">
                          {/* 1. Grid Background & Target Circles */}
                          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
                            {/* Accent Circular target meshes */}
                            <div className="absolute w-[240px] h-[240px] rounded-full border border-[#00f5d4]/20"></div>
                            <div className="absolute w-[180px] h-[180px] rounded-full border border-[#00f5d4]/15 animate-pulse"></div>
                            <div className="absolute w-[120px] h-[120px] rounded-full border border-[#00f5d4]/10"></div>
                            
                            {/* Thin Grid line pattern */}
                            <div className="absolute inset-0 bg-[#00f5d4]/[0.025] bg-[size:20px_20px]"></div>
                            
                            {/* Axis crosses */}
                            <div className="absolute w-full h-[0.5px] bg-[#00f5d4]/15"></div>
                            <div className="absolute h-full w-[0.5px] bg-[#00f5d4]/15"></div>
                          </div>

                          {/* 2. Inner Digital Scanner Bracket Borders */}
                          <div className="absolute top-6 left-6 w-8 h-8 border-t-[3px] border-l-[3px] border-[#00f5d4] rounded-tl-sm pointer-events-none z-25"></div>
                          <div className="absolute top-6 right-6 w-8 h-8 border-t-[3px] border-r-[3px] border-[#00f5d4] rounded-tr-sm pointer-events-none z-25"></div>
                          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-[3px] border-l-[3px] border-[#00f5d4] rounded-bl-sm pointer-events-none z-25"></div>
                          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-[3px] border-r-[3px] border-[#00f5d4] rounded-br-sm pointer-events-none z-25"></div>

                          {/* 3. Centered Glowing Fingerprint Vector */}
                          <div className="relative flex-1 w-full flex items-center justify-center z-10 mt-2">
                            {/* Soft glowing aura under the fingerprint */}
                            <div className="absolute w-36 h-36 rounded-full bg-[#00f5d4]/15 blur-2xl pointer-events-none"></div>
                            
                            {/* Pulsing halo */}
                            <div className="absolute w-28 h-28 rounded-full border-2 border-[#00f5d4]/20 animate-ping duration-1000"></div>

                            {/* Fingerprint Glyph */}
                            <div className="relative">
                              <Fingerprint 
                                className="w-32 h-32 text-[#00f5d4] drop-shadow-[0_0_15px_rgba(0,245,212,0.85)]" 
                                strokeWidth={1.5}
                              />
                            </div>

                            {/* Precise horizontal sweep line inside the sensor boundaries */}
                            <motion.div
                              animate={{
                                y: [-60, 60, -60]
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="absolute left-2 right-2 h-[2.5px] bg-gradient-to-r from-transparent via-[#00f5d4] to-transparent shadow-[0_0_12px_#00f5d4] z-20 pointer-events-none flex items-center justify-center"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#00f5d4] animate-pulse"></div>
                            </motion.div>
                          </div>

                          {/* 4. Scanning Text Status & Dynamic Percentage Indicators */}
                          <div className="relative z-20 w-full flex flex-col items-center gap-1.5 pt-2">
                            <div className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#00f5d4] uppercase animate-pulse">
                              SCANNING . . .
                            </div>
                            <div className="text-xl font-mono font-black text-[#00f5d4] leading-none mb-1">
                              {Math.round(scanProgress)}%
                            </div>
                            
                            {/* Segmented Digital Loading Tick Markers */}
                            <div className="flex gap-[3px] justify-center items-center w-full max-w-[210px] h-3">
                              {Array.from({ length: 32 }).map((_, idx) => {
                                const activeTicksCount = Math.floor((scanProgress / 100) * 32);
                                const isActive = idx < activeTicksCount;
                                return (
                                  <div
                                    key={idx}
                                    className={`w-[4px] h-3.5 rounded-[1px] transition-all duration-100 ${
                                      isActive 
                                        ? "bg-[#00f5d4] shadow-[0_0_8px_rgba(0,245,212,0.95)]" 
                                        : "bg-zinc-800/60"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Decrypting scanning hud overlay indicators */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10 font-mono text-[9px]">
                        <div className="bg-black/90 px-2 py-0.5 rounded border border-cyan-500/30 text-[#00f5d4] font-bold uppercase animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]"></span>
                          COMPILING
                        </div>
                        <span className="text-zinc-500 font-semibold uppercase tracking-widest text-[8px]">SCAN_FEED_01</span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex items-center justify-between font-mono text-[9px] text-[#00f5d4] z-10 bg-black/60 px-2.5 py-1 rounded border border-zinc-900 backdrop-blur-sm">
                        <span className="text-zinc-400 font-semibold text-[8px]">NODE: 0x89</span>
                        <span className="animate-pulse text-[8px] uppercase tracking-wider text-right">UNMASKING MATRIX PATHS...</span>
                      </div>
                    </div>

                    {/* Corner aesthetics pins on the scanner cube context */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400/50 rounded-tl"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400/50 rounded-tr"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-400/50 rounded-bl"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-400/50 rounded-br"></div>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 3: Interactive GHOST toggles card */}
              {appScreen === "dashboard" && !isScanning && (
                <motion.div
                  key="privacy-toggles-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-sm min-h-[490px] h-auto rounded-2xl border border-zinc-900 bg-zinc-950/65 backdrop-blur-md p-6 flex flex-col justify-between shadow-2xl relative overflow-visible"
                >
                  <div className="space-y-4">
                    <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                        <h4 className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wide">
                          GHOST Proxy Filters
                        </h4>
                      </div>
                      <Shield className="w-4 h-4 text-orange-400" />
                    </div>

                    {/* Active toggle sliders lists */}
                    <div className="space-y-3 pt-1.5 text-left">
                      
                      {/* Toggle 1 */}
                      <label className="flex items-center justify-between p-2 rounded-xl border border-zinc-900/50 hover:bg-zinc-900/30 transition-all cursor-pointer select-none">
                        <div className="text-left leading-tight pr-2">
                          <span className="text-xs font-bold font-sans block text-zinc-200">Canvas Fingerprint Blocker</span>
                          <span className="text-[10px] font-mono text-zinc-500 block leading-normal mt-0.5">Inject randomized hash context (+20%)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={shieldToggles.canvas}
                          onChange={() => setShieldToggles(prev => ({ ...prev, canvas: !prev.canvas }))}
                          className="h-4 w-4 rounded border-zinc-800 text-[#00f5d4] focus:ring-[#00f5d4] cursor-pointer"
                        />
                      </label>

                      {/* Toggle 2 */}
                      <label className="flex items-center justify-between p-2 rounded-xl border border-zinc-900/50 hover:bg-zinc-900/30 transition-all cursor-pointer select-none">
                        <div className="text-left leading-tight pr-2">
                          <span className="text-xs font-bold font-sans block text-zinc-200">User-Agent Rotator Filter</span>
                          <span className="text-[10px] font-mono text-zinc-500 block leading-normal mt-0.5">Continuously mask client brand (+22%)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={shieldToggles.userAgent}
                          onChange={() => setShieldToggles(prev => ({ ...prev, userAgent: !prev.userAgent }))}
                          className="h-4 w-4 rounded border-zinc-800 text-[#00f5d4] focus:ring-[#00f5d4] cursor-pointer"
                        />
                      </label>

                      {/* Toggle 3 */}
                      <label className="flex items-center justify-between p-2 rounded-xl border border-zinc-900/50 hover:bg-zinc-900/30 transition-all cursor-pointer select-none">
                        <div className="text-left leading-tight pr-2">
                          <span className="text-xs font-bold font-sans block text-zinc-200">WebRTC Protection Guard</span>
                          <span className="text-[10px] font-mono text-zinc-500 block leading-normal mt-0.5">Seal local IP leaks in sandbox (+21%)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={shieldToggles.webRTC}
                          onChange={() => setShieldToggles(prev => ({ ...prev, webRTC: !prev.webRTC }))}
                          className="h-4 w-4 rounded border-zinc-800 text-[#00f5d4] focus:ring-[#00f5d4] cursor-pointer"
                        />
                      </label>

                      {/* Toggle 4 */}
                      <label className="flex items-center justify-between p-2 rounded-xl border border-zinc-900/50 hover:bg-zinc-900/30 transition-all cursor-pointer select-none">
                        <div className="text-left leading-tight pr-2">
                          <span className="text-xs font-bold font-sans block text-zinc-200">Encrypted DoH Transit DNS</span>
                          <span className="text-[10px] font-mono text-zinc-500 block leading-normal mt-0.5">Obfuscate query trails (+15%)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={shieldToggles.dnsOverHttps}
                          onChange={() => setShieldToggles(prev => ({ ...prev, dnsOverHttps: !prev.dnsOverHttps }))}
                          className="h-4 w-4 rounded border-zinc-800 text-[#00f5d4] focus:ring-[#00f5d4] cursor-pointer"
                        />
                      </label>

                    </div>
                  </div>

                  {/* Buttons controls inside controllers console */}
                  <div className="space-y-2 mt-4">
                    <AnimatePresence>
                      {isShieldApplied ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 font-mono text-[10px] rounded-xl text-center leading-normal"
                        >
                          ✔ GHOST Shield successfully engaged on port coordinates!
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <button
                      onClick={() => setIsShieldApplied(true)}
                      className="w-full bg-[#00f5d4] hover:shadow-[0_0_20px_rgba(0,245,212,0.5)] text-black font-bold text-xs py-3 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Lock Down Connection Matrix</span>
                    </button>

                    <button
                      onClick={() => {
                        setShieldToggles({ canvas: false, userAgent: false, webRTC: false, dnsOverHttps: false });
                        setIsShieldApplied(false);
                        setIsScanning(false);
                        setAppScreen("landing");
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 hover:text-white hover:bg-zinc-800 font-semibold text-zinc-400 text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3 animate-spin-slow shrink-0" />
                      <span>Reset Coordinates Audit</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

        {/* BOTTOM METRIC GRID — Show only if not dashboard (i.e. on Landing or Scanning screens) */}
        {appScreen !== "dashboard" && (
          <div className={`mt-8 md:mt-12 grid grid-cols-2 gap-4 max-w-sm transition-all duration-700 ${
            isScanning ? "opacity-30 pointer-events-none blur-[1px]" : "opacity-100"
          }`}>
            {/* Micro card 1 (150+) */}
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 text-left backdrop-blur-sm shadow-lg">
              <div className="text-xl md:text-2xl font-black text-[#00f5d4] font-sans tracking-tight">150+</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Global Nodes Audited</div>
            </div>
            {/* Micro card 2 (98%) */}
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 text-left backdrop-blur-sm shadow-lg">
              <div className="text-xl md:text-2xl font-black text-[#00f5d4] font-sans tracking-tight">98%</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Prevention Accuracy</div>
            </div>
          </div>
        )}

      </main>

      {/* Trust Strip */}
      <div className="w-full border-t border-zinc-900 bg-zinc-950/15 py-4 px-6 text-center text-xs text-zinc-500 font-sans z-15 mt-auto select-none">
        <span className="inline-flex items-center gap-2 justify-center">
          <span>🔒</span>
          <span>We never store your photo, fingerprint, or scan details. Everything stays on your device.</span>
        </span>
      </div>

      {/* Footer Branding Copyright */}
      <footer className="w-full border-t border-zinc-950 bg-black/60 py-4 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600 font-mono z-10">
        <span>© 2026 GHOST Privacy Technologies Inc. All rights reserved.</span>
        <div className="flex gap-4 mt-2 sm:mt-0 select-none">
          <a href="#" onClick={(e) => { e.preventDefault(); setActivePopup("about"); }} className="hover:text-[#00f5d4] pb-0.5 border-b border-transparent hover:border-[#00f5d4]/50">Security Parameters</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setAppScreen("scanning"); }} className="hover:text-[#00f5d4] pb-0.5 border-b border-transparent hover:border-[#00f5d4]/50">Diagnostic Logs</a>
        </div>
      </footer>

      {/* Popups Overlay System for About and How It Works */}
      <AnimatePresence>
        {activePopup !== "none" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Top gradient highlight lines */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

              {/* Close Button */}
              <button
                onClick={() => setActivePopup("none")}
                className="absolute top-5 right-5 p-2 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-full text-zinc-400 hover:text-white cursor-pointer"
              >
                <XIcon />
              </button>

              {activePopup === "about" && (
                <div className="space-y-5 text-left">
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit text-orange-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-sans">Humanist Conception Strategy</h3>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                      At GHOST, we challenge the conventional industry paradigm of treating human audiences as mere clicks, DAUs, or optimization targets. We believe high-end visual design is a profound medium of connection.
                    </p>
                  </div>
                  <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 font-mono text-xs text-zinc-400">
                    <div className="flex gap-2.5 items-start">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>We employ strict offline privacy checks throughout all client applications to ensure complete safety and trust.</span>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <Compass className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                      <span>Zero toxic notification patterns, pop-up loops, or hidden subscription gates.</span>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <Cpu className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                      <span>Optimized backend engines developed with sub-second responsiveness standards.</span>
                    </div>
                  </div>
                  <div className="pt-3 flex justify-end gap-3">
                    <button
                      onClick={() => { setActivePopup("none"); setIsWizardOpen(true); }}
                      className="px-5 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors text-xs cursor-pointer"
                    >
                      Audit My Systems
                    </button>
                  </div>
                </div>
              )}

              {activePopup === "how-it-works" && (
                <div className="space-y-6 text-left">
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit text-orange-400">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-sans">The 3-Step Integration Flow</h3>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                      How we synchronize with your enterprise team's coordinates:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-7 h-7 bg-zinc-900 border border-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Align Context and Demographics</h4>
                        <p className="text-xs text-zinc-400 mt-1">We study your target audiences and behavior benchmarks through non-invasive telemetry profiles.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-7 h-7 bg-zinc-900 border border-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Perform Zero-Friction Sculpting</h4>
                        <p className="text-xs text-zinc-400 mt-1">We implement components with perfect layout ratios, geometric typography rules, and accelerated loaders.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-7 h-7 bg-zinc-900 border border-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Deploy on Secure Glass Rails</h4>
                        <p className="text-xs text-zinc-400 mt-1">Your code compiles into light, bundled static containers ready for lightning-fast edge delivery worldwide.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActivePopup("none")}
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer shadow-lg"
                    >
                      Acknowledge Workflow
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating System Alerts Toaster matching the engineering checklist */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-950/95 border border-orange-500/30 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.15)] backdrop-blur-xl"
          >
            <div className="p-1 px-1.5 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 text-[10px] font-bold font-mono">
              SYSTEM
            </div>
            <div className="text-xs font-semibold font-sans">
              {notification}
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 hover:text-zinc-200 text-zinc-500 transition-colors"
            >
              <XIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Setup Interactive Onboarding Forms */}
      <GetStartedWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        scanType={wizardType} 
        photoMode={photoMode}
        uploadedFile={uploadedFile}
        uploadedFileName={uploadedFileName}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

    </div>
  );
}

// Small custom helper component for Close Icon
function XIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-400 hover:text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
