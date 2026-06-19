import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MessageCircle, Navigation, 
  Clock, CheckCircle, Star, Copy, Check, X,
  MapPin, User, Calendar, ChevronRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

// ✅ Leaflet imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ✅ Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ✅ Custom car icon
const carIcon = L.divIcon({
  html: `<div style="background: #005F54; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 0 20px rgba(0,95,84,0.5);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// ✅ Simple circle marker for customer
const customerIcon = L.divIcon({
  html: `<div style="background: #EF4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 20px rgba(239,68,68,0.4);"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const LiveTracking: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [eta, setEta] = useState(8);
  const [orderStatus, setOrderStatus] = useState<'confirmed' | 'assigned' | 'onway' | 'completed'>('onway');
  const [showCopied, setShowCopied] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  
  // ✅ Provider location (moving)
  const [providerLocation, setProviderLocation] = useState<[number, number]>([31.5204, 74.3587]);
  const [customerLocation] = useState<[number, number]>([31.5154, 74.3517]);
  
  // ✅ Map ref
  const mapRef = useRef<any>(null);

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

  // ✅ Simulate provider movement
  useEffect(() => {
    if (orderStatus === 'onway') {
      const timer = setInterval(() => {
        setProviderLocation(prev => {
          // Move towards customer (simplified)
          const lat = prev[0] + 0.0005;
          const lng = prev[1] + 0.0004;
          // Check if reached customer
          if (lat >= customerLocation[0] && lng >= customerLocation[1]) {
            return customerLocation;
          }
          return [lat, lng];
        });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [orderStatus, customerLocation]);

  // ✅ Center map when location changes
  useEffect(() => {
    if (mapRef.current && providerLocation) {
      mapRef.current.setView(providerLocation, 15);
    }
  }, [providerLocation]);

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
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
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

      {/* ✅ LIVE MAP */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-lg" style={{ height: '240px' }}>
        <MapContainer
          center={providerLocation}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          {/* ✅ Customer Marker */}
          <Marker position={customerLocation} icon={customerIcon}>
            <Popup>Your Location</Popup>
          </Marker>
          
          {/* ✅ Provider Marker (moving) */}
          <Marker position={providerLocation} icon={carIcon}>
            <Popup>Provider is on the way!</Popup>
          </Marker>
        </MapContainer>
        
        {/* ✅ Map overlay - distance badge */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-lg border border-white/50">
          <div className="flex items-center gap-1.5">
            <Navigation size={14} className="text-emerald-600" />
            <span className="text-xs font-semibold text-gray-700">2.3 km away</span>
          </div>
        </div>
      </div>

      {/* ETA Card */}
      <div className="mx-4 mt-4">
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Estimated Arrival</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight">{eta}</span>
                <span className="text-lg font-medium text-white/80 mb-1">min</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/80">Provider is on the way</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Clock size={28} className="text-white" />
            </div>
          </div>

          <div className="relative z-10 mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
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
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
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