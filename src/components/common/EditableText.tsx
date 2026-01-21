import { useCallback, useEffect, useRef, useState } from "react";

import { ReactTyped } from "react-typed";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface TypedConfig {
  startDelay?: number;
  typeSpeed?: number;
  backSpeed?: number;
  loop?: boolean;
}

interface EditableTextProps {
  initialText: string;
  as?: HeadingLevel | "p" | "span";
  className?: string;
  title?: string;
  onTextChange?: (newText: string) => void;
  placeholder?: string;
  useTyped?: boolean;
  typedConfig?: TypedConfig;
}

const EditableText = ({
  initialText,
  as = "p",
  className = "",
  title,
  onTextChange,
  placeholder = "텍스트를 입력하세요",
  useTyped = false,
  typedConfig = {},
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [typedComplete, setTypedComplete] = useState(!useTyped);
  const inputRef = useRef<HTMLInputElement>(null);

  // 더블클릭으로 편집 모드 진입
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  // 편집 완료 (Enter 또는 blur)
  const handleSave = useCallback(() => {
    setIsEditing(false);
    if (text.trim() === "") {
      setText(initialText);
    } else if (onTextChange && text !== initialText) {
      onTextChange(text);
    }
  }, [text, initialText, onTextChange]);

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setText(initialText);
        setIsEditing(false);
      }
    },
    [handleSave, initialText]
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

  // 텍스트 편집 후 타이핑 효과 리셋
  useEffect(() => {
    if (useTyped) {
      setTypedComplete(false);
    }
  }, [text, useTyped]);

  // 헤딩 태그 렌더링
  const renderHeading = (level: HeadingLevel, content: React.ReactNode) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag
        className={`${className} cursor-pointer select-none transition-opacity hover:opacity-80`}
        title={title ?? "텍스트를 입력하세요."}
        onDoubleClick={handleDoubleClick}
      >
        {content}
      </Tag>
    );
  };

  // 일반 텍스트 렌더링
  const renderText = (tag: "p" | "span", content: React.ReactNode) => {
    const Tag = tag;
    return (
      <Tag
        className={`${className} cursor-pointer select-none transition-opacity hover:opacity-80`}
        title={title ?? "더블클릭하여 수정"}
        onDoubleClick={handleDoubleClick}
      >
        {content}
      </Tag>
    );
  };

  // 편집 모드일 때 input 렌더링
  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${className} bg-transparent border-b-2 border-current outline-none text-center w-full`}
        style={{ caretColor: "currentColor" }}
      />
    );
  }

  // ReactTyped 콘텐츠 렌더링
  const renderTypedContent = () => {
    if (useTyped && !typedComplete) {
      return (
        <ReactTyped
          strings={[text || placeholder]}
          startDelay={typedConfig.startDelay ?? 500}
          typeSpeed={typedConfig.typeSpeed ?? 100}
          backSpeed={typedConfig.backSpeed ?? 50}
          loop={typedConfig.loop ?? false}
          onComplete={() => setTypedComplete(true)}
        />
      );
    }
    return text || placeholder;
  };

  // 읽기 모드 렌더링
  const content = renderTypedContent();

  if (typeof as === "number") {
    return renderHeading(as, content);
  }

  return renderText(as, content);
};

export default EditableText;
