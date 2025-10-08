import { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';

export default function AudioPlayer({ url, songName, artistName }: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef: any = useRef(null);

  useEffect(() => {
    const audio: any = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeChange = (e: any) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // Formatear tiempo en formato mm:ss
  const formatTime = (time: any) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700 p-3 rounded-xl">
      <audio ref={audioRef} src={url}></audio>
      
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-white font-medium text-sm truncate">{songName}</h3>
          <p className="text-gray-400 text-xs">{artistName}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={toggleMute} className="p-2 rounded-full bg-gray-800/60 hover:bg-gray-700/60">
            {isMuted ? <FiVolumeX size={18} className="text-gray-400" /> : <FiVolume2 size={18} className="text-white" />}
          </button>
          <button 
            onClick={togglePlay} 
            className="p-2 rounded-full bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] hover:from-[#ff7cff] hover:to-[#75cfff]"
          >
            {isPlaying ? <FiPause size={18} className="text-white" /> : <FiPlay size={18} className="text-white" />}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleTimeChange}
          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4EBEFF]"
        />
        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
      </div>
    </div>
  );
}