import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/language-context';

interface CountdownBannerProps {
  className?: string;
}

const CountdownBanner: React.FC<CountdownBannerProps> = ({ className = '' }) => {
  const { locale, t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    // Reset timer to 15 minutes when component mounts (page refresh)
    setTimeLeft(900);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          return 0; // Stop at 0
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg mb-8 animate-pulse ${className}`}>
      <div className="text-center">
        <div className="text-xl md:text-2xl font-bold mb-2">
          🔥 {t('countdown.limitedOffer')} 🔥
        </div>
        <div className="text-2xl md:text-3xl font-bold mb-3">
          {t('countdown.productOffer')}
        </div>
        <div className="text-lg md:text-xl mb-2">
          {t('countdown.hurryMessage')} <span className="font-mono text-yellow-300 text-2xl md:text-3xl font-bold">{formatTime(timeLeft)}</span>
        </div>
        <div className="text-base md:text-lg">
          {t('countdown.dontMiss')}
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;