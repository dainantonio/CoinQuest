import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, Shield, Home, CheckCircle, TrendingUp, Heart, ShoppingBag,
  ClipboardCheck, PlusCircle
} from 'lucide-react';

// --- CONFIGURATION & DATA ---

const CONTENT_BY_AGE = {
  '5-7': {
    chores: [
      { id: 1, text: "Put Toys Away", reward: 5, icon: "🧸" },
      { id: 2, text: "Brush Teeth", reward: 5, icon: "🦷" },
      { id: 3, text: "Share a Toy", reward: 10, icon: "🤗" }
    ],
    stocks: {
      "LEMON": { name: "Lemonade Stand", price: 10, owned: 0 },
      "COOKIE": { name: "Cookie Co.", price: 5, owned: 0 },
    }
  },
  '8-10': {
    chores: [
      { id: 1, text: "Wash Dishes", reward: 15, icon: "🍽️" },
      { id: 2, text: "Walk the Dog", reward: 10, icon: "🐕" },
      { id: 3, text: "Finish Homework", reward: 20, icon: "📚" }
    ],
    stocks: {
      "GAME": { name: "GameStudio", price: 25, owned: 0 },
      "ROBOT": { name: "RoboTech", price: 40, owned: 0 },
      "SODA": { name: "FizzPop Inc", price: 15, owned: 0 }
    }
  },
  '11+': {
    chores: [
      { id: 1, text: "Mow Lawn", reward: 50, icon: "🌱" },
      { id: 2, text: "Clean Car", reward: 40, icon: "🚗" },
      { id: 3, text: "Cook Dinner", reward: 35, icon: "👨‍🍳" }
    ],
    stocks: {
      "CRYPTO": { name: "BlockChain Z", price: 100, owned: 0 },
      "SOLAR": { name: "SunPower", price: 85, owned: 0 },
      "AI": { name: "NeuralNet", price: 120, owned: 0 }
    }
  }
};

const SHOP_ITEMS = [
  { id: 1, name: "Cool Sticker", price: 15, icon: "🦄", type: "collectible" },
  { id: 2, name: "Rare Gem", price: 50, icon: "💎", type: "collectible" },
  { id: 3, name: "Pizza Party", price: 100, icon: "🍕", type: "reward" },
  { id: 4, name: "Rocket Ship", price: 200, icon: "🚀", type: "collectible" },
  { id: 5, name: "Gaming Time", price: 75, icon: "🎮", type: "reward" },
  { id: 6, name: "Ice Cream", price: 25, icon: "🍦", type: "reward" }
];

const INITIAL_STATE = {
  balance: 50,
  xp: 0,
  level: 1,
  ageGroup: '8-10',
  inventory: [],
  requests: [],
  donations: 0,
  stocks: {},
  history: [],
  dailyChores: [],
  parentMode: false
};

// --- HOOKS ---

