import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Lock, Check, ArrowLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { pakistanCities } from '../data/services';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function CustomerSignup() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    password: '',
    agreeToTerms: false,
  });
  const [showPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const getPasswordStrength = (pwd: string): PasswordStrength => {
    if (pwd.length < 6) return 'weak';
    if (pwd.length < 10) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const filteredCities = pakistanCities.filter((city) =>
    city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCitySelect = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      city,
    }));
    setShowCityDropdown(false);
    setSearchCity('');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError('Please enter your full name');
        return false;
      }
      if (!formData.phoneNumber.trim()) {
        setError('Please enter your phone number');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Please enter your email');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.city) {
        setError('Please select your city');
        return false;
      }
      if (!formData.password.trim()) {
        setError('Please enter a password');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) {
        setError('Please agree to the Terms of Service');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUser({
        name: formData.fullName,
        email: formData.email,
        role: 'customer',
      });
      navigate('/customer-home');
    } catch (err) {
      setError('Sign up failed. Please try again.');
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
        delayChildren: 0.1,
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
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#005F54] via-[#00B4D8] to-[#005F54] pt-16 pb-32 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Join the Family</h1>
          <p className="text-lg opacity-90 max-w-md mx-auto">
            Become part of Pakistan's largest service network
          </p>
        </motion.div>

        {/* Curved Bottom */}
        <svg
          className="absolute bottom-0 w-full h-20 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 Q300,80 600,30 T1200,30 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/customer-signin')}
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-20"
      >
        <ArrowLeft size={24} className="text-[#005F54]" />
      </motion.button>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative -mt-12 mx-4 mb-12 bg-white rounded-t-[40px] shadow-2xl overflow-hidden"
      >
        <div className="px-6 md:px-8 pt-8 pb-12 max-w-md mx-auto">
          {/* Header */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-8">
            <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Create Account
            </motion.h2>
            <motion.p variants={itemVariants} className="text-sm text-[#005F54] urdu font-medium mb-4">
              نیا اکاؤنٹ بنائیں
            </motion.p>

            {/* Progress Dots */}
            <motion.div variants={itemVariants} className="flex justify-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={`h-2 rounded-full transition-all ${
                    dot === step
                      ? 'bg-gradient-to-r from-[#005F54] to-[#00B4D8] w-8'
                      : dot < step
                        ? 'bg-[#005F54] w-2'
                        : 'bg-gray-200 w-2'
                  }`}
                />
              ))}
            </motion.div>
            <p className="text-xs text-gray-500 mt-3 font-medium">
              Step {step} of 3
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 3) {
                handleNextStep();
              } else {
                handleSignUp(e);
              }
            }}
            className="space-y-5"
          >
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                {/* Full Name */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005F54]" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Muhammad Ali"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-[#005F54] focus:outline-none transition-colors bg-gray-50 font-medium"
                    />
                  </div>
                </motion.div>

                {/* Phone Number */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005F54]" />
                    <div className="flex">
                      <span className="flex items-center pl-4 pr-3 bg-gray-50 border-2 border-r-0 border-gray-200 rounded-l-2xl font-semibold text-gray-700">
                        +92
                      </span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="300 1234567"
                        className="flex-1 pr-4 py-3 border-2 border-gray-200 rounded-r-2xl focus:border-[#005F54] focus:outline-none transition-colors bg-gray-50 font-medium"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005F54]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-[#005F54] focus:outline-none transition-colors bg-gray-50 font-medium"
                    />
                  </div>
                </motion.div>
              </>
            )}

            {/* Step 2: Location & Password */}
            {step === 2 && (
              <>
                {/* City */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005F54] z-10" />
                    <input
                      type="text"
                      value={searchCity || formData.city}
                      onChange={(e) => {
                        setSearchCity(e.target.value);
                        setShowCityDropdown(true);
                      }}
                      onFocus={() => setShowCityDropdown(true)}
                      placeholder="Select your city"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-[#005F54] focus:outline-none transition-colors bg-gray-50 font-medium"
                    />

                    {/* City Dropdown */}
                    {showCityDropdown && filteredCities.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg z-20 max-h-48 overflow-y-auto"
                      >
                        {filteredCities.map((city, idx) => (
                          <motion.button
                            key={idx}
                            type="button"
                            onClick={() => handleCitySelect(city)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0 font-medium text-gray-700"
                          >
                            {city}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005F54]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-[#005F54] focus:outline-none transition-colors bg-gray-50 font-medium"
                    />
                  </div>

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                      <div className="flex gap-2 mb-2">
                        <div
                          className={`flex-1 h-2 rounded-full transition-colors ${
                            passwordStrength === 'weak'
                              ? 'bg-red-500'
                              : passwordStrength === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                        />
                        <div
                          className={`flex-1 h-2 rounded-full transition-colors ${
                            passwordStrength === 'medium' || passwordStrength === 'strong'
                              ? passwordStrength === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                        <div
                          className={`flex-1 h-2 rounded-full transition-colors ${
                            passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      </div>
                      <p
                        className={`text-xs font-semibold ${
                          passwordStrength === 'weak'
                            ? 'text-red-500'
                            : passwordStrength === 'medium'
                              ? 'text-yellow-500'
                              : 'text-green-500'
                        }`}
                      >
                        Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </>
            )}

            {/* Step 3: Terms */}
            {step === 3 && (
              <>
                <motion.div variants={itemVariants} className="space-y-4">
                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      id="terms"
                      checked={formData.agreeToTerms}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 mt-1 accent-[#005F54] rounded cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                      I agree to the{' '}
                      <button type="button" className="text-[#005F54] font-semibold hover:underline">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-[#005F54] font-semibold hover:underline">
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  {/* Benefits */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-4">Why join KHIDMAT?</p>
                    <div className="space-y-3">
                      {[
                        { icon: '✓', label: 'Verified Providers' },
                        { icon: '🔒', label: 'Secure Payments' },
                        { icon: '🕒', label: '24/7 Support' },
                        { icon: '💰', label: 'Best Prices' },
                      ].map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <span className="text-lg">{benefit.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{benefit.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}

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

            {/* Navigation Buttons */}
            <motion.div variants={itemVariants} className="flex gap-3 pt-4">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 rounded-2xl font-bold text-[#005F54] border-2 border-[#005F54] hover:bg-gray-50 transition-all"
                >
                  Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-[#005F54] to-[#00B4D8] hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {step < 3 ? (
                  <>
                    Next
                    <ChevronRight size={20} />
                  </>
                ) : loading ? (
                  'Creating Account...'
                ) : (
                  <>
                    Create Account
                    <Check size={20} />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Sign In Link */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/customer-signin')}
                className="text-[#005F54] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Spacing */}
      <div className="h-12" />
    </div>
  );
}
