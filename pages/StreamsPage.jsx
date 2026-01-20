
import React, { useState, useEffect } from 'react';

const StreamsPage = ({ streams }) => {
  const [activeStream, setActiveStream] = useState(null);
  const [chatPool, setChatPool] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', username: 'TaiGaming', text: "Let's go! 🔥", timestamp: Date.now() },
    { id: '2', username: 'FireMaster', text: "Amazing gameplay!", timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');

  // Load chat pool
  useEffect(() => {
    fetch('db/chat_pool.json')
      .then(res => res.json())
      .then(data => setChatPool(data))
      .catch(err => console.error("Chat pool error:", err));
  }, []);

  useEffect(() => {
    if (streams.length > 0 && !activeStream) {
      setActiveStream(streams[0]);
    }
  }, [streams, activeStream]);

  // Simulate live chat
  useEffect(() => {
    if (chatPool.length === 0) return;

    const interval = setInterval(() => {
      const randomMsg = chatPool[Math.floor(Math.random() * chatPool.length)];
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        username: randomMsg.user,
        text: randomMsg.msg,
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev.slice(-20), newMessage]);
    }, 4000);
    return () => clearInterval(interval);
  }, [chatPool]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      username: 'Guest_Pro',
      text: inputText,
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  return (
    <div className="pt-32 pb-24 bg-bg-dark min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-center mb-16 text-white uppercase tracking-tighter">
          LIVE <span className="text-primary">ARENA</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {activeStream ? (
              <div className="relative aspect-video glass rounded-xl overflow-hidden border border-primary/20 shadow-[0_0_30px_rgba(0,212,255,0.15)]">
                {activeStream.isLive && (
                    <div className="absolute top-6 left-6 z-10 bg-red-600 text-white px-4 py-2 font-bold text-sm flex items-center gap-2 animate-pulse rounded-full shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full"></span> LIVE STREAMING
                    </div>
                )}
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeStream.youtubeId}?autoplay=1&mute=1`}
                  title={activeStream.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
                <div className="aspect-video glass rounded-xl flex items-center justify-center text-gray-500 border border-white/5">
                    No active streams available.
                </div>
            )}

            <div className="glass p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-4 uppercase tracking-wider">{activeStream?.title || 'MATCH DESCRIPTION'}</h3>
              <p className="text-gray-400 font-rajdhani text-lg leading-relaxed">
                Experience the high-octane battle for supremacy. The top teams from the region 
                are competing today for a spot in the Grand Finale. Watch every clutch moment 
                and insane play live as history is being written in the e-sports arena.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-sm font-bold">#FreeFire</span>
                <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-sm font-bold">#NepalGaming</span>
                <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-sm font-bold">#Esports</span>
              </div>
            </div>

            {/* Video Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {streams.filter(s => s.id !== activeStream?.id).map(stream => (
                    <div key={stream.id} className="glass p-4 rounded-xl border border-white/5 hover:border-primary/40 transition-all cursor-pointer group" onClick={() => setActiveStream(stream)}>
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                            <img src={`https://img.youtube.com/vi/${stream.youtubeId}/hqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={stream.title} />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                                <i className="fab fa-youtube text-white text-4xl group-hover:text-red-600 transition-colors"></i>
                            </div>
                            {stream.isLive && <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">LIVE</span>}
                        </div>
                        <h4 className="text-white font-orbitron font-bold text-sm line-clamp-1">{stream.title}</h4>
                    </div>
                ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-8 h-full">
            {/* Upcoming */}
            <div className="glass p-6 rounded-xl border border-white/5">
              <h3 className="text-primary font-orbitron mb-6 uppercase tracking-widest text-sm border-b border-primary/20 pb-4">Upcoming Events</h3>
              <div className="space-y-6 font-rajdhani">
                {[
                  { time: '07:00 PM', title: 'The Battle of Champions', sub: 'Qualifier A' },
                  { time: '08:15 PM', title: 'Free Fire Scrims', sub: 'Group Stage' },
                  { time: '09:30 PM', title: 'Winner Takes All', sub: 'Grand Finale' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center group cursor-pointer">
                    <div className="text-accent font-black text-lg whitespace-nowrap min-w-[80px]">{item.time}</div>
                    <div className="border-l border-white/10 pl-4 group-hover:border-primary transition-colors">
                      <div className="text-white font-bold group-hover:text-primary transition-colors">{item.title}</div>
                      <div className="text-gray-500 text-xs uppercase tracking-tighter">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="glass p-6 rounded-xl border border-primary/10 flex flex-col h-[600px] shadow-lg">
              <div className="flex items-center justify-between mb-6 border-b border-primary/20 pb-4">
                <h3 className="text-primary font-orbitron uppercase tracking-widest text-sm font-bold">Live Community Chat</h3>
                <span className="text-[10px] text-gray-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 1.2K ONLINE</span>
              </div>
              <div className="flex-grow overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="text-sm font-rajdhani flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-black uppercase text-xs">{msg.username}</span>
                      <span className="text-[9px] text-gray-600 font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className="text-gray-300 bg-white/5 px-3 py-2 rounded-lg mt-1 inline-block self-start border border-white/5">{msg.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
                <div className="relative">
                   <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Say something to the crowd..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-rajdhani focus:border-primary outline-none transition-all placeholder:text-gray-600"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    <button type="button" className="text-gray-500 hover:text-primary"><i className="far fa-smile"></i></button>
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary text-bg-dark font-orbitron font-black py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all uppercase tracking-widest text-xs">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsPage;
