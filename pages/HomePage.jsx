
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ tournaments, leaderboard }) => {
  const trendingEvents = tournaments.slice(0, 3);
  const topWarriors = [...leaderboard].sort((a, b) => b.points - a.points).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dbjjzyrr3/image/upload/v1768562833/florian-olivo-Mf23RF8xArY-unsplash_mwnhvg.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/80 via-bg-dark/60 to-bg-dark"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-block px-4 py-1 bg-primary/20 border border-primary/40 rounded-full mb-6 text-[10px] md:text-xs font-black tracking-[0.3em] text-primary uppercase animate-pulse">
            Nepal's Premier Gaming Hub
          </div>
          <h1 className="text-4xl md:text-9xl font-orbitron font-black mb-6 tracking-tighter leading-none">
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">TAIGOUR'S</span><br/>
            <span className="text-primary animate-glitch relative inline-block">E-SPORTS</span>
          </h1>
          <p className="text-sm md:text-2xl font-rajdhani font-medium text-gray-400 mb-10 tracking-[0.2em] uppercase max-w-2xl mx-auto leading-relaxed">
            Forge Your Legacy, Rule the Game. Join the ultimate competitive arena and compete for glory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tournaments" className="px-8 md:px-12 py-3 md:py-4 bg-primary text-bg-dark font-orbitron font-black text-xs md:text-sm hover:shadow-[0_0_30px_rgba(0,212,255,0.7)] transition-all flex items-center justify-center group cyber-button">
              JOIN THE BATTLE <i className="fa-solid fa-bolt ml-2 group-hover:translate-x-1 transition-transform"></i>
            </Link>
            <Link to="/leaderboard" className="px-8 md:px-12 py-3 md:py-4 border-2 border-white/10 text-white font-orbitron font-black text-xs md:text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center">
              RANKINGS <i className="fa-solid fa-crown ml-2"></i>
            </Link>
          </div>
        </div>

        {/* Floating background elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-accent/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
      </section>

      {/* Stats Quick Grid */}
      <section className="bg-bg-card py-12 border-y border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Warriors', val: '1500+', icon: 'fa-users' },
            { label: 'Total Events', val: '45+', icon: 'fa-calendar-check' },
            { label: 'Prize Awarded', val: 'रु 50K+', icon: 'fa-award' },
            { label: 'Stream Viewers', val: '10K+', icon: 'fa-eye' },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:border-primary transition-colors">
                <i className={`fa-solid ${stat.icon} text-primary text-xl`}></i>
              </div>
              <div className="text-2xl md:text-4xl font-orbitron font-black text-white">{stat.val}</div>
              <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 bg-bg-dark relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white uppercase tracking-tighter">
              WHY <span className="text-primary">WARRIORS</span> JOIN US
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Fair Play Protocols', 
                desc: 'Anti-cheat systems and manual moderation ensure a level playing field for everyone.',
                icon: 'fa-shield-halved',
                color: 'text-primary'
              },
              { 
                title: 'Instant Rewards', 
                desc: 'Our payout systems are optimized for speed. Win today, get paid tonight.',
                icon: 'fa-bolt-lightning',
                color: 'text-accent'
              },
              { 
                title: 'Pro Coverage', 
                desc: 'Experience your matches with live casting and pro-grade stream production.',
                icon: 'fa-headset',
                color: 'text-secondary'
              }
            ].map((feature, i) => (
              <div key={i} className="glass p-10 rounded-xl border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                <i className={`fa-solid ${feature.icon} ${feature.color} text-4xl mb-6 group-hover:scale-110 transition-transform block`}></i>
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 uppercase tracking-wider">{feature.title}</h3>
                <p className="text-gray-400 font-rajdhani text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-bg-card border-y border-white/5">
        <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white uppercase tracking-tighter mb-8">
                  PATH TO <span className="text-primary">GLORY</span>
                </h2>
                <div className="space-y-12">
                   {[
                     { step: '01', title: 'CHOOSE YOUR ARENA', desc: 'Browse our active tournaments and select the game where you excel most.' },
                     { step: '02', title: 'REGISTER & DEPLOY', desc: 'Secure your spot by filling the entry form. Get your confirmation ID instantly.' },
                     { step: '03', title: 'DOMINATE THE FIELD', desc: 'Join the lobby at scheduled time. Play your best and follow fair play rules.' },
                     { step: '04', title: 'COLLECT YOUR REWARD', desc: 'Top performers get their prizes distributed directly within 24 hours.' }
                   ].map((item, idx) => (
                     <div key={idx} className="flex gap-6 items-start group">
                        <div className="font-orbitron font-black text-3xl md:text-5xl text-white/10 group-hover:text-primary/40 transition-colors">{item.step}</div>
                        <div>
                           <h4 className="font-orbitron font-bold text-white text-lg md:text-xl mb-2">{item.title}</h4>
                           <p className="text-gray-400 font-rajdhani text-lg">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute -inset-10 bg-primary/5 blur-3xl rounded-full"></div>
                <img 
                  src="https://res.cloudinary.com/dbjjzyrr3/image/upload/v1768563772/axville-SXGVliZGS7I-unsplash_kr0kwj.jpg" 
                  className="rounded-lg shadow-2xl border border-primary/20 relative z-10" 
                  alt="Path to Glory" 
                />
                <div className="absolute -bottom-6 -left-6 glass p-6 border-l-4 border-primary z-20 hidden md:block">
                   <div className="text-primary font-orbitron font-black text-4xl">4,500+</div>
                   <div className="text-white text-xs uppercase tracking-widest font-bold">Lobbies Played</div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Supported Games Horizontal Grid */}
      <section className="py-24 bg-bg-dark overflow-hidden">
        <div className="container mx-auto px-4">
           <h3 className="text-center font-orbitron text-gray-500 uppercase tracking-[0.5em] text-sm mb-12">DOMINATE ACROSS TITLES</h3>
           <div className="flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-opacity">
              {['FREE FIRE', 'PUBG MOBILE', 'LUDO KING', 'VALORANT', 'COD MOBILE'].map(game => (
                <div key={game} className="text-xl md:text-3xl font-orbitron font-black text-white hover:text-primary transition-colors cursor-default whitespace-nowrap">
                  {game}
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Trending Events Teaser */}
      <section className="py-24 bg-bg-card relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white uppercase tracking-tighter">
                TRENDING <span className="text-primary">BATTLES</span>
              </h2>
              <p className="text-gray-500 font-rajdhani uppercase tracking-widest mt-2">Hottest tournaments currently accepting warriors</p>
            </div>
            <Link to="/tournaments" className="text-primary font-orbitron font-black text-xs uppercase tracking-widest border-b-2 border-primary/20 hover:border-primary transition-all pb-1">
              VIEW ALL EVENTS <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingEvents.map(t => (
              <div key={t.id} className="neon-border group h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img src={t.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={t.title} />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <span className="absolute top-4 right-4 bg-primary text-bg-dark px-3 py-1 font-orbitron font-black text-[10px] uppercase">{t.game}</span>
                </div>
                <div className="p-6 bg-bg-dark flex-grow border-t border-white/5">
                  <h3 className="text-lg font-orbitron font-bold text-white mb-2 line-clamp-1">{t.title}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-accent font-black text-lg">{t.prize}</span>
                    <Link to="/tournaments" className="px-4 py-2 bg-white/5 border border-white/10 text-white font-orbitron font-black text-[10px] hover:bg-primary hover:text-bg-dark transition-all">ENTER ARENA</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Call to Action */}
      <section className="py-24 bg-primary text-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-7xl font-orbitron font-black mb-6 uppercase tracking-tighter">
            JOIN THE <span className="text-bg-dark border-b-4 border-bg-dark">COMMUNITY</span>
          </h2>
          <p className="max-w-2xl mx-auto font-rajdhani font-bold text-xl md:text-2xl mb-12 uppercase tracking-wide">
            Get instant updates on daily scrims, tournament schedules, and special giveaways.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://discord.gg/f2bgpfNP" className="flex items-center gap-3 px-8 py-4 bg-bg-dark text-white font-orbitron font-black text-sm hover:-translate-y-1 transition-all shadow-xl" target="_blank">
              <i className="fa-brands fa-discord text-2xl"></i> DISCORD
            </a>
            <a href="https://wa.me/9766115626" className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-orbitron font-black text-sm hover:-translate-y-1 transition-all shadow-xl" target="_blank">
              <i className="fa-brands fa-whatsapp text-2xl"></i> WHATSAPP
            </a>
            <a href="https://www.youtube.com/@TaigoursE-Sports" className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-orbitron font-black text-sm hover:-translate-y-1 transition-all shadow-xl" target="_blank">
              <i className="fa-brands fa-youtube text-2xl"></i> YOUTUBE
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
