import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MessageCircle, Navigation, 
  Clock, CheckCircle, Star, Copy, Check, X,
  MapPin, User, Calendar, ChevronRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const LiveTracking: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [eta, setEta] = useState(8);
  const [orderStatus, setOrderStatus] = useState<'confirmed' | 'assigned' | 'onway' | 'completed'>('onway');
  const [showCopied, setShowCopied] = useState(false);

  // ETA countdown
  useEffect(() => {
    if (orderStatus === 'onway' && eta > 0) {
      const timer = setInterval(() => {
        setEta(prev => {
          if (prev <= 1) {
            setOrderStatus('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [orderStatus, eta]);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText('KH-12345');
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      alert('Order cancelled');
      navigate('/customer-orders');
    }
  };

  const getStatusBadge = () => {
    switch(orderStatus) {
      case 'confirmed': return { text: 'Confirmed', color: 'bg-blue-500' };
      case 'assigned': return { text: 'Assigned', color: 'bg-yellow-500' };
      case 'onway': return { text: 'On the Way', color: 'bg-orange-500' };
      case 'completed': return { text: 'Completed', color: 'bg-green-500' };
      default: return { text: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-emerald-700 flex-1">Track Order</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* Order ID */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <span className="text-sm text-gray-500">Order ID</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">KH-12345</span>
            <button onClick={handleCopyOrderId} className="p-1 hover:bg-gray-100 rounded">
              {showCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Map Placeholder - Static but professional */}
      <div className="mx-4 mt-4">
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Estimated Arrival</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold tracking-tight">{eta}</span>
                <span className="text-xl font-medium text-white/80 mb-1">min</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/80">Provider is on the way</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Navigation size={32} className="text-white" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative z-10 mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${(8 - eta) / 8 * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Provider Info */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <img 
              src="https://ui-avatars.com/api/?name=Ahmed+Raza&background=005F54&color=fff&size=60"
              alt="Provider"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">Ahmed Raza</h3>
                <div className="flex items-center gap-0.5">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold">4.9</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">Plumber</p>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> ETA {eta} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Progress</h3>
          <div className="relative flex justify-between">
            {/* Line behind */}
            <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 rounded-full"
                style={{ 
                  width: orderStatus === 'confirmed' ? '25%' : 
                         orderStatus === 'assigned' ? '50%' : 
                         orderStatus === 'onway' ? '75%' : '100%' 
                }}
              />
            </div>

            {['confirmed', 'assigned', 'onway', 'completed'].map((step, idx) => {
              const isActive = orderStatus === step;
              const isCompleted = ['confirmed', 'assigned', 'onway', 'completed'].indexOf(step) <= 
                                  ['confirmed', 'assigned', 'onway', 'completed'].indexOf(orderStatus);
              
              return (
                <div key={step} className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-200 text-gray-400'
                  } ${isActive ? 'ring-4 ring-emerald-500/20 scale-110' : ''}`}>
                    {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 mt-2 text-center leading-tight">
                    {step === 'confirmed' ? 'Confirm' : 
                     step === 'assigned' ? 'Assign' : 
                     step === 'onway' ? 'On Way' : 'Complete'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-xl transition active:scale-95">
            <Phone size={18} /> Call
          </button>
          <button className="bg-white text-emerald-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-emerald-600/20 hover:bg-emerald-50 transition active:scale-95">
            <MessageCircle size={18} /> Chat
          </button>
          <button className="bg-white text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 transition active:scale-95">
            <Navigation size={18} /> Track
          </button>
        </div>
      </div>

      {/* Cancel Button */}
      {orderStatus !== 'completed' && (
        <div className="mx-4 mt-4">
          <button 
            onClick={handleCancelOrder}
            className="w-full border-2 border-red-500 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition active:scale-95"
          >
            Cancel Order
          </button>
        </div>
      )}

      {/* Completed State */}
      {orderStatus === 'completed' && (
        <div className="mx-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-700">Service Complete! 🎉</h3>
            <p className="text-sm text-green-600">Thank you for choosing KHIDMAT</p>
            <button 
              onClick={() => navigate('/customer-home')}
              className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;