import { useEffect, useState, useRef } from 'react';

function ServerSentEvent() {
  const [message, setMessage] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      eventSourceRef.current = new EventSource(import.meta.env.VITE_APP_BACKEND + '/api/events');

      eventSourceRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessage(data.message);
      };

      eventSourceRef.current.onerror = () => {
        // 연결 종료
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        // 1초 후에 재연결 시도
        setTimeout(() => {
          connect();
        }, 1000);
      };
    };

    connect();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []); // 의존성 배열을 빈 배열로 두어 최초 렌더링 시에만 실행

  return (<div>Message from server: {message}</div>);
}

export default ServerSentEvent;
