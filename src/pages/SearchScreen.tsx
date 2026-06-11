import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, MapPin, Star, Filter, 
  ChevronDown, X, CheckCircle
} from 'lucide-react';
import { providers, pakistanCities } from '../data/services';

const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Lahore');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'price'>('distance');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get all unique categories from ALL providers (not just filtered)
  const allCategories = [...new Map(providers.map(p => [p.category, p.category])).values()];

  // Filter providers by city
  const filteredByCity = providers.filter(p => p.city === selectedCity);
  
  // Filter by category (if selected)
  const categoryFiltered = selectedCategory 
    ? filteredByCity.filter(p => p.category === selectedCategory)
    : filteredByCity;
  
  // Filter by search query
  const searchFiltered = searchQuery
    ? categoryFiltered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryFiltered;
  
  // Sort providers
  const sortedProviders = [...searchFiltered].sort((a, b) => {
    if (sortBy === 'distance') {
      return (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0);
    } else {
      return (a.price || 0) - (b.price || 0);
    }
  });

  const handleBooking = (provider: any) => {
    localStorage.setItem('selectedProvider', JSON.stringify(provider));
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft size={22} className="text-gray-700 dark:text-white" />
          </button>
          <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex-1">Search Services</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for plumber, electrician, AC repair..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
          />
        </div>

        {/* City Selector */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-emerald-600" />
            <span className="font-medium text-gray-800 dark:text-white">{selectedCity}</span>
          </div>
          <button onClick={() => setShowCityPicker(true)} className="text-emerald-600 text-sm font-semibold">Change</button>
        </div>

        {/* Category Filters - ALL CATEGORIES */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
              !selectedCategory ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort By & Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{sortedProviders.length} providers found in {selectedCity}</p>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm"
            >
              <Filter size={12} />
              Sort: {sortBy === 'distance' ? 'Nearest' : 'Lowest Price'}
              <ChevronDown size={12} />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border z-20">
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

        {/* Providers List - All Services */}
        <div className="space-y-3">
          {sortedProviders.map(provider => (
            <div key={provider.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <div className="flex gap-3">
                <img src={provider.avatar} alt={provider.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-gray-800 dark:text-white">{provider.name}</h3>
                        {provider.verified && <CheckCircle size={14} className="text-emerald-500" />}
                      </div>
                      <p className="text-sm text-gray-500">{provider.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-800 dark:text-white">{provider.rating}</span>
                      </div>
                      <p className="text-xs text-gray-400">{provider.distance} km</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <p className="text-xs text-gray-500">{provider.experience} exp</p>
                      <p className="font-bold text-emerald-600">Rs {provider.price}/hr</p>
                    </div>
                    <button 
                      onClick={() => handleBooking(provider)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {sortedProviders.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No providers found in {selectedCity}</p>
              <button onClick={() => setShowCityPicker(true)} className="mt-2 text-emerald-600 font-semibold">Change City</button>
            </div>
          )}
        </div>
      </div>

      {/* City Picker Modal */}
      {showCityPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCityPicker(false)}>
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-2xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-white">Select City</h3>
              <button onClick={() => setShowCityPicker(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {pakistanCities.map(city => (
                <button
                  key={city}
                  onClick={() => { setSelectedCity(city); setShowCityPicker(false); }}
                  className={`py-2 rounded-lg text-sm font-semibold transition ${
                    selectedCity === city
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchScreen;