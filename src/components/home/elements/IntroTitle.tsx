import { useCallback, useEffect, useRef, useState } from "react";

import { ReactTyped } from "react-typed";

interface IntroTitleProps {
  initialText?: string;
  className?: string;
  tooltip?: string;
  onTextChange?: (text: string) => void;
}

const IntroTitle = ({
  initialText = "One for a line, a line for all.",
  className = "text-4xl break-keep m-16 text-gradient",
  tooltip = "더블클릭하여 수정",
  onTextChange,
}: IntroTitleProps) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 더블클릭으로 편집 모드 진입
  const handleDoubleClick = useCallback(() => {
    setEditingText(text);
    setIsEditing(true);
  }, [text]);

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
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder="텍스트를 입력하세요"
        className={`${className} bg-transparent border-b-2 border-current outline-none text-center w-full`}
        style={{ caretColor: "currentColor" }}
      />
    );
  }

  return (
    <h1 className={`${className} cursor-text`} title={tooltip} onDoubleClick={handleDoubleClick}>
      <ReactTyped strings={[text]} startDelay={500} typeSpeed={50} showCursor cursorChar="|" />
    </h1>
  );
};

export default IntroTitle;
