import { useEffect, useRef, useState } from "react";

function ServerSentEvent() {
  const [message, setMessage] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0); // 재연결 시도 횟수 추적

  useEffect(() => {
    const maxRetries = 5; // 최대 재연결 시도 횟수

    const connect = () => {
      eventSourceRef.current = new EventSource(
        import.meta.env.VITE_APP_SLACK_ENDPOINT + "/api/events?enable=true"
      );

      eventSourceRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessage(data.message);
      };

      eventSourceRef.current.onerror = () => {
        // 연결 종료
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        // 최대 재연결 시도 횟수를 초과하지 않은 경우
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1; // 재연결 시도 횟수 증가
          console.info(`Connecting .. ${retryCountRef.current}`);
          setTimeout(() => {
            connect();
          }, 5000);
        } else {
          console.error(`Failed to reconnect after ${maxRetries} attempts.`);
        }
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

  return <div>Message from server: {message}</div>;
}

export default ServerSentEvent;
