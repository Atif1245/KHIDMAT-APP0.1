import React, { useState, useEffect } from 'react';
import { Menu, Bell, Circle, MapPin, Clock, CheckCircle2, X, Star, Briefcase, Wallet, User, Home, TrendingUp, XCircle, Clock4, Navigation, MapPinned } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard: React.FC = () => {
  const { setSidebarOpen, user, profile } = useApp();
  const navigate = useNavigate();
  const [jobCount, setJobCount] = useState(0);
  const [earningsCount, setEarningsCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [providerCity, setProviderCity] = useState(profile?.city || 'Lahore');
  const [providerCategory, setProviderCategory] = useState(profile?.category || 'Plumber');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    if (profile) {
      setProviderCity(profile.city);
      setProviderCategory(profile.category);
    }
  }, [profile]);

  useEffect(() => {
    const t = setInterval(() => setJobCount(p => (p < 3 ? p + 1 : 3)), 300);
    return () => clearInterval(t);
  }, []);
  
  useEffect(() => {
    const t = setInterval(() => setEarningsCount(p => (p < 4500 ? p + 300 : 4500)), 50);
    return () => clearInterval(t);
  }, []);
  
  useEffect(() => {
    const t = setInterval(() => setRatingCount(p => (p < 4.9 ? parseFloat((p + 0.2).toFixed(1)) : 4.9)), 100);
    return () => clearInterval(t);
  }, []);

  const requests = [
    { id: '1', customerName: 'Fatima Ali', service: 'Pipe Installation', budget: 'Rs 1,500', address: 'House 42, Block D, Defence' },
    { id: '2', customerName: 'Hassan Khan', service: 'General Maintenance', budget: 'Rs 800', address: 'Flat 7, Main Blvd, Gulberg' },
  ];

  const jobsData = [
    { id: '1', customer: 'Fatima Ali', service: 'Pipe Installation', status: 'waiting', address: 'House 42, Block D, Defence', time: '2:00 PM' },
    { id: '2', customer: 'Hassan Khan', service: 'General Maintenance', status: 'waiting', address: 'Flat 7, Main Blvd, Gulberg', time: '4:30 PM' },
    { id: '3', customer: 'Sara Ahmed', service: 'Leak Fix', status: 'completed', address: 'House 88, DHA Phase 5', time: '10:00 AM' },
    { id: '4', customer: 'Ali Raza', service: 'Installation', status: 'cancelled', address: 'Flat 3, Johar Town', time: '11:30 AM' },
  ];

  const totalOrders = jobsData.length;
  const totalCompleted = jobsData.filter(j => j.status === 'completed').length;
  const totalCancelled = jobsData.filter(j => j.status === 'cancelled').length;
  const waitingJobs = jobsData.filter(j => j.status === 'waiting');

  const providerName = profile?.name || user?.name || 'Ahmed Raza';
  
  const getProfileImage = () => {
    if (profile?.profileImage) {
      return profile.profileImage;
    }
    return `https://ui-avatars.com/api/?name=${providerName.replace(' ', '+')}&background=005F54&color=fff&size=100`;
  };

  const pakistanCities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Sialkot', 'Gujranwala'];
  const categoriesList = ['Plumber', 'Electrician', 'AC Repair', 'Carpenter', 'Painter', 'Mechanic'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
            <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>

          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">KHIDMAT</h1>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">خدمات آپ کے گھر پر</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-1 relative">
                <Bell className="w-6 h-6 text-gray-800 dark:text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">2</span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border p-4 z-50">
                  <h4 className="font-bold mb-3">Notifications</h4>
                  <div className="space-y-3">
                    <p className="text-sm">New job request from Fatima Ali</p>
                    <p className="text-xs text-gray-400">2 min ago</p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-600">
                <img src={getProfileImage()} alt="" className="w-full h-full object-cover" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border p-4 z-50">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                    <img src={getProfileImage()} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold text-sm">{providerName}</p>
                      <p className="text-xs text-gray-400">{providerCategory}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/provider-profile')} className="w-full text-left text-sm py-2">View Profile</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-5">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={getProfileImage()} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600" />
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{providerName}</h3>
                  <div className="flex gap-3 mt-1">
                    <button onClick={() => setShowCityPicker(true)} className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" /> {providerCity}
                    </button>
                    <button onClick={() => setShowCategoryPicker(true)} className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <Briefcase className="w-3 h-3" /> {providerCategory}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-2xl p-4 text-white text-center">
                <p className="text-xs">Jobs Today</p>
                <p className="text-3xl font-bold">{jobCount}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl p-4 text-white text-center">
                <p className="text-xs">Earnings</p>
                <p className="text-xl font-bold">Rs {Math.floor(earningsCount / 1000)}k</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl p-4 text-white text-center">
                <p className="text-xs">Rating</p>
                <p className="text-3xl font-bold">{ratingCount.toFixed(1)}</p>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border-l-4 border-green-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{isAvailable ? 'AVAILABLE FOR WORK' : 'UNAVAILABLE'}</p>
                  <p className="text-xs text-gray-500">کام کے لیے دستیاب</p>
                </div>
                <button onClick={() => setIsAvailable(!isAvailable)} className={`relative w-12 h-7 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* Current Job */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border-l-4 border-orange-500">
              <p className="text-xs text-gray-500 mb-1">Current Job</p>
              <p className="font-bold text-lg">Sara Khan</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <MapPin className="w-4 h-4" /> House 88, DHA Phase 5, 1.2 km
              </div>
              <div className="flex gap-3 mt-4">
                <button className="flex-1 bg-emerald-600 text-white py-2 rounded-xl">Navigate</button>
                <button className="flex-1 border border-emerald-600 text-emerald-600 py-2 rounded-xl">Message</button>
              </div>
            </div>

            {/* New Requests */}
            <div>
              <h3 className="font-bold mb-3">New Requests</h3>
              {requests.map(req => (
                <div key={req.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-3">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="font-bold">{req.customerName}</p>
                      <p className="text-sm text-gray-500">{req.service}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">{req.budget}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{req.address}</p>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-green-500 text-white py-2 rounded-xl">Accept</button>
                    <button className="flex-1 border border-gray-300 py-2 rounded-xl">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center">
                <Briefcase className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalOrders}</p>
                <p className="text-xs">Total Orders</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalCompleted}</p>
                <p className="text-xs">Completed</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center">
                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalCancelled}</p>
                <p className="text-xs">Cancelled</p>
              </div>
            </div>

            <h3 className="font-bold mt-4">Waiting Jobs ({waitingJobs.length})</h3>
            {waitingJobs.map(job => (
              <div key={job.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">{job.customer}</p>
                    <p className="text-sm text-gray-500">{job.service}</p>
                  </div>
                  <span className="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded-full">{job.time}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{job.address}</p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm">Accept</button>
                  <button className="flex-1 border py-2 rounded-xl text-sm">Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-2xl p-5 text-white">
              <p className="text-sm">This Week</p>
              <p className="text-3xl font-bold">Rs 4,500</p>
              <p className="text-sm">+12% vs last week</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5">
              <h3 className="font-bold mb-4">Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Service Income</span><span className="font-bold">Rs 3,800</span></div>
                <div className="flex justify-between"><span>Tips</span><span className="font-bold">Rs 400</span></div>
                <div className="flex justify-between"><span>Bonuses</span><span className="font-bold">Rs 300</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center">
              <img src={getProfileImage()} alt="" className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-emerald-600" />
              <h2 className="text-xl font-bold">{providerName}</h2>
              <p className="text-emerald-600 font-semibold">{providerCategory}</p>
              <p className="text-sm text-gray-500 mt-1">⭐ 4.9 (245 reviews)</p>
              <button onClick={() => navigate('/provider-profile')} className="w-full bg-emerald-600 text-white py-3 rounded-xl mt-4">Edit Profile</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-4 px-4 py-3">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => setActiveTab('jobs')} className={`flex flex-col items-center ${activeTab === 'jobs' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <Briefcase className="w-5 h-5" />
            <span className="text-xs">Jobs</span>
          </button>
          <button onClick={() => setActiveTab('earnings')} className={`flex flex-col items-center ${activeTab === 'earnings' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Earnings</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* City Picker Modal */}
      {showCityPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCityPicker(false)}>
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-4">Select City</h3>
            <div className="grid grid-cols-2 gap-2">
              {pakistanCities.map(city => (
                <button key={city} onClick={() => { setProviderCity(city); setShowCityPicker(false); }} className={`py-3 rounded-xl text-sm font-semibold ${providerCity === city ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Picker Modal */}
      {showCategoryPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCategoryPicker(false)}>
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-4">Select Category</h3>
            <div className="grid grid-cols-2 gap-2">
              {categoriesList.map(cat => (
                <button key={cat} onClick={() => { setProviderCategory(cat); setShowCategoryPicker(false); }} className={`py-3 rounded-xl text-sm font-semibold ${providerCategory === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;