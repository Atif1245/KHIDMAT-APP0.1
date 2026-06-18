import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MessageCircle, Navigation, 
  Clock, MapPin, CheckCircle, AlertCircle,
  Star, User, Calendar, ChevronRight, 
  Share2, HelpCircle, Copy, Check,
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

// ✅ CORRECT Leaflet imports
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ✅ Fix default marker icons - CORRECT way
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LiveTracking: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [eta, setEta] = useState(8);
  const [orderStatus, setOrderStatus] = useState<'confirmed' | 'assigned' | 'onway' | 'completed'>('onway');
  const [providerLocation, setProviderLocation] = useState<[number, number]>([31.5204, 74.3587]);
  const [customerLocation] = useState<[number, number]>([31.5154, 74.3517]);
  const [showCopied, setShowCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Simulate ETA countdown
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

  // Simulate provider movement
  useEffect(() => {
    if (orderStatus === 'onway') {
      const timer = setInterval(() => {
        setProviderLocation(prev => {
          const lat = prev[0] + 0.0003;
          const lng = prev[1] + 0.0004;
          return [lat, lng];
        });
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [orderStatus]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'from-blue-500 to-blue-400';
      case 'assigned': return 'from-yellow-500 to-yellow-400';
      case 'onway': return 'from-orange-500 to-orange-400';
      case 'completed': return 'from-green-500 to-green-400';
      default: return 'from-gray-400 to-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'assigned': return 'Assigned';
      case 'onway': return 'On the Way';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getStatusDotColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-blue-500';
      case 'assigned': return 'bg-yellow-500';
      case 'onway': return 'bg-orange-500 animate-pulse';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

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

  const routeCoordinates: [number, number][] = [
    [31.5154, 74.3517],
    [31.5180, 74.3540],
    [31.5204, 74.3587],
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-0">
        <span className="text-9xl font-bold text-[#005F54] tracking-widest">KHIDMAT</span>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#0A1628] tracking-tight">Live Tracking</h1>
            <p className="text-xs text-gray-500">Order #KH-12345</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getStatusColor(orderStatus)} text-white text-xs font-semibold shadow-lg`}>
            <span className={`w-2 h-2 rounded-full ${getStatusDotColor(orderStatus)}`}></span>
            {getStatusLabel(orderStatus)}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative mx-4 mt-4 rounded-3xl overflow-hidden shadow-2xl" style={{ height: '42vh' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#005F54]/5 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F7FA] to-transparent z-10 pointer-events-none" />
        
        <MapContainer 
          center={providerLocation} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          {/* Route path */}
          <Polyline 
            positions={routeCoordinates} 
            color="#005F54" 
            weight={3} 
            dashArray="8,8"
            opacity={0.6}
          />
          
          {/* Customer marker */}
          <Marker position={customerLocation}>
            <Popup>Your Location</Popup>
          </Marker>
          
          {/* Provider marker with simple circle */}
          <Marker position={providerLocation}>
            <Popup>Provider is on the way!</Popup>
          </Marker>
        </MapContainer>

        {/* Map overlay controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition">
            <span className="text-lg font-bold text-gray-700">+</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition">
            <span className="text-lg font-bold text-gray-700">−</span>
          </button>
        </div>

        {/* Distance badge */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/20">
          <div className="flex items-center gap-2">
            <Navigation size={14} className="text-[#005F54]" />
            <span className="text-sm font-semibold text-gray-700">2.3 km away</span>
          </div>
        </div>
      </div>

      {/* Provider Card - Glassmorphism */}
      <div className="relative -mt-8 mx-4 z-20">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="https://ui-avatars.com/api/?name=Ahmed+Raza&background=005F54&color=fff&size=80"
                alt="Provider"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#005F54]"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0A1628] text-lg">Ahmed Raza</h3>
                <div className="flex items-center gap-0.5">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-700">4.98</span>
                </div>
                <span className="bg-blue-500/10 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-semibold">Verified</span>
              </div>
              <p className="text-sm text-gray-500">Professional Plumber</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> ETA {eta} min
                </span>
              </div>
            </div>
            <button className="w-10 h-10 bg-[#005F54]/10 rounded-full flex items-center justify-center hover:bg-[#005F54]/20 transition">
              <ChevronRight size={18} className="text-[#005F54]" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100/50">
            <div className="text-center">
              <p className="text-lg font-bold text-[#0A1628]">8+</p>
              <p className="text-xs text-gray-500">Years Exp</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#0A1628]">245</p>
              <p className="text-xs text-gray-500">Jobs Done</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#0A1628]">4.98</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* ETA Hero Display */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-br from-[#005F54] to-[#00B4D8] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
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
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="white/20" strokeWidth="4" fill="none" />
                <circle 
                  cx="40" cy="40" r="32" 
                  stroke="white" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeDasharray={`${(8 - eta / 10) * 20.1} 201`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock size={24} className="text-white/80" />
              </div>
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

      {/* Timeline */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Progress</h3>
          <div className="relative flex justify-between">
            {/* Line behind */}
            <div className="absolute left-0 right-0 top-5 h-1 bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-[#005F54] to-[#00B4D8] transition-all duration-1000 rounded-full"
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    isCompleted ? 'bg-[#005F54] text-white shadow-lg shadow-[#005F54]/30' : 'bg-gray-100 text-gray-400'
                  } ${isActive ? 'ring-4 ring-[#005F54]/20 scale-110' : ''}`}>
                    {isCompleted ? <CheckCircle size={18} /> : idx + 1}
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
      <div className="px-4 mt-6">
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-gradient-to-r from-[#005F54] to-[#00B4D8] text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#005F54]/30 hover:shadow-xl transition-all active:scale-95">
            <Phone size={18} /> Call
          </button>
          <button className="bg-white text-[#005F54] py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 border border-[#005F54]/20 hover:bg-[#005F54]/5 transition-all active:scale-95">
            <MessageCircle size={18} /> Chat
          </button>
          <button className="bg-white text-gray-700 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
            <Navigation size={18} /> Track
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 mt-6 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCopyOrderId}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              {showCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              <span>{showCopied ? 'Copied!' : 'Copy ID'}</span>
            </button>
            <button 
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              <HelpCircle size={16} /> Help
            </button>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition">
              <Share2 size={16} /> Share
            </button>
          </div>
          {orderStatus !== 'completed' && (
            <button 
              onClick={handleCancelOrder}
              className="text-sm font-semibold text-red-500 hover:text-red-600 transition flex items-center gap-1.5"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Completed State Overlay */}
      {orderStatus === 'completed' && (
        <div className="fixed inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95 z-50 flex items-center justify-center p-6">
          <div className="text-center text-white max-w-sm">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Service Complete! 🎉</h2>
            <p className="text-white/80 mb-6">Thank you for choosing KHIDMAT</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/customer-orders')}
                className="bg-white text-green-600 px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition active:scale-95"
              >
                View Order History
              </button>
              <button 
                onClick={() => navigate('/customer-home')}
                className="text-white/80 hover:text-white transition font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;