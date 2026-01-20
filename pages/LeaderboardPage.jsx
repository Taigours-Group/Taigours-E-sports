import React, { useState } from 'react';

const LeaderboardPage = ({ leaderboard }) => {
  const [lbTab, setLbTab] = useState('freefire');

  const filteredLeaderboard = leaderboard
    .filter(l => l.game === lbTab)
    .sort((a, b) => b.points - a.points);

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-bg-dark min-h-screen">
      <div className="container mx-auto px-2 md:px-4">
        <h2 className="text-3xl md:text-6xl font-orbitron font-black text-center mb-10 text-white uppercase tracking-tighter text-glow">
          HALL OF <span className="text-primary">FAME</span>
        </h2>

        <div className="flex justify-center gap-2 md:gap-4 mb-10">
          {(['freefire', 'pubg', 'ludo']).map(game => (
            <button
              key={game}
              onClick={() => setLbTab(game)}
              className={`px-4 md:px-8 py-2 md:py-3 font-orbitron text-[10px] md:text-sm transition-all border ${lbTab === game ? 'bg-primary text-bg-dark border-primary' : 'bg-transparent text-white border-primary/20 hover:border-primary/60'}`}
            >
              {game.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="glass rounded-lg overflow-hidden border border-white/5 max-w-5xl mx-auto shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left font-rajdhani border-collapse min-w-[500px]">
              <thead className="bg-primary/5">
                <tr className="border-b border-primary/10">
                  <th className="p-4 md:p-6 text-primary font-orbitron tracking-widest text-[10px] md:text-xs uppercase">Pos</th>
                  <th className="p-4 md:p-6 text-primary font-orbitron tracking-widest text-[10px] md:text-xs uppercase">Warrior</th>
                  <th className="p-4 md:p-6 text-primary font-orbitron tracking-widest text-[10px] md:text-xs uppercase text-center">Kills</th>
                  <th className="p-4 md:p-6 text-primary font-orbitron tracking-widest text-[10px] md:text-xs uppercase text-center">Wins</th>
                  <th className="p-4 md:p-6 text-primary font-orbitron tracking-widest text-[10px] md:text-xs uppercase text-right">Points</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {filteredLeaderboard.length > 0 ? filteredLeaderboard.map((player, index) => (
                  <tr key={player.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4 md:p-6">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center font-black font-orbitron text-xs md:text-sm ${index === 0 ? 'bg-yellow-500 text-black' : index === 1 ? 'bg-gray-400 text-black' : index === 2 ? 'bg-orange-700 text-white' : 'bg-white/5 text-gray-500'}`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-4 md:p-6">
                      <div className="flex items-center gap-2 md:gap-4">
                        <img src={player.avatar} alt="" className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-primary/20 group-hover:border-primary/60 transition-colors" />
                        <span className="font-bold text-sm md:text-xl group-hover:text-primary transition-colors truncate max-w-[120px] md:max-w-none">{player.teamName}</span>
                      </div>
                    </td>
                    <td className="p-4 md:p-6 text-center font-mono text-xs md:text-lg">{player.kills}</td>
                    <td className="p-4 md:p-6 text-center font-mono text-xs md:text-lg">{player.wins}</td>
                    <td className="p-4 md:p-6 text-right">
                      <span className="text-primary font-black text-lg md:text-2xl font-orbitron">{player.points}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="p-20 text-center text-gray-600 font-orbitron text-sm">No rankings available yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;