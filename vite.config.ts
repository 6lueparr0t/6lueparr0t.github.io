import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200, // 기본 500KB → 1200KB로 증가 (불필요한 경고 방지)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // React 관련 라이브러리 그룹
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "react-core";
            }

            // 상태 관리 관련 그룹
            if (id.includes("zustand")) {
              return "state-management";
            }

            // UI 컴포넌트 관련 그룹
            if (id.includes("@radix-ui")) {
              return "ui-radix";
            }
            if (id.includes("lucide-react") || id.includes("heroicons") || id.includes("cmdk")) {
              return "ui-icons";
            }

            // 애니메이션 & 시각 효과 관련 그룹
            if (
              id.includes("react-animated-numbers") ||
              id.includes("confetti.ts") ||
              id.includes("react-typed")
            ) {
              return "ui-effects";
            }

            // Markdown 및 문서 렌더링 관련 그룹
            if (
              id.includes("react-markdown") ||
              id.includes("remark-gfm") ||
              id.includes("rehype-raw")
            ) {
              return "markdown-rendering";
            }

            // 코드 하이라이팅 관련 그룹
            if (id.includes("react-syntax-highlighter")) {
              return "code-highlighting";
            }

            // 날짜 및 시간 관리 그룹
            if (id.includes("dayjs")) {
              return "date-utils";
            }

            // 네트워크 및 API 클라이언트 그룹
            if (id.includes("axios") || id.includes("octokit")) {
              return "networking";
            }

            //  스타일 및 Tailwind 관련 그룹
            if (
              id.includes("tailwindcss") ||
              id.includes("tailwind-merge") ||
              id.includes("tailwindcss-animate")
            ) {
              return "ui-styling";
            }

            //  tsParticles 관련 그룹
            if (id.includes("@tsparticles")) {
              return "ts-particles";
            }

            //  기타 유틸리티 라이브러리
            if (id.includes("clsx") || id.includes("notistack")) {
              return "utility-libs";
            }

            //  기타 모든 외부 라이브러리 그룹
            return "vendor";
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
