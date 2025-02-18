import { useEffect } from "react";
import Script from "next/script";
const ChatwootWidget = ():any => {
  useEffect(() => {
    // Thêm CSS để ẩn icon gốc của Chatwoot
    const style = document.createElement("style");
    style.innerHTML = `
      .woot--close img { display: none; }
      #woot-widget-bubble-icon { display: none; }
    `;
    document.head.appendChild(style);

    // Hàm tải icon mới
    const loadCustomIcon = async () => {
      try {

        // Quan sát DOM để thay đổi icon của Chatwoot
        const observer = new MutationObserver((mutations) => {
          for (let mutation of mutations) {
            const { target } = mutation;

            // Kiểm tra xem target có phải là một phần tử HTML không
            if (target instanceof HTMLElement) {
              const bubbleElements = target.querySelectorAll(".woot-widget-bubble");

              if (bubbleElements.length > 0) {
                observer.disconnect(); // Ngừng quan sát khi tìm thấy widget
                bubbleElements.forEach((bubble) => {
                  const img = document.createElement("img");
                  img.style.width = "80%"
                  img.style.marginLeft = "3.5px"
                  img.style.marginRight = "3.5px"
                  img.src = "https://i.postimg.cc/rwbwmwsP/header-icon-support.png";
                  img.width = 36; // Điều chỉnh kích thước icon
                  bubble.appendChild(img);
                });
                break;
              }
            }
          }
        });

        observer.observe(document.body, { subtree: true, childList: true });
      } catch (error) {
        console.error("Lỗi khi tải icon mới:", error);
      }
    };
    // Chạy script của Chatwoot
    const loadChatwoot = () => {
      const BASE_URL = "https://chatwoot-e8804sgsooss484oc0c4kggo.wealthfarming.org";
      const script = document.createElement("script");
      script.src = `${BASE_URL}/packs/js/sdk.js`;
      script.defer = true;
      script.async = true;
      script.onload = () => {
        (window as any).chatwootSDK.run({
          websiteToken: "66GW6RuRtxGCD71UaP9XJxkS",
          baseUrl: BASE_URL,
        });
      };
      document.body.appendChild(script);
    };

    loadCustomIcon();
    loadChatwoot();
  }, []);

  return null; // Không hiển thị UI, chỉ inject script vào DOM
};
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
          "radius": 1,

        },
        "clientId": "8000cc50-3979-48aa-90f5-50a2ec7437bd",
        "user": {
          "data": {
            "uid": localStorage.getItem('user_id') ? localStorage.getItem('user_id') : '0',
            "lang": localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en',
            "conversationId": '0',
          }
        }
      });

      (window as any).botpress.on('webchat:opened', () => {
        (window as any).botpress.updateUser({
          "data": {
            "uid": localStorage.getItem('user_id') ? localStorage.getItem('user_id') : '0',
            "lang": localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en',
            "conversationId": (window as any).botpress.onEvent("message", (event: any) => {
              return event.conversationId
            })
          }
        })
      })
    }
  }, []);

  return (
    <>
      <Script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"/>
      <Script src="https://files.bpcontent.cloud/2025/02/14/11/20250214113712-TNLG44T4.js"></Script>
      <ChatwootWidget />
    </>
  );
};

export { ChatBot };