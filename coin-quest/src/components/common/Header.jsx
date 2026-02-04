import React from 'react';
import { Lock, Unlock, Shield } from 'lucide-react';

const Header = ({ state, setAgeGroup, toggleParentMode }) => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 pt-6 rounded-b-[2rem] shadow-lg relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
    
    <div className="max-w-md mx-auto relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center border-4 border-white/20 shadow-inner animate-bounce text-2xl">
            🦁
          </div>
          <div>
            <h1 className="font-bold text-xl leading-none tracking-tight">CoinQuest</h1>
            <div className="text-xs text-indigo-200 mt-1 font-medium">Lvl {state.level} • {state.xp} XP</div>
          </div>
        </div>
        
        <div className="flex gap-2">
            <button 
              onClick={toggleParentMode}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${state.parentMode ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
            >
              {state.parentMode ? <Unlock size={16} /> : <Lock size={16} />}
            </button>
        </div>
      </div>

      {!state.parentMode ? (
        <div className="flex justify-between items-end">
          <div>
              <p className="text-xs text-indigo-200 uppercase tracking-wider font-bold mb-1">Total Balance</p>
              <div className="text-4xl font-black text-white drop-shadow-sm flex items-start gap-1">
                <span className="text-2xl mt-1 opacity-70">$</span>
                {state.balance}
              </div>
          </div>
          <div className="text-right">
              <p className="text-xs text-purple-200 uppercase tracking-wider font-bold mb-1">Net Worth</p>
              <div className="text-xl font-bold text-purple-100">
                ${(state.balance + Object.values(state.stocks).reduce((a, s) => a + (s.price * s.owned), 0)).toLocaleString()}
              </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
          <h2 className="font-bold flex items-center gap-2">
             <Shield size={16} /> Parent Dashboard
          </h2>
          <p className="text-xs text-indigo-200">Review requests & manage chores</p>
        </div>
      )}
    </div>
  </div>
);

export default Header;