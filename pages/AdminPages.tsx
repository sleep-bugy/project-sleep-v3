
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedPage, useAuth, useData } from '../App';
import { Device, ROM, RomType, TeamApplication } from '../types';

// Login Page
export const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const user = await login(email, password);
        setIsLoading(false);
        if (user) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <AnimatedPage>
            <div className="max-w-md mx-auto mt-10 md:mt-20">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-hsl-card border border-hsl-border rounded-2xl shadow-2xl shadow-hsl-primary/10"
                >
                    <h1 className="text-3xl font-bold text-center text-hsl-primary">Admin Login</h1>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3 bg-hsl-input border border-hsl-border rounded-lg focus:ring-2 focus:ring-hsl-primary focus:outline-none"/>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 bg-hsl-input border border-hsl-border rounded-lg focus:ring-2 focus:ring-hsl-primary focus:outline-none"/>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} type="submit" disabled={isLoading} className="w-full py-3 font-semibold bg-hsl-primary text-hsl-primary-foreground rounded-lg transition-colors hover:bg-opacity-90 disabled:bg-opacity-50">
                            {isLoading ? 'Logging in...' : 'Login'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};


// Admin Dashboard
type AdminTab = 'devices' | 'roms' | 'applications';
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

export const AdminDashboardPage = () => {
    const { logout } = useAuth();
    const { devices, roms, applications, updateApplicationStatus, addDevice, updateDevice, deleteDevice, addRom, updateRom, deleteRom } = useData();
    const [activeTab, setActiveTab] = useState<AdminTab>('devices');

    const [editingDevice, setEditingDevice] = useState<Device | null>(null);
    const [editingRom, setEditingRom] = useState<ROM | null>(null);

    const handleDeviceSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const deviceData = Object.fromEntries(formData.entries()) as Omit<Device, 'id' | 'imageUrl'>;
        if(editingDevice) {
            updateDevice({...editingDevice, ...deviceData});
        } else {
            addDevice({...deviceData, imageUrl: 'https://picsum.photos/400/300'});
        }
        setEditingDevice(null);
    };

     const handleRomSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const romData = {
          ...Object.fromEntries(formData.entries()),
          isRecommended: formData.get('isRecommended') === 'on'
        } as unknown as Omit<ROM, 'id'>;

        if(editingRom) {
            updateRom({...editingRom, ...romData});
        } else {
            addRom(romData);
        }
        setEditingRom(null);
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'devices':
                return (
                    <motion.div key="devices" variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                        <h2 className="text-2xl font-bold mb-4">Manage Devices ({devices.length})</h2>
                        <form onSubmit={handleDeviceSubmit} className="p-4 bg-hsl-card border border-hsl-border rounded-lg mb-6 grid grid-cols-2 gap-4">
                            <h3 className="col-span-2 text-lg font-semibold">{editingDevice ? `Editing ${editingDevice.model}` : 'Add New Device'}</h3>
                            <input name="brand" defaultValue={editingDevice?.brand} placeholder="Brand" required className="bg-hsl-input p-2 rounded" />
                            <input name="model" defaultValue={editingDevice?.model} placeholder="Model" required className="bg-hsl-input p-2 rounded" />
                            <input name="codename" defaultValue={editingDevice?.codename} placeholder="Codename" required className="bg-hsl-input p-2 rounded" />
                            <input name="chipset" defaultValue={editingDevice?.chipset} placeholder="Chipset" required className="bg-hsl-input p-2 rounded" />
                            <div className="col-span-2 flex gap-2">
                                <button type="submit" className="px-4 py-2 bg-hsl-primary rounded">{editingDevice ? 'Update' : 'Add'}</button>
                                {editingDevice && <button onClick={() => setEditingDevice(null)} type="button" className="px-4 py-2 bg-hsl-border rounded">Cancel</button>}
                            </div>
                        </form>
                        <div className="space-y-2">
                            {devices.map(d => <div key={d.id} className="p-3 bg-hsl-card flex justify-between items-center rounded"><span>{d.brand} {d.model}</span><div><button onClick={() => setEditingDevice(d)} className="mr-2 text-sm text-blue-400">Edit</button><button onClick={() => deleteDevice(d.id)} className="text-sm text-red-400">Delete</button></div></div>)}
                        </div>
                    </motion.div>
                );
            case 'roms':
                 return (
                    <motion.div key="roms" variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                        <h2 className="text-2xl font-bold mb-4">Manage ROMs ({roms.length})</h2>
                        <form onSubmit={handleRomSubmit} className="p-4 bg-hsl-card border border-hsl-border rounded-lg mb-6 grid grid-cols-2 gap-4">
                             <h3 className="col-span-2 text-lg font-semibold">{editingRom ? `Editing ${editingRom.type} ${editingRom.version}` : 'Add New ROM'}</h3>
                             <select name="deviceId" defaultValue={editingRom?.deviceId} required className="bg-hsl-input p-2 rounded">
                                {devices.map(d => <option key={d.id} value={d.id}>{d.brand} {d.model}</option>)}
                             </select>
                             <select name="type" defaultValue={editingRom?.type} required className="bg-hsl-input p-2 rounded">
                                {(['SleepOS', 'AOSP', 'Port'] as RomType[]).map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                             <input name="version" defaultValue={editingRom?.version} placeholder="Version" required className="bg-hsl-input p-2 rounded" />
                             <input name="androidVersion" defaultValue={editingRom?.androidVersion} placeholder="Android Version" required className="bg-hsl-input p-2 rounded" />
                             <input name="fileSize" defaultValue={editingRom?.fileSize} placeholder="File Size" required className="bg-hsl-input p-2 rounded" />
                             <input name="releaseDate" defaultValue={editingRom?.releaseDate} type="date" required className="bg-hsl-input p-2 rounded"/>
                             <textarea name="changelog" defaultValue={editingRom?.changelog} placeholder="Changelog" required className="col-span-2 bg-hsl-input p-2 rounded"></textarea>
                             <textarea name="notes" defaultValue={editingRom?.notes} placeholder="Notes" required className="col-span-2 bg-hsl-input p-2 rounded"></textarea>
                             <div className="flex items-center gap-2"><input defaultChecked={editingRom?.isRecommended} type="checkbox" name="isRecommended" id="isRecommended" className="bg-hsl-input" /><label htmlFor="isRecommended">Is Recommended?</label></div>
                             <div className="col-span-2 flex gap-2">
                                <button type="submit" className="px-4 py-2 bg-hsl-primary rounded">{editingRom ? 'Update' : 'Add'}</button>
                                {editingRom && <button onClick={() => setEditingRom(null)} type="button" className="px-4 py-2 bg-hsl-border rounded">Cancel</button>}
                            </div>
                        </form>
                        <div className="space-y-2">
                            {roms.map(r => {
                                const device = devices.find(d => d.id === r.deviceId);
                                return <div key={r.id} className="p-3 bg-hsl-card flex justify-between items-center rounded"><span>{device?.model} - {r.type} {r.version}</span><div><button onClick={() => setEditingRom(r)} className="mr-2 text-sm text-blue-400">Edit</button><button onClick={() => deleteRom(r.id)} className="text-sm text-red-400">Delete</button></div></div>
                            })}
                        </div>
                    </motion.div>
                );
            case 'applications':
                return (
                    <motion.div key="applications" variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                        <h2 className="text-2xl font-bold mb-4">Team Applications ({applications.length})</h2>
                         <div className="space-y-4">
                            {applications.map(app => (
                                <div key={app.id} className="p-4 bg-hsl-card rounded-lg border border-hsl-border">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold">{app.name} - <span className="font-normal text-hsl-primary">{app.role}</span></h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : app.status === 'approved' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{app.status}</span>
                                    </div>
                                    <p className="text-sm text-hsl-foreground/70">{app.email} | From: {app.country}</p>
                                    <p className="mt-2 text-sm text-hsl-foreground/90">{app.experience}</p>
                                    {app.status === 'pending' && (
                                        <div className="mt-4 flex gap-2">
                                            <button onClick={() => updateApplicationStatus(app.id, 'approved')} className="px-3 py-1 text-sm bg-green-500/80 rounded">Approve</button>
                                            <button onClick={() => updateApplicationStatus(app.id, 'rejected')} className="px-3 py-1 text-sm bg-red-500/80 rounded">Reject</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    }

    return (
        <AnimatedPage>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <button onClick={logout} className="px-4 py-2 bg-hsl-border rounded-lg hover:bg-red-500/20 transition-colors">Logout</button>
            </div>
            
            <div className="flex border-b border-hsl-border mb-6">
                {(['devices', 'roms', 'applications'] as AdminTab[]).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`capitalize relative px-4 py-2 font-medium ${activeTab === tab ? 'text-hsl-primary' : 'text-hsl-foreground/70'}`}>
                        {tab}
                        {activeTab === tab && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-hsl-primary" layoutId="admin-underline" />}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </AnimatedPage>
    );
};
