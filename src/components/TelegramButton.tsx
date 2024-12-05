import React, { useEffect } from 'react';

// Define props interface
interface TelegramButtonProps {
  userId: string; // Define the type for userId prop (assuming userId is a string)
}

const TelegramButton: React.FC<TelegramButtonProps> = ({ userId }) => {
  useEffect(() => {
    // Dynamically create the script element
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js";
    script.async = true;
    script.setAttribute('data-telegram-login', 'Dev_quote_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', `https://dev.wealthfarming.org/api/auth/login/telegram?user_id=${userId}`);
    
    // Find the element with class "telegram" and append the script to it
    const telegramDiv = document.querySelector('.telegram');
    if (telegramDiv) {
      telegramDiv.appendChild(script);
    }

    // Cleanup the script when the component is unmounted
    return () => {
      if (telegramDiv) {
        telegramDiv.removeChild(script);
      }
    };
  }, [userId]); // Re-run the effect if userId changes

  return (
    <div className="relative">
      <p className="mb-4 text-lg text-gray-700">Click the button to log in via Telegram</p>
      <div className="telegram flex justify-center items-center h-16 w-full"></div> {/* Centered container */}
    </div>
  );
};

export default TelegramButton;
