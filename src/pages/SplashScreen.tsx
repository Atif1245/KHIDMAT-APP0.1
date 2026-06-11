import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/role-selection');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-primary to-[#004D40] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating Circles */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full border border-white opacity-10"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-32 right-20 w-48 h-48 rounded-full border border-white opacity-10"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full border border-white opacity-10"
        animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center gap-5 z-10">
        {/* Pakistan Flag */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-20 h-14 rounded-lg overflow-hidden shadow-xl border-2 border-white/30 relative"
        >
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 bg-[#01411C] w-3/4" />
          <div className="absolute top-1/2 left-[37.5%] -translate-x-1/2 -translate-y-1/2">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <polygon points="16,2 20,12 31,12 22,19 25,30 16,23 7,30 10,19 1,12 12,12" fill="white" />
            </svg>
          </div>
        </motion.div>

        {/* Animated Handshake Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Handshake size={80} className="text-white" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* KHIDMAT Text */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-white tracking-[-2px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          KHIDMAT
        </motion.h1>

        {/* Urdu Subtitle */}
        <motion.p
          className="text-base md:text-lg text-white opacity-90 urdu font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          خدمات آپ کے گھر پر
        </motion.p>
      </div>

      {/* Loading Bar */}
      <motion.div
        className="absolute bottom-24 w-48 h-1 bg-white/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-white to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Footer Text */}
      <motion.p
        className="absolute bottom-8 text-white text-xs md:text-sm opacity-70 text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        Pakistan's #1 Service Marketplace
      </motion.p>
    </div>
  );
};

export default SplashScreen;
