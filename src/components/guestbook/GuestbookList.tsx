import { useState } from 'react';
import dayjs from 'dayjs';
import guestbookData from './guestbook.json'; // JSON 파일을 직접 import

interface GuestbookEntry {
  name: string;
  message: string;
  mail: string;
  date: string;
  answer?: string; // Optional field
}

const GuestbookList = () => {
  const [entries] = useState<GuestbookEntry[]>(guestbookData);
  const [loading] = useState<boolean>(false); // 데이터를 import했으므로 true로 설정할 필요 없음
  const [error] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-200 dark:bg-gray-800 shadow-md rounded-lg my-16">
      {loading && <p className="text-gray-500 dark:text-gray-400">불러오는 중...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {entries.length === 0 && !loading && <p className="text-gray-500 dark:text-gray-400">방명록이 없습니다.</p>}
      <ul className="space-y-4">
        {entries.map((entry, index) => (
          <li key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-sm bg-white dark:bg-gray-900">
            <div className=" text-black dark:text-gray-100">{entry.name}</div>
            <div className="text-base text-gray-600 dark:text-gray-400">({entry.mail})</div>
            <p className="mt-2 text-black dark:text-gray-300">{entry.message}</p>
            {entry.answer && (
              <div className="mt-2 text-base text-gray-800 dark:text-gray-200 italic">답장: {entry.answer}</div>
            )}
            <div className="mt-2 text-base text-gray-500 dark:text-gray-500">{dayjs(entry.date).format("YYYY-MM-DD HH:mm:ss")}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuestbookList;
