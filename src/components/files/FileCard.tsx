import React from "react";
import { motion } from "framer-motion";
import { Film, FileText, Image as ImageIcon, Trash2, Download, ExternalLink } from "lucide-react";
import { FileMetadata, useStore } from "../../store/useStore";
import { formatBytes } from "../../lib/utils";
import { toast } from "sonner";
import { THEME_IMAGES } from "../../constants";

export function FileCard({ file, themeIndex = 0 }: any) {
  const removeFile = useStore((state) => state.removeFile);
  const userFolderBg = useStore((state) => state.userFolderBg);
  const themeImageUrl = userFolderBg || THEME_IMAGES[themeIndex % THEME_IMAGES.length];

  const getIcon = () => {
    switch (file.category) {
      case "video": return <Film className="w-10 h-10 text-orange-main" />;
      case "document": return <FileText className="w-10 h-10 text-teal-accent" />;
      case "image": return <ImageIcon className="w-10 h-10 text-white" />;
      default: return <FileText className="w-10 h-10 text-slate-text" />;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFile(file.id);
    toast.error("File Decommissioned", {
      description: `${file.name} removed from registry.`,
      style: { background: "#333", color: "#fff", border: "none" },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="glass rounded-2xl p-4 group relative border-t-2 border-t-transparent hover:border-t-orange-main transition-all duration-300 w-full"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button 
          onClick={handleDelete}
          className="p-1.5 bg-black/40 backdrop-blur-md hover:bg-red-500/80 rounded-md text-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="w-full aspect-[16/9] bg-charcoal-deep rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
          {/* Dynamic Theme Background */}
          <img 
            src={themeImageUrl} 
            alt="Theme" 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:opacity-60 transition-opacity"
            referrerPolicy="no-referrer"
          />
          
          <div className="relative z-10 flex flex-col items-center">
            {file.category === 'image' ? (
               <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/20 shadow-xl">
                 <img 
                   src={file.url} 
                   alt={file.name} 
                   className="w-full h-full object-cover" 
                   referrerPolicy="no-referrer"
                 />
               </div>
            ) : (
              <div className="flex flex-col items-center gap-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {getIcon()}
                <span className="text-[10px] uppercase tracking-widest text-white/80 font-bold">{file.category}</span>
              </div>
            )}
          </div>
          
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
             <button className="p-3 bg-orange-main hover:bg-orange-main/90 rounded-full shadow-lg shadow-orange-main/20 transition-all active:scale-95">
                <Download className="w-5 h-5 text-white" />
             </button>
             <a href={file.url} target="_blank" className="p-3 bg-teal-accent hover:bg-teal-accent/90 rounded-full shadow-lg shadow-teal-accent/20 transition-all active:scale-95">
                <ExternalLink className="w-5 h-5 text-white" />
             </a>
          </div>
        </div>

        <div className="px-1">
          <h4 className="text-white font-semibold truncate mb-1" title={file.name}>
            {file.name}
          </h4>
          <div className="flex justify-between items-center text-[10px] text-slate-text font-mono">
            <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{formatBytes(file.size)}</span>
            <span className="opacity-60">{new Date(file.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
