import React from 'react';
import CookieConsent from 'react-cookie-consent';

declare global {
  interface Window {
    gtag: (type: 'config' | 'event' | 'consent', action: string, options: Record<string, unknown>) => void;
  }
}

const Cookie: React.FC = () => {
  const handleAccept = () => {
    // 사용자가 쿠키를 수락했을 때 실행할 코드
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted'
    });
  };

  const handleDecline = () => {
    // 사용자가 쿠키를 거부했을 때 실행할 코드
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied'
    });
  };

  return (
    <div>
      <CookieConsent
        onAccept={handleAccept}
        onDecline={handleDecline}
        enableDeclineButton
      >
        이 사이트는 쿠키를 사용합니다. 계속 사용하려면 쿠키 사용에 동의해주세요.
      </CookieConsent>
    </div>
  );
};

export default Cookie;
