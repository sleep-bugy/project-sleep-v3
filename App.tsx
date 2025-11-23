


import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { translations, seedData } from './data';
import { Language, TeamMember, Device, ROM, TeamApplication, User } from './types';
import { api } from './services';
import Layout from './components/Layout';
import { HomePage, FeaturesPage, DownloadPage, TeamPage, AboutPage } from './pages/PublicPages';
import { AdminLoginPage, AdminDashboardPage } from './pages/AdminPages';

// THEME
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// FIX: Made children prop optional to satisfy TypeScript compiler error.
const ThemeProvider = ({ children }: { children?: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// i18n
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// FIX: Made children prop optional to satisfy TypeScript compiler error.
const I18nProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>;
};
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};

// DATA
interface DataContextType {
  team: TeamMember[];
  devices: Device[];
  roms: ROM[];
  applications: TeamApplication[];
  addDevice: (device: Omit<Device, 'id'>) => void;
  updateDevice: (device: Device) => void;
  deleteDevice: (id: string) => void;
  addRom: (rom: Omit<ROM, 'id'>) => void;
  updateRom: (rom: ROM) => void;
  deleteRom: (id: string) => void;
  addApplication: (application: Omit<TeamApplication, 'id' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: 'approved' | 'rejected') => void;
}
const DataContext = createContext<DataContextType | undefined>(undefined);

// FIX: Made children prop optional to satisfy TypeScript compiler error.
const DataProvider = ({ children }: { children?: ReactNode }) => {
  const [team, setTeam] = useState<TeamMember[]>(seedData.team);
  const [devices, setDevices] = useState<Device[]>(seedData.devices);
  const [roms, setRoms] = useState<ROM[]>(seedData.roms);
  const [applications, setApplications] = useState<TeamApplication[]>(seedData.applications);

  const addDevice = (device: Omit<Device, 'id'>) => setDevices(prev => [...prev, { ...device, id: `dev-${Date.now()}` }]);
  const updateDevice = (updatedDevice: Device) => setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
  const deleteDevice = (id: string) => setDevices(prev => prev.filter(d => d.id !== id));

  const addRom = (rom: Omit<ROM, 'id'>) => setRoms(prev => [...prev, { ...rom, id: `rom-${Date.now()}` }]);
  const updateRom = (updatedRom: ROM) => setRoms(prev => prev.map(r => r.id === updatedRom.id ? updatedRom : r));
  const deleteRom = (id: string) => setRoms(prev => prev.filter(r => r.id !== id));

  const addApplication = (app: Omit<TeamApplication, 'id' | 'status'>) => {
    const newApp = { ...app, id: `app-${Date.now()}`, status: 'pending' as const };
    setApplications(prev => [...prev, newApp]);
  };
  const updateApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    const app = applications.find(a => a.id === id);
    if(status === 'approved' && app){
      const newMember = {
        id: `team-${Date.now()}`,
        name: app.name,
        role: app.role,
        country: app.country,
        avatar: `https://i.pravatar.cc/150?u=${app.name}`,
        socials: {}
      };
      setTeam(prev => [...prev, newMember]);
    }
  };

  return <DataContext.Provider value={{ team, devices, roms, applications, addDevice, updateDevice, deleteDevice, addRom, updateRom, deleteRom, addApplication, updateApplicationStatus }}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

// AUTH
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Made children prop optional to satisfy TypeScript compiler error.
const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, pass: string) => {
    const loggedInUser = await api.login(email, pass);
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    }
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// PROVIDERS & ROUTER
const AppProviders = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <I18nProvider>
      <DataProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </DataProvider>
    </I18nProvider>
  </ThemeProvider>
);

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/admin/login" />;
};

// FIX: Made children prop optional to satisfy TypeScript compiler error.
export const AnimatedPage = ({ children }: { children?: ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
        {children}
    </motion.div>
);

function App() {
  const location = useLocation();
  return (
    <AppProviders>
      <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/download" element={<DownloadPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<AdminDashboardPage />} />
              </Route>
            </Routes>
          </AnimatePresence>
      </Layout>
    </AppProviders>
  );
}

export default App;