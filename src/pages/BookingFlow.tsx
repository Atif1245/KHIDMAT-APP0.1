import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Check,
  Wrench,
  Calendar,
  ArrowRight,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  available: boolean;
}

const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user } = useApp();
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('jazzcash');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedProvider = localStorage.getItem('selectedProvider');
    if (savedProvider) {
      setSelectedProvider(JSON.parse(savedProvider));
      localStorage.removeItem('selectedProvider');
    }
    setLoading(false);
  }, []);

  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true },
    { time: '1:00 PM', available: true },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: false },
    { time: '4:00 PM', available: true },
    { time: '5:00 PM', available: true },
  ];

  const generateCalendar = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const firstDayOfWeek = 1;
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: 0, isCurrentMonth: false, available: false });
    }
    for (let i = 1; i <= 30; i++) {
      days.push({ date: i, isCurrentMonth: true, available: i >= 7 });
    }
    return days;
  };

  const calendarDays = generateCalendar();

  const calculatePrice = () => {
    const basePrice = selectedProvider?.price || 800;
    const travelFee = 200;
    const platformFee = 100;
    const tax = Math.round((basePrice + travelFee + platformFee) * 0.1);
    const total = basePrice + travelFee + platformFee + tax;
    return { base: basePrice, travel: travelFee, platform: platformFee, tax: tax, total: total };
  };

  const price = calculatePrice();
  const subtotal = price.base + price.travel + price.platform + price.tax;
  const discount = promoApplied ? 200 : 0;
  const totalPrice = subtotal - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  // ✅ FINAL FIXED VERSION - Direct provider ID use karo
  const saveBookingToDatabase = async () => {
    setIsSaving(true);
    setBookingError('');

    try {
      const storedUser = localStorage.getItem('khidmat_user');
      const currentUser = storedUser ? JSON.parse(storedUser) : user;

      if (!currentUser || !currentUser.id) {
        setBookingError('Please login to continue');
        setIsSaving(false);
        return false;
      }

      // ✅ DIRECTLY USE PROVIDER ID (NO DATABASE QUERY!)
      const providerId = selectedProvider?.id;
      
      console.log('Provider ID from localStorage:', providerId);
      console.log('Provider name:', selectedProvider?.name);
      console.log('Provider city:', selectedProvider?.city);
      
      if (!providerId) {
        setBookingError('Invalid provider. Please try again.');
        setIsSaving(false);
        return false;
      }

      const bookingId = 'KH-' + Date.now();

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            booking_id: bookingId,
            customer_id: currentUser.id,
            provider_id: providerId,
            service: selectedProvider?.category || 'Service',
            booking_date: `2026-06-${selectedDate}`,
            booking_time: selectedTime,
            amount: totalPrice,
            status: 'confirmed',
            payment_method: selectedPayment,
            customer_address: profile?.address || 'Not provided',
            customer_phone: profile?.phone || currentUser?.phone || 'Not provided',
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        setBookingError(error.message || 'Failed to save booking');
        setIsSaving(false);
        return false;
      }

      console.log('Booking saved successfully!');
      setIsSaving(false);
      return true;
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError('Something went wrong. Please try again.');
      setIsSaving(false);
      return false;
    }
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedDate && selectedTime) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const success = await saveBookingToDatabase();
      if (success) {
        setCurrentStep(4);
      }
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedProvider) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Provider Selected</h2>
          <p className="text-gray-500 mb-6">Please select a service provider first.</p>
          <button 
            onClick={() => navigate('/customer-home')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Provider Details
  const Step1 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-600">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/80 dark:to-gray-900/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={selectedProvider.avatar || `https://ui-avatars.com/api/?name=${selectedProvider.name.replace(' ', '+')}&background=005F54&color=fff&size=100`}
            alt={selectedProvider.name}
            className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-xl"
          />
        </div>
      </div>

      <div className="px-4 pt-8 pb-24 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{selectedProvider.name}</h1>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{selectedProvider.rating} ({selectedProvider.reviews} reviews)</span>
          </div>
          <p className="text-emerald-600 font-semibold">{selectedProvider.category}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Services</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span>{selectedProvider.category} Service</span>
              <span className="font-semibold text-emerald-600">Rs {selectedProvider.price}/hour</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span>Travel Fee</span>
              <span className="font-semibold text-emerald-600">Rs 200</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Platform Fee</span>
              <span className="font-semibold text-emerald-600">Rs 100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg px-4 py-5 max-w-md mx-auto border-t border-gray-200 dark:border-gray-700">
        <div className="text-center mb-3">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">Rs {selectedProvider.price}<span className="text-gray-400 text-lg">/hour</span></span>
        </div>
        <button
          onClick={handleContinue}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Book Now <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );

  // Step 2: Select Date & Time (keep your existing code)
  const Step2 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 pt-8 pb-24 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Select Date & Time</h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">June 2026</h3>
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-gray-400 text-xs font-semibold py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => (
            <button
              key={idx}
              onClick={() => day.available && day.isCurrentMonth && setSelectedDate(day.date)}
              disabled={!day.available || !day.isCurrentMonth}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !day.isCurrentMonth ? 'bg-transparent text-gray-300'
                  : !day.available ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : selectedDate === day.date ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              {day.isCurrentMonth ? day.date : ''}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Available Times - June {selectedDate}</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                  !slot.available ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : selectedTime === slot.time ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-100'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg px-4 py-5 max-w-md mx-auto border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            selectedDate && selectedTime
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );

  // Step 3: Order Summary (keep your existing code)
  const Step3 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 pt-8 pb-24 max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 mb-8">
        {[
          { label: 'Details', completed: true },
          { label: 'Payment', completed: true },
          { label: 'Confirm', completed: false },
        ].map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
              step.completed ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
            }`}>
              {step.completed ? <Check size={18} /> : idx + 1}
            </div>
            {idx < 2 && <div className={`h-0.5 w-8 ${idx < 1 ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order Summary</h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex gap-4">
          <img 
            src={selectedProvider.avatar || `https://ui-avatars.com/api/?name=${selectedProvider.name.replace(' ', '+')}&background=005F54&color=fff`}
            alt={selectedProvider.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white">{selectedProvider.name}</h3>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400" />
              <span>{selectedProvider.rating} ({selectedProvider.reviews})</span>
            </div>
            <p className="text-xs text-gray-500">{selectedProvider.category}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3 text-gray-600 mb-2">
          <Calendar size={18} className="text-emerald-600" />
          <span>June {selectedDate}, 2026 at {selectedTime}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <MapPin size={18} className="text-emerald-600" />
          <span>{profile?.city || 'Lahore'}, Pakistan</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">Price Breakdown</h3>
        <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
          <div className="flex justify-between"><span>Service (2 hrs)</span><span>Rs {price.base}</span></div>
          <div className="flex justify-between"><span>Travel</span><span>Rs {price.travel}</span></div>
          <div className="flex justify-between"><span>Platform Fee</span><span>Rs {price.platform}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>Rs {price.tax}</span></div>
        </div>
        {promoApplied && <div className="flex justify-between text-green-600 mb-3"><span>Discount</span><span>-Rs {discount}</span></div>}
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span><span className="text-emerald-600">Rs {totalPrice}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          name="promoCode"
          placeholder="Promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          disabled={promoApplied}
          className="flex-1 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
        />
        <button
          onClick={handleApplyPromo}
          disabled={promoApplied}
          className="px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50"
        >
          {promoApplied ? 'Applied' : 'Apply'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">Payment Method</h3>
        <div className="space-y-3">
          {['jazzcash', 'easypaisa', 'credit', 'cash'].map((method) => (
            <label key={method} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={selectedPayment === method}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="w-4 h-4 accent-emerald-600"
              />
              <span className="capitalize font-semibold text-gray-700">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {bookingError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          {bookingError}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg px-4 py-5 max-w-md mx-auto border-t border-gray-200">
        <button
          onClick={handleContinue}
          disabled={isSaving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSaving ? 'Processing...' : 'Confirm Booking'} <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );

  // Step 4: Success
  const Step4 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
        <Check size={48} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Booking Confirmed!</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 w-full max-w-md text-center shadow-sm">
        <p className="text-gray-400 text-sm mb-1">Order ID</p>
        <p className="text-2xl font-bold text-emerald-600">KH-{Date.now().toString().slice(-6)}</p>
        <div className="border-t pt-4 mt-4">
          <p className="text-gray-400 text-sm mb-1">ETA</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">15-20 minutes</p>
        </div>
      </div>
      <div className="space-y-3 w-full max-w-md">
        <button onClick={() => navigate('/customer-orders')} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl">View Orders</button>
        <button onClick={() => navigate('/customer-home')} className="w-full border-2 border-emerald-600 text-emerald-600 font-bold py-4 rounded-xl">Back to Home</button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {currentStep === 1 && <Step1 key="step1" />}
      {currentStep === 2 && <Step2 key="step2" />}
      {currentStep === 3 && <Step3 key="step3" />}
      {currentStep === 4 && <Step4 key="step4" />}
    </AnimatePresence>
  );
};

export default BookingFlow; 