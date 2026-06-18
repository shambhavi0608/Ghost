/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Shield, AlertCircle, Cpu, Eye, EyeOff, Globe, Sparkles, Smartphone, Layers } from "lucide-react";
import { runFullScan } from "../../browser scanner/scan-engine";

interface GetStartedWizardProps {
  isOpen: boolean;
  onClose: () => void;
  scanType: "fingerprint" | "photo";
  photoMode?: "upload" | null;
  uploadedFile?: string | null;
  uploadedFileName?: string | null;
}

export default function GetStartedWizard({ 
  isOpen, 
  onClose, 
  scanType,
  photoMode = null,
  uploadedFile = null,
  uploadedFileName = null
}: GetStartedWizardProps) {
  const [scanState, setScanState] = useState<"scanning" | "completed">("scanning");
  const [loadingStep, setLoadingStep] = useState(0);

  const loaderMessages = [
    "Initializing sandboxed client verification...",
    "Analyzing hardware architecture & canvas fingerprinting...",
    "Querying public location & routing parameters...",
    "Decoding active browser metadata records...",
  ];

  // Browser telemetry details gathered client-side safely
  const [telemetry, setTelemetry] = useState({
    viewport: "1920x1080",
    os: "Unknown OS",
    browser: "Unknown Browser",
    language: "en-US",
    timezone: "UTC",
    gpu: "WebGL Renderer",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getBrowserInfo = () => {
        const ua = navigator.userAgent;
        let tem;
        let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
          tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
          return "IE " + (tem[1] || "");
        }
        if (M[1] === "Chrome") {
          tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
          if (tem != null) return tem.slice(1).join(" ").replace("OPR", "Opera");
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(" ");
      };

      const getOSInfo = () => {
        const platform = navigator.platform || "";
        if (platform.indexOf("Win") !== -1) return "Windows";
        if (platform.indexOf("Mac") !== -1) return "macOS";
        if (platform.indexOf("Linux") !== -1) return "Linux";
        if (/Android/.test(navigator.userAgent)) return "Android";
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return "iOS";
        return platform;
      };

      setTelemetry({
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        os: getOSInfo(),
        browser: getBrowserInfo(),
        language: navigator.language || "en-US",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        gpu: "HTML5 Canvas Active",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("WIZARD EFFECT RUNNING");
    console.log("About to call runFullScan");

    if (!isOpen) {
      console.log("Wizard closed");
      return;
    }

    console.log("Wizard opened");

    console.log("ABOUT TO CALL RUNFULLSCAN VERSION 999");
    console.log(runFullScan);
    alert("VERSION 999");

    runFullScan()
      .then((result) => {
        console.log("Ghost Scan Result:", result);
      })
      .catch((err) => {
        console.error("Ghost Scan Failed:", err);
      });

    setScanState("scanning");
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loaderMessages.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setScanState("completed");
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1000); // 1000ms * 4 steps = 4 seconds total as requested

    return () => {
      clearInterval(stepInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-[0_10px_50px_rgba(0,245,212,0.15)]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-full text-zinc-400 hover:text-white cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Glowing Cyan Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f5d4] to-transparent animate-pulse"></div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            
            {/* 1. SCANNING STATE (For exactly 4 seconds) */}
            {scanState === "scanning" && (
              <motion.div
                key="scanning-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8 space-y-6 text-center w-full"
              >
                <div className="relative w-full max-w-sm h-48 rounded-2xl overflow-hidden border border-zinc-900 bg-black/60 flex items-center justify-center">
                  {/* Fingerprint scan animation */}
                  {scanType === "fingerprint" && (
                    <div className="relative w-20 h-20 rounded-full border border-[#00f5d4]/20 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#00f5d4]/10 rounded-full animate-ping"></div>
                      <Layers className="w-10 h-10 text-[#00f5d4] animate-pulse" />
                    </div>
                  )}

                  {/* Photo scan: Local image preview */}
                  {scanType === "photo" && photoMode === "upload" && (
                    <div className="relative w-full h-full flex items-center justify-center bg-zinc-900/40">
                      {uploadedFile ? (
                        <>
                          <img
                            src={uploadedFile}
                            alt="Uploaded local check source"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                          {/* Scanning matrix animation */}
                          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse top-1/2 shadow-[0_0_15px_rgba(0,245,212,0.4)]"></div>
                          
                          <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-450 font-mono text-[9px] truncate max-w-[200px]">
                            {uploadedFileName || "source_capture.png"}
                          </div>
                        </>
                      ) : (
                        <div className="p-4 text-center space-y-2 text-zinc-500">
                          <Smartphone className="w-8 h-8 mx-auto text-zinc-600 animate-pulse" />
                          <p className="text-xs font-mono">No local image active</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback generic photo scan */}
                  {scanType === "photo" && !photoMode && (
                    <div className="relative w-20 h-20 rounded-full border border-cyan-400/20 flex items-center justify-center">
                      <div className="absolute inset-0 bg-cyan-400/10 rounded-full animate-ping"></div>
                      <Smartphone className="w-10 h-10 text-cyan-400 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-red-500 font-sans">
                    THIS IS VERSION 999
                    {scanType === "fingerprint" ? "Analyzing Digital Fingerprint" : "Calibrating Sandbox Aperture"}
                  </h3>
                  <div className="text-xs font-mono text-[#00f5d4] bg-[#00f5d4]/5 px-4 py-2 rounded-xl border border-[#00f5d4]/25 max-w-sm inline-block">
                    {loaderMessages[loadingStep]}
                  </div>
                </div>

                {/* Secure Progress bar running up to 4s */}
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00f5d4] to-cyan-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((loadingStep + 1) / loaderMessages.length) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  ></motion.div>
                </div>
              </motion.div>
            )}

            {/* 2. COMPLETED STATE - Display local exposed settings securely */}
            {scanState === "completed" && (
              <motion.div
                key="completed-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#00f5d4]/10 border border-[#00f5d4]/20 rounded-xl text-[#00f5d4]">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-sans">
                      {scanType === "fingerprint" ? "Your Exposed Identity Report" : "Aperture Check Completed"}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      GHOST found the following leak paths actively streaming from your browser.
                    </p>
                  </div>
                </div>

                {/* Exposed parameter grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-900">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">OPERATING SYSTEM</span>
                    <span className="text-sm font-semibold text-white tracking-tight block mt-0.5">{telemetry.os}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-900">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">BROWSER AGENT</span>
                    <span className="text-sm font-semibold text-white tracking-tight block mt-0.5">{telemetry.browser}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-900">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">SCREEN DENSITY</span>
                    <span className="text-sm font-semibold text-white tracking-tight block mt-0.5">{telemetry.viewport}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-900">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">LOCAL TIMEZONE</span>
                    <span className="text-sm font-semibold text-white tracking-tight block mt-0.5">{telemetry.timezone}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-900">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">PREFERRED LANGUAGE</span>
                    <span className="text-sm font-semibold text-white tracking-tight block mt-0.5">{telemetry.language}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-900">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">CANVAS HASH</span>
                    <span className="text-sm font-semibold text-emerald-400 tracking-tight block mt-0.5 font-mono text-xs">OK (EXEMPT)</span>
                  </div>
                </div>

                <div className="space-y-2 bg-[#00f5d4]/5 p-4 rounded-xl border border-[#00f5d4]/20 font-mono text-[11px] text-zinc-400">
                  <div className="flex gap-2 items-start text-[#00f5d4]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-bold">Privacy Advice:</span>
                  </div>
                  <p className="leading-relaxed mt-1">
                    Your platform variables allow trackers to uniquely isolate your device query path. Avoid sharing permissions with untrusted connections.
                  </p>
                </div>

                {/* Trust and close */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] text-zinc-500 font-mono select-none flex items-center gap-1.5 order-2 sm:order-1">
                    🔒 Locally analyzed. No data leaves device.
                  </span>
                  <button
                    onClick={onClose}
                    className="cursor-pointer bg-[#00f5d4] text-black hover:bg-cyan-400 px-6 py-2.5 rounded-full font-bold text-xs font-sans transition-all w-full sm:w-auto order-1 sm:order-2"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
