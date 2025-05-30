import React, { type PropsWithChildren, useCallback, useEffect, useState } from "react";

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
  children,
}) => {
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (id === parseInt(event.key) - 1) {
        openHandler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, openHandler, setGifts]);

  return (
    <div className="door">
      <div
        className={`door-front text-xl md:text-4xl lg:text-7xl ${gift.open ? "open" : "close"}`}
        onClick={openHandler}
      >
        <div className="content">{id + 1}</div>
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
