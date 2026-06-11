import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

// Icons
import { X } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';
import { Briefcase } from 'lucide-react';
import { Wallet } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { Star } from 'lucide-react';
import { UserCog } from 'lucide-react';
import { CreditCard } from 'lucide-react';
import { Bell } from 'lucide-react';
import { Globe } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Lock } from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import { Phone } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { MapPin, Mail, CheckCircle, Send } from 'lucide-react';

const menuItems = [
  {
    section: 'PROFESSIONAL',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/provider-dashboard' },
      { icon: Briefcase, label: 'My Jobs', path: '/provider-jobs' },
      { icon: Wallet, label: 'Earnings', path: '/provider-earnings' },
      { icon: Calendar, label: 'Calendar', path: '/provider-calendar' },
      { icon: Star, label: 'Reviews', path: '/provider-profile' },
    ],
  },
  {
    section: 'ACCOUNT',
    items: [
      { icon: UserCog, label: 'Profile Settings', path: '/provider-profile' },
      { icon: CreditCard, label: 'Payment Methods', path: '/provider-payment' },
      { icon: Bell, label: 'Notifications', path: '/provider-notifications' },
    ],
  },
  {
    section: 'PREFERENCES',
    items: [
      { icon: Globe, label: 'Language', action: 'language' },
      { icon: Moon, label: 'Dark Mode', action: 'darkmode' },
      { icon: Lock, label: 'Privacy & Security', path: '/provider-privacy' },
    ],
  },
  {
    section: 'SUPPORT',
    items: [
      { icon: HelpCircle, label: 'Help Center', action: 'help' },
      { icon: Phone, label: 'Contact Us', action: 'contact' },
      { icon: AlertTriangle, label: 'Report Issue', action: 'report' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    darkMode, 
    toggleDarkMode, 
    language, 
    setLanguage, 
    setUser,
    profile,
    user 
  } = useApp();

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const providerName = profile?.name || user?.name || 'M. Atif';
  const providerEmail = profile?.email || user?.email || 'atifsial5510@gmail.com';
  const providerPhone = profile?.phone || '+92 308 5228520';
  const providerCity = profile?.city || 'Islamabad';
  const providerRating = profile?.rating || 4.9;
  
  const getProfileImage = () => {
    if (profile?.profileImage) {
      return profile.profileImage;
    }
    return `https://ui-avatars.com/api/?name=${providerName.replace(' ', '+')}&background=005F54&color=fff&size=100`;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('khidmat_user');
    setSidebarOpen(false);
    navigate('/');
  };

  const handleLanguageChange = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  // ✅ Fixed: Only ONE function for Contact Us
  const handleContactUs = () => {
    navigate('/contact-us');
    setSidebarOpen(false);
  };

  // ✅ Fixed: Only ONE function for Help Center
  const handleHelpCenter = () => {
    navigate('/help-center');
    setSidebarOpen(false);
  };

  const handleReportSubmit = () => {
    if (reportText.trim()) {
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportText('');
        setReportSubmitted(false);
      }, 2000);
    }
  };

  const handleAction = (action: string) => {
    switch(action) {
      case 'language':
        handleLanguageChange();
        break;
      case 'darkmode':
        toggleDarkMode();
        break;
      case 'help':
        handleHelpCenter();
        break;
      case 'contact':
        handleContactUs();
        break;
      case 'report':
        setShowReportModal(true);
        break;
    }
    if (action !== 'report') {
      setSidebarOpen(false);
    }
  };

  if (!sidebarOpen) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay - Click to close sidebar */}
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Sidebar Panel */}
      <div className="fixed left-0 top-0 h-screen w-[300px] z-50 overflow-y-auto bg-gradient-to-b from-navy to-primary-dark">
        {/* Dot Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition-colors z-50"
        >
          <X size={22} />
        </button>

        {/* Header Section - Updated with full profile info */}
        <div className="relative z-10 pt-8 px-6 pb-5">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary-light rounded-full blur-xl opacity-30" />
            <img
              src={getProfileImage()}
              alt={providerName}
              className="w-20 h-20 rounded-full border-4 border-secondary/50 object-cover relative z-10"
            />
          </div>

          <div>
            <h3 className="text-white text-xl font-bold mb-1">{providerName}</h3>
            <p className="text-white/60 text-sm mb-1">{providerEmail}</p>
            <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
              <MapPin size={12} />
              <span>{providerCity}</span>
              <Mail size={12} />
              <span>{providerEmail}</span>
            </div>
            <span className="inline-block text-xs font-bold bg-gradient-to-r from-secondary to-secondary-light text-white px-3 py-1 rounded-full mb-3">
              PRO VERIFIED
            </span>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-secondary fill-secondary" />
              <span className="text-white text-sm font-semibold">{providerRating}</span>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="mx-6 mb-6 p-4 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <p className="text-white/50 text-xs mb-2">Available Balance</p>
          <h4 className="text-secondary-light text-2xl font-bold mb-3">Rs 185,000</h4>
          <button className="w-full py-2 px-3 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors">
            Withdraw
          </button>
        </div>

        {/* Menu Sections */}
        <div className="relative z-10 px-4 space-y-1 pb-24">
          {menuItems.map((section, sectionIndex) => (
            <div key={section.section}>
              {sectionIndex > 0 && <div className="h-px bg-white/10 my-4" />}
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3 px-3">
                {section.section}
              </p>

              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.action) {
                        handleAction(item.action);
                      } else if (item.path) {
                        handleNavigate(item.path);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                      item.path && isActive(item.path) 
                        ? 'bg-white/20 text-white' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-secondary/20 to-primary-light/20 group-hover:from-secondary/30 group-hover:to-primary-light/30 transition-colors">
                      <Icon size={16} className="text-secondary-light" />
                    </div>
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                    {item.action === 'language' && (
                      <span className="text-[10px] text-white/70 uppercase font-bold">{language === 'en' ? 'EN' : 'UR'}</span>
                    )}
                    {item.action === 'darkmode' && (
                      <div className="w-10 h-5 rounded-full bg-white/20 p-0.5 flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full transition-all duration-300 ${
                            darkMode ? 'bg-secondary translate-x-5' : 'bg-white translate-x-0'
                          }`}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Logout Button */}
          <div className="pt-4">
            <div className="h-px bg-white/10 my-4" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors group"
            >
              <div className="p-1.5 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                <LogOut size={16} className="text-red-400" />
              </div>
              <span className="flex-1 text-left text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 px-6 py-4 border-t border-white/10">
          <p className="text-white/30 text-xs text-center">v2.0.0 © 2026 KHIDMAT</p>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {language === 'en' ? 'Report Issue' : 'مسئلہ رپورٹ کریں'}
              </h3>
              <button onClick={() => setShowReportModal(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            {!reportSubmitted ? (
              <>
                <p className="text-gray-500 text-sm mb-4">
                  {language === 'en' 
                    ? 'Describe your issue below and we will get back to you.' 
                    : 'اپنا مسئلہ نیچے لکھیں، ہم آپ سے رابطہ کریں گے۔'}
                </p>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder={language === 'en' ? 'Type your issue here...' : 'اپنا مسئلہ یہاں لکھیں...'}
                  rows={4}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-emerald-500 resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-xl font-semibold"
                  >
                    {language === 'en' ? 'Cancel' : 'منسوخ'}
                  </button>
                  <button
                    onClick={handleReportSubmit}
                    disabled={!reportText.trim()}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={16} />
                    {language === 'en' ? 'Submit' : 'جمع کریں'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {language === 'en' ? 'Report Submitted!' : 'رپورٹ جمع کر دی گئی!'}
                </h4>
                <p className="text-gray-500 text-sm">
                  {language === 'en' 
                    ? 'Thank you for your feedback. We will contact you soon.' 
                    : 'آپ کی رائے کا شکریہ۔ ہم جلد رابطہ کریں گے۔'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;