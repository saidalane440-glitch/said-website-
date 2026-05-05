import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock pre-signed URL logic
  app.post("/api/upload/pre-signed", (req, res) => {
    const { fileName, fileType } = req.body;
    // In a real app, you'd talk to S3 or Firebase here
    res.json({
      uploadUrl: `/api/upload/mock-target?file=${encodeURIComponent(fileName)}`,
      fileKey: `uploads/${Date.now()}-${fileName}`,
    });
  });

  // Mock upload target to simulate large file handling without actual storage
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
