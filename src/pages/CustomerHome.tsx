import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  MapPin,
  AlertCircle,
  Clock,
  Heart,
  History,
  Search,
  Calendar,
  MessageCircle,
  User,
  Home,
  Star,
  CheckCircle,
  ChevronRight,
  Wrench,
  Zap,
  Snowflake,
  BookOpen,
  Sparkles,
  Shield,
  Car,
  Paintbrush,
  ChefHat,
  Hammer,
  Cog,
  X,
  ShoppingBag,
  UserCircle,
  Filter,
  TrendingDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { categories, providers, promoBanners, pakistanCities } from '../data/services';

const iconMap: Record<string, React.ComponentType<any>> = {
  Wrench, Zap, Snowflake, BookOpen, Sparkles, Home, Shield, Car, Paintbrush, ChefHat, Hammer, Cog,
};

export default function CustomerHome() {
  const navigate = useNavigate();
  const { setSidebarOpen, user, profile } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [userCity, setUserCity] = useState(() => {
    const saved = localStorage.getItem('userCity');
    return saved || 'Lahore';
  });
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'price'>('distance');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { t } = useApp();

  // Save city to localStorage
  useEffect(() => {
    localStorage.setItem('userCity', userCity);
  }, [userCity]);

  const providerName = profile?.name || user?.name || 'Ahmed';
  
  const getProfileImage = () => {
    if (profile?.profileImage) {
      return profile.profileImage;
    }
    return `https://ui-avatars.com/api/?name=${providerName.replace(' ', '+')}&background=005F54&color=fff&size=100`;
  };

  const notifications = [
    { id: 1, message: 'Your booking with Ali Raza has been confirmed', time: '5 min ago', read: false },
    { id: 2, message: 'Payment of Rs 1,800 received', time: '1 hour ago', read: false },
    { id: 3, message: 'New service available in your area', time: '1 day ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // ✅ FILTER PROVIDERS BY CITY
  const filteredByCity = providers.filter(p => p.city === userCity);
  
  // ✅ FILTER PROVIDERS BY CATEGORY (if selected)
  const categoryFiltered = selectedCategory 
    ? filteredByCity.filter(p => p.category === selectedCategory)
    : filteredByCity;

  // ✅ FILTER BY SEARCH QUERY
  const searchFiltered = searchQuery 
    ? categoryFiltered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryFiltered;

  // ✅ SORT PROVIDERS (by distance or price)
  const sortedProviders = [...searchFiltered].sort((a, b) => {
    if (sortBy === 'distance') {
      const distA = parseFloat(a.distance) || 0;
      const distB = parseFloat(b.distance) || 0;
      return distA - distB;
    } else {
      return (a.price || 0) - (b.price || 0);
    }
  });

  // ✅ ALL CATEGORIES (sab show honge, filter sirf providers par)
  const allCategories = categories;

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  const handleBooking = (provider: any) => {
    localStorage.setItem('selectedProvider', JSON.stringify(provider));
    navigate('/booking');
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSortBy('distance');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
            <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>

          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">KHIDMAT</h1>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 urdu font-medium">خدمات</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                <Bell className="w-6 h-6 text-gray-800 dark:text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-10 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border z-50 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b font-bold">Notifications</div>
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 border-b text-sm ${!n.read ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                      <p className="text-gray-800 dark:text-gray-200">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <button onClick={() => navigate('/provider-profile')} className="w-9 h-9 rounded-full border-2 border-emerald-500 overflow-hidden">
              <img src={getProfileImage()} alt="Profile" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search in ${userCity}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-500 text-sm"
          />
        </div>

        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-2xl p-4 text-white">
          <div className="relative z-10">
            <h2 className="text-lg font-bold mb-0.5">Assalam-o-Alaikum, {providerName.split(' ')[0]}! 👋</h2>
            <p className="text-xs opacity-90">What service do you need today?</p>
          </div>
        </div>

        {/* Location Card - SMALLER */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{userCity}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">{filteredByCity.length} providers</p>
            </div>
          </div>
          <button onClick={() => setShowCityPicker(true)} className="text-orange-500 text-xs font-semibold hover:underline">Change</button>
        </div>

        {/* Sort By Button */}
        <div className="flex justify-end">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm"
            >
              <Filter size={12} />
              Sort by: {sortBy === 'distance' ? 'Nearest' : 'Lowest Price'}
              <ChevronRight size={12} className={showSortMenu ? 'rotate-90' : ''} />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-8 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg border z-20">
                <button
                  onClick={() => { setSortBy('distance'); setShowSortMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-xl"
                >
                  📍 Nearest First
                </button>
                <button
                  onClick={() => { setSortBy('price'); setShowSortMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl"
                >
                  💰 Lowest Price First
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Service Categories - ALL CATEGORIES (sab show honge) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 dark:text-white text-sm">Popular Services</h3>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="text-emerald-600 text-xs">Clear</button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {allCategories.map((category, idx) => {
              const IconComponent = iconMap[category.icon] || Wrench;
              const isSelected = selectedCategory === category.name;
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`cursor-pointer group ${isSelected ? 'ring-2 ring-emerald-500 rounded-xl' : ''}`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center hover:shadow-md transition">
                    <div className={`w-10 h-10 mx-auto bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-1`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-[10px] text-gray-800 dark:text-white">{category.name}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Promo Banners - Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {promoBanners.slice(0, 2).map((banner) => (
            <div key={banner.id} className={`bg-gradient-to-br ${banner.gradient} rounded-xl p-3 min-w-[160px] text-white`}>
              <h4 className="font-bold text-sm">{banner.title}</h4>
              <p className="text-[10px] opacity-90">{banner.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Nearby Providers - Filtered by City + Sorted */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 dark:text-white text-sm">
              {selectedCategory ? `${selectedCategory} in ${userCity}` : `Providers in ${userCity}`}
            </h3>
            <span className="text-[10px] text-gray-500">{sortedProviders.length} found</span>
          </div>
          
          {sortedProviders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <p className="text-gray-500 text-sm">No providers found in {userCity}</p>
              <button onClick={() => setShowCityPicker(true)} className="mt-2 text-emerald-600 text-sm font-semibold">Change City</button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex gap-3">
                    <img src={provider.avatar} alt={provider.name} className="w-14 h-14 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-bold text-gray-800 dark:text-white text-sm">{provider.name}</h4>
                            {provider.verified && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                          </div>
                          <p className="text-xs text-gray-500">{provider.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold">{provider.rating}</span>
                          </div>
                          <p className="text-[10px] text-gray-400">{provider.distance} km</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <p className="text-[10px] text-gray-500">{provider.experience} exp</p>
                          <p className="font-bold text-emerald-600 text-sm">Rs {provider.price}/hr</p>
                        </div>
                        <button 
                          onClick={() => handleBooking(provider)}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 z-30">
        <div className="flex items-center justify-around">
          <button onClick={() => { setActiveTab('home'); navigate('/customer-home'); }} className="flex flex-col items-center gap-0.5">
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className={`text-[9px] font-medium ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}>Home</span>
          </button>
          <button onClick={() => navigate('/search')} className="flex flex-col items-center gap-0.5">
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-medium text-gray-400">Search</span>
          </button>
          <button onClick={() => navigate('/customer-orders')} className="flex flex-col items-center gap-0.5">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-medium text-gray-400">Orders</span>
          </button>
          <button onClick={() => navigate('/customer-chats')} className="flex flex-col items-center gap-0.5">
            <MessageCircle className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-medium text-gray-400">Chats</span>
          </button>
          <button onClick={() => navigate('/provider-profile')} className="flex flex-col items-center gap-0.5">
            <UserCircle className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-medium text-gray-400">Profile</span>
          </button>
        </div>
      </div>

      {/* City Picker Modal */}
      <AnimatePresence>
        {showCityPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCityPicker(false)}>
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-2xl p-5 pb-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white">Select City</h3>
                <button onClick={() => setShowCityPicker(false)} className="p-1">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {pakistanCities.map(city => (
                  <button
                    key={city}
                    onClick={() => { setUserCity(city); setSelectedCategory(null); setSearchQuery(''); setShowCityPicker(false); }}
                    className={`py-2 rounded-lg text-sm font-semibold transition ${
                      userCity === city
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}