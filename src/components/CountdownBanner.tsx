import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/language-context';

interface CountdownBannerProps {
  productSlug: string;
}

const CountdownBanner: React.FC<CountdownBannerProps> = ({ productSlug }) => {
  const { locale } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Only show for Meowtica Smart Hub
  if (productSlug !== 'meowtica-smart-hub') {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const messages = {
    en: {
      limitedTime: 'LIMITED TIME OFFER',
      countdown: 'HURRY! Sale ends in',
      expired: '🎉 50% OFF NOW ACTIVE!',
      expiredSubtext: 'Limited time promotion is now active - Don\'t miss out!',
      minutes: 'minutes',
      seconds: 'seconds'
    },
    zh: {
      limitedTime: '限时优惠',
      countdown: '抢购倒计时',
      expired: '🎉 50% 折扣现已生效！',
      expiredSubtext: '限时促销现已开始 - 不要错过！',
      minutes: '分钟',
      seconds: '秒钟'
    }
  };

  const msg = messages[locale as keyof typeof messages] || messages.en;

  if (isExpired) {
    return (
      <div className="bg-gradient-to-r from-accent to-green-400 text-white py-4 px-6 mx-4 mb-6 rounded-xl shadow-lg">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold mb-2 animate-pulse">
            {msg.expired}
          </div>
          <div className="text-lg opacity-90">
            {msg.expiredSubtext}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-secondary-dark to-gray-800 text-white py-4 px-6 mx-4 mb-6 rounded-xl shadow-lg border-l-4 border-accent">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent text-secondary-dark px-3 py-1 rounded-full text-sm font-bold">
            {msg.limitedTime}
          </div>
          <span className="text-lg font-medium">
            {msg.countdown}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white text-secondary-dark px-4 py-2 rounded-lg font-mono text-2xl font-bold min-w-[80px] text-center shadow-inner">
            {formatTime(timeLeft)}
          </div>
          <div className="text-accent text-sm font-medium">
            {Math.floor(timeLeft / 60)} {msg.minutes} {timeLeft % 60} {msg.seconds}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;