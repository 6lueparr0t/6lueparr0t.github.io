import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface RouletteItem {
  id: string;
  name: string;
  weight: number;
  color: string;
  angle?: number;
  angleSum?: number;
}

const COLORS = [
  "oklch(63.7% 0.237 25.331)", // red-500
  "oklch(70.5% 0.213 47.604)", // orange-500
  "oklch(76.9% 0.188 70.08)", // amber-500
  "oklch(79.5% 0.184 86.047)", // yellow-500
  "oklch(76.8% 0.233 130.85)", // lime-500
  "oklch(72.3% 0.219 149.579)", // green-500
  "oklch(69.6% 0.17 162.48)", // emerald-500
  "oklch(70.4% 0.14 182.503)", // teal-500
  "oklch(71.5% 0.143 215.221)", // cyan-500
  "oklch(68.5% 0.169 237.323)", // sky-500
  "oklch(62.3% 0.214 259.815)", // blue-500
  "oklch(58.5% 0.233 277.117)", // indigo-500
  "oklch(60.6% 0.25 292.717)", // violet-500
  "oklch(62.7% 0.265 303.9)", // purple-500
  "oklch(66.7% 0.295 322.15)", // fuchsia-500
  "oklch(65.6% 0.241 354.308)", // pink-500
  "oklch(64.5% 0.246 16.439)", // rose-500
  "oklch(55.4% 0.046 257.417)", // slate-500
  "oklch(55.1% 0.027 264.364)", // gray-500
  "oklch(55.2% 0.016 285.938)", // zinc-500
  "oklch(55.6% 0 0)", // neutral-500
  "oklch(55.3% 0.013 58.071)", // stone-500
  "oklch(54.2% 0.034 322.5)", // mauve-500
  "oklch(58% 0.031 107.3)", // olive-500
  "oklch(56% 0.021 213.5)", // mist-500
  "oklch(54.7% 0.021 43.1)", // taupe-500
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

// Helper to get N unique random colors
const getUniqueRandomColors = (count: number) => {
  const shuffled = [...COLORS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const RoulettePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Initialize with 3 unique colors
  const initialColors = useRef(getUniqueRandomColors(3)).current;

  const [items, setItems] = useState<RouletteItem[]>([
    { id: "1", name: "Item 1", weight: 1, color: initialColors[0] },
    { id: "2", name: "Item 2", weight: 1, color: initialColors[1] },
    { id: "3", name: "Item 3", weight: 1, color: initialColors[2] },
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Animation state refs
  const requestRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const stoppingRef = useRef<number | null>(null);
  const dampingRef = useRef<number>(0);

  const processedItems = useMemo(() => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let angleSum = 0;

    return items.map((item) => {
      const chance = totalWeight === 0 ? 0 : item.weight / totalWeight;
      const angle = 360 * chance;
      angleSum += angle;
      return {
        ...item,
        angle,
        angleSum,
        color: item.color || getRandomColor(),
      };
    });
  }, [items]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.45;

    ctx.clearRect(0, 0, width, height);

    // Draw Wheel
    if (processedItems.length > 0) {
      let lastAngle = 0;
      processedItems.forEach((item) => {
        const startAngle = (rotationRef.current + lastAngle - 90) * (Math.PI / 180);
        const endAngle =
          (rotationRef.current + lastAngle + (item.angle || 0) - 90) * (Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.stroke();

        // Text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(
          (rotationRef.current + lastAngle + (item.angle || 0) / 2 - 90) * (Math.PI / 180)
        );
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.fillText(item.name, radius - 20, 5);
        ctx.restore();

        lastAngle += item.angle || 0;
      });
    }

    // Draw Pin
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius + 20);
    ctx.lineTo(centerX - 15, centerY - radius - 15);
    ctx.lineTo(centerX + 15, centerY - radius - 15);
    ctx.closePath();
    ctx.fillStyle = "#ef4444"; // Red
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black"; // Black border
    ctx.stroke();

    // Draw Center Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.lineWidth = 1; // Reset line width
    ctx.strokeStyle = "black"; // Optional: border for center circle
    ctx.stroke();
  }, [processedItems]);

  const animate = useCallback(
    (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (stoppingRef.current) {
        if (Date.now() - stoppingRef.current > 15000) {
          velocityRef.current = 0;
          stoppingRef.current = null;
        }
      }

      if (dampingRef.current > 0) {
        velocityRef.current -=
          Math.max(20, Math.min(velocityRef.current * 0.5, dampingRef.current)) *
          (deltaTime / 1000);
      }

      // Check if stopped
      if (velocityRef.current <= 0 && dampingRef.current > 0 && isSpinning) {
        velocityRef.current = 0;
        setIsSpinning(false); // This will trigger re-render
        setIsStopping(false);

        // Calculate winner
        let currentAngle = 360 - (rotationRef.current % 360);

        const winnerItem = processedItems.find((item) => {
          // We need to normalize currentAngle to be checked against angleSum
          // item.angleSum is the END of the slice.
          // item.angleSum - item.angle is the START of the slice.
          const start = item.angleSum! - item.angle!;
          const end = item.angleSum!;
          return start <= currentAngle && currentAngle <= end;
        });

        if (winnerItem) {
          setWinner(winnerItem.name);
        }
      }

      if (velocityRef.current > 0) {
        rotationRef.current += velocityRef.current * (deltaTime / 1000);
        rotationRef.current %= 360;
      }

      draw();
      requestRef.current = requestAnimationFrame(animate);
    },
    [draw, isSpinning, processedItems]
  ); // Note: adding isSpinning to deps might cause issues if it changes frequently, but here it changes only on start/stop.

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  const toggleSpin = () => {
    if (isSpinning) {
      if (isStopping) return;
      // Stop
      stoppingRef.current = Date.now();
      dampingRef.current = 360 * (0.5 + 0.1 * Math.random());
      setIsStopping(true);
    } else {
      // Start
      if (processedItems.length === 0) return;
      setIsSpinning(true);
      setIsStopping(false);
      setWinner(null);
      velocityRef.current = 4 * 360 + Math.random() * 360;
      dampingRef.current = 0;
      stoppingRef.current = null;
    }
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: `Item ${prev.length + 1}`,
        weight: 1,
        color: getRandomColor(),
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof RouletteItem, value: any) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="container mx-auto p-8 h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full max-w-[500px] aspect-square"
        />
        <Button
          size="lg"
          className="mt-8 text-xl px-8 py-6"
          onClick={toggleSpin}
          disabled={isStopping}
        >
          {isStopping ? "멈추는 중..." : isSpinning ? "멈춰!" : "돌려돌려 돌림판~"}
        </Button>
        {winner && <div className="mt-8 text-3xl font-bold text-primary">{winner} 당첨!</div>}
      </div>

      <div className="w-full lg:w-1/3 h-full overflow-y-auto">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              항목
              <Button size="sm" onClick={addItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    min="1"
                    value={item.weight}
                    onChange={(e) => updateItem(item.id, "weight", parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mb-0.5"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoulettePage;
