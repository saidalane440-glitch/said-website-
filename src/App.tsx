/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "./store/useStore";
import { PasswordGate } from "./components/auth/PasswordGate";
import { Navbar } from "./components/layout/Navbar";
import { DropZone } from "./components/upload/DropZone";
import { FileGrid } from "./components/files/FileGrid";
import { Shield, LayoutDashboard, Database, Activity } from "lucide-react";
import { THEME_IMAGES } from "./constants";
import { useEffect, useState } from "react";
import { cn } from "./lib/utils";

export default function App() {
  const { isAuthenticated, theme } = useStore();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % THEME_IMAGES.length);
    }, 10000); // Cycle every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "min-h-screen relative transition-colors duration-700 overflow-hidden",
      theme === "dark" ? "bg-charcoal-deep text-slate-text" : "bg-slate-50 text-slate-700"
    )}>
      <Toaster position="top-right" expand={false} richColors />

      {/* Persistent Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className={cn(
          "absolute inset-0 z-10",
          theme === "dark" 
            ? "bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,0,0.1)_0%,transparent_50%)] bg-charcoal-deep/60" 
            : "bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,0,0.05)_0%,transparent_50%)] bg-white/60"
        )} />
        
        <AnimatePresence mode="wait">
          <motion.img
             key={bgIndex}
             src={THEME_IMAGES[bgIndex]}
             initial={{ opacity: 0, scale: 1.1 }}
             animate={{ opacity: 0.15, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ duration: 2 }}
             alt="Background"
             className="w-full h-full object-cover mix-blend-overlay"
             referrerPolicy="no-referrer"
             loading="lazy"
          />
        </AnimatePresence>
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <PasswordGate key="auth" />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 pt-24 pb-20 px-6"
          >
            <Navbar />

            <main className="w-full max-w-4xl mx-auto space-y-12 px-4 md:px-0">
              {/* Header Section */}
              <div className={cn(
                "flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b",
                theme === "dark" ? "border-white/5" : "border-black/5"
              )}>
                <div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-orange-main mb-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Command Center</span>
                  </motion.div>
                  <h1 className={cn("text-4xl md:text-5xl font-bold tracking-tight", theme === 'dark' ? 'text-white' : 'text-charcoal-deep')}>
                    Project <span className="text-orange-main">Management</span> Hub
                  </h1>
                  <p className="text-slate-text mt-2 max-w-xl">
                    Deploy, organize and index your project assets within our secure biometric-simulated environment.
                  </p>
                </div>

                <div className="flex gap-4">
                   <StatCard icon={Shield} label="Security" value="Active" color="text-teal-accent" theme={theme} />
                   <StatCard icon={Database} label="Storage" value="Optimized" color="text-orange-main" theme={theme} />
                </div>
              </div>

              {/* Upload Zone */}
              <section>
                <DropZone />
              </section>

              {/* File Explorer */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-orange-main rounded-full" />
                  <h2 className={cn("text-xl font-bold", theme === 'dark' ? 'text-white' : 'text-charcoal-deep')}>Central Asset Registry</h2>
                </div>
                <FileGrid />
              </section>
            </main>

            {/* Footer Status Bar */}
            <footer className={cn(
              "fixed bottom-0 left-0 right-0 h-8 backdrop-blur-md border-t px-6 flex items-center justify-between z-40 transition-colors",
              theme === "dark" ? "bg-charcoal-deep/80 border-white/5" : "bg-white/80 border-black/5"
            )}>
               <div className="flex items-center gap-6 text-[10px] font-mono tracking-wider text-slate-text/60">
                 <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-teal-accent" /> LATENCY: 12ms</span>
                 <span className="hidden sm:inline">UPLOADER: STABLE</span>
                 <span className="hidden md:inline">ENCRYPTION: AES-256</span>
               </div>
               <div className="text-[10px] font-mono text-orange-main/60">
                 &copy; 2026 SAID_TECHNOLOGIES_CORP
               </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, theme }: { icon: any, label: string, value: string, color: string, theme: string }) {
  return (
    <div className={cn(
      "px-3 py-2 md:px-4 md:py-3 rounded-xl border-l-2 border-l-current flex-1 md:flex-none",
      theme === 'dark' ? 'glass' : 'bg-white shadow-sm border border-black/5'
    )}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("w-3 h-3", color)} />
        <span className="text-[9px] uppercase tracking-widest text-slate-text">{label}</span>
      </div>
      <div className={cn("text-xs md:text-sm font-bold uppercase", color)}>{value}</div>
    </div>
  );
}

