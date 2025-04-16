import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { plugin as markdown, type Mode } from "vite-plugin-markdown";
import tsconfigPaths from "vite-tsconfig-paths";

// @ts-ignore
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    basicSsl(),
    markdown({
      mode: ["html", "meta", "toc"] as Mode[],
    }),
    visualizer({ open: false, gzipSize: true, brotliSize: true }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@posts": path.resolve(__dirname, "./posts"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200, // 기본 500KB → 1200KB로 증가 (불필요한 경고 방지)
    rollupOptions: {
      treeshake: true, // 트리 쉐이킹 활성화 (기본값)
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "react-core";
            }

            if (id.includes("zustand")) {
              return "state-management";
            }

            if (id.includes("@radix-ui")) {
              return "ui-radix";
            }

            if (id.includes("lucide-react") || id.includes("heroicons") || id.includes("cmdk")) {
              return "ui-icons";
            }

            if (
              id.includes("react-animated-numbers") ||
              id.includes("confetti.ts") ||
              id.includes("react-typed")
            ) {
              return "ui-effects";
            }

            if (
              id.includes("react-markdown") ||
              id.includes("remark-gfm") ||
              id.includes("rehype-raw")
            ) {
              return "markdown-rendering";
            }

            if (id.includes("react-syntax-highlighter")) {
              return "code-highlighting";
            }

            if (id.includes("dayjs") || id.includes("date-fns")) {
              return "date-utils";
            }

            if (id.includes("axios") || id.includes("octokit")) {
              return "networking";
            }

            if (
              id.includes("tailwindcss") ||
              id.includes("tailwind-merge") ||
              id.includes("tailwindcss-animate")
            ) {
              return "ui-styling";
            }

            if (id.includes("@tsparticles")) {
              return "ts-particles";
            }

            if (id.includes("clsx") || id.includes("notistack")) {
              return "utility-libs";
            }

            // ✨ 나머지는 파일 이름 기반으로 나눔 (예: node_modules/foo/bar.js → chunk-foo)
            const dirs = id.split("/node_modules/")[1].split("/");
            return `chunk-${dirs[0]}`;
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true, // console.log 제거
        drop_debugger: true, // debugger 제거
      },
    },
  },
});
