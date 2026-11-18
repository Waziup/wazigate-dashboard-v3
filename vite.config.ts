import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";

const root = path.dirname(fileURLToPath(import.meta.url));

// The API documentation of the gateway (/docs/) is part of the UI, so it has to be
// part of the build as well - the gateway serves whatever is in /var/lib/wazigate/www.
const copyDocs = (): Plugin => ({
  name: "wazigate-copy-docs",
  apply: "build",
  closeBundle() {
    const from = path.resolve(root, "docs");
    const to = path.resolve(root, "dist", "docs");
    fs.rmSync(to, { recursive: true, force: true });
    fs.cpSync(from, to, { recursive: true });
  },
});

// The dashboard may be opened through the VPN through a sub-path, e.g.
// http://vpn.waziup.org/gateway-b827eba987e8df8f/docs/. Such a request may arrive here with
// the sub-path still on it; strip it exactly like the gateway does.
const subPathRewrite = (): Plugin => ({
  name: "wazigate-subpath-rewrite",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url || "/";
      if (!url.startsWith("/gateway-")) return next();
      req.url = url.replace(/^\/gateway-[^/]+/, "") || "/";
      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [react(), copyDocs(), subPathRewrite()],
  server: {
    host: true,
  },
});
