import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setLanguage, language } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300 overflow-hidden">
      {/* Abstract Blob Decoration */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-secondary/5 to-primary/5 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col min-h-screen px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="pt-8 md:pt-12 pb-6 md:pb-8 text-center"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-2 tracking-tight">
            KHIDMAT
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">
            Premium Service Marketplace
          </p>

          {/* Decorative Gradient Line */}
          <motion.div
            className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mt-4 max-w-xs mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.div>

        {/* Cards Container */}
        <motion.div className="flex-1 flex flex-col gap-6 md:gap-8 justify-center py-8">
          {/* Service Provider Card */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-card dark:shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-xl transition-shadow"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            {/* Left Gradient Accent Bar */}
            <div className="h-1 bg-gradient-to-r from-primary to-blue-500" />

            <div className="p-6 md:p-8">
              {/* Icon */}
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-5"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Wrench size={32} className="text-white" strokeWidth={1.5} />
              </motion.div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Service Provider
              </h2>
              <p className="text-primary font-semibold mb-3 urdu text-lg">
                خدمت فراہم کرنی والا
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm md:text-base">
                Join thousands of skilled professionals and earn reliable income.
              </p>

              {/* Highlight */}
              <motion.div
                className="inline-block bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 px-4 py-2 rounded-lg mb-6"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-primary dark:text-primary-light font-semibold text-sm">
                  Earn up to PKR 100,000/month
                </p>
              </motion.div>

              {/* Button - ✅ Fixed: Provider Signup pe jayega */}
              <motion.button
                onClick={() => navigate('/provider-signup')}
                className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary-dark hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          {/* Need a Service Card */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-card dark:shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-xl transition-shadow"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            {/* Left Gradient Accent Bar */}
            <div className="h-1 bg-gradient-to-r from-secondary to-orange-400" />

            <div className="p-6 md:p-8">
              {/* Icon */}
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-orange-400 flex items-center justify-center mb-5"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Search size={32} className="text-white" strokeWidth={1.5} />
              </motion.div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Need a Service
              </h2>
              <p className="text-secondary font-semibold mb-3 urdu text-lg">
                خدمت چاہیے
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm md:text-base">
                Find and hire trusted professionals for any task you need done.
              </p>

              {/* Highlight */}
              <motion.div
                className="inline-block bg-gradient-to-r from-secondary/10 to-orange-400/10 dark:from-secondary/20 dark:to-orange-400/20 px-4 py-2 rounded-lg mb-6"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-secondary dark:text-orange-300 font-semibold text-sm">
                  Verified & Insured Professionals
                </p>
              </motion.div>

              {/* Button - ✅ Fixed: Customer Signin pe jayega */}
              <motion.button
                onClick={() => navigate('/customer-signin')}
                className="w-full bg-gradient-to-r from-secondary to-orange-400 hover:from-[#E67E00] hover:to-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="grid grid-cols-3 gap-4 md:gap-6 py-8 border-t border-gray-200 dark:border-slate-700"
          variants={itemVariants}
        >
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-light">
              50K+
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1">
              Providers
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-light">
              1M+
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1">
              Jobs Completed
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-light">
              4.9★
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1">
              Avg Rating
            </p>
          </div>
        </motion.div>

        {/* Language Toggle */}
        <motion.div
          className="flex justify-center gap-2 pb-6 md:pb-8"
          variants={itemVariants}
        >
          {[
            { key: 'en' as const, label: 'English' },
            { key: 'ur' as const, label: 'اردو', isUrdu: true },
            { key: 'roman' as const, label: 'Roman' },
          ].map((lang) => (
            <button
              key={lang.key}
              onClick={() => setLanguage(lang.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md ${
                lang.isUrdu ? 'urdu' : ''
              } ${
                language === lang.key
                  ? 'bg-gradient-to-r from-primary to-info text-white'
                  : 'bg-white dark:bg-surface-card text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-light'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;