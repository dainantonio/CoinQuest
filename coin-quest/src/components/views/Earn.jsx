import React from 'react';

const Earn = ({ chores, onComplete }) => (
  <div className="space-y-4 animate-slide-up pb-24">
    <div className="bg-orange-50 border border-orange-100 p-5 rounded-3xl">
      <h2 className="font-bold text-xl text-orange-800 flex items-center gap-2">🚀 Mission Board</h2>
      <p className="text-sm text-orange-600/80">Complete tasks to earn coins.</p>
    </div>
    {chores.map(chore => (
      <button 
        key={chore.id}
        disabled={chore.done}
        onClick={() => onComplete(chore.id)}
        className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all transform active:scale-95 text-left border-2 ${
          chore.done 
          ? 'bg-slate-50 border-slate-100 opacity-60' 
          : 'bg-white border-white shadow-sm hover:border-orange-200'
        }`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${chore.done ? 'bg-slate-200 grayscale' : 'bg-orange-100'}`}>
          {chore.icon || "✨"}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-700">{chore.text}</h3>
          <span className="text-xs text-slate-400 font-medium">Daily Task</span>
        </div>
        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${chore.done ? 'bg-slate-200 text-slate-500' : 'bg-green-100 text-green-700'}`}>
          +${chore.reward}
        </div>
      </button>
    ))}
  </div>
);

export default Earn;