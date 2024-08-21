import { useEffect } from "react";

// 여기에 `Guestbook` 페이지에 필요한 컴포넌트를 추가하세요.
import GuestbookForm from "@/components/guestbook/GuestbookForm";  // 예시 컴포넌트
import GuestbookList from "@/components/guestbook/GuestbookList";  // 예시 컴포넌트

function Guestbook() {
  useEffect(() => {
    document.title = "Guestbook";
  }, []);

  return (
    <div className="font-['DungGeunMo']">
      <GuestbookForm />
      <GuestbookList />
    </div>
  );
}

export default Guestbook;
