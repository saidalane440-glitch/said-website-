import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";

export function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const setAuthenticated = useStore((state) => state.setAuthenticated);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a hash check or server call
    // Using "admin" as a placeholder for the demo as requested for a gateway
    if (password === "said2026") {
      setAuthenticated(true);
      toast.success("Access Granted", {
        style: { background: "#FF6B00", color: "#fff", border: "none" },
      });
    } else {
      setError(true);
      toast.error("Access Denied", {
        description: "Invalid credentials provided.",
        style: { background: "#ff4444", color: "#fff", border: "none" },
      });
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-deep/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 md:p-8 rounded-2xl w-full max-w-sm md:max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-main to-teal-accent" />
        
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-orange-main/10 rounded-full flex items-center justify-center border border-orange-main/20">
            {error ? (
              <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />
            ) : (
              <Lock className="w-8 h-8 text-orange-main" />
            )}
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2 underline decoration-orange-main/50 decoration-2 underline-offset-4">Said Hub</h1>
            <p className="text-slate-text text-sm">Secure Management Gateway</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                className={`input-field w-full text-center tracking-[0.5em] font-mono ${error ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}`}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full group"
            >
              Unlock Terminal
              <ShieldCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>
          </form>
          
          <p className="text-[10px] uppercase tracking-widest text-slate-text/30 font-mono">
            System Identity: Project Said v1.0.4
          </p>
        </div>
      </motion.div>
    </div>
  );
}
