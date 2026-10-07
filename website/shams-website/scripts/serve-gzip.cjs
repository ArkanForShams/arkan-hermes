/* Static server WITH gzip — measures what a real CDN (Netlify/Pages/Vercel)
   delivers. python http.server serves uncompressed, unfairly inflating LCP. */
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "..", "out");
const PORT = 4181;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".json": "application/json",
};

http
  .createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      return res.end("not found");
    }
    const ext = path.extname(file);
    const type = MIME[ext] || "application/octet-stream";
    const data = fs.readFileSync(file);
    const compress = /text|font/.test(type) && data.length > 1024 && (req.headers["accept-encoding"] || "").includes("gzip");
    const headers = {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
    };
    if (compress) {
      const gz = zlib.gzipSync(data);
      headers["Content-Encoding"] = "gzip";
      headers["Content-Length"] = gz.length;
      res.writeHead(200, headers);
      res.end(gz);
    } else {
      headers["Content-Length"] = data.length;
      res.writeHead(200, headers);
      res.end(data);
    }
  })
  .listen(PORT, "127.0.0.1", () => console.log("gzip static server on", PORT));