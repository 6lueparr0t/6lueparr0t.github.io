import { useEffect } from "react";

// 여기에 `Guestbook` 페이지에 필요한 컴포넌트를 추가하세요.
import GuestbookForm from "@/components/guest/GuestbookForm"; // 예시 컴포넌트
import GuestbookList from "@/components/guest/GuestbookList"; // 예시 컴포넌트

function Guestbook() {
  useEffect(() => {
    document.title = "Guest";
  }, []);

  return (
    <div className="font-['DungGeunMo'] flex flex-col items-center">
      <GuestbookForm />
      <GuestbookList />
    </div>
  );
}

export default Guestbook;
