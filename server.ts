import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { put } from "@vercel/blob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Configure Multer for memory storage
  const upload = multer({ storage: multer.memoryStorage() });

  // Vercel Blob Upload Endpoint
  app.post("/api/upload/vercel", upload.single("file"), async (req: express.Request, res: express.Response) => {
    try {
      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Upload to Vercel Blob
      const blob = await put(file.originalname, file.buffer, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      res.status(200).json({
        success: true,
        url: blob.url,
        fileName: file.originalname,
        size: file.size,
      });
    } catch (error) {
      console.error("Vercel Blob Error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Mock pre-signed URL logic (Legacy/Fallback)
  app.post("/api/upload/pre-signed", (req, res) => {
    const { fileName } = req.body;
    res.json({
      uploadUrl: `/api/upload/mock-target?file=${encodeURIComponent(fileName)}`,
      fileKey: `uploads/${Date.now()}-${fileName}`,
    });
  });

  app.post("/api/upload/mock-target", (req, res) => {
    res.status(200).json({ success: true, message: "File uploaded to virtual storage" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Said Hub running on http://localhost:${PORT}`);
  });
}

startServer();
