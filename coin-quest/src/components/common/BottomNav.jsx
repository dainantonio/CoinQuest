import React from 'react';
import { Home, CheckCircle, TrendingUp, Heart, ShoppingBag } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home', color: 'text-indigo-500' },
  { id: 'earn', icon: CheckCircle, label: 'Earn', color: 'text-orange-500' },
  { id: 'invest', icon: TrendingUp, label: 'Invest', color: 'text-blue-500' },
  { id: 'give', icon: Heart, label: 'Give', color: 'text-purple-500' },
  { id: 'shop', icon: ShoppingBag, label: 'Shop', color: 'text-yellow-500' },
];

const BottomNav = ({ view, setView }) => {
  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-slate-200 p-2 pb-6 z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] left-0 right-0 mx-auto">
      <div className="flex justify-around items-center">
        {NAV_ITEMS.map(item => {
          const isActive = view === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-slate-100 -translate-y-4 shadow-lg scale-110' : 'hover:bg-slate-50'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-0.5 transition-colors ${isActive ? item.color : 'text-slate-400'}`} />
              <span className={`text-[9px] font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;