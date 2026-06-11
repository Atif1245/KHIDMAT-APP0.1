import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Check,
  Wrench,
  Calendar,
  ArrowRight,
  Copy,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('jazzcash');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

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

  const servicePrice = 1600;
  const travelPrice = 200;
  const platformFee = 100;
  const taxPrice = 190;
  const subtotal = servicePrice + travelPrice + platformFee + taxPrice;
  const discount = promoApplied ? 200 : 0;
  const totalPrice = subtotal - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  const handleContinue = () => {
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2 && selectedDate && selectedTime) setCurrentStep(3);
    else if (currentStep === 3) setCurrentStep(4);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  // Step 1: Provider Details
  const Step1 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Hero */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-dark to-primary">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/80 dark:to-surface-dark/80" />
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-28 h-28 bg-gradient-to-br from-primary-light to-info rounded-full flex items-center justify-center text-white shadow-xl">
            <Wrench size={56} />
          </div>
        </motion.div>
      </div>

      <div className="px-4 pt-8 pb-24 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">Ahmed Raza</h1>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star size={18} className="fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-600 dark:text-yellow-400 font-semibold">4.9 (428 reviews)</span>
          </div>
          <p className="text-primary dark:text-primary-bright text-lg font-semibold">Plumber</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-surface-card rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-navy dark:text-white font-bold mb-4">Services</h3>
          <div className="space-y-3">
            {[
              { name: 'Pipe Repair', price: 'Rs 800' },
              { name: 'Leak Fix', price: 'Rs 600' },
              { name: 'Installation', price: 'Rs 1,200' },
              { name: 'Consultation', price: 'Rs 300' },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex justify-between items-center text-navy/70 dark:text-gray-400 pb-3 border-b border-gray-100 dark:border-surface-light last:border-0"
              >
                <span className="text-sm">{service.name}</span>
                <span className="text-primary dark:text-primary-bright font-semibold">{service.price}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sticky Bottom */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-surface-card/90 backdrop-blur-lg px-4 py-5 max-w-md mx-auto border-t border-gray-100 dark:border-surface-light"
      >
        <div className="text-center mb-3">
          <span className="text-navy dark:text-white text-2xl font-bold">Rs 800<span className="text-gray-400 text-lg">/hour</span></span>
        </div>
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-primary to-info hover:from-primary-dark hover:to-info text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Book Now <ArrowRight size={20} />
        </button>
      </motion.div>
    </motion.div>
  );

  // Step 2: Select Date & Time
  const Step2 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="min-h-screen bg-surface dark:bg-surface-dark px-4 pt-8 pb-24 max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-2xl font-bold text-navy dark:text-white mb-6">Select Date & Time</h2>

        <div className="bg-white dark:bg-surface-card rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-navy dark:text-white font-bold mb-4">June 2026</h3>
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-gray-400 text-xs font-semibold py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => day.available && day.isCurrentMonth && setSelectedDate(day.date)}
                disabled={!day.available || !day.isCurrentMonth}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  !day.isCurrentMonth ? 'bg-transparent text-gray-300 dark:text-gray-600'
                    : !day.available ? 'bg-gray-100 dark:bg-surface-light text-gray-400 cursor-not-allowed'
                      : selectedDate === day.date ? 'bg-gradient-to-br from-primary to-info text-white shadow-md'
                        : 'bg-gray-50 dark:bg-surface-light text-navy dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-card'
                }`}
              >
                {day.isCurrentMonth ? day.date : ''}
              </motion.button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-surface-card rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="text-navy dark:text-white font-bold mb-4">Available Times - June {selectedDate}</h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                    !slot.available ? 'bg-gray-100 dark:bg-surface-light text-gray-400 cursor-not-allowed'
                      : selectedTime === slot.time ? 'bg-gradient-to-br from-primary to-info text-white shadow-md'
                        : 'bg-gray-50 dark:bg-surface-light text-navy dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-card'
                  }`}
                >
                  {slot.time}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-surface-card/90 backdrop-blur-lg px-4 py-5 max-w-md mx-auto border-t border-gray-100 dark:border-surface-light"
      >
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
            selectedDate && selectedTime
              ? 'bg-gradient-to-r from-primary to-info hover:from-primary-dark hover:to-info text-white'
              : 'bg-gray-200 dark:bg-surface-light text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue <ArrowRight size={20} />
        </button>
      </motion.div>
    </motion.div>
  );

  // Step 3: Order Summary
  const Step3 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="min-h-screen bg-surface dark:bg-surface-dark px-4 pt-8 pb-24 max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { label: 'Details', completed: true },
            { label: 'Payment', completed: true },
            { label: 'Confirm', completed: false },
          ].map((step, idx) => (
            <React.Fragment key={idx}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  step.completed ? 'bg-gradient-to-br from-primary to-info text-white'
                    : 'bg-gray-200 dark:bg-surface-light text-gray-400'
                }`}
              >
                {step.completed ? <Check size={18} /> : idx + 1}
              </motion.div>
              {idx < 2 && (
                <div className={`h-0.5 w-8 ${idx < 1 ? 'bg-gradient-to-r from-primary to-info' : 'bg-gray-200 dark:bg-surface-light'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-navy dark:text-white mb-6">Order Summary</h2>

        {/* Provider Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-surface-card rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center text-white flex-shrink-0">
              <Wrench size={28} />
            </div>
            <div>
              <h3 className="font-bold text-navy dark:text-white">Ahmed Raza</h3>
              <div className="flex items-center gap-1 text-yellow-500 text-sm">
                <Star size={14} className="fill-yellow-400" />
                <span>4.9 (428)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Date & Time & Location */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white dark:bg-surface-card rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mb-3 text-sm">
            <Calendar size={18} className="text-primary dark:text-primary-bright" />
            <span>June {selectedDate}, 2026 at {selectedTime}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
            <MapPin size={18} className="text-primary dark:text-primary-bright" />
            <span>Lahore, Pakistan</span>
          </div>
        </motion.div>

        {/* Price Breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-surface-card rounded-2xl p-6 mb-4 shadow-sm">
          <h3 className="font-bold text-navy dark:text-white mb-4">Price Breakdown</h3>
          <div className="space-y-3 mb-4 pb-4 border-b border-gray-100 dark:border-surface-light">
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm"><span>Service (2 hrs)</span><span>Rs {servicePrice.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm"><span>Travel</span><span>Rs {travelPrice.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm"><span>Platform Fee</span><span>Rs {platformFee.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm"><span>Tax</span><span>Rs {taxPrice.toLocaleString()}</span></div>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-success text-sm mb-3"><span>Discount</span><span>-Rs {discount.toLocaleString()}</span></div>
          )}
          <div className="flex justify-between text-navy dark:text-white font-bold text-lg">
            <span>Total</span><span>Rs {totalPrice.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Promo Code */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={promoApplied}
            className="flex-1 bg-white dark:bg-surface-card text-navy dark:text-white rounded-xl px-4 py-3 border border-gray-200 dark:border-surface-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
          <button
            onClick={handleApplyPromo}
            disabled={promoApplied}
            className="px-4 py-3 bg-primary dark:bg-primary-bright text-white rounded-xl font-semibold transition-all disabled:opacity-50 text-sm"
          >
            {promoApplied ? 'Applied' : 'Apply'}
          </button>
        </motion.div>

        {/* Payment Methods */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-surface-card rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="font-bold text-navy dark:text-white mb-4">Payment Method</h3>
          <div className="space-y-3">
            {[
              { id: 'jazzcash', name: 'JazzCash' },
              { id: 'easypaisa', name: 'Easypaisa' },
              { id: 'credit', name: 'Credit Card' },
              { id: 'cash', name: 'Cash' },
              { id: 'afterwork', name: 'After Work' },
            ].map((method) => (
              <label key={method.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-light transition-all">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-navy dark:text-gray-300 font-semibold flex-1 text-sm">{method.name}</span>
              </label>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Confirm Button */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-surface-card/90 backdrop-blur-lg px-4 py-5 max-w-md mx-auto border-t border-gray-100 dark:border-surface-light"
      >
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-primary to-info hover:from-primary-dark hover:to-info text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Confirm Booking <ArrowRight size={20} />
        </button>
      </motion.div>
    </motion.div>
  );

  // Step 4: Success
  const Step4 = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-surface dark:bg-surface-dark px-4 pt-8 pb-24 max-w-md mx-auto flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated circles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0], opacity: [0, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          className="absolute w-20 h-20 rounded-full bg-primary"
          style={{ left: `${15 + i * 15}%`, top: `${25 + (i % 2) * 25}%` }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="relative z-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="w-24 h-24 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
        >
          <Check size={48} className="text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-navy dark:text-white mb-6">Booking Confirmed!</h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-surface-card rounded-2xl p-6 mb-6 w-full shadow-sm"
        >
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-1">Order ID</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-primary dark:text-primary-bright">#KH-12345</span>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 hover:bg-gray-100 dark:hover:bg-surface-light rounded-lg transition-all">
                <Copy size={18} className="text-gray-400" />
              </motion.button>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-surface-light pt-4">
            <p className="text-gray-400 text-sm mb-1">ETA</p>
            <p className="text-3xl font-bold text-navy dark:text-white">8 minutes</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <button
            onClick={() => navigate('/tracking')}
            className="w-full bg-gradient-to-r from-primary to-info hover:from-primary-dark hover:to-info text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Track Order <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/customer-home')}
            className="w-full border-2 border-primary dark:border-primary-bright text-primary dark:text-primary-bright hover:bg-primary hover:text-white dark:hover:bg-primary-bright dark:hover:text-surface-dark font-bold py-4 rounded-xl transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </motion.div>
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
