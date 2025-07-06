import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, SpeakerphoneIcon } from '@heroicons/react/outline';

interface AudioPlayerProps {
  productId: number;
  productName: string;
  locale: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ productId, productName, locale }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(locale);
  const audioRef = useRef<HTMLAudioElement>(null);

  // File naming convention: meowtica-smart-hub-en.wav, meowtica-smart-hub-zh.wav
  const getAudioFileName = (lang: string) => {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    return `/audio/${slug}-${lang}.wav`;
  };

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    setIsLoading(true);
    setHasError(false);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentLanguage(lang);
    setHasError(false);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    setHasError(true);
    setIsPlaying(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleAudioEnded);
      audio.addEventListener('error', handleAudioError);
      
      return () => {
        audio.removeEventListener('ended', handleAudioEnded);
        audio.removeEventListener('error', handleAudioError);
      };
    }
  }, []);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SpeakerphoneIcon className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage === 'zh' ? '听产品介绍' : 'Listen to Product Description'}
          </span>
        </div>
        
        {/* Language Selection */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              currentLanguage === 'en'
                ? 'bg-secondary-dark text-white border-secondary-dark'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageChange('zh')}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              currentLanguage === 'zh'
                ? 'bg-secondary-dark text-white border-secondary-dark'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            中文
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-3">
        <button
          onClick={handlePlayPause}
          disabled={isLoading || hasError}
          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
            hasError
              ? 'border-red-300 bg-red-50 cursor-not-allowed'
              : isLoading
              ? 'border-gray-300 bg-gray-50 cursor-wait'
              : 'border-secondary-dark text-secondary-dark hover:bg-secondary-dark hover:text-white'
          }`}
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5 ml-0.5" />
          )}
        </button>

        {hasError ? (
          <span className="text-sm text-red-600">
            {currentLanguage === 'zh' ? '音频文件不可用' : 'Audio file not available'}
          </span>
        ) : (
          <span className="text-sm text-gray-600">
            {isLoading
              ? (currentLanguage === 'zh' ? '加载中...' : 'Loading...')
              : isPlaying
              ? (currentLanguage === 'zh' ? '播放中' : 'Playing')
              : (currentLanguage === 'zh' ? '点击播放' : 'Click to play')
            }
          </span>
        )}
      </div>

      <audio
        ref={audioRef}
        src={getAudioFileName(currentLanguage)}
        preload="none"
        className="hidden"
      />
    </div>
  );
};

export default AudioPlayer;