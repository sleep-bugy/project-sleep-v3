
import React, { useState, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../App';
import { useI18n } from '../App';
import { Language } from '../types';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪' },
];

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);


const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_features'), path: '/features' },
    { name: t('nav_download'), path: '/download' },
    { name: t('nav_team'), path: '/team' },
    { name: t('nav_about'), path: '/about' },
  ];

  const activeLinkStyle = {
      color: 'hsl(var(--primary))',
      textShadow: 'var(--primary-neon)',
  };

  const MobileMenu = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-full left-0 w-full bg-hsl-card/80 backdrop-blur-md md:hidden shadow-lg border-b border-hsl-border"
    >
      <nav className="flex flex-col items-center space-y-4 py-6">
        {navLinks.map((link) => (
          <NavLink key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} style={({isActive}) => isActive ? activeLinkStyle : {}} className="text-lg font-medium transition-colors hover:text-hsl-primary">
            {link.name}
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hsl-border/40 bg-hsl-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <NavLink to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tighter text-hsl-primary" style={{textShadow: 'var(--primary-neon)'}}>Project Sleep</span>
        </NavLink>
        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} style={({isActive}) => isActive ? activeLinkStyle : {}} className="font-medium transition-colors hover:text-hsl-primary">
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="p-2 rounded-full hover:bg-hsl-border transition-colors">
              <GlobeIcon className="h-5 w-5" />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-hsl-card border border-hsl-border ring-1 ring-black ring-opacity-5"
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {languages.map((lang) => (
                      <button key={lang.code} onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }} className={`flex items-center w-full px-4 py-2 text-sm text-left ${language === lang.code ? 'bg-hsl-border text-hsl-primary' : ''} hover:bg-hsl-border transition-colors`}>
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-hsl-border transition-colors">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={theme} initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
          
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && <MobileMenu />}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => {
    return (
        <footer className="border-t border-hsl-border/40">
            <div className="container mx-auto max-w-7xl py-6 px-4 text-center text-sm text-hsl-foreground/60">
                <p>&copy; {new Date().getFullYear()} Project Sleep. All Rights Reserved.</p>
            </div>
        </footer>
    );
};


const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-hsl-background-start to-hsl-background-end text-hsl-foreground">
            <Header />
            <main className="flex-grow container mx-auto max-w-7xl px-4 py-8 md:py-12">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
