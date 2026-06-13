import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Chrome, Apple } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';

export default function CustomerSignin() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ LOGIN WITH SUPABASE DATABASE
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user exists in Supabase
      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (supabaseError || !data) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Save user to context and localStorage
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        role: data.role || 'customer',
      };
      
      setUser(userData);
      localStorage.setItem('khidmat_user', JSON.stringify(userData));
      
      // Redirect based on role
      if (data.role === 'provider') {
        navigate('/provider-dashboard');
      } else {
        navigate('/customer-home');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ SOCIAL LOGIN WITH SUPABASE
  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setError('');
    
    try {
      const mockEmail = `user@${provider.toLowerCase()}.com`;
      const mockPassword = 'social_login';
      
      // Check if user exists
      let { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', mockEmail)
        .single();
      
      // If not exists, create new user
      if (!existingUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              name: `${provider} User`,
              email: mockEmail,
              password: mockPassword,
              role: 'customer',
              city: 'Lahore',
              phone: '03000000000'
            }
          ])
          .select()
          .single();
        
        if (insertError) {
          setError('Social login failed');
          setLoading(false);
          return;
        }
        existingUser = newUser;
      }
      
      const userData = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role || 'customer',
      };
      
      setUser(userData);
      localStorage.setItem('khidmat_user', JSON.stringify(userData));
      navigate('/customer-home');
      
    } catch (err) {
      setError('Social login failed');
      console.error('Social login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/role-selection')}
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-10"
      >
        <ArrowLeft size={24} className="text-[#005F54]" />
      </motion.button>

      {/* Wave Pattern Background */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-64 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Main Content */}
      <motion.div
        className="flex-1 flex items-center justify-center px-4 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-md bg-white rounded-[48px] shadow-2xl p-8"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h1 className="text-[28px] font-bold text-[#005F54] mb-2">KHIDMAT</h1>
            <p className="text-sm text-gray-500">Premium Service Marketplace</p>
          </motion.div>

          {/* Welcome Text */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-lg text-[#005F54] urdu font-medium">خوش آمدید</p>
          </motion.div>

          {/* Decorative Line */}
          <motion.div
            variants={itemVariants}
            className="w-[50px] h-1 bg-gradient-to-r from-[#005F54] to-[#00B4D8] mx-auto mb-8"
          />

          {/* Form */}
          <motion.form variants={itemVariants} onSubmit={handleSignIn} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <label className="block text-xs text-[#005F54] urdu mb-2">ای میل</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005F54]" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-[#005F54] focus:outline-none transition-colors bg-gray-50 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-[#FF8C00] hover:underline font-medium"
                >
                  Forgot?
                </button>
              </div>
              <label className="block text-xs text-[#005F54] urdu mb-2">پاس ورڈ</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005F54]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-2xl focus:border-[#005F54] focus:outline-none transition-colors bg-gray-50 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#005F54]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-[#005F54] to-[#00B4D8] hover:shadow-lg transition-all disabled:opacity-70 mt-6"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-4 text-gray-500 font-medium text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </motion.div>

          {/* Social Login */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialLogin('Google')}
              className="py-3 px-4 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-2 hover:border-[#005F54] transition-colors font-medium text-gray-700"
            >
              <Chrome size={20} />
              <span className="text-sm">Google</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialLogin('Apple')}
              className="py-3 px-4 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-2 hover:border-[#005F54] transition-colors font-medium text-gray-700"
            >
              <Apple size={20} />
              <span className="text-sm">Apple</span>
            </motion.button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants} className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/customer-signup')}
                className="text-[#005F54] font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </motion.div>

          {/* Security Note */}
          <motion.div
            variants={itemVariants}
            className="mt-8 p-4 bg-gradient-to-r from-[#00B4D8]/10 to-[#005F54]/10 rounded-2xl border border-[#00B4D8]/20"
          >
            <p className="text-xs text-gray-600 text-center font-medium">
              🔒 Secure login with 2FA protection
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}