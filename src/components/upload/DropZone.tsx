import { useDropzone } from "react-dropzone";
import { Upload, File, Film, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { useStore, FileCategory, FileMetadata } from "../../store/useStore";
import { toast } from "sonner";

export function DropZone() {
  const [isUploading, setIsUploading] = useState(false);
  const addFile = useStore((state) => state.addFile);

  const onDrop = (acceptedFiles: File[]) => {
    const handleUploads = async () => {
      setIsUploading(true);
      for (const file of acceptedFiles) {
        const toastId = toast.loading(`Uploading ${file.name}...`, {
          style: { background: "#121212", color: "#fff", border: "1px solid #FF6B00" },
        });

        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload/vercel", {
            method: "POST",
            body: formData,
          });
          
          if (!response.ok) throw new Error("Upload failed");
          
          const data = await response.json();
          const { url } = data;

          let category: FileCategory = "other";
          if (file.type.startsWith("video/")) category = "video";
          else if (file.type.startsWith("image/")) category = "image";
          else if (file.type.includes("pdf") || file.type.includes("word") || file.type.includes("text")) category = "document";

          const newFile: FileMetadata = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            category,
            uploadDate: Date.now(),
            url: url, // Use the real Vercel Blob URL
          };

          addFile(newFile);
          toast.success(`${file.name} deployed to hub`, {
            id: toastId,
            style: { background: "#FF6B00", color: "#fff", border: "none" },
          });
        } catch (error) {
          toast.error(`Transfer interrupted: ${file.name}`, {
            id: toastId,
            description: "Connection to terminal lost or token invalid.",
            style: { background: "#ff4444", color: "#fff", border: "none" },
          });
        }
      }
      setIsUploading(false);
    };
    
    handleUploads();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'video/*': [],
      'image/*': [],
      'application/pdf': [],
      'text/*': []
    }
  } as any);

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "glass-orange rounded-2xl p-6 md:p-12 border-2 border-dashed transition-all cursor-pointer group w-full",
        isDragActive ? "border-orange-main bg-orange-main/20 scale-[1.01]" : "border-orange-main/30 hover:border-orange-main/60"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <motion.div
            animate={isDragActive ? { y: [0, -10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Upload className={cn(
              "w-12 h-12 transition-colors",
              isDragActive ? "text-orange-main" : "text-orange-main/60 group-hover:text-orange-main"
            )} />
          </motion.div>
          {isUploading && (
            <motion.div 
              className="absolute inset-0 border-2 border-orange-main rounded-full"
              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white">
            {isDragActive ? "Drop items now" : "Deploy Project Files"}
          </h3>
          <p className="text-slate-text text-sm mt-1">
            Drag and drop videos, documents or images
          </p>
        </div>

        <div className="flex gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
          <Film className="w-5 h-5 text-orange-main" />
          <File className="w-5 h-5 text-teal-accent" />
          <ImageIcon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
