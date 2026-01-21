import React, { type PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";

interface Gift {
  id: number;
  status: string;
  open: boolean;
  reward: string;
}

interface DoorProps extends PropsWithChildren {
  id: number;
  status: string;
  gifts: Gift[];
  gift: Gift;
  setGifts: React.Dispatch<React.SetStateAction<Gift[]>>;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setRewarddCount: React.Dispatch<React.SetStateAction<number>>;
  doorOpenCheck: string[];
  setDoorOpenCheck: React.Dispatch<React.SetStateAction<string[]>>;
  onWinPosition?: (position: { x: number; y: number }) => void;
}

const Door: React.FC<DoorProps> = ({
  id,
  gifts,
  gift,
  setGifts,
  count,
  setCount,
  setRewarddCount,
  doorOpenCheck,
  setDoorOpenCheck,
  onWinPosition,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const doorRef = useRef<HTMLDivElement>(null);

  const updateOpenDoor = useCallback(
    (status: string) => {
      gifts.map((item) => {
        if (item.status === status) {
          setDoorOpenCheck((prev) => Array.from(new Set([...prev, item.status])));
        }
      });
    },
    [gifts, setDoorOpenCheck]
  );

  const openHandler = useCallback(() => {
    if (open === false && !doorOpenCheck.includes(gift.status)) setCount((prev) => prev + 1);

    if (count === 0) {
      const otherStatus = gift.status === "poop" ? "bomb" : "poop";
      setGifts((prev) => {
        const loseOpen = prev.map((gift) => {
          if (gift.status === otherStatus) {
            gift.open = true;
          }
          return gift;
        });
        return [...loseOpen];
      });

      updateOpenDoor(otherStatus);
      return;
    } else {
      updateOpenDoor(gift.status);
    }

    if (count === 1 && gift.status === "win") {
      // win 문의 위치를 계산하여 전달
      if (doorRef.current && onWinPosition) {
        const rect = doorRef.current.getBoundingClientRect();
        const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
        onWinPosition({ x, y });
      }
      setRewarddCount((prev) => prev + 1);
    }

    setOpen(!open);
    setGifts((prev) => {
      prev[id].open = !open;
      return [...prev];
    });
  }, [
    count,
    gift.status,
    id,
    open,
    doorOpenCheck,
    setCount,
    setGifts,
    setRewarddCount,
    updateOpenDoor,
  ]);

  useEffect(() => {
    setOpen(gift.open);
  }, [gift.open]);

  // Intersection Observer로 Door가 화면에 보이는지 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 } // 조금이라도 보이면 true
    );

    if (doorRef.current) {
      observer.observe(doorRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      // Door가 화면에 보일 때만 키보드 이벤트 처리
      if (isVisible && id === parseInt(event.key) - 1) {
        openHandler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, openHandler, setGifts, isVisible]);

  return (
    <div className="door" ref={doorRef}>
      <div
        className={`door-front text-xl md:text-4xl lg:text-7xl ${gift.open ? "open" : "close"}`}
        onClick={openHandler}
      >
        <div className="content text-white">{id + 1}</div>
        <div className="knob"></div>
      </div>
      <div
        className="door-back font-['Tossface'] text-xl md:text-4xl lg:text-7xl"
        onClick={openHandler}
      >
        {children}
      </div>
    </div>
  );
};

export default Door;
