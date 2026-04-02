import React, { useState, useEffect, useContext } from 'react';
import {
  UserCircleIcon,
  CreditCardIcon,
  BellIcon,
  ShieldIcon,
  PlugIcon,
  HelpCircleIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon
} from '../components/icons';
import { AppDataContext } from '../App';
import { ProfileDetails, CompanyDetails } from '../types';

type Action = {
  label: string;
  action: string;
};

type NavCategory = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Action[];
  description?: string;
};

const accountNavigation: Record<string, NavCategory> = {
  profile: {
    label: 'Profile',
    icon: UserCircleIcon,
    items: [
      { label: 'Edit Profile', action: 'editProfile' },
      { label: 'Change Password', action: 'changePassword' },
    ],
  },
  subscription: {
    label: 'Subscription',
    icon: CreditCardIcon,
    items: [
      { label: 'Current Plan', action: 'viewPlan' },
      { label: 'Billing Information', action: 'billingInfo' },
    ],
  },
  myCompany: {
      label: 'My Company',
      icon: BuildingOfficeIcon,
      items: [
          { label: 'Edit Company Details', action: 'editCompanyDetails' },
      ],
      description: 'Manage your own company information for comparison purposes.'
  },
  notifications: {
    label: 'Notifications',
    icon: BellIcon,
    items: [
      { label: 'Email Notifications', action: 'emailNotifications' },
      { label: 'Integration Alerts', action: 'integrationAlerts' },
    ],
  },
  integrations: {
    label: 'Integrations',
    icon: PlugIcon,
    items: [
      { label: 'API Key Management', action: 'manageAPIKeys' },
      { label: 'Connected Apps', action: 'connectedApps' },
    ],
  },
  security: {
    label: 'Security & Activity',
    icon: ShieldIcon,
    items: [
      { label: 'Login History', action: 'loginHistory' },
      { label: 'Active Sessions', action: 'activeSessions' },
    ],
  },
  support: {
    label: 'Support',
    icon: HelpCircleIcon,
    items: [
      { label: 'Contact Support', action: 'contactSupport' },
      { label: 'Submit Feedback', action: 'submitFeedback' },
    ],
  },
};

// --- Mock Data for Security Section ---
const MOCK_LOGIN_HISTORY = [
    { id: 1, date: '2024-07-22 10:30 AM', status: 'Success', ip: '198.51.100.1', location: 'New York, USA' },
    { id: 2, date: '2024-07-21 08:00 PM', status: 'Success', ip: '203.0.113.25', location: 'London, UK' },
    { id: 3, date: '2024-07-21 07:59 PM', status: 'Failed', ip: '192.0.2.14', location: 'Unknown' },
];

const MOCK_ACTIVE_SESSIONS = [
    { id: 1, device: 'Chrome on macOS', type: 'desktop', ip: '198.51.100.1', lastSeen: 'Active now', isCurrent: true },
    { id: 2, device: 'iPhone 15 Pro', type: 'mobile', ip: '203.0.113.50', lastSeen: '2 hours ago', isCurrent: false },
];


