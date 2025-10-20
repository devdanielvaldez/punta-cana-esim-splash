'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const languageRef = useRef();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  // Partículas flotantes en el header
  const floatingParticles = [
    { delay: 0, duration: 4, size: 'w-1 h-1', top: '40%', left: '15%' },
    { delay: 1, duration: 5, size: 'w-2 h-2', top: '70%', left: '25%' },
    { delay: 2, duration: 6, size: 'w-1 h-1', top: '50%', left: '75%' },
    { delay: 3, duration: 4, size: 'w-2 h-2', top: '80%', left: '85%' },
  ];

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-4"
    >
      {/* Partículas flotantes en el header */}
      {floatingParticles.map((particle, index) => (
        <motion.div
          key={index}
          initial={{ y: 0, x: 0, opacity: 0, scale: 0 }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full ${particle.size} bg-cyan-400/40 blur-sm`}
          style={{
            top: particle.top,
            left: particle.left,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo oficial */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center space-x-4 cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"> */}
                <img 
                  src="https://storage.googleapis.com/triptap/logo%20eSIM%20PC.png" 
                  alt="PuntaCana eSIM Logo"
                  className="w-20 h-14 "
                />
              {/* </div> */}
              {/* <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 bg-cyan-400/30 rounded-2xl blur-sm -z-10"
              /> */}
            </motion.div>
            {/* <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                PuntaCana
              </motion.span>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-cyan-300/70 -mt-1 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>eSIM</span>
              </motion.div>
            </div> */}
          </motion.div>

          {/* Espacio central vacío (donde estaba la search bar) */}
          <div className="flex-1"></div>

          {/* Language Selector */}
          <div className="relative" ref={languageRef}>
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-3 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300 shadow-lg"
            >
              <Globe className="w-6 h-6 text-cyan-300" />
              <span className="text-base font-medium text-white">
                {languages.find(lang => lang.code === language)?.flag}
              </span>
              <motion.div
                animate={{ rotate: isLanguageOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-cyan-300" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-56 bg-slate-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 py-3 z-50"
                >
                  {languages.map((lang, index) => (
                    <motion.button
                      key={lang.code}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full px-5 py-4 text-left hover:bg-white/10 transition-all duration-300 flex items-center space-x-4 group ${
                        language === lang.code 
                          ? 'bg-cyan-500/20 text-cyan-300 border-r-2 border-cyan-400' 
                          : 'text-white'
                      }`}
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {lang.flag}
                      </span>
                      <span className="text-base group-hover:text-cyan-300 transition-colors">
                        {lang.name}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;