import { useEffect, useRef, useState } from "react";

interface SpaceGridConfig {
  gridColor?: string;
  gridColorLight?: string;
  gridAlpha?: number;
  speed?: number;
  fov?: number;
  gridSize?: number;
  horizonY?: number;
}

interface SpaceGridProps {
  className?: string;
  config?: SpaceGridConfig;
}

const SpaceGrid = ({ className = "", config = {} }: SpaceGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const defaultConfig = {
      gridColor: config.gridColor ?? (isDarkMode ? "#00FFFF" : "#0088AA"),
      gridAlpha: config.gridAlpha ?? (isDarkMode ? 0.4 : 0.3),
      speed: config.speed ?? 1,
      fov: config.fov ?? 100,
      gridSize: config.gridSize ?? 60,
      horizonY: config.horizonY ?? 0.52,
      bgColor: isDarkMode ? "#050505" : "#f8fafc",
      bgColorRgb: isDarkMode ? "5,5,5" : "248,250,252",
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
      // 1. 배경 지우기
      ctx.fillStyle = defaultConfig.bgColor;
      ctx.fillRect(0, 0, width, height);

      // 지평선 높이 계산
      const horizon = height * defaultConfig.horizonY;

      ctx.save();
      ctx.beginPath();

      // 2. 격자 효과 설정
      ctx.strokeStyle = defaultConfig.gridColor;
      ctx.globalAlpha = defaultConfig.gridAlpha;
      ctx.lineWidth = 1.5;

      // 중앙 소실점 설정
      const centerX = width / 2;
      const centerY = horizon;

      // 세로선의 끝점들 (화면 하단에서의 x 좌표)
      const verticalLines: number[] = [];
      for (let x = -width; x < width * 2; x += defaultConfig.gridSize * 4) {
        verticalLines.push(x);
      }

      // 세로선 그리기 (Vertical Lines)
      for (const x of verticalLines) {
        ctx.moveTo(x, height);
        ctx.lineTo(centerX, centerY);
      }

      // 가로선 그리기 (Horizontal Lines)
      offsetRef.current = (offsetRef.current + defaultConfig.speed) % defaultConfig.gridSize;

      // 가장 왼쪽과 오른쪽 세로선 (화면 하단에서의 x 위치)
      const leftMostX = verticalLines[0];
      const rightMostX = verticalLines[verticalLines.length - 1];
      const bottomY = height;
      const gridAreaHeight = height - centerY;

      if (defaultConfig.fov === 0) {
        // fov=0: 일정한 간격으로 가로선 그리기 (원근감 없음)
        const lineSpacing = defaultConfig.gridSize;

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
        // fov>0: FOV 기반 3D 원근 투영
        // z=0에서 y=bottomY(화면 하단), z가 커지면 y가 centerY(지평선)에 가까워짐
        const maxZ = defaultConfig.fov * 100; // 충분히 큰 범위

        for (let z = 0; z < maxZ; z += defaultConfig.gridSize) {
          // 다가오는 애니메이션: offset을 빼서 선이 앞으로 이동
          let currentZ = z - offsetRef.current;

          // 음수면 맨 뒤로 순환 (연속적인 루프)
          while (currentZ < 0) {
            currentZ += maxZ;
          }

          // ★ 3D 원근 투영 공식: scale = fov / (fov + z)
          const scale = defaultConfig.fov / (defaultConfig.fov + currentZ);
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

      // 3. 지평선 부드럽게 가리기 (Fading Mask)
      const gradient = ctx.createLinearGradient(0, centerY, 0, height);
      gradient.addColorStop(0, `rgba(${defaultConfig.bgColorRgb}, 1)`);
      gradient.addColorStop(0.2, `rgba(${defaultConfig.bgColorRgb}, 0.5)`);
      gradient.addColorStop(1, `rgba(${defaultConfig.bgColorRgb}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, centerY, width, height - centerY);

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
  }, [config, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
};

export default SpaceGrid;
