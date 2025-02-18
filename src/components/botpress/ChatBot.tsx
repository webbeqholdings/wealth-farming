import { useEffect } from "react";
import Script from "next/script";

const ChatBot = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).botpress) {
      (window as any).botpress.init({
        "botId": "bac514d4-4fbe-41c3-9d9e-c5efc5919e9b",
        "configuration": {
          "botName": "Wealth Farming",
          "website": {},
          "email": {},
          "phone": {},
          "termsOfService": {},
          "privacyPolicy": {},
          "color": "#3B82F6",
          "variant": "solid",
          "themeMode": "light",
          "fontFamily": "inter",
          "radius": 1
        },
        "clientId": "6a8aebe0-1c97-45fd-addd-cb677c876a88",
        "user": {
          "data": {
            "uid": localStorage.getItem('user_id')
          }
        }
      });
      (window as any).botpress.on('webchat:opened', () => {
        (window as any).botpress.updateUser({
          "data": {
            "uid": localStorage.getItem('user_id')
          }
        })
       })
    }
  }, []);

  return (
    <>
      <Script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js" strategy="beforeInteractive" />
    </>
  );
};

export default ChatBot;