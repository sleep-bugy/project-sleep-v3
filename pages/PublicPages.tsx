

import React, { useState, useMemo } from 'react';
// FIX: Import `Variants` type from framer-motion to correctly type animation variants.
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { AnimatedPage, useData, useI18n, useTheme } from '../App';
import { RomType, Device, ROM } from '../types';
import { api } from '../services';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// FIX: Explicitly type `itemVariants` with `Variants` to resolve TypeScript error with transition type. This fixes multiple errors where this constant is used.
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

// FIX: Extended component props to accept standard button attributes and made children optional.
const NeonButton = ({ children, onClick, className = '', primary = false, ...props }: { children?: React.ReactNode, onClick?: () => void, className?: string, primary?: boolean } & React.ComponentProps<typeof motion.button>) => {
    const baseClasses = "px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-hsl-background-start";
    const primaryClasses = "bg-hsl-primary text-hsl-primary-foreground shadow-[var(--primary-neon)] hover:scale-105 focus:ring-hsl-primary";
    const secondaryClasses = "border-2 border-hsl-primary text-hsl-primary hover:bg-hsl-primary hover:text-hsl-primary-foreground hover:shadow-[var(--primary-neon)] focus:ring-hsl-primary";
    
    return (
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses} ${className}`} {...props}>
            {children}
        </motion.button>
    );
};


// Home Page
export const HomePage = () => {
  const { t } = useI18n();
  
  const animatedText = t('home_hero_title_animated').split("").map((char, index) => (
    <motion.span key={index} variants={itemVariants} className="inline-block">
        {char === " " ? "\u00A0" : char}
    </motion.span>
  ));

  const romTypes = [
      { name: 'SleepOS', desc: t('home_rom_sleepos_desc') },
      { name: 'AOSP', desc: t('home_rom_aosp_desc') },
      { name: 'Port ROM', desc: t('home_rom_port_desc') },
  ];
  
  const advantages = [
      { title: t('home_advantage_1_title'), desc: t('home_advantage_1_desc') },
      { title: t('home_advantage_2_title'), desc: t('home_advantage_2_desc') },
      { title: t('home_advantage_3_title'), desc: t('home_advantage_3_desc') },
      { title: t('home_advantage_4_title'), desc: t('home_advantage_4_desc') },
  ];

  return (
    <AnimatedPage>
      <div className="space-y-20 md:space-y-28">
        {/* Hero Section */}
        <section className="text-center pt-10 md:pt-20">
          <motion.h1 variants={containerVariants} initial="hidden" animate="visible" className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter">
            <motion.span variants={itemVariants}>{t('home_hero_title')}{' '}</motion.span>
            <span className="text-hsl-primary" style={{ textShadow: 'var(--primary-neon)' }}>
                {animatedText}
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} initial="hidden" animate="visible" transition={{delay: 0.5}} className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-hsl-foreground/80">{t('home_hero_subtitle')}</motion.p>
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{delay: 0.7}} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <NeonButton primary>{t('home_hero_cta_download')}</NeonButton>
              <NeonButton>{t('home_hero_cta_features')}</NeonButton>
          </motion.div>
        </section>

        {/* ROM Types */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">{t('home_rom_types')}</h2>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {romTypes.map(rt => (
              <motion.div key={rt.name} variants={itemVariants} className="p-6 rounded-xl border border-hsl-border bg-hsl-card/50 backdrop-blur-sm transition-all hover:border-hsl-primary hover:shadow-2xl hover:shadow-hsl-primary/20">
                <h3 className="text-2xl font-bold text-hsl-primary">{rt.name}</h3>
                <p className="mt-2 text-hsl-foreground/80">{rt.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Advantages */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">{t('home_advantages_title')}</h2>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map(adv => (
              <motion.div key={adv.title} variants={itemVariants} className="text-center p-4">
                <h3 className="text-xl font-semibold">{adv.title}</h3>
                <p className="mt-1 text-hsl-foreground/70">{adv.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </AnimatedPage>
  );
};


// Features Page
export const FeaturesPage = () => {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState<RomType>('SleepOS');

    const tabs: { id: RomType, name: string, desc: string, features: string[] }[] = [
        { id: 'SleepOS', name: t('features_tab_sleepos'), desc: t('features_sleepos_desc'), features: ['Advanced Customization', 'Performance Tweaks', 'Enhanced Battery Life', 'Sleep-centric UI'] },
        { id: 'AOSP', name: t('features_tab_aosp'), desc: t('features_aosp_desc'), features: ['Pixel-like Experience', 'Minimal & Clean', 'Security Focused', 'Optimized for Speed'] },
        { id: 'Port', name: t('features_tab_port'), desc: t('features_port_desc'), features: ['Unique Device Features', 'Cross-device Compatibility', 'Stable & Reliable Ports', 'Fresh UI experience'] },
    ];

    const activeTabData = tabs.find(tab => tab.id === activeTab);

    return (
        <AnimatedPage>
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold">{t('features_title')}</h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-hsl-foreground/80">{t('features_subtitle')}</p>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
                <div className="flex justify-center border-b border-hsl-border">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative px-4 py-3 font-medium text-lg transition-colors ${activeTab === tab.id ? 'text-hsl-primary' : 'text-hsl-foreground/70 hover:text-hsl-foreground'}`}>
                            {tab.name}
                            {activeTab === tab.id && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-hsl-primary" layoutId="underline" />}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8"
                    >
                        {activeTabData && (
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl font-bold">{activeTabData.name}</h3>
                                    <p className="mt-2 text-hsl-foreground/80">{activeTabData.desc}</p>
                                    <ul className="mt-4 space-y-2">
                                        {activeTabData.features.map(feat => <li key={feat} className="flex items-center"><svg className="w-4 h-4 mr-2 text-hsl-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>{feat}</li>)}
                                    </ul>
                                </div>
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="grid grid-cols-2 gap-4">
                                    <img src="https://picsum.photos/seed/feat1/400/800" alt="Screenshot 1" className="rounded-lg shadow-lg"/>
                                    <img src="https://picsum.photos/seed/feat2/400/800" alt="Screenshot 2" className="rounded-lg shadow-lg mt-8"/>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};


// Download Page
const RomDetailsModal = ({ rom, device, onClose }: { rom: ROM, device: Device, onClose: () => void }) => {
    const { t } = useI18n();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-hsl-card rounded-2xl p-6 md:p-8 w-full max-w-2xl border border-hsl-border"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{device.brand} {device.model} - {rom.type} {rom.version}</h2>
                        <p className="text-hsl-primary">{t('download_android_version')} {rom.androidVersion}</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-hsl-border transition-colors">&times;</button>
                </div>
                <div className="mt-6 space-y-4 text-sm">
                    <p><strong>{t('download_file_size')}:</strong> {rom.fileSize}</p>
                    <p><strong>{t('download_changelog')}:</strong></p>
                    <p className="pl-4 whitespace-pre-wrap text-hsl-foreground/80">{rom.changelog}</p>
                    <p><strong>{t('download_notes')}:</strong></p>
                    <p className="pl-4 text-hsl-foreground/80">{rom.notes}</p>
                </div>
                <div className="mt-8 text-center">
                    <NeonButton primary onClick={() => window.location.href = rom.downloadUrl}>{t('download_button')}</NeonButton>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const DownloadPage = () => {
    const { devices, roms } = useData();
    const { t } = useI18n();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<RomType | 'All'>('All');
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [selectedRom, setSelectedRom] = useState<ROM | null>(null);

    const filteredDevices = useMemo(() => {
        return devices.filter(d => 
            `${d.brand} ${d.model} ${d.codename}`.toLowerCase().includes(search.toLowerCase())
        );
    }, [devices, search]);
    
    const deviceRoms = useMemo(() => {
        if (!selectedDevice) return [];
        return roms.filter(r => r.deviceId === selectedDevice.id && (filter === 'All' || r.type === filter));
    }, [roms, selectedDevice, filter]);

    return (
        <AnimatedPage>
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold">{t('download_title')}</h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-hsl-foreground/80">{t('download_subtitle')}</p>
            </div>

            <div className="mt-12 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('download_search_placeholder')}
                        className="w-full px-4 py-2 bg-hsl-input border border-hsl-border rounded-lg focus:ring-2 focus:ring-hsl-primary focus:outline-none"
                    />
                </div>
                
                <AnimatePresence>
                    {selectedDevice && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="my-8">
                            <button onClick={() => setSelectedDevice(null)} className="mb-4 text-sm text-hsl-primary">&larr; Back to device list</button>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-hsl-card border border-hsl-border">
                                <img src={selectedDevice.imageUrl} alt={selectedDevice.model} className="w-24 h-auto rounded-md"/>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedDevice.brand} {selectedDevice.model}</h2>
                                    <p className="text-hsl-foreground/70">({selectedDevice.codename}) - {selectedDevice.chipset}</p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2 mt-6 p-1 bg-hsl-card rounded-full border border-hsl-border">
                                {(['All', 'SleepOS', 'AOSP', 'Port'] as const).map(f => (
                                    <button key={f} onClick={() => setFilter(f)} className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${filter === f ? 'text-hsl-primary-foreground' : 'hover:text-hsl-primary'}`}>
                                        {f === 'All' ? t('download_filter_all') : f}
                                        {filter === f && <motion.div className="absolute inset-0 bg-hsl-primary rounded-full -z-10" layoutId="filter-bubble"/>}
                                    </button>
                                ))}
                            </div>
                            <motion.div layout className="mt-6 space-y-4">
                                <AnimatePresence>
                                {deviceRoms.length > 0 ? deviceRoms.map(rom => (
                                    <motion.div key={rom.id} variants={itemVariants} initial="hidden" animate="visible" exit="hidden" layout className="p-4 border border-hsl-border rounded-lg bg-hsl-card/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-hsl-primary flex items-center gap-2">{rom.type} {rom.version} {rom.isRecommended && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">{t('download_recommended')}</span>}</h3>
                                            <p className="text-sm text-hsl-foreground/70">Android {rom.androidVersion} | {rom.fileSize} | {new Date(rom.releaseDate).toLocaleDateString()}</p>
                                        </div>
                                        <NeonButton onClick={() => setSelectedRom(rom)}>{t('download_button')}</NeonButton>
                                    </motion.div>
                                )) : <p className="text-center text-hsl-foreground/70 py-8">{t('download_no_roms')}</p>}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {!selectedDevice && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDevices.map(device => (
                                <motion.div key={device.id} variants={itemVariants} onClick={() => setSelectedDevice(device)} className="rounded-xl border border-hsl-border bg-hsl-card overflow-hidden cursor-pointer transition-all hover:border-hsl-primary hover:shadow-2xl hover:shadow-hsl-primary/20 hover:-translate-y-1">
                                    <img src={device.imageUrl} alt={device.model} className="w-full h-40 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-bold">{device.brand} {device.model}</h3>
                                        <p className="text-sm text-hsl-foreground/70">{device.codename}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {selectedRom && selectedDevice && <RomDetailsModal rom={selectedRom} device={selectedDevice} onClose={() => setSelectedRom(null)} />}
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};


// Team Page
export const TeamPage = () => {
    const { team } = useData();
    const { t } = useI18n();
    const { addApplication } = useData();
    const [formData, setFormData] = useState({ name: '', email: '', role: '', country: '', experience: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await api.submitApplication(formData);
        if (res.success) {
            addApplication(formData);
            setSubmitStatus('success');
            setFormData({ name: '', email: '', role: '', country: '', experience: '' });
        } else {
            setSubmitStatus('error');
        }
        setIsSubmitting(false);
        setTimeout(() => setSubmitStatus('idle'), 5000);
    };

    const getFlagEmoji = (countryCode: string) => {
        if (!countryCode || countryCode.length !== 2) return '🌐';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    return (
        <AnimatedPage>
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold">{t('team_title')}</h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-hsl-foreground/80">{t('team_subtitle')}</p>
            </div>
            
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {team.map(member => (
                    <motion.div key={member.id} variants={itemVariants} className="text-center p-4 rounded-lg bg-hsl-card/50 border border-transparent transition-colors hover:border-hsl-primary/50">
                        <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto ring-2 ring-hsl-primary/50" />
                        <h3 className="mt-4 font-bold text-lg">{member.name} <span title={member.country}>{getFlagEmoji(member.country)}</span></h3>
                        <p className="text-hsl-primary">{member.role}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="mt-20 max-w-2xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">{t('team_join_title')}</h2>
                    <p className="mt-2 text-hsl-foreground/80">{t('team_join_subtitle')}</p>
                </div>
                <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} className="mt-8 space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('team_form_name')} required className="w-full px-4 py-2 bg-hsl-input border border-hsl-border rounded-lg focus:ring-2 focus:ring-hsl-primary focus:outline-none"/>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('team_form_email')} required className="w-full px-4 py-2 bg-hsl-input border border-hsl-border rounded-lg focus:ring-2 focus:ring-hsl-primary focus:outline-none"/>
                    <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder={t('team_form_role')} required className="w-full px-4 py-2 bg-hsl-input border border-hsl-border rounded-lg focus:ring-2 focus:ring-hsl-primary focus:outline-none"/>
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder={t('team_form_country')} required maxLength={2} className="w-full px-4 py-2 bg-hsl-input border border-hsl-border rounded-lg focus:ring-2 focus:ring-hsl-primary focus:outline-none"/>
                    <textarea name="experience" value={formData.experience} onChange={handleInputChange} placeholder={t('team_form_experience')} required rows={4} className="w-full px-4 py-2 bg-hsl-input border border-hsl-border rounded-lg focus:ring-2 focus:ring-hsl-primary focus:outline-none"></textarea>
                    <div className="text-center">
                        <NeonButton primary type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : t('team_form_submit')}</NeonButton>
                    </div>
                </motion.form>
                {submitStatus === 'success' && <p className="mt-4 text-center text-green-400">{t('team_form_success')}</p>}
                {submitStatus === 'error' && <p className="mt-4 text-center text-red-400">An error occurred. Please try again.</p>}
            </div>
        </AnimatedPage>
    );
};

// About Page
export const AboutPage = () => {
    const { t } = useI18n();
    
    const links = [
        { name: t('about_telegram_channel'), url: 'https://t.me/SleepOsUpdate' },
        { name: t('about_telegram_group'), url: 'https://t.me/SleepOsUser' },
        { name: t('about_discord'), url: 'https://discord.gg/sK433E4jq' },
        { name: t('about_github'), url: 'https://github.com/sleep-bugy' },
    ];

    return (
        <AnimatedPage>
            <div className="max-w-3xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold">{t('about_title')}</h1>
                    <p className="mt-3 text-lg text-hsl-foreground/80">{t('about_subtitle')}</p>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10 space-y-6 text-lg text-hsl-foreground/90 text-justify">
                    <p>{t('about_p1')}</p>
                    <p>{t('about_p2')}</p>
                </motion.div>
                
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-center mb-6">{t('about_connect')}</h2>
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {links.map(link => (
                            <motion.a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" variants={itemVariants} className="block text-center">
                                <NeonButton className="w-full">{link.name}</NeonButton>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};