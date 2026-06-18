import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Wrench,
  Calendar,
  ArrowRight,
  Phone,
  MessageCircle,
  Video,
  Award,
  Briefcase,
  Users,
  Clock,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';

const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user } = useApp();
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<number>(5);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [selectedPayment, setSelectedPayment] = useState('jazzcash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const savedProvider = localStorage.getItem('selectedProvider');
    if (savedProvider) {
      setSelectedProvider(JSON.parse(savedProvider));
      localStorage.removeItem('selectedProvider');
    }
    setLoading(false);
  }, []);

  // ✅ ALL 12 MONTHS
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // ✅ DATES 1-31
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  // ✅ ALL TIMES - 7 AM to 10 PM (30 min intervals)
  const generateTimes = () => {
    const times = [];
    for (let hour = 7; hour <= 22; hour++) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour > 12 ? hour - 12 : hour;
      if (hour === 12) {
        times.push('12:00 PM');
      } else {
        times.push(`${hour12}:00 ${ampm}`);
        times.push(`${hour12}:30 ${ampm}`);
      }
    }
    return times;
  };
  const times = generateTimes();

  const handleBooking = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const storedUser = localStorage.getItem('khidmat_user');
      const currentUser = storedUser ? JSON.parse(storedUser) : user;

      if (!currentUser || !currentUser.id) {
        alert('Please login to continue');
        return;
      }

      const bookingId = 'KH-' + Date.now();

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            booking_id: bookingId,
            customer_id: currentUser.id,
            provider_id: selectedProvider?.id,
            service: selectedProvider?.category || 'Service',
            booking_date: `2026-06-${selectedDate}`,
            booking_time: selectedTime,
            amount: selectedProvider?.price || 800,
            status: 'confirmed',
            payment_method: selectedPayment,
            customer_address: profile?.address || 'Not provided',
            customer_phone: profile?.phone || currentUser?.phone || 'Not provided',
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        alert('Booking failed: ' + error.message);
        return;
      }

      alert('Booking confirmed successfully!');
      setShowPaymentModal(false);
      navigate('/customer-orders');
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!selectedProvider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">No Provider Selected</h2>
          <button onClick={() => navigate('/customer-home')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl">
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Back Button & Header */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-md">
          <ArrowRight size={20} className="rotate-180 text-gray-700" />
        </button>
        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold text-emerald-600">KHIDMAT</span>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Profile Card with Curved Overlay */}
      <div className="relative mt-2 mx-4">
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-3xl h-48 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/220429/pexels-photo-220429.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 rounded-t-3xl"></div>
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-white p-1 shadow-xl">
          <img
            src={selectedProvider.avatar || `https://ui-avatars.com/api/?name=${selectedProvider.name.replace(' ', '+')}&background=005F54&color=fff&size=100`}
            alt={selectedProvider.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>

      {/* Provider Info */}
      <div className="mt-16 text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">{selectedProvider.name}</h1>
        <div className="flex items-center justify-center gap-2 text-gray-500 mt-1">
          <span className="font-semibold text-emerald-600">{selectedProvider.category}</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400">{selectedProvider.city}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-gray-800">{selectedProvider.rating}</span>
          <span className="text-gray-400">• {selectedProvider.reviews || 245} reviews</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex justify-center gap-4 mt-4 px-4">
        <button className="flex flex-col items-center gap-1 p-3 bg-emerald-50 rounded-2xl w-20 hover:bg-emerald-100 transition">
          <Phone className="w-6 h-6 text-emerald-600" />
          <span className="text-xs text-gray-600">Call</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-3 bg-emerald-50 rounded-2xl w-20 hover:bg-emerald-100 transition">
          <MessageCircle className="w-6 h-6 text-emerald-600" />
          <span className="text-xs text-gray-600">Chat</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-3 bg-emerald-50 rounded-2xl w-20 hover:bg-emerald-100 transition">
          <Video className="w-6 h-6 text-emerald-600" />
          <span className="text-xs text-gray-600">Video</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex justify-around bg-white mx-4 mt-4 rounded-2xl py-4 shadow-sm">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-600">
            <Award className="w-4 h-4" />
            <span className="font-bold text-gray-800">{selectedProvider.experience || '8+ yrs'}</span>
          </div>
          <span className="text-xs text-gray-400">Experience</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-600">
            <Briefcase className="w-4 h-4" />
            <span className="font-bold text-gray-800">{selectedProvider.jobs || 245}</span>
          </div>
          <span className="text-xs text-gray-400">Jobs</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-600">
            <Users className="w-4 h-4" />
            <span className="font-bold text-gray-800">{selectedProvider.rating}</span>
          </div>
          <span className="text-xs text-gray-400">Reviews</span>
        </div>
      </div>

      {/* Select Date */}
      <div className="mt-6 px-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          Select Date
        </h3>
        {/* Month Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                selectedMonth === month
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
        {/* Date Grid */}
        <div className="grid grid-cols-7 gap-2 mt-3">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition ${
                selectedDate === date
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Select Time */}
      <div className="mt-4 px-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          Select Time
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition ${
                selectedTime === time
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Book Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 max-w-md mx-auto shadow-lg">
        <button
          onClick={handleBooking}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition"
        >
          Book Appointment - Rs {selectedProvider.price}/hr <ArrowRight size={20} />
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Payment Method</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-1">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {['jazzcash', 'easypaisa', 'credit', 'cash'].map((method) => (
                <label key={method} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={selectedPayment === method}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className="capitalize font-semibold text-gray-700 dark:text-gray-300">
                    {method === 'jazzcash' ? 'JazzCash' :
                     method === 'easypaisa' ? 'Easypaisa' :
                     method === 'credit' ? 'Credit Card' : 'Cash on Service'}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;