const useGameData = () => {
  const [state, setState] = useState(() => {
    // Check local storage or use default
    const saved = localStorage.getItem('coinquest_v7');
    if (saved) return JSON.parse(saved);
    
    // Default setup
    const defaultAge = '8-10';
    return {
      ...INITIAL_STATE,
      ageGroup: defaultAge,
      stocks: CONTENT_BY_AGE[defaultAge].stocks,
      dailyChores: CONTENT_BY_AGE[defaultAge].chores
    };
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Save state on change
  useEffect(() => {
    localStorage.setItem('coinquest_v7', JSON.stringify(state));
  }, [state]);

  // Stock Market Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const newStocks = { ...prev.stocks };
        let hasChange = false;
        Object.keys(newStocks).forEach(key => {
          const stock = newStocks[key];
          const volatility = prev.ageGroup === '11+' ? 15 : 5;
          const move = Math.floor(Math.random() * (volatility * 2 + 1)) - volatility;
          if (move !== 0) {
            let newPrice = Math.max(1, stock.price + move);
            newStocks[key] = { ...stock, price: newPrice, trend: move };
            hasChange = true;
          }
        });
        return hasChange ? { ...prev, stocks: newStocks } : prev;
      });
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  const notify = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const actions = {
    setAgeGroup: (age) => {
      setState(prev => ({
        ...prev,
        ageGroup: age,
        stocks: { ...CONTENT_BY_AGE[age].stocks },
        dailyChores: [ ...CONTENT_BY_AGE[age].chores ]
      }));
      notify(`Switched to Age ${age} Mode!`, 'celebrate');
    },
    toggleParentMode: () => {
      setState(prev => ({ ...prev, parentMode: !prev.parentMode }));
      notify(state.parentMode ? "Switched to Child Mode" : "Parent Mode Unlocked", "success");
    },
    completeChore: (id) => {
      const chore = state.dailyChores.find(c => c.id === id);
      if (chore && !chore.done) {
        setState(prev => ({
          ...prev,
          balance: prev.balance + chore.reward,
          xp: prev.xp + 10,
          dailyChores: prev.dailyChores.map(c => c.id === id ? { ...c, done: true } : c),
          history: [{ desc: `Did chore: ${chore.text}`, amount: chore.reward }, ...prev.history].slice(0, 10)
        }));
        notify(`Earned $${chore.reward}! Great job!`, 'success');
      }
    },
    buyStock: (ticker) => {
      const stock = state.stocks[ticker];
      if (state.balance >= stock.price) {
        setState(prev => ({
          ...prev,
          balance: prev.balance - stock.price,
          stocks: { ...prev.stocks, [ticker]: { ...stock, owned: stock.owned + 1 } },
          history: [{ desc: `Bought ${stock.name}`, amount: -stock.price }, ...prev.history].slice(0, 10)
        }));
        notify(`Invested in ${stock.name}`, 'success');
      }
    },
    sellStock: (ticker) => {
      const stock = state.stocks[ticker];
      if (stock.owned > 0) {
        setState(prev => ({
          ...prev,
          balance: prev.balance + stock.price,
          stocks: { ...prev.stocks, [ticker]: { ...stock, owned: stock.owned - 1 } },
          history: [{ desc: `Sold ${stock.name}`, amount: stock.price }, ...prev.history].slice(0, 10)
        }));
        notify(`Sold stock for $${stock.price}`, 'success');
      }
    },
    donate: (amount) => {
      if (state.balance >= amount) {
        setState(prev => ({
          ...prev,
          balance: prev.balance - amount,
          donations: prev.donations + amount,
          xp: prev.xp + (amount * 2),
          history: [{ desc: `Donated to Charity`, amount: -amount }, ...prev.history].slice(0, 10)
        }));
        notify(`Donated $${amount}. You are amazing!`, 'celebrate');
      }
    },
    buyItem: (item) => {
      if (item.type === 'collectible') {
        setState(prev => ({
          ...prev,
          balance: prev.balance - item.price,
          inventory: [...prev.inventory, item],
          history: [{ desc: `Bought ${item.name}`, amount: -item.price }, ...prev.history].slice(0, 10)
        }));
        notify(`Bought ${item.name}!`, 'celebrate');
      } else {
        const request = { id: Date.now(), name: item.name, price: item.price, status: 'pending' };
        setState(prev => ({
          ...prev,
          balance: prev.balance - item.price,
          requests: [...prev.requests, request],
          history: [{ desc: `Requested ${item.name}`, amount: -item.price }, ...prev.history].slice(0, 10)
        }));
        notify("Request sent to parents!", "success");
      }
    },
    approveRequest: (id) => {
      setState(prev => ({
        ...prev,
        requests: prev.requests.map(r => r.id === id ? { ...r, status: 'approved' } : r),
        inventory: [...prev.inventory, { name: prev.requests.find(r => r.id === id).name, icon: '🎁' }] 
      }));
      notify("Request Approved", "success");
    },
    denyRequest: (id) => {
      const req = state.requests.find(r => r.id === id);
      setState(prev => ({
        ...prev,
        balance: prev.balance + req.price,
        requests: prev.requests.filter(r => r.id !== id),
        history: [{ desc: `Refund: ${req.name} denied`, amount: req.price }, ...prev.history].slice(0, 10)
      }));
      notify("Request Denied & Refunded", "success");
    },
    addCustomChore: (chore) => {
      const newChoreObj = { id: Date.now(), text: chore.text, reward: chore.reward, icon: "✨", done: false };
      setState(prev => ({
        ...prev,
        dailyChores: [...prev.dailyChores, newChoreObj]
      }));
      notify("Chore Added!", "success");
    }
  };

  return { state, notification, actions };
};

// --- VIEW COMPONENTS ---

