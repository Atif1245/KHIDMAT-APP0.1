import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Share2,
  Home,
  Car,
  CheckCircle2,
  Circle,
  MessageCircle,
  Star,
  X,
  Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LiveTracking: React.FC = () => {
  const navigate = useNavigate();

  const [eta, setEta] = useState(8);
  const [seconds, setSeconds] = useState(42);
  const [isCompleting, setIsCompleting] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedTip, setSelectedTip] = useState(0);
  const [review, setReview] = useState('');
  const [showChatPreview, setShowChatPreview] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev === 0) {
          if (eta > 0) { setEta(e => e - 1); return 59; }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [eta]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkerPosition(prev => (prev + 2) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteOrder = () => {
    if (rating > 0) navigate('/customer-home');
  };

  const timeline = [
    { label: 'Confirmed', completed: true, active: false },
    { label: 'Assigned', completed: true, active: false },
    { label: 'On Way', completed: false, active: true },
    { label: 'Complete', completed: false, active: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface dark:bg-surface-dark max-w-md mx-auto relative"
    >
      {/* Map Section */}
      <div className="relative w-full h-[50vh] bg-gradient-to-br from-primary-dark to-primary overflow-hidden">
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Animated path */}
        <motion.svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
          <motion.path
            d="M 100 100 Q 180 150, 250 200"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10 5"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -15 }}
            transition={{ duration: 1, repeat: Infinity }}
            opacity="0.6"
          />
        </motion.svg>

        {/* Provider marker */}
        <motion.div
          className="absolute w-11 h-11 bg-gradient-to-br from-primary-light to-info rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ left: `${markerPosition}%`, top: '40%', transform: 'translate(-50%, -50%)' }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <Car size={22} />
        </motion.div>

        {/* Customer marker */}
        <div className="absolute w-11 h-11 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center text-white shadow-lg bottom-20 right-12">
          <Home size={22} />
        </div>

        {/* ETA Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 right-6 bg-surface-dark/90 dark:bg-surface-dark/90 backdrop-blur border border-primary/30 rounded-xl px-4 py-3"
        >
          <p className="text-gray-400 text-xs">ETA</p>
          <p className="text-white font-bold text-lg">{eta}:{seconds.toString().padStart(2, '0')} min</p>
        </motion.div>
      </div>

      {/* Status Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-6 border-b border-gray-100 dark:border-surface-light"
      >
        <div className="flex items-center justify-between">
          {timeline.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-gradient-to-br from-primary to-info text-white'
                      : step.active ? 'bg-primary/20 border-2 border-primary dark:border-primary-bright text-primary dark:text-primary-bright'
                        : 'bg-gray-100 dark:bg-surface-light text-gray-400'
                  }`}
                >
                  {step.active && !step.completed ? (
                    <motion.div animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-3 h-3 bg-primary dark:bg-primary-bright rounded-full" />
                  ) : step.completed ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Circle size={18} />
                  )}
                </motion.div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium">{step.label}</span>
              </div>
              {idx < timeline.length - 1 && (
                <div className={`h-0.5 w-10 ${step.completed ? 'bg-gradient-to-r from-primary to-info' : 'bg-gray-200 dark:bg-surface-light'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Provider Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-4 my-5 glass glass-border rounded-2xl p-5"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <span className="text-xl font-bold">AR</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-navy dark:text-white">Ahmed Raza</h3>
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              <Star size={14} className="fill-yellow-400" />
              <span>4.9 (428)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4 text-sm">
          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-primary dark:text-primary-bright">
            ●
          </motion.span>
          <span>On the way to your location...</span>
        </div>

        <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 mb-4">
          <p className="text-gray-400 text-xs mb-1">ETA</p>
          <p className="text-3xl font-bold text-primary dark:text-primary-bright">
            {eta}:{seconds.toString().padStart(2, '0')}
          </p>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-400">Distance</span>
            <span className="text-xs text-gray-400">3.2 km</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-surface-light rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary to-info h-2 rounded-full"
              initial={{ width: '20%' }}
              animate={{ width: '60%' }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-4 mb-4 grid grid-cols-2 gap-3"
      >
        <button className="flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-surface-light hover:border-primary dark:hover:border-primary-bright text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-bright font-semibold py-3 rounded-xl transition-all text-sm">
          <Phone size={18} />
          Call Driver
        </button>
        <button className="flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-surface-light hover:border-primary dark:hover:border-primary-bright text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-bright font-semibold py-3 rounded-xl transition-all text-sm">
          <Share2 size={18} />
          Share Location
        </button>
      </motion.div>

      {/* Chat Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mx-4 mb-4 bg-white dark:bg-surface-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-all shadow-sm"
        onClick={() => setShowChatPreview(true)}
      >
        <div className="flex gap-3 mb-2">
          <MessageCircle size={18} className="text-primary dark:text-primary-bright flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm truncate">"I'm on my way..."</p>
            <p className="text-gray-400 text-xs">Ahmed</p>
          </div>
        </div>
        <button className="text-primary dark:text-primary-bright hover:underline text-sm font-semibold transition-all">
          Open Chat
        </button>
      </motion.div>

      {/* Complete / Cancel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-4 pb-8 flex items-center justify-center gap-6"
      >
        <button
          onClick={() => setIsCompleting(true)}
          className="text-primary dark:text-primary-bright hover:underline font-semibold text-sm transition-all"
        >
          Mark as Complete
        </button>
        <button
          onClick={() => navigate('/customer-home')}
          className="text-danger hover:underline font-semibold text-sm transition-all"
        >
          Cancel Order
        </button>
      </motion.div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {isCompleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          >
            <motion.div
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              exit={{ y: 500 }}
              transition={{ type: 'spring', damping: 30 }}
              className="w-full max-w-md bg-white dark:bg-surface-card rounded-t-3xl p-6 pb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy dark:text-white">Rate & Review</h3>
                <button onClick={() => { setIsCompleting(false); setRating(0); setSelectedTip(0); setReview(''); }} className="p-2 hover:bg-gray-100 dark:hover:bg-surface-light rounded-lg transition-all">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">Rate your experience</p>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }} onClick={() => setRating(star)} className="text-4xl transition-all">
                      <Star size={32} className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">Add a tip</p>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 15, 20].map((tip) => (
                    <motion.button
                      key={tip}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedTip(tip)}
                      className={`py-3 rounded-xl font-semibold transition-all text-sm ${
                        selectedTip === tip
                          ? 'bg-gradient-to-br from-primary to-info text-white shadow-md'
                          : 'bg-gray-50 dark:bg-surface-light text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-card'
                      }`}
                    >
                      +{tip}%
                    </motion.button>
                  ))}
                </div>
              </div>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience (optional)"
                className="w-full bg-gray-50 dark:bg-surface-light text-navy dark:text-white rounded-xl px-4 py-3 border border-gray-200 dark:border-surface-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 mb-6 resize-none h-24"
              />

              <button
                onClick={handleCompleteOrder}
                disabled={rating === 0}
                className={`w-full py-4 rounded-xl font-bold transition-all active:scale-[0.98] ${
                  rating > 0
                    ? 'bg-gradient-to-r from-primary to-info hover:from-primary-dark hover:to-info text-white'
                    : 'bg-gray-200 dark:bg-surface-light text-gray-400 cursor-not-allowed'
                }`}
              >
                Complete Order
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Preview Overlay */}
      <AnimatePresence>
        {showChatPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          >
            <motion.div
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              exit={{ y: 500 }}
              transition={{ type: 'spring', damping: 30 }}
              className="w-full max-w-md bg-white dark:bg-surface-card rounded-t-3xl p-6 pb-8 h-[70vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-surface-light">
                <h3 className="text-lg font-bold text-navy dark:text-white">Chat with Ahmed</h3>
                <button onClick={() => setShowChatPreview(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-surface-light rounded-lg transition-all">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-full flex-shrink-0" />
                  <div className="bg-gray-50 dark:bg-surface-light rounded-xl px-4 py-2 max-w-xs">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">I'm on my way to your location...</p>
                    <p className="text-gray-400 text-xs mt-1">8:42 AM</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-gradient-to-br from-primary to-info rounded-xl px-4 py-2 max-w-xs">
                    <p className="text-white text-sm">Thanks! See you soon</p>
                    <p className="text-white/70 text-xs mt-1">8:41 AM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-full flex-shrink-0" />
                  <div className="bg-gray-50 dark:bg-surface-light rounded-xl px-4 py-2 max-w-xs">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Just 5 minutes away!</p>
                    <p className="text-gray-400 text-xs mt-1">8:39 AM</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 dark:bg-surface-light text-navy dark:text-white rounded-xl px-4 py-3 border border-gray-200 dark:border-surface-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button className="p-3 bg-gradient-to-br from-primary to-info text-white rounded-xl transition-all hover:shadow-md">
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LiveTracking;
