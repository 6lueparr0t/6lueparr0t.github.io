// components/guestbook/GuestbookForm.tsx
import { useRef, useState, FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

import { Button } from '@/components/ui/button'; // UI 폴더에 Button 컴포넌트가 있다고 가정합니다.

interface FormData {
  name: string;
  message: string;
  mail: string;
}

const GuestbookForm = () => {
  const [status, setStatus] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    message: '',
    mail: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`https://${import.meta.env.VITE_APP_SLACK_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('검토 후 반영하겠습니다. 감사합니다.');
        setFormData({ name: '', message: '', mail: '' });
        turnstileRef.current?.reset();
        setStatus('expired');
      } else {
        setError('메시지 전송에 실패했습니다. 아래 메일로 문의해주세요.');
      }
    } catch (error) {
      setError('메시지 전송에 실패했습니다. 아래 메일로 문의해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[calc(100%-4rem)] sm:w-1/2 mx-8 p-6 bg-slate-100 dark:bg-gray-800 shadow-md rounded-lg mt-16">
      <h2 className="text-2xl font-bold mb-4 text-dark dark:text-white">방명록</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dark dark:text-gray-300">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-black dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-dark dark:text-gray-300">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-black dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="mail" className="block text-sm font-medium text-dark dark:text-gray-300">Email:</label>
          <input
            type="email"
            id="mail"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-black dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
          />
        </div>
        <div className='flex justify-center mt-6'>
          <Turnstile
            ref={turnstileRef}
            siteKey='0x4AAAAAAAh0AbQiSvRJjo-z'
            onError={() => setStatus('error')}
            onExpire={() => setStatus('expired')}
            onSuccess={() => setStatus('solved')}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || status !== 'solved'}
          className={`flex mt-4 mx-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white dark:text-black bg-slate-600 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? '보내는 중...' : '남기기'}
        </Button>
        {error && <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>}
        {success && <p className="mt-4 text-green-600 dark:text-green-400">{success}</p>}
      </form>
    </div>
  );
};

export default GuestbookForm;
