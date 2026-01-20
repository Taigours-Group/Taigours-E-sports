
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';

// Page Components
import HomePage from './pages/HomePage';
import TournamentsPage from './pages/TournamentsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import StreamsPage from './pages/StreamsPage';
import AdminPanel from './components/AdminPanel';

// Shared Components
import Header from './components/Header';
import Footer from './components/Footer';

// Use localhost for local dev, but we handle the failure gracefully
const API_BASE = '/api';

const LoadingScreen = ({ progress, status, error, onRetry }) => (
  <div className="fixed inset-0 z-[2000] bg-bg-dark flex flex-col items-center justify-center p-8">
    <div className="relative mb-12 group">
      <img 
        src="https://res.cloudinary.com/dbjjzyrr3/image/upload/v1768567786/tiger-logo_jcf2zj.png" 
        className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-2 border-primary group-hover:rotate-[360deg] transition-transform duration-1000 shadow-[0_0_30px_rgba(0,212,255,0.3)]" 
        alt="Logo" 
      />
      <div className={`absolute inset-0 ${error ? 'bg-red-500/20' : 'bg-primary/20'} animate-pulse blur-2xl -z-10`}></div>
    </div>
    
    <div className="w-full max-w-md text-center">
      <h1 className="font-orbitron font-black text-2xl md:text-3xl text-white mb-2 tracking-tighter text-glow text-center">
        TAIGOUR'S <span className="text-primary uppercase">E-Sports</span>
      </h1>
      <p className={`font-rajdhani ${error ? 'text-red-500' : 'text-gray-500'} text-[10px] md:text-xs uppercase tracking-[0.4em] mb-8 animate-pulse font-bold`}>
        {status}
      </p>
      
      {!error ? (
        <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/5">
          <div 
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_20px_rgba(0,212,255,1)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded text-red-400 font-rajdhani text-sm">
             Backend server at <strong>{API_BASE}</strong> is unreachable. 
             The app will run in <strong>Static Mode</strong> (Read-only).
          </div>
          <button 
            onClick={onRetry}
            className="px-6 py-2 bg-primary text-bg-dark font-orbitron font-black text-xs uppercase tracking-widest hover:shadow-glow transition-all"
          >
            Enter Static Mode
          </button>
        </div>
      )}
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Syncing Data...');

  const [tournaments, setTournaments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streams, setStreams] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  
  const addLog = useCallback((method, endpoint, status = 'SUCCESS') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      method,
      endpoint,
      timestamp: new Date().toLocaleTimeString(),
      status
    };
    setSystemLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      // Step 1: Try Backend API
      const response = await fetch(`${API_BASE}/data`);
      if (!response.ok) throw new Error('API offline');
      const data = await response.json();
      
      setTournaments(data.tournaments || []);
      setLeaderboard(data.leaderboard || []);
      setStreams(data.streams || []);
      setRegistrations(data.registrations || []);
      
      addLog('GET', '/api/data', 'SUCCESS');
      setIsStandalone(false);
      return true;
    } catch (err) {
      console.warn("Backend API unavailable. Falling back to local DB files.", err);
      
      // Step 2: Fallback to static JSON files in ./db/
      try {
        const [t, l, s, r] = await Promise.all([
          fetch('./db/tournaments.json').then(res => res.json()),
          fetch('./db/leaderboard.json').then(res => res.json()),
          fetch('./db/streams.json').then(res => res.json()),
          fetch('./db/registrations.json').then(res => res.json()).catch(() => [])
        ]);
        
        setTournaments(t);
        setLeaderboard(l);
        setStreams(s);
        setRegistrations(r);
        
        addLog('SYSTEM', 'Static Fallback Active', 'SUCCESS');
        setIsStandalone(true);
        return true;
      } catch (fallbackErr) {
        addLog('GET', '/api/data', 'ERROR');
        return false;
      }
    }
  }, [addLog]);

  useEffect(() => {
    const initApp = async () => {
      setLoadingStatus('Connecting to Neural Link...');
      setLoadingProgress(30);
      
      const success = await refreshData();
      
      if (success) {
        setLoadingProgress(100);
        setLoadingStatus('Authentication Successful.');
        setTimeout(() => setIsLoading(false), 800);
      } else {
        setLoadingStatus('Connection Failed. Node Server Offline.');
        setConnectionError(true);
      }
    };
    initApp();
  }, [refreshData]);

  const updateResource = async (resource, data) => {
    if (isStandalone) {
      alert("Application is in 'Static Mode'. Updates require the Node.js server to be running.");
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        addLog('POST', `/api/${resource}`, 'SUCCESS');
        if (resource === 'tournaments') setTournaments(data);
        if (resource === 'leaderboard') setLeaderboard(data);
        if (resource === 'streams') setStreams(data);
        if (resource === 'registrations') setRegistrations(data);
        return true;
      }
    } catch (err) {
      addLog('POST', `/api/${resource}`, 'ERROR');
      alert('Could not reach the backend. Check if node server.js is running.');
    }
    return false;
  };

  const addRegistration = async (reg) => {
    if (isStandalone) {
      // In standalone, we just update local state so user sees a "success" 
      // even if it won't persist past a refresh.
      setRegistrations(prev => [...prev, reg]);
      alert('Registration simulated (Static Mode). Run the Node server for permanent storage.');
      return;
    }
    const newData = [...registrations, reg];
    await updateResource('registrations', newData);
  };

  if (isLoading) {
    return (
      <LoadingScreen 
        progress={loadingProgress} 
        status={loadingStatus} 
        error={connectionError} 
        onRetry={() => setIsLoading(false)} 
      />
    );
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-bg-dark text-white overflow-x-hidden selection:bg-primary selection:text-bg-dark">
    
        <Header />
        <main className="flex-grow pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage tournaments={tournaments} leaderboard={leaderboard} />} />
            <Route 
              path="/tournaments" 
              element={<TournamentsPage tournaments={tournaments} onRegister={addRegistration} />} 
            />
            <Route path="/leaderboard" element={<LeaderboardPage leaderboard={leaderboard} />} />
            <Route path="/streams" element={<StreamsPage streams={streams} />} />
            <Route 
              path="/admin" 
              element={
                <AdminPanel 
                  tournaments={tournaments} 
                  saveTournaments={(data) => updateResource('tournaments', data)}
                  leaderboard={leaderboard}
                  saveLeaderboard={(data) => updateResource('leaderboard', data)}
                  streams={streams}
                  saveStreams={(data) => updateResource('streams', data)}
                  registrations={registrations}
                  saveRegistrations={(data) => updateResource('registrations', data)}
                  systemLogs={systemLogs}
                  isReadOnly={isStandalone}
                />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
