import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), basicSsl()],
  test: {
    environment: "jsdom",
    globals: true, // global 변수 활성화 (e.g., describe, test 등)
    setupFiles: "./vitest.setup.ts", // 추가 설정 파일
    css: true, // CSS 속성 테스트 활성화
    exclude: [...configDefaults.exclude, "node_modules/**"], // 기본 제외 경로 포함
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
