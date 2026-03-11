import React, { useEffect, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FancyMultiSelect, Option } from "@/components/ui/fancy-multi-select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MdToPlainTextPage: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // Options state
  const [removeBold, setRemoveBold] = useState(true);
  const [singleNewline, setSingleNewline] = useState(false);
  const [removeEmoji, setRemoveEmoji] = useState(false);
  const [copyOnClick, setCopyOnClick] = useState(false);
  const [filterWords, setFilterWords] = useState<Option[]>([]);
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load options from localStorage
  useEffect(() => {
    const savedOptions = localStorage.getItem("plainTextOptions");
    if (savedOptions) {
      try {
        const parsed = JSON.parse(savedOptions);
        setRemoveBold(parsed.removeBold ?? true);
        setSingleNewline(parsed.singleNewline ?? false);
        setRemoveEmoji(parsed.removeEmoji ?? false);
        setCopyOnClick(parsed.copyOnClick ?? false);
        setFilterWords(parsed.filterWords ?? []);
        setIsOptionsOpen(parsed.isOptionsOpen ?? true);
      } catch (e) {
        console.error("Failed to parse saved options", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save options to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    const optionsToSave = {
      removeBold,
      singleNewline,
      removeEmoji,
      copyOnClick,
      filterWords,
      isOptionsOpen,
    };
    localStorage.setItem("plainTextOptions", JSON.stringify(optionsToSave));
  }, [
    removeBold,
    singleNewline,
    removeEmoji,
    copyOnClick,
    filterWords,
    isOptionsOpen,
    isInitialized,
  ]);

  useEffect(() => {
    let result = input;

    // 1. Filter words
    filterWords.forEach((wordOption) => {
      if (wordOption.value) {
        // Escape regex special characters
        const escapedWord = wordOption.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedWord, "gi");
        result = result.replace(regex, "");
      }
    });

    // 2. Strip Markdown
    // Headers
    result = result.replace(/^#+\s+/gm, "");
    // Blockquotes
    result = result.replace(/^>\s+/gm, "");
    // Lists
    result = result.replace(/^[\*\-\+]\s+/gm, "");
    // Links
    result = result.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
    // Images
    result = result.replace(/!\[([^\]]+)\]\([^\)]+\)/g, "$1");

    // // Code blocks
    // result = result.replace(/```[\s\S]*?```/g, "");
    // // Inline code
    // result = result.replace(/`([^`]+)`/g, "$1");
    // // HTML tags
    // result = result.replace(/<[^>]*>/g, "");

    // Bold/Italic - controlled by checkbox
    if (removeBold) {
      result = result.replace(/(\*\*|__)(.*?)\1/g, "$2");
      result = result.replace(/(\*|_)(.*?)\1/g, "$2");
    }

    // Single Newline - reduce multiple newlines to single
    if (singleNewline) {
      result = result.replace(/\n+/g, "\n\n");
    }

    // Remove Emoji
    if (removeEmoji) {
      // \p{Extended_Pictographic}: 모든 이모지 캐릭터를 찾음
      // \u{FE0F}?: 변형 선택자가 있다면 그것까지 포함
      // \s*: 뒤에 오는 모든 공백(스페이스, 탭, 줄바꿈 등)을 포함
      const emojiRegex = /\p{Extended_Pictographic}\u{FE0F}?\s*/gu;
      result = result.replace(emojiRegex, "");
    }

    // Replace multiple spaces with a single space
    result = result.replace(/[ ]{2,}/g, " ");

    // Trim
    result = result.trim();

    setOutput(result);
  }, [input, removeBold, singleNewline, removeEmoji, filterWords]);

  const handleOutputClick = () => {
    if (copyOnClick && output) {
      navigator.clipboard.writeText(output);
      // Using alert for now if toast is not available, but ideally use toast
      // alert("Copied to clipboard!");
      // Assuming user might want some feedback.
      // If you have a toast library installed, use it here.
      // I will add a simple visual feedback or just use the clipboard API silently if no toast is ready.
      // Let's check package.json for toast library. 'notistack' is there.
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex-none">MD to Text</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 pb-8">
        <div className="flex flex-col gap-4 h-full">
          <Card className="flex-1 flex flex-col min-h-[300px] lg:min-h-[400px]">
            <CardHeader className="flex-none p-3">
              <CardTitle className="text-lg md:text-xl">마크다운 입력</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-3 pt-0">
              <Textarea
                className="h-full min-h-[200px] font-mono resize-none text-sm md:text-base"
                placeholder="내용을 입력하세요."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="flex-none">
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 cursor-pointer select-none p-3"
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            >
              <CardTitle className="text-lg md:text-xl font-bold">옵션</CardTitle>
              <div>
                {isOptionsOpen ? (
                  <ChevronUpIcon className="w-[24px] h-[24px]" />
                ) : (
                  <ChevronDownIcon className="w-[24px] h-[24px]" />
                )}
              </div>
            </CardHeader>
            <div className={isOptionsOpen ? "" : "hidden"}>
              <CardContent className="space-y-3 p-3 pt-0">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remove-bold"
                    checked={removeBold}
                    onCheckedChange={(checked) => setRemoveBold(checked as boolean)}
                  />
                  <Label htmlFor="remove-bold" className="text-sm md:text-base cursor-pointer">
                    굵은 글씨(Bold) 문법 제거
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="single-newline"
                    checked={singleNewline}
                    onCheckedChange={(checked) => setSingleNewline(checked as boolean)}
                  />
                  <Label htmlFor="single-newline" className="text-sm md:text-base cursor-pointer">
                    여러 줄 바꿈을 한 줄로 변경
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remove-emoji"
                    checked={removeEmoji}
                    onCheckedChange={(checked) => setRemoveEmoji(checked as boolean)}
                  />
                  <Label htmlFor="remove-emoji" className="text-sm md:text-base cursor-pointer">
                    이모지 제거
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="copy-on-click"
                    checked={copyOnClick}
                    onCheckedChange={(checked) => setCopyOnClick(checked as boolean)}
                  />
                  <Label htmlFor="copy-on-click" className="text-sm md:text-base cursor-pointer">
                    결과 클릭 시 자동 복사
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm md:text-base">필터링할 단어 (입력 후 Enter)</Label>
                  <FancyMultiSelect
                    placeholder="필터링할 단어를 입력하세요."
                    creatable={true}
                    options={[]} // No default options, purely user created
                    value={filterWords}
                    onChange={setFilterWords}
                  />
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4 h-full">
          <Card className="flex-1 flex flex-col min-h-[300px] lg:min-h-[400px]">
            <CardHeader className="flex-none p-3">
              <CardTitle className="text-lg md:text-xl">결과</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-3 pt-0">
              <Textarea
                className={`h-full min-h-[200px] font-mono resize-none text-sm md:text-base ${
                  copyOnClick ? "cursor-pointer hover:bg-muted/50" : ""
                }`}
                readOnly
                value={output}
                onClick={handleOutputClick}
                placeholder={`변환된 텍스트가 여기에 표시됩니다. ${copyOnClick ? "(클릭 시 복사)" : ""}`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MdToPlainTextPage;
