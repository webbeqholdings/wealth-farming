import { useEffect } from "react";
import Script from "next/script";

const ChatBot = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).botpress) {
      (window as any).botpress.init({
        "botId": "ccf9936b-e976-4add-96de-6f8719acb9c4",
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
        "clientId": "8000cc50-3979-48aa-90f5-50a2ec7437bd",
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

  const sendMessage = () => {
    
  };

  return (
    <>
      <Script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js" strategy="beforeInteractive" />
    </>
  );
};

export default ChatBot;