// Helper Components for Action Views
const InputField = ({ id, label, type = 'text', value, onChange }: { id: string, label: string, type?: string, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input 
            id={id} 
            type={type} 
            value={value}
            onChange={onChange}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
    </div>
);

const ToggleSwitch = ({ id, label, enabled, setEnabled }: { id: string, label: string, enabled: boolean, setEnabled: (e: boolean) => void }) => (
    <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
        <span className="font-semibold text-white">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`${
                enabled ? 'bg-cyan-500' : 'bg-slate-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
            <span
                className={`${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
        </button>
    </div>
);


const ActionContent: React.FC<{ action: string; }> = ({ action }) => {
    const appData = useContext(AppDataContext);
    if (!appData) return null; // or a loading indicator

    const { profileDetails, setProfileDetails, companyDetails, setCompanyDetails } = appData;

    // States for interactive components
    const [notifications, setNotifications] = useState({ weekly: true, product: false, security: true });
    const [activeSessions, setActiveSessions] = useState(MOCK_ACTIVE_SESSIONS);

    // Local state for forms
    const [localProfile, setLocalProfile] = useState(profileDetails);
    const [localCompany, setLocalCompany] = useState(companyDetails);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        setLocalProfile(profileDetails);
    }, [profileDetails]);
    
    useEffect(() => {
        setLocalCompany(companyDetails);
    }, [companyDetails]);

    const handleProfileSave = () => {
        setProfileDetails(prev => ({...prev, name: localProfile.name, email: localProfile.email}));
        alert('Profile details saved!');
    };

    const handleCompanySave = () => {
        setCompanyDetails(localCompany);
        alert('Company details saved!');
    };
    
    const handlePasswordChange = () => {
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match.");
            return;
        }
        if (!passwords.new || !passwords.current) {
            alert("Please fill in all password fields.");
            return;
        }
        alert('Password changed successfully! (Demo)');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const handlePhotoChange = () => {
      const newUrl = window.prompt("Enter new profile image URL:", profileDetails.photoUrl);
      if (newUrl) {
          setProfileDetails(prevDetails => ({ ...prevDetails, photoUrl: newUrl }));
          alert('Profile photo updated!');
      }
    };

    const handlePhotoRemove = () => {
        if (window.confirm("Are you sure you want to remove your profile photo?")) {
            setProfileDetails(prevDetails => ({ ...prevDetails, photoUrl: '' }));
            alert('Profile photo removed.');
        }
    };

    const handleLogoutSession = (sessionId: number) => {
        if (window.confirm("Are you sure you want to log out this session?")) {
            setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
            alert('Session logged out.');
        }
    };

    switch(action) {
        case 'editProfile':
            return (
                <div>
                    <div className="flex items-center gap-6 mb-6">
                        {profileDetails.photoUrl ? (
                            <img src={profileDetails.photoUrl} alt="Profile" className="w-24 h-24 rounded-full border-2 border-cyan-400 object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-slate-700">
                                <UserCircleIcon className="w-16 h-16 text-slate-500" />
                            </div>
                        )}
                        <div className="space-y-2">
                           {profileDetails.photoUrl ? (
                                <>
                                    <button onClick={handlePhotoChange} className="px-4 py-1.5 text-sm font-bold text-white bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                                        Change Photo
                                    </button>
                                    <button onClick={handlePhotoRemove} className="ml-2 px-4 py-1.5 text-sm font-bold text-red-400 bg-red-900/30 rounded-lg hover:bg-red-900/50 transition-colors">
                                        Remove
                                    </button>
                                </>
                           ) : (
                                <button onClick={handlePhotoChange} className="px-4 py-1.5 text-sm font-bold text-white bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                                    Add Photo
                                </button>
                           )}
                           <p className="text-xs text-slate-400">Enter a URL for your new photo.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <InputField id="name" label="Full Name" value={localProfile.name} onChange={e => setLocalProfile({...localProfile, name: e.target.value})} />
                        <InputField id="email" label="Email Address" type="email" value={localProfile.email} onChange={e => setLocalProfile({...localProfile, email: e.target.value})} />
                        <button onClick={handleProfileSave} className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
                    </div>
                </div>
            );
        case 'changePassword':
             return (
                <div className="space-y-4">
                    <InputField id="currentPassword" label="Current Password" type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
                    <InputField id="newPassword" label="New Password" type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
                    <InputField id="confirmPassword" label="Confirm New Password" type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
                    <button onClick={handlePasswordChange} className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg hover:opacity-90 transition-opacity">Update Password</button>
                </div>
            );
        case 'viewPlan':
            return (
                <div className="bg-slate-800/50 p-6 rounded-lg text-center">
                    <p className="text-slate-400">Your Current Plan</p>
                    <p className="text-3xl font-bold text-white mt-2">Pro Plan</p>
                    <p className="text-slate-300 mt-1">$99 / month</p>
                    <button className="mt-4 px-5 py-2 text-sm font-bold text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">Manage Subscription</button>
                </div>
            );
        case 'billingInfo':
            return (
                 <div className="bg-slate-800/50 p-6 rounded-lg">
                    <h4 className="font-bold text-white mb-2">Payment Method</h4>
                    <p className="text-slate-300">Visa ending in 4242</p>
                    <p className="text-slate-400 text-sm">Expires 12/2026</p>
                     <button className="mt-4 text-sm text-cyan-400 hover:text-cyan-300">Update Payment Method</button>
                </div>
            );
        case 'editCompanyDetails':
            return (
                <div className="space-y-4">
                    <InputField id="companyName" label="Your Company Name" value={localCompany.name} onChange={e => setLocalCompany({...localCompany, name: e.target.value})} />
                    <InputField id="companyUrl" label="Your Company URL" type="url" value={localCompany.url} onChange={e => setLocalCompany({...localCompany, url: e.target.value})} />
                    <button onClick={handleCompanySave} className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg hover:opacity-90 transition-opacity">Save Company Details</button>
                </div>
            );
        case 'emailNotifications':
            return (
                <div className="space-y-4">
                    <ToggleSwitch id="weekly" label="Weekly Summary Reports" enabled={notifications.weekly} setEnabled={val => setNotifications(p => ({...p, weekly: val}))} />
                    <ToggleSwitch id="product" label="New Product Updates" enabled={notifications.product} setEnabled={val => setNotifications(p => ({...p, product: val}))} />
                    <ToggleSwitch id="security" label="Security Alerts" enabled={notifications.security} setEnabled={val => setNotifications(p => ({...p, security: val}))} />
                </div>
            );
        case 'loginHistory':
            return (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="p-3 font-semibold text-slate-300 text-sm">Date</th>
                                <th className="p-3 font-semibold text-slate-300 text-sm">Status</th>
                                <th className="p-3 font-semibold text-slate-300 text-sm">IP Address</th>
                                <th className="p-3 font-semibold text-slate-300 text-sm">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_LOGIN_HISTORY.map(log => (
                                <tr key={log.id} className="border-b border-slate-800">
                                    <td className="p-3 text-slate-300">{log.date}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${log.status === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-300">{log.ip}</td>
                                    <td className="p-3 text-slate-300">{log.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case 'activeSessions':
            return (
                <div className="space-y-4">
                    {activeSessions.map(session => (
                         <div key={session.id} className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {session.type === 'desktop' ? <ComputerDesktopIcon className="w-8 h-8 text-slate-400"/> : <DevicePhoneMobileIcon className="w-8 h-8 text-slate-400"/>}
                                <div>
                                    <p className="font-semibold text-white">{session.device} {session.isCurrent && <span className="text-xs text-green-400 ml-2">(This session)</span>}</p>
                                    <p className="text-sm text-slate-400">{session.lastSeen} &middot; {session.ip}</p>
                                </div>
                            </div>
                            {!session.isCurrent && (
                                <button onClick={() => handleLogoutSession(session.id)} className="text-sm font-semibold text-red-400 hover:text-red-300">
                                    Log out
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            );
        default:
            return <p className="text-slate-400">This feature is under construction. Check back soon!</p>;
    }
}

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  useEffect(() => {
      // Reset action view when tab changes
      setCurrentAction(null);
  }, [activeTab]);

  const selectedCategory = accountNavigation[activeTab];

  const handleBack = () => setCurrentAction(null);

  return (
    <div className="animate-fadeInUp max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Account Settings</h2>
        <p className="text-slate-400 mt-1">Manage your account, subscription, and security settings.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <nav className="space-y-1">
            {Object.entries(accountNavigation).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === key
                    ? 'bg-blue-600/30 text-white font-semibold'
                    : 'text-gray-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1 bg-slate-900/50 border border-slate-700/80 rounded-xl backdrop-blur-sm p-8">
            {currentAction ? (
                <div>
                    <button onClick={handleBack} className="text-sm text-cyan-400 hover:text-cyan-300 mb-6 flex items-center gap-1">
                        &larr; Back to {selectedCategory.label}
                    </button>
                    <h3 className="text-2xl font-bold text-white mb-6">{selectedCategory.items.find(i => i.action === currentAction)?.label}</h3>
                    <ActionContent 
                        action={currentAction} 
                    />
                </div>
            ) : (
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedCategory.label}</h3>
                    <p className="text-slate-400 mb-6">{selectedCategory.description || `Manage your ${selectedCategory.label.toLowerCase()} settings.`}</p>
                    <ul className="space-y-4">
                        {selectedCategory.items.map(item => (
                        <li key={item.action} className="bg-slate-800/50 p-4 rounded-lg flex justify-between items-center">
                            <p className="font-semibold text-white">{item.label}</p>
                            <button 
                                onClick={() => setCurrentAction(item.action)}
                                className="px-4 py-1.5 text-sm font-bold text-white bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                            >
                            Manage
                            </button>
                        </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;