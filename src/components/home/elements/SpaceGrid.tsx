import { useCallback, useEffect, useRef, useState } from "react";

import { Pause, Play, RotateCcw, Settings, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SpaceGridConfig {
  gridColor?: string;
  gridAlpha?: number;
  speed?: number;
  fov?: number;
  gridSize?: number;
  horizonY?: number;
  starCount?: number;
  starSpeed?: number;
}

interface Star {
  x: number;
  y: number;
  counter: number;
  radiusMax: number;
  speed: number;
}

interface SpaceGridProps {
  className?: string;
  config?: SpaceGridConfig;
}

const DEFAULT_CONFIG: SpaceGridConfig = {
  gridAlpha: 0.6,
  speed: 1,
  fov: 100,
  gridSize: 60,
  horizonY: 0.52,
  starCount: 5000,
  starSpeed: 0.1, // 기본값: 아주 느린 속도
};

const SpaceGrid = ({ className = "", config = {} }: SpaceGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const isPausedRef = useRef(false);

  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // 현재 적용된 설정 (실시간 미리보기용)
  const [currentConfig, setCurrentConfig] = useState<SpaceGridConfig>({
    ...DEFAULT_CONFIG,
    ...config,
  });

  // 저장된 설정 (Cancel 시 복원용)
  const [savedConfig, setSavedConfig] = useState<SpaceGridConfig>({
    ...DEFAULT_CONFIG,
    ...config,
  });

  // 테마 변경 감지
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // 일시정지/재생 토글
  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      isPausedRef.current = !prev;
      return !prev;
    });
  }, []);

  // 설정 패널 열기
  const openSettings = useCallback(() => {
    setSavedConfig(currentConfig); // 현재 설정 저장
    setShowSettings(true);
  }, [currentConfig]);

  // 설정 저장 (현재 값 유지하고 패널 닫기)
  const saveSettings = useCallback(() => {
    setSavedConfig(currentConfig);
    setShowSettings(false);
  }, [currentConfig]);

  // 설정 취소 (저장된 값으로 복원)
  const cancelSettings = useCallback(() => {
    setCurrentConfig(savedConfig);
    starsRef.current = []; // 별 리셋
    setShowSettings(false);
  }, [savedConfig]);

  // 설정값 변경 핸들러 (실시간 적용)
  const updateConfig = useCallback((key: keyof SpaceGridConfig, value: number | string) => {
    setCurrentConfig((prev) => {
      const newConfig = { ...prev, [key]: value };
      // 별 개수가 변경되면 별 리셋
      if (key === "starCount") {
        starsRef.current = [];
      }
      return newConfig;
    });
  }, []);

  // 기본값으로 초기화
  const resetToDefault = useCallback(() => {
    setCurrentConfig({ ...DEFAULT_CONFIG });
    starsRef.current = [];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const activeConfig = {
      gridColor: isDarkMode ? "#FF1493" : "#FF8C00",
      gridAlpha: currentConfig.gridAlpha ?? DEFAULT_CONFIG.gridAlpha!,
      speed: currentConfig.speed ?? DEFAULT_CONFIG.speed!,
      fov: currentConfig.fov ?? DEFAULT_CONFIG.fov!,
      gridSize: currentConfig.gridSize ?? DEFAULT_CONFIG.gridSize!,
      horizonY: currentConfig.horizonY ?? DEFAULT_CONFIG.horizonY!,
      starCount: currentConfig.starCount ?? DEFAULT_CONFIG.starCount!,
      starSpeed: currentConfig.starSpeed ?? DEFAULT_CONFIG.starSpeed!,
    };

    const drawBackground = (canvasWidth: number, canvasHeight: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);

      if (isDarkMode) {
        // Dark mode: Deep Space (깊고 어두운 우주)
        // 위쪽은 거의 완전한 검정에서 시작해서, 지평선으로 갈수록 아주 은은한 네이비로 떨어짐
        gradient.addColorStop(0, "#000000"); // 완전한 검정 (Pure Black)
        gradient.addColorStop(0.3, "#020205"); // 아주 깊은 어둠
        gradient.addColorStop(0.6, "#050510"); // 희미한 네이비 (Deepest Navy)
        gradient.addColorStop(0.8, "#0a0a1a"); // 짙은 밤하늘 (Dark Midnight)
        gradient.addColorStop(1, "#101522"); // 지평선 끝의 차분한 다크 블루 (Horizon Dark)
      } else {
        // Light mode: Clear Daylight (티 없이 맑고 밝은 하늘)
        // 위쪽은 아주 연한 하늘색, 아래는 순백색으로 떨어져서 개방감을 줌
        gradient.addColorStop(0, "#D4F1F4"); // 아주 연한 민트 블루 (Pale Mint Blue)
        gradient.addColorStop(0.3, "#E3FDFD"); // 투명한 하늘색 (Clean Cyan)
        gradient.addColorStop(0.6, "#F0F9FF"); // 앨리스 블루 (Alice Blue)
        gradient.addColorStop(0.8, "#F7FDFF"); // 거의 흰색 (Off White)
        gradient.addColorStop(1, "#FFFFFF"); // 순백색 (Pure White)
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    };

    const getRandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // 소수점 지원하는 랜덤 함수 (별 속도용)
    const getRandomFloat = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const remap = (value: number, low1: number, high1: number, low2: number, high2: number) => {
      return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
    };

    const initStars = (canvasWidth: number, canvasHeight: number) => {
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      const stars: Star[] = [];

      for (let i = 0; i < activeConfig.starCount; i++) {
        stars.push({
          x: getRandomInt(-centerX, centerX),
          y: getRandomInt(-centerY, centerY),
          counter: getRandomInt(1, canvasWidth),
          radiusMax: 1 + Math.random() * 3,
          speed: getRandomFloat(0.05, activeConfig.starSpeed), // 최소 0.05 ~ 설정값
        });
      }

      return stars;
    };

    const drawStars = (canvasWidth: number, canvasHeight: number) => {
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      if (starsRef.current.length === 0) {
        starsRef.current = initStars(canvasWidth, canvasHeight);
      }

      ctx.save();
      ctx.translate(centerX, centerY);

      for (const star of starsRef.current) {
        if (!isPausedRef.current) {
          star.counter -= star.speed;

          if (star.counter < 1) {
            star.counter = canvasWidth;
            star.x = getRandomInt(-centerX, centerX);
            star.y = getRandomInt(-centerY, centerY);
            star.radiusMax = 1 + Math.random() * 3;
            star.speed = getRandomFloat(0.05, activeConfig.starSpeed); // 최소 0.05 ~ 설정값
          }
        }

        const xRatio = star.x / star.counter;
        const yRatio = star.y / star.counter;

        const starX = remap(xRatio, 0, 1, 0, canvasWidth);
        const starY = remap(yRatio, 0, 1, 0, canvasHeight);

        const radius = remap(star.counter, 0, canvasWidth, star.radiusMax, 0);

        ctx.beginPath();
        ctx.arc(starX, starY, Math.max(0.5, radius), 0, Math.PI * 2, false);
        ctx.closePath();

        const alpha = remap(star.counter, 0, canvasWidth, 1, 0.2);
        ctx.fillStyle = isDarkMode ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
        ctx.fill();
      }

      ctx.translate(-centerX, -centerY);
      ctx.restore();
    };

    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = canvas.width = parent.clientWidth;
        height = canvas.height = parent.clientHeight;
      }
    };

    const draw = () => {
      drawBackground(width, height);
      drawStars(width, height);

      const horizon = height * activeConfig.horizonY;

      ctx.save();
      ctx.beginPath();

      ctx.strokeStyle = activeConfig.gridColor;
      ctx.globalAlpha = activeConfig.gridAlpha;
      ctx.lineWidth = 1.5;

      const centerX = width / 2;
      const centerY = horizon;

      const verticalLines: number[] = [];
      for (let x = -width; x < width * 2; x += activeConfig.gridSize * 4) {
        verticalLines.push(x);
      }

      for (const x of verticalLines) {
        ctx.moveTo(x, height);
        ctx.lineTo(centerX, centerY);
      }

      if (!isPausedRef.current) {
        offsetRef.current = (offsetRef.current + activeConfig.speed) % activeConfig.gridSize;
      }

      const leftMostX = verticalLines[0];
      const rightMostX = verticalLines[verticalLines.length - 1];
      const bottomY = height;
      const gridAreaHeight = height - centerY;

      if (activeConfig.fov === 0) {
        const lineSpacing = activeConfig.gridSize;

        for (let i = 0; i <= gridAreaHeight / lineSpacing; i++) {
          const y = centerY + ((i * lineSpacing + offsetRef.current) % gridAreaHeight);

          if (y > centerY && y < height) {
            const ratio = (y - centerY) / (height - centerY);
            const lineLeftX = centerX + (leftMostX - centerX) * ratio;
            const lineRightX = centerX + (rightMostX - centerX) * ratio;

            ctx.moveTo(lineLeftX, y);
            ctx.lineTo(lineRightX, y);
          }
        }
      } else {
        const maxZ = activeConfig.fov * 100;

        for (let z = 0; z < maxZ; z += activeConfig.gridSize) {
          let currentZ = z - offsetRef.current;

          while (currentZ < 0) {
            currentZ += maxZ;
          }

          const scale = activeConfig.fov / (activeConfig.fov + currentZ);
          const y = centerY + (bottomY - centerY) * scale;

          if (y > centerY && y < height) {
            const ratio = (y - centerY) / (height - centerY);
            const lineLeftX = centerX + (leftMostX - centerX) * ratio;
            const lineRightX = centerX + (rightMostX - centerX) * ratio;

            ctx.moveTo(lineLeftX, y);
            ctx.lineTo(lineRightX, y);
          }
        }
      }
      ctx.stroke();

      // 지평선 위에서 시작하여 부드럽게 블렌딩되도록 함
      const fadeStartY = centerY - 50; // 지평선 50px 위에서 시작
      const fadeGradient = ctx.createLinearGradient(0, fadeStartY, 0, height);
      if (isDarkMode) {
        // Dark mode: 지평선 페이드 마스크 (Deep Space 색상에 맞춤)
        // 지평선(horizonY=0.52) 근처의 배경색은 약 #050510
        fadeGradient.addColorStop(0, "rgba(5, 5, 16, 0)"); // 시작: 투명 (배경과 자연스럽게 섞임)
        fadeGradient.addColorStop(0.3, "rgba(5, 5, 16, 0.5)"); // 서서히 불투명해짐
        fadeGradient.addColorStop(0.6, "rgba(10, 10, 26, 0.8)"); // 더 불투명
        fadeGradient.addColorStop(1, "rgba(16, 21, 34, 0)"); // 끝: 다시 투명
      } else {
        // Light mode: 지평선 페이드 마스크 (Clean Daylight 색상에 맞춤)
        // 지평선 근처의 배경색은 약 #F0F9FF
        fadeGradient.addColorStop(0, "rgba(240, 249, 255, 0)"); // 시작: 투명
        fadeGradient.addColorStop(0.3, "rgba(247, 253, 255, 0.5)"); // 서서히 불투명해짐
        fadeGradient.addColorStop(0.6, "rgba(255, 255, 255, 0.8)"); // 더 불투명
        fadeGradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // 끝: 다시 투명
      }

      ctx.fillStyle = fadeGradient;
      ctx.fillRect(0, fadeStartY, width, height - fadeStartY);

      ctx.restore();

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [currentConfig, isDarkMode]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{ pointerEvents: "none" }}
      />

      {/* 컨트롤 버튼 (오른쪽 상단) */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button
          onClick={togglePause}
          className="p-2 rounded-full bg-black/20 dark:bg-white/20 opacity-30 hover:opacity-100 transition-opacity duration-300"
          title={isPaused ? "재생" : "일시정지"}
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-white" />
          ) : (
            <Pause className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          onClick={openSettings}
          className={`p-2 rounded-full bg-black/20 dark:bg-white/20 transition-opacity duration-300 ${
            showSettings ? "opacity-100" : "opacity-30 hover:opacity-100"
          }`}
          title="설정"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* 설정 패널 (사이드 팝업) */}
      <div
        className={`absolute top-16 right-4 z-20 w-72 transition-all duration-300 ${
          showSettings
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-700">
          {/* 패널 헤더 */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-zinc-700">
            <h2 className="text-sm font-semibold">SpaceGrid 설정</h2>
            <div className="flex gap-1">
              <button
                onClick={resetToDefault}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                title="기본값으로 초기화"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={cancelSettings}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 패널 본문 */}
          <div className="p-3 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* 별 개수 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <Label className="text-xs">별 개수</Label>
                <span className="text-xs text-gray-500 font-mono">{currentConfig.starCount}</span>
              </div>
              <Slider
                value={[currentConfig.starCount ?? DEFAULT_CONFIG.starCount!]}
                min={100}
                max={10000}
                step={100}
                onValueChange={([v]) => updateConfig("starCount", v)}
              />
            </div>

            {/* 별 속도 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <Label className="text-xs">별 속도</Label>
                <span className="text-xs text-gray-500 font-mono">
                  {(currentConfig.starSpeed ?? DEFAULT_CONFIG.starSpeed!).toFixed(1)}
                </span>
              </div>
              <Slider
                value={[currentConfig.starSpeed ?? DEFAULT_CONFIG.starSpeed!]}
                min={0.1}
                max={10}
                step={0.1}
                onValueChange={([v]) => updateConfig("starSpeed", v)}
              />
            </div>

            {/* 격자 투명도 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <Label className="text-xs">격자 투명도</Label>
                <span className="text-xs text-gray-500 font-mono">
                  {(currentConfig.gridAlpha ?? DEFAULT_CONFIG.gridAlpha!).toFixed(2)}
                </span>
              </div>
              <Slider
                value={[currentConfig.gridAlpha ?? DEFAULT_CONFIG.gridAlpha!]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={([v]) => updateConfig("gridAlpha", v)}
              />
            </div>

            {/* 격자 속도 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <Label className="text-xs">격자 속도</Label>
                <span className="text-xs text-gray-500 font-mono">{currentConfig.speed}</span>
              </div>
              <Slider
                value={[currentConfig.speed ?? DEFAULT_CONFIG.speed!]}
                min={0}
                max={5}
                step={0.5}
                onValueChange={([v]) => updateConfig("speed", v)}
              />
            </div>

            {/* 격자 크기 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <Label className="text-xs">격자 크기</Label>
                <span className="text-xs text-gray-500 font-mono">{currentConfig.gridSize}</span>
              </div>
              <Slider
                value={[currentConfig.gridSize ?? DEFAULT_CONFIG.gridSize!]}
                min={20}
                max={150}
                step={10}
                onValueChange={([v]) => updateConfig("gridSize", v)}
              />
            </div>

            {/* FOV */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <Label className="text-xs">FOV (원근감)</Label>
                <span className="text-xs text-gray-500 font-mono">{currentConfig.fov}</span>
              </div>
              <Slider
                value={[currentConfig.fov ?? DEFAULT_CONFIG.fov!]}
                min={0}
                max={300}
                step={10}
                onValueChange={([v]) => updateConfig("fov", v)}
              />
            </div>
          </div>

          {/* 패널 푸터 */}
          <div className="flex gap-2 p-3 border-t border-gray-200 dark:border-zinc-700">
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={cancelSettings}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1 text-xs" onClick={saveSettings}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpaceGrid;
