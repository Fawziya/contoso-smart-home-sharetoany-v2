'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/language-context';

interface CountdownBannerProps {
  className?: string;
}

export default function CountdownBanner({ className = '' }: CountdownBannerProps) {
  const { locale } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const promotionText = {
    en: {
      main: "50% OFF in",
      expired: "🎉 50% OFF Sale is Now LIVE!"
    },
    zh: {
      main: "15分钟后享受50%折扣！剩余时间：",
      expired: "🎉 50%折扣优惠现已开始！"
    }
  };

  const currentText = locale === 'zh' ? promotionText.zh : promotionText.en;

  if (isExpired) {
    return (
      <div className={`bg-gradient-to-r from-accent to-accent/80 text-white py-4 px-6 rounded-lg shadow-lg mb-6 text-center ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-xl font-bold animate-pulse">
            {currentText.expired}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg shadow-lg mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-center">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">
            {locale === 'zh' ? '🎯 Meowtica Smart Hub' : '🎯 Meowtica Smart Hub'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium">
            {currentText.main}
          </span>
          <div className="bg-white text-red-600 px-3 py-1 rounded-md font-bold text-xl min-w-[80px]">
            {formatTime(timeLeft)}
          </div>
          {locale === 'en' && (
            <span className="text-lg font-medium">minutes!</span>
          )}
        </div>
      </div>
      <div className="text-center mt-2 text-sm opacity-90">
        {locale === 'zh' 
          ? '限时优惠，不容错过！' 
          : 'Limited time offer - don\'t miss out!'
        }
      </div>
    </div>
  );
}