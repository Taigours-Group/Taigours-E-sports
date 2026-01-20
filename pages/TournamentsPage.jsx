import React, { useState } from 'react';

const TournamentsPage = ({ tournaments, onRegister }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [regForm, setRegForm] = useState({
    playerName: '',
    playerEmail: '',
    playerContact: '',
    gameUid: ''
  });

  const filteredTournaments = tournaments.filter(t => activeTab === 'all' || t.type === activeTab);

  const handleShare = async (t) => {
    const shareText = `🔥 Join the ${t.title} Tournament on Taigour's E-Sports! 🏆 Prize: ${t.prize} | 📅 Date: ${t.date} | 📍 ${t.location}. Register now!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\nLink: ${shareUrl}`);
        alert('Tournament details and link copied to clipboard! 📋');
      } catch (err) {
        alert('Could not copy to clipboard. Please share the URL manually.');
      }
    }
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    if (!selectedTournament) return;

    const registration = {
      id: Date.now().toString(),
      tournamentId: selectedTournament.id,
      tournamentTitle: selectedTournament.title,
      playerName: regForm.playerName,
      playerEmail: regForm.playerEmail,
      playerContact: regForm.playerContact,
      gameUid: regForm.gameUid,
      registrationDate: Date.now()
    };

    onRegister(registration);
    alert(`Successfully registered for ${selectedTournament.title}! 🚀`);
    setSelectedTournament(null);
    setRegForm({ playerName: '', playerEmail: '', playerContact: '', gameUid: '' });
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-bg-dark min-h-screen">
      <div className="container mx-auto px-2 md:px-4">
        <header className="text-center mb-10">
          <h2 className="text-3xl md:text-6xl font-orbitron font-black mb-4 text-glow uppercase tracking-tighter">
            ACTIVE <span className="text-primary">ARENAS</span>
          </h2>
          <p className="font-rajdhani text-gray-400 text-sm md:text-lg tracking-widest uppercase">Select your game and dominate the competition</p>
        </header>

        <div className="flex justify-center gap-2 md:gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {['all', 'freefire', 'pubg', 'ludo'].map(game => (
            <button
              key={game}
              onClick={() => setActiveTab(game)}
              className={`px-4 md:px-8 py-2 md:py-3 font-orbitron text-[10px] md:text-sm transition-all border whitespace-nowrap cyber-button ${activeTab === game ? 'bg-primary text-bg-dark border-primary shadow-[0_0_15px_rgba(0,212,255,0.5)]' : 'bg-transparent text-white border-primary/20 hover:border-primary/60'}`}
            >
              {game.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {filteredTournaments.length > 0 ? filteredTournaments.map(t => (
            <div key={t.id} className="neon-border overflow-hidden flex flex-col h-full group bg-bg-card/40 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent opacity-80"></div>
                <span className="absolute top-2 right-2 bg-accent text-white px-2 py-0.5 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-sm shadow-lg">
                  {t.game}
                </span>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-primary/20 backdrop-blur-md border border-primary/40 px-2 py-1 rounded">
                   <i className="fas fa-trophy text-yellow-500 text-[10px] md:text-xs"></i>
                   <span className="text-white text-[10px] md:text-xs font-black">{t.prize}</span>
                </div>
              </div>
              
              <div className="p-3 md:p-5 flex-grow flex flex-col">
                <h3 className="text-xs md:text-lg font-orbitron font-bold mb-3 text-white line-clamp-2 h-8 md:h-14 leading-tight group-hover:text-primary transition-colors">
                  {t.title}
                </h3>
                
                <div className="space-y-1 md:space-y-2 text-gray-400 font-rajdhani text-[10px] md:text-sm flex-grow">
                  <p className="flex items-center gap-2"><i className="fas fa-calendar-alt text-primary opacity-70 w-4"></i> {t.date}</p>
                  <p className="flex items-center gap-2"><i className="fas fa-clock text-primary opacity-70 w-4"></i> {t.time}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setSelectedTournament(t)}
                    className="flex-grow py-2 md:py-3 bg-primary text-bg-dark font-black hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all rounded-sm uppercase font-orbitron text-[9px] md:text-xs tracking-wider"
                  >
                    JOIN
                  </button>
                  <button 
                    onClick={() => handleShare(t)}
                    className="px-3 md:px-4 py-2 md:py-3 bg-white/5 text-gray-400 border border-white/10 hover:border-accent hover:text-accent transition-all rounded-sm"
                    title="Share Tournament"
                  >
                    <i className="fas fa-share-nodes text-xs md:text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 text-center text-gray-600 font-orbitron italic text-xl border border-dashed border-white/5 rounded-lg">
              <i className="fas fa-ghost text-5xl mb-4 block opacity-20"></i>
              No active tournaments found.
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-bg-dark/90 backdrop-blur-md" onClick={() => setSelectedTournament(null)}></div>
          <div className="relative w-full max-w-lg glass p-6 md:p-10 rounded-xl border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.2)]">
            <button 
              onClick={() => setSelectedTournament(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-orbitron font-black text-white uppercase tracking-tight">Tournament <span className="text-primary">Entry</span></h3>
              <p className="text-gray-500 font-rajdhani uppercase tracking-widest text-xs mt-2">Fill your details to secure your slot</p>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="space-y-5 font-rajdhani overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
              {/* Read-only Event Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Tournament Title</label>
                  <input 
                    type="text" 
                    value={selectedTournament.title} 
                    readOnly 
                    className="w-full bg-white/5 border border-white/10 p-3 text-white font-bold opacity-60 outline-none cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Game Mode</label>
                  <input 
                    type="text" 
                    value={selectedTournament.game} 
                    readOnly 
                    className="w-full bg-white/5 border border-white/10 p-3 text-white font-bold opacity-60 outline-none cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Date</label>
                  <input 
                    type="text" 
                    value={selectedTournament.date} 
                    readOnly 
                    className="w-full bg-white/5 border border-white/10 p-3 text-white font-bold opacity-60 outline-none cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Entry Fee</label>
                  <input 
                    type="text" 
                    value={selectedTournament.entryFee} 
                    readOnly 
                    className="w-full bg-white/5 border border-white/10 p-3 text-accent font-bold opacity-80 outline-none cursor-not-allowed" 
                  />
                </div>
              </div>

              <hr className="border-white/5" />

              {/* Editable Player Details */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Player / Leader Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Full name or Team name"
                  className="w-full bg-white/10 border border-white/20 p-3 text-white focus:border-primary outline-none transition-all"
                  value={regForm.playerName}
                  onChange={e => setRegForm({...regForm, playerName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="email@example.com"
                    className="w-full bg-white/10 border border-white/20 p-3 text-white focus:border-primary outline-none transition-all"
                    value={regForm.playerEmail}
                    onChange={e => setRegForm({...regForm, playerEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contact / WhatsApp *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+977-9800000000"
                    className="w-full bg-white/10 border border-white/20 p-3 text-white focus:border-primary outline-none transition-all"
                    value={regForm.playerContact}
                    onChange={e => setRegForm({...regForm, playerContact: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Game UID / Character ID *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 548392011"
                  className="w-full bg-white/10 border border-white/20 p-3 text-white focus:border-primary outline-none transition-all"
                  value={regForm.gameUid}
                  onChange={e => setRegForm({...regForm, gameUid: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full py-4 bg-primary text-bg-dark font-orbitron font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] transition-all">
                CONFIRM REGISTRATION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentsPage;