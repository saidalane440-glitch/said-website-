import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Bell, Circle, Sun, Moon, Palette, Check } from "lucide-react";
import { useStore } from "../../store/useStore";
import { THEME_IMAGES } from "../../constants";
import { cn } from "../../lib/utils";

export function Navbar() {
  const fileCount = useStore((state) => state.files.length);
  const { theme, toggleTheme, userFolderBg, setFolderBg } = useStore();
  const [showThemePanel, setShowThemePanel] = useState(false);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b transition-colors duration-500",
      theme === "dark" 
        ? "bg-charcoal-deep/50 border-white/5" 
        : "bg-white/50 border-black/5"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-main flex items-center justify-center shadow-lg shadow-orange-main/20">
            <Terminal className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className={cn("font-bold tracking-tight text-sm leading-none", theme === "dark" ? "text-white" : "text-charcoal-deep")}>SAID</span>
            <span className="text-[10px] text-teal-accent font-mono uppercase tracking-tighter leading-none mt-1 items-center flex gap-1">
              <Circle className="w-1.5 h-1.5 fill-teal-accent" /> SYSTEM_ONLINE
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#" label="Registry" active theme={theme} />
          <NavLink href="#" label="Resources" theme={theme} />
          <NavLink href="#" label="Analytics" theme={theme} />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-orange-main" /> : <Moon className="w-5 h-5 text-charcoal-deep" />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowThemePanel(!showThemePanel)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Palette className={cn("w-5 h-5", theme === "dark" ? "text-slate-text" : "text-charcoal-deep")} />
            </button>

            <AnimatePresence>
              {showThemePanel && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 p-4 glass rounded-2xl shadow-2xl z-50"
                  style={{ backgroundColor: theme === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}
                >
                  <h4 className={cn("text-xs font-bold uppercase tracking-wider mb-3", theme === 'dark' ? 'text-white' : 'text-charcoal-deep')}>Folder Skins</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <button 
                      onClick={() => setFolderBg(null)}
                      className={cn(
                        "aspect-square rounded-md border flex items-center justify-center text-[8px] font-bold overflow-hidden transition-all",
                        userFolderBg === null ? "border-orange-main" : "border-white/10"
                      )}
                    >
                      AUTO
                    </button>
                    {THEME_IMAGES.map((url) => (
                      <button
                        key={url}
                        onClick={() => setFolderBg(url)}
                        className={cn(
                          "aspect-square rounded-md border overflow-hidden relative group transition-all",
                          userFolderBg === url ? "border-orange-main" : "border-white/10"
                        )}
                      >
                        <img src={url} alt="skin" className="w-full h-full object-cover" />
                        {userFolderBg === url && (
                          <div className="absolute inset-0 bg-orange-main/40 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-text font-mono">ASSETS</span>
              <span className="text-xs text-orange-main font-bold leading-none">{fileCount}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-accent to-orange-main p-[1px]">
              <div className="w-full h-full rounded-full bg-charcoal-deep flex items-center justify-center text-[10px] font-bold text-white uppercase">
                SA
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, active = false, theme }: { href: string; label: string; active?: boolean, theme: "light" | "dark" }) {
  return (
    <a 
      href={href}
      className={cn(
        "text-sm font-medium transition-colors relative py-2",
        active 
          ? (theme === "dark" ? "text-white" : "text-charcoal-deep")
          : (theme === "dark" ? "text-slate-text hover:text-white" : "text-slate-text hover:text-charcoal-deep")
      )}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-main"
        />
      )}
    </a>
  );
}

