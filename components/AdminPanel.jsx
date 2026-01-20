
import React, { useState, useMemo } from 'react';

const AdminPanel = ({
  tournaments, saveTournaments,
  leaderboard, saveLeaderboard,
  streams, saveStreams,
  registrations, saveRegistrations,
  systemLogs,
  isReadOnly = false
}) => {
  const [activeView, setActiveView] = useState('tournaments');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Form Initial States
  const initialTournament = {
    game: 'Free Fire', type: 'freefire', location: 'Nepal',
    prize: 'रु 1,000', entryFee: 'रु 100', date: '', time: '07:00 PM',
    registrationUrl: '#', streamId: '',
    image: 'https://picsum.photos/seed/default/600/400', title: ''
  };

  const initialLeaderboard = {
    game: 'freefire', kills: 0, wins: 0, points: 0, teamName: '',
    avatar: 'https://picsum.photos/seed/new/50/50'
  };

  const initialStream = {
    title: '', youtubeId: '', isLive: false
  };

  const initialRegistration = {
    playerName: '', playerEmail: '', playerContact: '', gameUid: '', tournamentTitle: '', tournamentId: ''
  };

  // Current Form Data States
  const [tourneyForm, setTourneyForm] = useState(initialTournament);
  const [lbForm, setLbForm] = useState(initialLeaderboard);
  const [streamForm, setStreamForm] = useState(initialStream);
  const [regForm, setRegForm] = useState(initialRegistration);

  // Filtered Data
  const filteredData = useMemo(() => {
    const s = search.toLowerCase();
    switch (activeView) {
      case 'tournaments': return tournaments.filter(t => t.title.toLowerCase().includes(s));
      case 'leaderboard': return leaderboard.filter(l => l.teamName.toLowerCase().includes(s));
      case 'streams': return streams.filter(s_ => s_.title.toLowerCase().includes(s));
      case 'registrations': return registrations.filter(r => r.playerName.toLowerCase().includes(s) || r.tournamentTitle.toLowerCase().includes(s));
      default: return [];
    }
  }, [activeView, tournaments, leaderboard, streams, registrations, search]);

  // Handlers
  const handleSaveTournament = async (e) => {
    e.preventDefault();
    if (isReadOnly) return alert('Cannot save in Static Mode. Connect to Node.js backend.');
    if (!tourneyForm.title || !tourneyForm.date) return alert('Required fields missing');

    let newData;
    if (editingId) {
      newData = tournaments.map(t => t.id === editingId ? { ...t, ...tourneyForm } : t);
    } else {
      newData = [...tournaments, { ...tourneyForm, id: Date.now().toString() }];
    }

    const success = await saveTournaments(newData);
    if (success) {
      alert('Tournament Saved! 🚀');
      resetForms();
    }
  };

  const handleSaveLeaderboard = async (e) => {
    e.preventDefault(); 
    if (isReadOnly) return alert('Cannot save in Static Mode.');
    if (!lbForm.teamName) return alert('Team Name missing');

    let newData;
    if (editingId) {
      newData = leaderboard.map(l => l.id === editingId ? { ...l, ...lbForm } : l);
    } else {
      newData = [...leaderboard, { ...lbForm, id: Date.now().toString() }];
    }

    const success = await saveLeaderboard(newData);
    if (success) {
      alert('Ranking Updated! 🎖️');
      resetForms();
    }
  };

  const handleSaveStream = async (e) => {
    e.preventDefault();
    if (isReadOnly) return alert('Cannot save in Static Mode.');
    if (!streamForm.title || !streamForm.youtubeId) return alert('Missing stream data');

    let newData;
    if (editingId) {
      newData = streams.map(s => s.id === editingId ? { ...s, ...streamForm } : s);
    } else {
      newData = [...streams, { ...streamForm, id: Date.now().toString() }];
    }

    const success = await saveStreams(newData);
    if (success) resetForms();
  };

  const handleSaveRegistration = async (e) => {
    e.preventDefault();
    if (isReadOnly) return alert('Cannot save in Static Mode.');
    if (!regForm.playerName || !regForm.gameUid) return alert('Missing player data');
    if (editingId) {
      const newData = registrations.map(r => r.id === editingId ? { ...r, ...regForm } : r);
      await saveRegistrations(newData);
    }
    resetForms();
  };

  const resetForms = () => {
    setEditingId(null);
    setTourneyForm(initialTournament);
    setLbForm(initialLeaderboard);
    setStreamForm(initialStream);
    setRegForm(initialRegistration);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    switch (activeView) {
      case 'tournaments': setTourneyForm(item); break;
      case 'leaderboard': setLbForm(item); break;
      case 'streams': setStreamForm(item); break;
      case 'registrations': setRegForm(item); break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (isReadOnly) return alert('Cannot delete in Static Mode.');
    if (!confirm('Permanently delete this record?')) return;
    switch (activeView) {
      case 'tournaments': await saveTournaments(tournaments.filter(t => t.id !== id)); break;
      case 'leaderboard': await saveLeaderboard(leaderboard.filter(l => l.id !== id)); break;
      case 'streams': await saveStreams(streams.filter(s => s.id !== id)); break;
      case 'registrations': await saveRegistrations(registrations.filter(r => r.id !== id)); break;
    }
  };

  const exportDatabase = () => {
    const db = { tournaments, leaderboard, streams, registrations };
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esports_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importDatabase = async (e) => {
    if (isReadOnly) return alert('Cannot import in Static Mode.');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        if (data.tournaments) await saveTournaments(data.tournaments);
        if (data.leaderboard) await saveLeaderboard(data.leaderboard);
        if (data.streams) await saveStreams(data.streams);
        if (data.registrations) await saveRegistrations(data.registrations);
        alert('Database Restored Successfully! 🛡️');
      } catch (err) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const resetRegistrations = async () => {
    if (isReadOnly) return alert('Cannot wipe data in Static Mode.');
    if (confirm('Wipe ALL player registrations? This cannot be undone.')) {
      await saveRegistrations([]);
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-bg-dark min-h-screen">
      <div className="container mx-auto px-4">
        {/* Nav Header */}
        <header className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-orbitron font-black text-white uppercase tracking-tight text-glow">
              CORE <span className="text-primary">ADMIN</span>
            </h1>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              <span className={`w-2 h-2 rounded-full ${isReadOnly ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {isReadOnly ? 'Static Mode' : 'Backend Live'}
              </span>
            </div>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded border border-white/10 overflow-x-auto no-scrollbar w-full md:w-auto">
            {['tournaments', 'leaderboard', 'streams', 'registrations', 'logs', 'system'].map((view) => (
              <button 
                key={view}
                onClick={() => { setActiveView(view); resetForms(); setSearch(''); }}
                className={`px-4 py-2 font-bold font-orbitron text-[10px] md:text-xs transition-all uppercase tracking-widest whitespace-nowrap ${activeView === view ? 'bg-primary text-bg-dark' : 'text-gray-500 hover:text-white'}`}
              >
                {view}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-5 xl:col-span-4">
            {activeView !== 'logs' && activeView !== 'system' && (
              <div className="glass p-6 md:p-8 rounded-lg border border-primary/20 sticky top-24 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-orbitron font-black text-white uppercase border-l-4 border-primary pl-4 tracking-widest">
                    {editingId ? 'MODIFY RECORD' : 'CREATE NEW'}
                  </h2>
                  {editingId && (
                    <button onClick={resetForms} className="text-xs text-accent hover:underline uppercase font-bold">Cancel</button>
                  )}
                </div>

                {isReadOnly && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                    Read-Only Mode Active
                  </div>
                )}

                {activeView === 'tournaments' && (
                  <form onSubmit={handleSaveTournament} className="space-y-4 font-rajdhani">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Type</label>
                        <select className="w-full bg-bg-dark border border-white/10 p-3 rounded text-sm text-white" value={tourneyForm.type} onChange={e => setTourneyForm({ ...tourneyForm, type: e.target.value })}>
                          <option value="freefire">Free Fire</option>
                          <option value="pubg">PUBG Mobile</option>
                          <option value="ludo">Ludo King</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Prize</label>
                        <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={tourneyForm.prize} onChange={e => setTourneyForm({ ...tourneyForm, prize: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Title</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={tourneyForm.title} onChange={e => setTourneyForm({ ...tourneyForm, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Date</label>
                        <input type="date" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={tourneyForm.date} onChange={e => setTourneyForm({ ...tourneyForm, date: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Time</label>
                        <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={tourneyForm.time} onChange={e => setTourneyForm({ ...tourneyForm, time: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Location</label>
                        <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={tourneyForm.location} onChange={e => setTourneyForm({ ...tourneyForm, location: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Fee</label>
                        <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={tourneyForm.entryFee} onChange={e => setTourneyForm({ ...tourneyForm, entryFee: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Banner URL</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={tourneyForm.image} onChange={e => setTourneyForm({ ...tourneyForm, image: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Stream ID</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={tourneyForm.streamId} onChange={e => setTourneyForm({ ...tourneyForm, streamId: e.target.value })} />
                    </div>
                    <button type="submit" disabled={isReadOnly} className={`w-full py-4 bg-primary text-bg-dark font-orbitron font-black text-xs uppercase tracking-widest shadow-glow ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {editingId ? 'COMMIT CHANGES' : 'CREATE TOURNAMENT'}
                    </button>
                  </form>
                )}

                {activeView === 'leaderboard' && (
                  <form onSubmit={handleSaveLeaderboard} className="space-y-4 font-rajdhani">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Game</label>
                      <select className="w-full bg-bg-dark border border-white/10 p-3 rounded text-sm text-white" value={lbForm.game} onChange={e => setLbForm({ ...lbForm, game: e.target.value })}>
                        <option value="freefire">Free Fire</option>
                        <option value="pubg">PUBG Mobile</option>
                        <option value="ludo">Ludo King</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Team/Player Name</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={lbForm.teamName} onChange={e => setLbForm({ ...lbForm, teamName: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase text-center block">Kills</label>
                        <input type="number" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white text-center" value={lbForm.kills} onChange={e => setLbForm({ ...lbForm, kills: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase text-center block">Wins</label>
                        <input type="number" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white text-center" value={lbForm.wins} onChange={e => setLbForm({ ...lbForm, wins: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase text-center block">Points</label>
                        <input type="number" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white text-center" value={lbForm.points} onChange={e => setLbForm({ ...lbForm, points: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Avatar Image URL</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={lbForm.avatar} onChange={e => setLbForm({ ...lbForm, avatar: e.target.value })} />
                    </div>
                    <button type="submit" disabled={isReadOnly} className={`w-full py-4 bg-primary text-bg-dark font-orbitron font-black text-xs uppercase tracking-widest ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {editingId ? 'COMMIT CHANGES' : 'CREATE ENTRY'}
                    </button>
                  </form>
                )}

                {activeView === 'streams' && (
                  <form onSubmit={handleSaveStream} className="space-y-4 font-rajdhani">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Stream Title</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={streamForm.title} onChange={e => setStreamForm({ ...streamForm, title: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">YouTube ID</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={streamForm.youtubeId} onChange={e => setStreamForm({ ...streamForm, youtubeId: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded border border-white/10">
                      <input type="checkbox" id="islive_check" className="w-5 h-5 accent-primary" checked={streamForm.isLive} onChange={e => setStreamForm({ ...streamForm, isLive: e.target.checked })} />
                      <label htmlFor="islive_check" className="text-[10px] font-black text-white uppercase cursor-pointer tracking-widest">Live Broadcast Mode</label>
                    </div>
                    <button type="submit" disabled={isReadOnly} className={`w-full py-4 bg-primary text-bg-dark font-orbitron font-black text-xs uppercase tracking-widest ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {editingId ? 'UPDATE BROADCAST' : 'SCHEDULE BROADCAST'}
                    </button>
                  </form>
                )}

                {activeView === 'registrations' && (
                  <div className="space-y-4">
                    {!editingId ? (
                      <div className="text-center py-20 text-gray-600 font-rajdhani italic">Select a player from the list to modify details.</div>
                    ) : (
                      <form onSubmit={handleSaveRegistration} className="space-y-4 font-rajdhani">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase">Tournament</label>
                          <input type="text" readOnly className="w-full bg-black/40 border border-white/10 p-3 rounded text-sm text-gray-500" value={regForm.tournamentTitle} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase">Player Name</label>
                          <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={regForm.playerName} onChange={e => setRegForm({ ...regForm, playerName: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 uppercase">Game UID</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={regForm.gameUid} onChange={e => setRegForm({ ...regForm, gameUid: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 uppercase">Contact</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white" value={regForm.playerContact} onChange={e => setRegForm({ ...regForm, playerContact: e.target.value })} />
                          </div>
                        </div>
                        <button type="submit" disabled={isReadOnly} className={`w-full py-4 bg-primary text-bg-dark font-orbitron font-black text-xs uppercase tracking-widest ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}>SAVE PLAYER PROFILE</button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* System Tab Sidebar Widgets */}
            {activeView === 'system' && (
              <div className="space-y-6">
                <div className="glass p-6 rounded-lg border border-white/5">
                  <h3 className="font-orbitron font-black text-white text-xs uppercase tracking-widest mb-4 border-b border-white/5 pb-2 text-glow">Global Stats</h3>
                  <div className="grid grid-cols-2 gap-4 font-rajdhani">
                    <div className="p-3 bg-white/5 rounded">
                      <div className="text-primary text-2xl font-black">{tournaments.length}</div>
                      <div className="text-[9px] text-gray-500 uppercase font-bold">Tournaments</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded">
                      <div className="text-accent text-2xl font-black">{registrations.length}</div>
                      <div className="text-[9px] text-gray-500 uppercase font-bold">Registrations</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

             {activeView === 'logs' && (
              <div className="glass p-6 rounded-lg border border-white/5">
                <h3 className="font-orbitron font-black text-white text-xs uppercase tracking-widest mb-4">Traffic Monitor</h3>
                <div className="p-4 bg-black/50 border border-primary/20 rounded font-mono text-[10px] text-primary/80">
                  <p className="animate-pulse"> {isReadOnly ? 'STATIC ENGINE ACTIVE' : 'API CONNECTED...'}</p>
                </div>
              </div>
            )}
          </div>

          {/* List Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="glass p-6 md:p-8 rounded-lg flex flex-col min-h-[600px] shadow-2xl">
              
              {/* SYSTEM VIEW UI */}
              {activeView === 'system' ? (
                <div className="space-y-12">
                   <div>
                    <h3 className="text-xl font-orbitron font-black text-white uppercase tracking-tighter mb-6 text-glow">DATA <span className="text-primary">MANAGEMENT</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Export Card */}
                      <div className="p-6 bg-white/5 border border-white/10 rounded-lg hover:border-primary transition-all group">
                        <i className="fas fa-file-export text-primary text-2xl mb-4"></i>
                        <h4 className="text-white font-bold font-orbitron text-xs mb-2">EXPORT DATABASE</h4>
                        <p className="text-gray-500 font-rajdhani text-xs mb-6">Download a full JSON backup of all project data.</p>
                        <button onClick={exportDatabase} className="w-full py-2 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-bg-dark transition-all">START EXPORT</button>
                      </div>

                      {/* Import Card */}
                      <div className={`p-6 bg-white/5 border border-white/10 rounded-lg hover:border-accent transition-all group ${isReadOnly ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                        <i className="fas fa-file-import text-accent text-2xl mb-4"></i>
                        <h4 className="text-white font-bold font-orbitron text-xs mb-2">IMPORT DATABASE</h4>
                        <p className="text-gray-500 font-rajdhani text-xs mb-6">Restore database from backup file. Overwrites current data.</p>
                        <div className="relative">
                          <input type="file" accept=".json" onChange={importDatabase} disabled={isReadOnly} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <div className="w-full py-2 border border-accent/40 text-accent text-[10px] font-black uppercase tracking-widest text-center">UPLOAD BACKUP</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-orbitron font-black text-white uppercase tracking-tighter mb-6">SYSTEM <span className="text-red-500">DANGER ZONE</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-6 bg-red-500/5 border border-red-500/20 rounded-lg ${isReadOnly ? 'opacity-50' : ''}`}>
                        <h4 className="text-red-500 font-bold font-orbitron text-xs mb-2 uppercase">Wipe Registrations</h4>
                        <p className="text-gray-500 font-rajdhani text-xs mb-6">Delete all player registration records permanently.</p>
                        <button onClick={resetRegistrations} disabled={isReadOnly} className={`w-full py-2 bg-red-600/20 text-red-500 border border-red-600/40 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all ${isReadOnly ? 'cursor-not-allowed' : ''}`}>EXECUTE WIPE</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h3 className="font-orbitron font-black text-white uppercase text-xl tracking-wider text-glow">
                      {activeView.toUpperCase()} <span className="text-primary">RECORDS</span>
                    </h3>
                    {activeView !== 'logs' && (
                      <div className="relative w-full md:w-64">
                         <input 
                          type="text" 
                          placeholder="Search database..." 
                          className="w-full bg-white/5 border border-white/10 px-4 py-2 rounded text-sm text-white outline-none focus:border-primary"
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 flex-grow overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                    {activeView === 'logs' ? (
                      <div className="font-mono text-[10px] space-y-2">
                        {systemLogs.map(log => (
                          <div key={log.id} className="flex gap-4 p-3 bg-black/40 border-l-2 border-primary/40 text-gray-400 rounded-r">
                            <span className="text-gray-600">[{log.timestamp}]</span>
                            <span className={`font-black uppercase ${log.method === 'POST' ? 'text-accent' : log.method === 'SYSTEM' ? 'text-secondary' : 'text-primary'}`}>{log.method}</span>
                            <span className="text-white">{log.endpoint}</span>
                            <span className="ml-auto text-green-500">{log.status}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {filteredData.map((item) => (
                          <div key={item.id} className={`p-4 rounded flex items-center justify-between border transition-all ${editingId === item.id ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="min-w-0">
                                <div className="text-sm font-black text-white uppercase font-orbitron truncate">
                                  {activeView === 'tournaments' ? item.title : activeView === 'leaderboard' ? item.teamName : activeView === 'streams' ? item.title : item.playerName}
                                </div>
                                <div className="text-[10px] text-primary uppercase font-bold tracking-widest truncate">
                                  {activeView === 'tournaments' ? `${item.game} • ${item.date}` : activeView === 'leaderboard' ? `${item.game} • ${item.points} Pts` : activeView === 'streams' ? `${item.youtubeId}` : `${item.tournamentTitle} • UID: ${item.gameUid}`}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => startEdit(item)} className="w-9 h-9 flex items-center justify-center text-primary border border-primary/20 hover:bg-primary hover:text-bg-dark transition-all rounded">
                                <i className="fas fa-edit text-xs"></i>
                              </button>
                              <button onClick={() => handleDelete(item.id)} disabled={isReadOnly} className={`w-9 h-9 flex items-center justify-center text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all rounded ${isReadOnly ? 'opacity-30 cursor-not-allowed' : ''}`}>
                                <i className="fas fa-trash text-xs"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                        {filteredData.length === 0 && (
                          <div className="py-20 text-center text-gray-600 font-orbitron italic text-sm">No records found.</div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
