import React from "react";

import CookieConsent from "react-cookie-consent";

declare global {
  interface Window {
    gtag: (
      type: "config" | "event" | "consent",
      action: string,
      options: Record<string, unknown>
    ) => void;
  }
}

const Cookie: React.FC = () => {
  const handleAccept = () => {
    // 사용자가 쿠키를 수락했을 때 실행할 코드
    window.gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  };

  const handleDecline = () => {
    // 사용자가 쿠키를 거부했을 때 실행할 코드
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  };

  return (
    <div>
      <CookieConsent onAccept={handleAccept} onDecline={handleDecline} enableDeclineButton>
        이 사이트는 Google Analytics 분석을 위해 쿠키를 사용합니다. 쿠키 수집에 동의하시나요?
      </CookieConsent>
    </div>
  );
};

export default Cookie;
