import React, { useState, useContext } from 'react';
import { BellIcon, SparklesIcon, ArrowPathIcon, SpinnerIcon } from '../components/icons';
import { Notification } from '../types';
import { AppDataContext } from '../App';
import { checkForCompetitorUpdates } from '../services/geminiService';

const NotificationCard: React.FC<{ notification: Notification; onMarkRead: (id: string) => void }> = ({ notification, onMarkRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'launch':
        return <SparklesIcon className="w-6 h-6 text-yellow-400" />;
      case 'pricing':
        return <span className="text-xl">💰</span>;
      case 'feature':
        return <span className="text-xl">🔧</span>;
      case 'funding':
        return <span className="text-xl">📈</span>;
      default:
        return <BellIcon className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className={`flex gap-4 p-4 rounded-lg border transition-all animate-fadeInUp ${
      notification.read ? 'bg-slate-900/30 border-slate-800 opacity-60' : 'bg-slate-800/50 border-slate-700'
    }`}>
      {!notification.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-1 bg-cyan-400 rounded-r-full"></div>}
      <div className="w-12 h-12 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center relative">
        {getIcon()}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <img src={notification.competitorLogo} alt={notification.competitorName} className="w-5 h-5 rounded-full"/>
              <p className="font-semibold text-white">{notification.title}</p>
            </div>
            <p className="text-sm text-slate-400 mt-1">{notification.description}</p>
          </div>
          {!notification.read && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 whitespace-nowrap ml-4"
            >
              Mark as read
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-2">{new Date(notification.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

const NotificationsPage: React.FC = () => {
  const appData = useContext(AppDataContext);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!appData) {
      return <div>Loading...</div>;
  }
  const { notifications, setNotifications, competitors } = appData;

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleCheckForUpdates = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const newUpdates = await checkForCompetitorUpdates(competitors);
        const newNotifications: Notification[] = newUpdates.map(update => ({
            ...update,
            id: `notif_${Date.now()}_${Math.random()}`,
            timestamp: new Date().toISOString(),
            read: false,
        }));
        setNotifications(prev => [...newNotifications, ...prev]);
    } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(n => filter === 'all' || !n.read);

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div>
        <h2 className="text-3xl font-bold text-white">Notifications</h2>
        <p className="text-slate-400 mt-1">Stay updated with the latest competitor activities and market shifts.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-600/30 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              filter === 'unread' ? 'bg-blue-600/30 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            Unread
          </button>
        </div>
         <div className="flex items-center gap-4">
            <button
              onClick={handleCheckForUpdates}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 px-4 py-2"
            >
              {isLoading ? (
                  <>
                      <SpinnerIcon className="w-4 h-4 animate-spin"/>
                      Checking...
                  </>
              ) : (
                  <>
                      <ArrowPathIcon className="w-4 h-4" />
                      Check for New Updates
                  </>
              )}
            </button>
            <button
              onClick={handleMarkAllRead}
              className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Mark all as read
            </button>
        </div>
      </div>
      
      {error && <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center">{error}</div>}

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div key={notification.id} className="relative">
                 <NotificationCard notification={notification} onMarkRead={handleMarkRead} />
            </div>
          ))
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-lg">
            <BellIcon className="mx-auto h-12 w-12 text-slate-500" />
            <h3 className="mt-2 text-xl font-medium text-white">All Caught Up!</h3>
            <p className="mt-1 text-sm text-slate-400">You have no unread notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;