const Notification = ({ message, type, show }) => (
  <div className={`fixed top-4 right-4 left-4 md:left-auto z-[100] transition-all duration-500 transform ${show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
    <div className={`
      px-6 py-4 rounded-2xl shadow-xl border-2 flex items-center gap-3 font-bold bg-white
      ${type === 'success' ? 'border-green-400 text-green-800' : ''}
      ${type === 'error' ? 'border-red-400 text-red-800' : ''}
      ${type === 'celebrate' ? 'border-yellow-400 text-yellow-800' : ''}
    `}>
      <span className="text-2xl">{type === 'success' ? '✅' : type === 'error' ? '❌' : '🎉'}</span>
      <span className="text-sm md:text-base">{message}</span>
    </div>
  </div>
);

const Header = ({ state, setAgeGroup, toggleParentMode }) => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 pt-6 rounded-b-[2rem] shadow-lg relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
    <div className="max-w-md mx-auto relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center border-4 border-white/20 shadow-inner animate-bounce-slow text-2xl">🦁</div>
          <div>
            <h1 className="font-bold text-xl leading-none tracking-tight">CoinQuest</h1>
            <div className="text-xs text-indigo-200 mt-1 font-medium">Lvl {state.level} • {state.xp} XP</div>
          </div>
        </div>
        <button onClick={toggleParentMode} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${state.parentMode ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}>
          {state.parentMode ? <Unlock size={16} /> : <Lock size={16} />}
        </button>
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
          <h2 className="font-bold flex items-center gap-2"><Shield size={16} /> Parent Dashboard</h2>
          <p className="text-xs text-indigo-200">Review requests & manage chores</p>
        </div>
      )}
    </div>
  </div>
);

const BottomNav = ({ view, setView }) => {
  const NAV_ITEMS = [
    { id: 'home', icon: Home, label: 'Home', color: 'text-indigo-500' },
    { id: 'earn', icon: CheckCircle, label: 'Earn', color: 'text-orange-500' },
    { id: 'invest', icon: TrendingUp, label: 'Invest', color: 'text-blue-500' },
    { id: 'give', icon: Heart, label: 'Give', color: 'text-purple-500' },
    { id: 'shop', icon: ShoppingBag, label: 'Shop', color: 'text-yellow-500' },
  ];
  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-slate-200 p-2 pb-6 z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] left-0 right-0 mx-auto">
      <div className="flex justify-around items-center">
        {NAV_ITEMS.map(item => {
          const isActive = view === item.id;
          return (
            <button key={item.id} onClick={() => setView(item.id)} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${isActive ? 'bg-slate-100 -translate-y-4 shadow-lg scale-110' : 'hover:bg-slate-50'}`}>
              <item.icon className={`w-6 h-6 mb-0.5 transition-colors ${isActive ? item.color : 'text-slate-400'}`} />
              <span className={`text-[9px] font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const Dashboard = ({ state }) => (
  <div className="space-y-6 animate-slide-up pb-24">
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
        🏆 Trophy Case <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{state.inventory.length} items</span>
      </h3>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 min-h-[80px]">
        {state.inventory.length === 0 ? (
          <div className="w-full text-center text-slate-400 text-sm py-4 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">No treasures yet. Visit the Shop!</div>
        ) : (
          state.inventory.map((item, i) => (
            <div key={i} className="min-w-[70px] h-[80px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 animate-pop">
              <span className="text-3xl mb-1 filter drop-shadow-sm">{item.icon}</span>
              <span className="text-[10px] font-bold text-slate-500 truncate w-full text-center px-1">{item.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
    {state.requests.filter(r => r.status === 'pending').length > 0 && (
      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
        <h4 className="font-bold text-orange-800 text-sm mb-2">⏳ Waiting for Parent Approval</h4>
        <div className="space-y-2">
          {state.requests.filter(r => r.status === 'pending').map(req => (
            <div key={req.id} className="flex justify-between text-xs text-orange-700 bg-white/50 p-2 rounded-lg"><span>{req.name}</span><span className="font-bold">${req.price}</span></div>
          ))}
        </div>
      </div>
    )}
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-700 mb-4">📜 Adventure Log</h3>
      <div className="space-y-4">
        {state.history.length === 0 ? <p className="text-slate-400 text-center text-sm">Start your adventure today!</p> : state.history.slice(0, 5).map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm">
            <div className={`w-2 h-2 rounded-full ${item.amount > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <div className="flex-1 text-slate-600 truncate">{item.desc}</div>
            <div className={`font-bold ${item.amount > 0 ? 'text-green-600' : 'text-slate-800'}`}>{item.amount > 0 ? '+' : ''}{item.amount}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Earn = ({ chores, onComplete }) => (
  <div className="space-y-4 animate-slide-up pb-24">
    <div className="bg-orange-50 border border-orange-100 p-5 rounded-3xl">
      <h2 className="font-bold text-xl text-orange-800 flex items-center gap-2">🚀 Mission Board</h2>
      <p className="text-sm text-orange-600/80">Complete tasks to earn coins.</p>
    </div>
    {chores.map(chore => (
      <button key={chore.id} disabled={chore.done} onClick={() => onComplete(chore.id)} className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all transform active:scale-95 text-left border-2 ${chore.done ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-white shadow-sm hover:border-orange-200'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${chore.done ? 'bg-slate-200 grayscale' : 'bg-orange-100'}`}>{chore.icon || "✨"}</div>
        <div className="flex-1"><h3 className="font-bold text-slate-700">{chore.text}</h3><span className="text-xs text-slate-400 font-medium">Daily Task</span></div>
        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${chore.done ? 'bg-slate-200 text-slate-500' : 'bg-green-100 text-green-700'}`}>+{chore.reward}</div>
      </button>
    ))}
  </div>
);

const Invest = ({ stocks, balance, onBuy, onSell }) => (
  <div className="space-y-4 animate-slide-up pb-24">
    <div className="bg-blue-600 text-white p-5 rounded-3xl relative overflow-hidden shadow-lg shadow-blue-200">
      <div className="relative z-10"><h2 className="font-bold text-xl">📈 Trend City</h2><p className="text-blue-100 text-sm">Prices update live! Buy low, sell high.</p></div>
      <div className="absolute -right-4 -bottom-8 text-8xl opacity-20">🏙️</div>
    </div>
    <div className="grid gap-3">
      {Object.entries(stocks).map(([ticker, stock]) => (
        <div key={ticker} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div><h3 className="font-bold text-slate-700">{stock.name}</h3><div className="flex items-center gap-2 mt-1"><span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider">{ticker}</span><span className="text-xs text-slate-400">Owned: {stock.owned}</span></div></div>
            <div className={`text-xl font-black ${stock.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>${stock.price}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button onClick={() => onSell(ticker)} disabled={stock.owned <= 0} className="py-2 rounded-xl font-bold text-sm bg-red-50 text-red-500 disabled:opacity-50 hover:bg-red-100 transition-colors">Sell</button>
            <button onClick={() => onBuy(ticker)} disabled={balance < stock.price} className="py-2 rounded-xl font-bold text-sm bg-blue-500 text-white shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none hover:scale-[1.02] active:scale-95 transition-all">Buy</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Give = ({ donations, balance, onDonate }) => (
  <div className="space-y-6 animate-slide-up pb-24 text-center">
    <div className="bg-purple-500 text-white p-6 rounded-3xl shadow-lg shadow-purple-200 relative overflow-hidden">
      <div className="relative z-10"><div className="text-5xl mb-2">❤️</div><h2 className="font-bold text-2xl">Kindness Fund</h2><p className="text-purple-100 text-sm mt-1">Helping others makes you richer.</p></div>
    </div>
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <p className="text-slate-500 text-sm uppercase tracking-wide font-bold mb-2">Total Given</p><div className="text-5xl font-black text-purple-500 mb-6">${donations}</div>
      <div className="grid grid-cols-3 gap-3">{[1, 5, 10].map(amt => <button key={amt} onClick={() => onDonate(amt)} disabled={balance < amt} className="bg-purple-50 text-purple-600 py-3 rounded-xl font-bold border-2 border-transparent hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed active:bg-purple-100 transition-all">Give ${amt}</button>)}</div>
    </div>
  </div>
);

const Shop = ({ items, balance, onBuy, inventory }) => (
  <div className="animate-slide-up pb-24">
    <div className="bg-yellow-400 text-yellow-900 p-5 rounded-3xl mb-4 shadow-lg shadow-yellow-200"><h2 className="font-bold text-xl">🎁 Rewards Shop</h2><p className="text-sm opacity-80">Treat yourself to something nice.</p></div>
    <div className="grid grid-cols-2 gap-3">
      {items.map(item => {
        const isOwned = inventory.some(i => i.id === item.id);
        return (
          <button key={item.id} disabled={balance < item.price || (item.type === 'collectible' && isOwned)} onClick={() => onBuy(item)} className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${isOwned ? 'bg-green-50 border-green-200 opacity-80' : 'bg-white border-white shadow-sm hover:border-yellow-300'}`}>
            <div className="text-4xl mb-2 filter drop-shadow-sm">{item.icon}</div><div className="font-bold text-slate-700 leading-tight mb-1">{item.name}</div>
            {isOwned ? <div className="mt-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">OWNED</div> : <div className={`mt-auto text-sm font-bold px-3 py-1 rounded-lg w-full ${balance >= item.price ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-400'}`}>{item.type === 'reward' ? 'Request' : 'Buy'} ${item.price}</div>}
          </button>
        );
      })}
    </div>
  </div>
);

const ParentDashboard = ({ state, onApprove, onDeny, onAddChore }) => {
  const [newChore, setNewChore] = useState({ text: '', reward: 10 });
  const pendingRequests = state.requests.filter(r => r.status === 'pending');
  const handleAddChore = () => { if(!newChore.text) return; onAddChore(newChore); setNewChore({ text: '', reward: 10 }); };

  return (
    <div className="space-y-6 animate-slide-up pb-24">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"><p className="text-xs text-slate-400 font-bold uppercase">Child Balance</p><p className="text-2xl font-black text-slate-800">${state.balance}</p></div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"><p className="text-xs text-slate-400 font-bold uppercase">Lifetime Giving</p><p className="text-2xl font-black text-purple-500">${state.donations}</p></div>
      </div>
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><ClipboardCheck className="text-orange-500" /> Approval Queue {pendingRequests.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingRequests.length}</span>}</h3>
        {pendingRequests.length === 0 ? <div className="text-center py-6 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200"><p className="text-slate-400 text-sm">No pending requests</p></div> : <div className="space-y-3">{pendingRequests.map(req => (<div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200"><div className="flex justify-between mb-2"><span className="font-bold text-slate-700">{req.name}</span><span className="font-bold text-orange-500">${req.price}</span></div><div className="flex gap-2"><button onClick={() => onApprove(req.id)} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-600">Approve</button><button onClick={() => onDeny(req.id)} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-200">Deny (Refund)</button></div></div>))}</div>}
      </div>
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><PlusCircle className="text-indigo-500" /> Add Custom Chore</h3>
        <div className="flex flex-col gap-3">
          <input type="text" placeholder="Chore name (e.g. Wash Car)" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-indigo-500" value={newChore.text} onChange={e => setNewChore({...newChore, text: e.target.value})} />
          <div className="flex gap-2"><div className="relative flex-1"><span className="absolute left-3 top-3 text-slate-400">$</span><input type="number" className="w-full p-3 pl-6 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-indigo-500" value={newChore.reward} onChange={e => setNewChore({...newChore, reward: parseInt(e.target.value) || 0})} /></div><button onClick={handleAddChore} className="bg-indigo-600 text-white px-6 rounded-xl font-bold text-sm">Add</button></div>
        </div>
      </div>
    </div>
  );
};

// --- APP COMPONENT ---

export default function App() {
  const [view, setView] = useState('home');
  const { state, notification, actions } = useGameData();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative">
      <Notification {...notification} />
      <Header state={state} setAgeGroup={actions.setAgeGroup} toggleParentMode={actions.toggleParentMode} />
      <main className="p-4 bg-pattern min-h-[calc(100vh-200px)]">
        {state.parentMode ? (
          <ParentDashboard state={state} onApprove={actions.approveRequest} onDeny={actions.denyRequest} onAddChore={actions.addCustomChore} />
        ) : (
          <>
            {view === 'home' && <Dashboard state={state} />}
            {view === 'earn' && <Earn chores={state.dailyChores} onComplete={actions.completeChore} />}
            {view === 'invest' && <Invest stocks={state.stocks} balance={state.balance} onBuy={actions.buyStock} onSell={actions.sellStock} />}
            {view === 'give' && <Give donations={state.donations} balance={state.balance} onDonate={actions.donate} />}
            {view === 'shop' && <Shop items={SHOP_ITEMS} balance={state.balance} inventory={state.inventory} onBuy={actions.buyItem} />}
          </>
        )}
      </main>
      {!state.parentMode && <BottomNav view={view} setView={setView} />}
    </div>
  );
}