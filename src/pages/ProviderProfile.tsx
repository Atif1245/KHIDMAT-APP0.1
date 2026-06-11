import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Edit3,
  Share2,
  Clock,
  Briefcase,
  Bell,
  Lock,
  Eye,
  Camera,
  X,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

const services = [
  { id: '1', name: 'Pipe Repair', price: 'Rs 800/hr' },
  { id: '2', name: 'Installation', price: 'Rs 1,200/hr' },
  { id: '3', name: 'Maintenance', price: 'Rs 600/hr' },
  { id: '4', name: 'Emergency Call', price: 'Rs 2,000/call' },
];

const reviews = [
  { id: '1', author: 'Ayesha Malik', rating: 5, text: 'Excellent work! Very professional and on time. Highly recommended.', date: '2 weeks ago' },
  { id: '2', author: 'Muhammad Hassan', rating: 4, text: 'Great service. Fixed the pipe quickly. Will hire again.', date: '1 month ago' },
];

const portfolio = [
  { id: '1', color: 'from-primary to-info' },
  { id: '2', color: 'from-secondary to-secondary-light' },
  { id: '3', color: 'from-info to-cyan-300' },
  { id: '4', color: 'from-success to-green-400' },
];

const toggleSettings = [
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'privacy', icon: Lock, label: 'Privacy' },
  { id: 'visibility', icon: Eye, label: 'Public Profile' },
];

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'settings', label: 'Settings' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function ProviderProfile() {
  const navigate = useNavigate(); // ✅ Back button ke liye
  const { darkMode, profile, updateProfile } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  const [editData, setEditData] = useState({
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    cnic: profile.cnic,
    address: profile.address,
    city: profile.city,
    category: profile.category,
    experience: profile.experience,
    hourlyRate: profile.hourlyRate,
    profileImage: profile.profileImage
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(profile.profileImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setEditData({...editData, profileImage: imageUrl});
    }
  };

  const handleSave = () => {
    updateProfile({
      name: editData.name,
      phone: editData.phone,
      email: editData.email,
      cnic: editData.cnic,
      address: editData.address,
      city: editData.city,
      category: editData.category,
      experience: editData.experience,
      hourlyRate: editData.hourlyRate,
      profileImage: previewImage || editData.profileImage
    });
    
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300">
      
      {/* ✅ BACK BUTTON - YAHAN ADD KIYA HAI */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <button 
          onClick={() => navigate('/provider-dashboard')}
          className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
      </div>

      {/* Cover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-40 bg-gradient-to-r from-primary to-info overflow-hidden"
      >
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,60 Q300,0 600,60 T1200,60 L1200,120 L0,120 Z"
            fill={darkMode ? '#0A0A0A' : '#F5F7FA'}
          />
        </svg>
      </motion.div>

      {/* Floating Profile Card */}
      <div className="max-w-md mx-auto px-4 -mt-20 relative z-10 mb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-surface-card rounded-3xl shadow-card p-6 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="mx-auto mb-4">
            <img
              src={profile.profileImage || `https://ui-avatars.com/api/?name=${profile.name.replace(' ', '+')}&background=005F54&color=fff&size=100`}
              alt={profile.name}
              className="w-24 h-24 rounded-full mx-auto border-4 border-white dark:border-surface-card shadow-lg object-cover"
            />
          </motion.div>

          <h1 className="text-2xl font-bold text-navy dark:text-white mb-1">{profile.name}</h1>
          <p className="text-primary dark:text-primary-bright font-semibold mb-3">{profile.category}</p>

          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{profile.city}, Pakistan</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/50 text-yellow-400/50'}`} />
              ))}
            </div>
            <span className="font-bold text-navy dark:text-white">4.9</span>
            <span className="text-gray-400 text-sm">(245 reviews)</span>
          </div>

          <div className="inline-block bg-gradient-to-r from-secondary to-secondary-light text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            PRO VERIFIED
          </div>

          <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100 dark:border-surface-light">
            <div>
              <p className="text-2xl font-bold text-navy dark:text-white">245</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Jobs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-navy dark:text-white">{profile.experience}+</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Years</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-navy dark:text-white">Rs {profile.hourlyRate}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hourly Rate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-surface-light"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition relative ${
                activeTab === tab.id
                  ? 'text-primary dark:text-primary-bright'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-info"
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Tab Content - Baqi sab waisa hi, time bachane ke liye same rakh raha hoon */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-md mx-auto px-4 pb-28"
      >
        {activeTab === 'overview' && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
            <motion.div variants={itemVariants}>
              <h3 className="font-bold text-navy dark:text-white mb-2">About</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Professional {profile.category.toLowerCase()} with {profile.experience}+ years of experience.
              </p>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'services' && (
          <div>Services content here</div>
        )}

        {activeTab === 'portfolio' && (
          <div>Portfolio content here</div>
        )}

        {activeTab === 'reviews' && (
          <div>Reviews content here</div>
        )}

        {activeTab === 'settings' && (
          <div>Settings content here</div>
        )}
      </motion.div>

      {/* Bottom Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 py-4 z-20"
      >
        <div className="bg-white dark:bg-surface-card rounded-2xl p-4 shadow-lg space-y-3">
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full bg-gradient-to-r from-primary to-info text-white py-3 rounded-xl font-semibold hover:shadow-md transition flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
          <button className="w-full border-2 border-gray-200 dark:border-surface-light text-navy dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-surface-light transition flex items-center justify-center gap-2 active:scale-[0.98]">
            <Share2 className="w-4 h-4" />
            Share Profile
          </button>
        </div>
      </motion.div>

      <div className="h-32" />

      {/* Edit Modal - Same as before */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-surface-card rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white dark:bg-surface-card rounded-t-3xl">
              <h3 className="text-xl font-bold text-primary">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-surface-light rounded-full transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              {/* Profile Picture Upload */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={previewImage || profile.profileImage || `https://ui-avatars.com/api/?name=${profile.name.replace(' ', '+')}&background=005F54&color=fff&size=100`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                  />
                  <label className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer shadow-lg">
                    <Camera size={16} className="text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tap to change profile picture</p>
              </div>

              {/* Full Name */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-2">Full Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full p-3 border rounded-2xl bg-gray-50 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-2">Phone Number</label>
                <div className="flex items-center border rounded-2xl bg-gray-50">
                  <span className="px-3 py-3 border-r font-bold text-primary">+92</span>
                  <input
                    type="tel"
                    value={editData.phone.replace('+92', '')}
                    onChange={(e) => setEditData({...editData, phone: '+92 ' + e.target.value})}
                    className="flex-1 p-3 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-2">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full p-3 border rounded-2xl bg-gray-50 focus:outline-none focus:border-primary"
                />
              </div>

              {/* CNIC */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-2">CNIC</label>
                <input
                  type="text"
                  value={editData.cnic}
                  onChange={(e) => setEditData({...editData, cnic: e.target.value})}
                  className="w-full p-3 border rounded-2xl bg-gray-50 focus:outline-none focus:border-primary"
                />
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-2">City</label>
                <select
                  value={editData.city}
                  onChange={(e) => setEditData({...editData, city: e.target.value})}
                  className="w-full p-3 border rounded-2xl bg-gray-50 focus:outline-none focus:border-primary"
                >
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Islamabad</option>
                  <option>Rawalpindi</option>
                </select>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-2">Service Category</label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                  className="w-full p-3 border rounded-2xl bg-gray-50 focus:outline-none focus:border-primary"
                >
                  <option>Plumber</option>
                  <option>Electrician</option>
                  <option>AC Repair</option>
                  <option>Carpenter</option>
                </select>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-2">Experience (Years)</label>
                <input
                  type="number"
                  value={editData.experience}
                  onChange={(e) => setEditData({...editData, experience: e.target.value})}
                  className="w-full p-3 border rounded-2xl bg-gray-50 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Hourly Rate */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-2">Hourly Rate (PKR)</label>
                <input
                  type="number"
                  value={editData.hourlyRate}
                  onChange={(e) => setEditData({...editData, hourlyRate: e.target.value})}
                  className="w-full p-3 border rounded-2xl bg-gray-50 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="text-sm font-semibold block mb-2">Address</label>
                <textarea
                  rows={3}
                  value={editData.address}
                  onChange={(e) => setEditData({...editData, address: e.target.value})}
                  className="w-full p-3 border rounded-2xl bg-gray-50 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 border rounded-full font-semibold">
                  Cancel
                </button>
                <button onClick={handleSave} className="flex-1 py-3 bg-primary text-white rounded-full font-semibold flex items-center justify-center gap-2">
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}