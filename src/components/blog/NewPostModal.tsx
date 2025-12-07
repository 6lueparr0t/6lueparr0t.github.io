import { useEffect, useState } from "react";

import modalStore from "@/store/modal";

import Copy from "@/components/common/Copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewPostModalProps {
  filename: string;
  isoString: string;
  slug: string;
}

export default function NewPostModal({ filename, isoString, slug }: NewPostModalProps) {
  const { popModals } = modalStore();
  const url = `https://github.com/${import.meta.env.VITE_APP_GIT_OWNER}/${import.meta.env.VITE_APP_GIT_REPO}/new/main/posts`;
  const [baseFilename] = useState(filename); // 기존 filename (readonly)
  const [customFilename, setCustomFilename] = useState(""); // 영문 filename 입력
  const [titleValue, setTitleValue] = useState(""); // 한글 title 입력
  const [content, setContent] = useState(`---\ntitle: \ndate: ${isoString}\nslug: ${slug}\n---\n`);

  // 최종 filename 계산 (기존 + 입력한 영문)
  const finalFilename = customFilename
    ? `${baseFilename.replace(/\.md$/, "")}${customFilename}.md`
    : baseFilename;

  // customFilename이 변경되면 filename과 slug 업데이트
  useEffect(() => {
    const newSlug = finalFilename.replace(/\.md$/, "");
    setContent((prev) => {
      // content에서 slug 부분만 업데이트
      return prev.replace(/slug: .+/, `slug: ${newSlug}`);
    });
  }, [finalFilename]);

  // title이 변경되면 content의 title 부분만 업데이트
  useEffect(() => {
    setContent((prev) => {
      // content에서 title 부분만 업데이트 (줄바꿈까지 포함)
      return prev.replace(/title: .*\n/, `title: "${titleValue}"\n`);
    });
  }, [titleValue]);

  // 영문만 입력 가능하도록 필터링
  const handleCustomFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 영문, 숫자, 하이픈, 언더스코어만 허용
    if (/^[a-zA-Z0-9_-]*$/.test(value)) {
      setCustomFilename(value);
    }
  };

  // 한글만 입력 가능하도록 필터링
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 한글, 영문, 숫자, 공백, 특수문자 허용 (한글 위주)
    setTitleValue(value);
  };

  const handleOpenGitHub = () => {
    // 백그라운드에서 창 열기 (setTimeout으로 포커스 유지)
    setTimeout(() => {
      const newWindow = window.open(url, "_blank");
      if (newWindow) {
        // 약간의 지연 후 현재 창에 포커스 유지
        setTimeout(() => {
          window.focus();
        }, 100);
      }
    }, 0);
  };

  const handleClose = () => {
    popModals();
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          type="text"
          value={titleValue}
          onChange={handleTitleChange}
          placeholder="포스트 제목을 입력하세요"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Filename</label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={customFilename}
            onChange={handleCustomFilenameChange}
            className="flex-1"
            placeholder="예: hello-world (영문, 숫자, -, _)"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Base Filename</label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={finalFilename}
            readOnly
            className="flex-1 bg-muted cursor-not-allowed"
          />
          <Button variant="outline" size="sm" asChild>
            <Copy id="filename" iconOnly>
              {finalFilename}
            </Copy>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Content</label>
        <div className="flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="border border-input rounded-md px-3 py-2 text-sm font-mono resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Copy id="content" iconOnly>
                {content}
              </Copy>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button onClick={handleOpenGitHub} variant="outline">
          GitHub 열기
        </Button>
        <Button onClick={handleClose} variant="default">
          닫기
        </Button>
      </div>
    </div>
  );
}
