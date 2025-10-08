// components/music/MusicCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiPlay, FiPause } from 'react-icons/fi';
import { useState } from 'react';
import AudioPlayer from './musicPlayer';

export default function MusicCard({ music, onDelete }: any) {
  const [showPlayer, setShowPlayer] = useState(false);
  
  return (
    <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300">
      <div className="relative">
        <Image 
          src={music.flyer} 
          alt={`${music.songName} by ${music.artistName}`}
          width={300}
          height={300}
          className="w-full h-48 object-cover"
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        <button 
          onClick={() => setShowPlayer(!showPlayer)}
          className="absolute bottom-3 right-3 p-3 rounded-full bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] hover:from-[#ff7cff] hover:to-[#75cfff]"
        >
          {showPlayer ? <FiPause className="text-white" /> : <FiPlay className="text-white" />}
        </button>
        
        <div className="absolute top-2 right-2">
          <span className={`
            text-xs px-2 py-1 rounded-lg font-medium
            ${music.status === 'ACTIVE' ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}
          `}>
            {music.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{music.songName}</h3>
        <p className="text-gray-400 text-sm">{music.artistName}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <p className="text-gray-500 text-xs">
            {new Date(music.createdAt).toLocaleDateString()}
          </p>
          <div className="flex space-x-1">
            <Link href={`/app/music/edit/${music._id}`}>
              <button className="p-1.5 rounded-lg bg-gray-700/60 hover:bg-blue-500/20 text-gray-300 hover:text-blue-300">
                <FiEdit2 size={16} />
              </button>
            </Link>
            <button 
              onClick={() => onDelete(music._id)}
              className="p-1.5 rounded-lg bg-gray-700/60 hover:bg-red-500/20 text-gray-300 hover:text-red-300"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {showPlayer && (
        <div className="p-4 pt-0">
          <AudioPlayer 
            url={music.songUrl} 
            songName={music.songName} 
            artistName={music.artistName} 
          />
        </div>
      )}
    </div>
  );
}