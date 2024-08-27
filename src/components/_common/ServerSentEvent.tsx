import { useEffect, useState } from 'react';

function ServerSentEvent() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const eventSource = new EventSource(import.meta.env.VITE_APP_BACKEND+'/api/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage(data.message);
    };

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      eventSource.close();
    };
  }, []);

  return (<div>Message from server: {message}</div>);
}

export default ServerSentEvent;
