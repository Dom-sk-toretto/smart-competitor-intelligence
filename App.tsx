import React, { useState, createContext, useMemo, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CompetitorsPage from './pages/CompetitorsPage';
import InsightsPage from './pages/InsightsPage';
import ComparePage from './pages/ComparePage';
import NotificationsPage from './pages/NotificationsPage';
import AccountPage from './pages/AccountPage';
import Layout from './components/Layout';
import { Competitor, ProfileDetails, CompanyDetails, Notification } from './types';
import { INITIAL_COMPETITORS, INITIAL_NOTIFICATIONS } from './constants';


interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AppDataContextType {
  competitors: Competitor[];
  setCompetitors: React.Dispatch<React.SetStateAction<Competitor[]>>;
  profileDetails: ProfileDetails;
  setProfileDetails: React.Dispatch<React.SetStateAction<ProfileDetails>>;
  companyDetails: CompanyDetails;
  setCompanyDetails: React.Dispatch<React.SetStateAction<CompanyDetails>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  insightsGeneratedCount: number;
  incrementInsightsGeneratedCount: () => void;
}

export const AppDataContext = createContext<AppDataContextType | null>(null);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authContextValue = useMemo(() => ({
    isAuthenticated,
    login: () => setIsAuthenticated(true),
    logout: () => setIsAuthenticated(false),
  }), [isAuthenticated]);

  const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  };

  const [competitors, setCompetitors] = useState<Competitor[]>(() => getInitialState('competitors', INITIAL_COMPETITORS));
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>(() => getInitialState('profileDetails', { name: 'Demo User', email: 'demo@competitor.ai', photoUrl: 'https://picsum.photos/seed/user/100' }));
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>(() => getInitialState('companyDetails', { name: 'My Awesome Inc.', url: 'https://myawesome.inc' }));
  const [notifications, setNotifications] = useState<Notification[]>(() => getInitialState('notifications', INITIAL_NOTIFICATIONS));
  const [insightsGeneratedCount, setInsightsGeneratedCount] = useState<number>(() => getInitialState('insightsGeneratedCount', 8));

  useEffect(() => {
    try {
      localStorage.setItem('competitors', JSON.stringify(competitors));
    } catch (error) {
      console.error('Error saving competitors to localStorage:', error);
    }
  }, [competitors]);

  useEffect(() => {
    try {
      localStorage.setItem('profileDetails', JSON.stringify(profileDetails));
    } catch (error) {
      console.error('Error saving profileDetails to localStorage:', error);
    }
  }, [profileDetails]);
  
  useEffect(() => {
    try {
      localStorage.setItem('companyDetails', JSON.stringify(companyDetails));
    } catch (error) {
      console.error('Error saving companyDetails to localStorage:', error);
    }
  }, [companyDetails]);

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);
  
  useEffect(() => {
    try {
      localStorage.setItem('insightsGeneratedCount', JSON.stringify(insightsGeneratedCount));
    } catch (error) {
      console.error('Error saving insightsGeneratedCount to localStorage:', error);
    }
  }, [insightsGeneratedCount]);


  const incrementInsightsGeneratedCount = useCallback(() => {
    setInsightsGeneratedCount(prev => prev + 1);
  }, []);

  const appDataContextValue = useMemo(() => ({
    competitors,
    setCompetitors,
    profileDetails,
    setProfileDetails,
    companyDetails,
    setCompanyDetails,
    notifications,
    setNotifications,
    insightsGeneratedCount,
    incrementInsightsGeneratedCount,
  }), [competitors, profileDetails, companyDetails, notifications, insightsGeneratedCount, incrementInsightsGeneratedCount]);


  return (
    <AuthContext.Provider value={authContextValue}>
      <AppDataContext.Provider value={appDataContextValue}>
        <HashRouter>
          <Routes>
            <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
            
            <Route element={<Layout />}>
              <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} />
              <Route path="/competitors" element={isAuthenticated ? <CompetitorsPage /> : <Navigate to="/" />} />
              <Route path="/insights" element={isAuthenticated ? <InsightsPage /> : <Navigate to="/" />} />
              <Route path="/compare" element={isAuthenticated ? <ComparePage /> : <Navigate to="/" />} />
              <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/" />} />
              <Route path="/account" element={isAuthenticated ? <AccountPage /> : <Navigate to="/" />} />
            </Route>
          </Routes>
        </HashRouter>
      </AppDataContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;