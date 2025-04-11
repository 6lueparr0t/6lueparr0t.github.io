/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["./**/*.md"], // md 파일을 asset으로 간주 (image처럼)
  test: {
    environment: "happy-dom",
    globals: true, // global 변수 활성화 (e.g., describe, test 등)
    setupFiles: "./vitest.setup.ts", // 추가 설정 파일
    css: true, // CSS 속성 테스트 활성화
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
