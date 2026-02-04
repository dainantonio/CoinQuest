import { useState, useEffect } from 'react';

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

export const useGameData = () => {
  const [state, setState] = useState(() => {
    // Load from local storage if available
    const saved = localStorage.getItem('coinquest_v4');
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

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('coinquest_v4', JSON.stringify(state));
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

  // ACTIONS
  const setAgeGroup = (age) => {
    setState(prev => ({
      ...prev,
      ageGroup: age,
      stocks: { ...CONTENT_BY_AGE[age].stocks },
      dailyChores: [ ...CONTENT_BY_AGE[age].chores ]
    }));
    notify(`Switched to Age ${age} Mode!`, 'celebrate');
  };

  const toggleParentMode = () => {
    setState(prev => ({ ...prev, parentMode: !prev.parentMode }));
    notify(state.parentMode ? "Switched to Child Mode" : "Parent Mode Unlocked", "success");
  };

  const completeChore = (id) => {
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
  };

  const buyStock = (ticker) => {
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
  };

  const sellStock = (ticker) => {
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
  };

  const donate = (amount) => {
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
  };

  const buyItem = (item) => {
    if (item.type === 'collectible') {
      setState(prev => ({
        ...prev,
        balance: prev.balance - item.price,
        inventory: [...prev.inventory, item],
        history: [{ desc: `Bought ${item.name}`, amount: -item.price }, ...prev.history].slice(0, 10)
      }));
      notify(`Bought ${item.name}!`, 'celebrate');
    } else {
      // Send Request
      const request = {
        id: Date.now(),
        name: item.name,
        price: item.price,
        status: 'pending'
      };
      setState(prev => ({
        ...prev,
        balance: prev.balance - item.price, // Deduct immediately (escrow)
        requests: [...prev.requests, request],
        history: [{ desc: `Requested ${item.name}`, amount: -item.price }, ...prev.history].slice(0, 10)
      }));
      notify("Request sent to parents!", "success");
    }
  };

  const approveRequest = (id) => {
    setState(prev => ({
      ...prev,
      requests: prev.requests.map(r => r.id === id ? { ...r, status: 'approved' } : r),
      inventory: [...prev.inventory, { name: prev.requests.find(r => r.id === id).name, icon: '🎁' }] 
    }));
    notify("Request Approved", "success");
  };

  const denyRequest = (id) => {
    const req = state.requests.find(r => r.id === id);
    setState(prev => ({
      ...prev,
      balance: prev.balance + req.price, // Refund
      requests: prev.requests.filter(r => r.id !== id),
      history: [{ desc: `Refund: ${req.name} denied`, amount: req.price }, ...prev.history].slice(0, 10)
    }));
    notify("Request Denied & Refunded", "success");
  };

  const addCustomChore = (chore) => {
    const newChoreObj = {
      id: Date.now(),
      text: chore.text,
      reward: chore.reward,
      icon: "✨",
      done: false
    };
    setState(prev => ({
      ...prev,
      dailyChores: [...prev.dailyChores, newChoreObj]
    }));
    notify("Chore Added!", "success");
  };

  return {
    state,
    notification,
    actions: {
      setAgeGroup,
      toggleParentMode,
      completeChore,
      buyStock,
      sellStock,
      donate,
      buyItem,
      approveRequest,
      denyRequest,
      addCustomChore
    }
  };
};