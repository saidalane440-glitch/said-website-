import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Film, FileText, Image as ImageIcon, LayoutGrid, Search } from "lucide-react";
import { useStore, FileCategory } from "../../store/useStore";
import { FileCard } from "./FileCard";
import { cn } from "../../lib/utils";

export function FileGrid() {
  const [filter, setFilter] = useState<FileCategory | "all">("all");
  const [search, setSearch] = useState("");
  const { files, folderCounts } = useStore();

  const filteredFiles = files.filter(file => {
    const matchesFilter = filter === "all" || file.category === filter;
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { id: "all" as const, label: "All Assets", icon: LayoutGrid, count: files.length },
    { id: "video" as const, label: "Media (Videos)", icon: Film, count: folderCounts.video },
    { id: "document" as const, label: "Documentation", icon: FileText, count: folderCounts.document },
    { id: "image" as const, label: "Visuals", icon: ImageIcon, count: folderCounts.image },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                filter === cat.id 
                  ? "bg-orange-main text-white shadow-lg shadow-orange-main/20" 
                  : "bg-white/5 text-slate-text hover:bg-white/10"
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
              <span className="opacity-50 text-[10px] bg-charcoal-deep px-1.5 py-0.5 rounded-md">{cat.count}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-text/50 group-focus-within:text-orange-main transition-colors" />
          <input
            type="text"
            placeholder="Index search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredFiles.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6"
          >
            {filteredFiles.map((file, index) => (
              <FileCard key={file.id} file={file} themeIndex={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 glass rounded-3xl border-dashed"
          >
            <Folder className="w-16 h-16 text-slate-text/20 mb-4" />
            <p className="text-slate-text">No assets found in current directory</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
