import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserInfo {
  name: string;
  email: string;
  role: 'customer' | 'provider';
  phone?: string;
  city?: string;
}

// Profile Data Type
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  city: string;
  category: string;
  experience: string;
  hourlyRate: string;
  profileImage: string | null;
  rating?: number;
}

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  t: (en: string, ur: string) => string;
}

// Default Profile Data - Updated with M. Atif
const defaultProfile: UserProfile = {
  name: "M. Atif",
  email: "atifsial5510@gmail.com",
  phone: "+92 308 5228520",
  cnic: "12345-6789012-3",
  address: "G-11, House 123, Islamabad",
  city: "Islamabad",
  category: "Plumber",
  experience: "8",
  hourlyRate: "800",
  profileImage: null,
  rating: 4.9
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  
  const [language, setLanguage] = useState<'en' | 'ur'>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'ur') ? saved : 'en';
  });
  
  const [user, setUser] = useState<UserInfo | null>(() => {
    const saved = localStorage.getItem('khidmat_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  // Translation function
  const t = (en: string, ur: string) => {
    return language === 'en' ? en : ur;
  };

  // Apply dark mode to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save dark mode to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Save language to localStorage and apply RTL if Urdu
  useEffect(() => {
    localStorage.setItem('language', language);
    if (language === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('khidmat_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('khidmat_user');
    }
  }, [user]);

  // Update profile function - updates EVERYWHERE
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...newProfile };
      localStorage.setItem('userProfile', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <AppContext.Provider value={{ 
      darkMode, 
      toggleDarkMode, 
      language, 
      setLanguage, 
      user, 
      setUser, 
      sidebarOpen, 
      setSidebarOpen,
      profile,
      updateProfile,
      isLoading,
      setIsLoading,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}