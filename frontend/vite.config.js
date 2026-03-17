import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls
      "/api": "http://localhost:3000",
      // Forward image file requests (Requirement for Lab 24)
      "/uploads": "http://localhost:3000",
    },
  },
});
