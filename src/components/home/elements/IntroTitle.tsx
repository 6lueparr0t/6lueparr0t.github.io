import { useCallback, useEffect, useRef, useState } from "react";

import { ReactTyped } from "react-typed";

interface IntroTitleProps {
  initialText?: string;
  className?: string;
  onTextChange?: (text: string) => void;
}

const IntroTitle = ({
  initialText = "One for a line, a line for all.",
  className = "text-4xl break-keep m-16 text-gradient",
  onTextChange,
}: IntroTitleProps) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTapRef = useRef<number>(0);

  // 편집 모드 진입
  const enterEditMode = useCallback(() => {
    setEditingText(text);
    setIsEditing(true);
  }, [text]);

  // 더블클릭으로 편집 모드 진입 (데스크톱)
  const handleClick = useCallback(() => {
    enterEditMode();
  }, [enterEditMode]);

  // 더블 탭으로 편집 모드 진입 (모바일)
  const handleTouchEnd = useCallback(() => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      enterEditMode();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [enterEditMode]);

  // 편집 완료
  const handleSave = useCallback(() => {
    const newText = editingText.trim() || initialText;
    setText(newText);

    if (onTextChange) {
      onTextChange(newText);
    }

    setIsEditing(false);
  }, [editingText, initialText, onTextChange]);

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setIsEditing(false);
      }
    },
    [handleSave]
  );

  // 편집 모드 진입 시 input focus
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // 초기값 변경 시 동기화
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`${className} bg-transparent outline-none text-center w-full`}
        style={{ caretColor: "currentColor" }}
      />
    );
  }

  return (
    <h1
      className={`${className} cursor-text outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50 rounded`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Backspace" || e.key === "Enter") {
          e.preventDefault();
          enterEditMode();
        }
      }}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    >
      <ReactTyped
        strings={[text]}
        startDelay={500}
        typeSpeed={50}
        cursorChar="|"
        showCursor={false}
      />
    </h1>
  );
};

export default IntroTitle;
