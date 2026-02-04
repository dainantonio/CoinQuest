import React from 'react';

const Shop = ({ items, balance, onBuy, inventory }) => (
  <div className="animate-slide-up pb-24">
    <div className="bg-yellow-400 text-yellow-900 p-5 rounded-3xl mb-4 shadow-lg shadow-yellow-200">
      <h2 className="font-bold text-xl">🎁 Rewards Shop</h2>
      <p className="text-sm opacity-80">Treat yourself to something nice.</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {items.map(item => {
        const isOwned = inventory.some(i => i.id === item.id);
        return (
          <button 
            key={item.id}
            disabled={balance < item.price || (item.type === 'collectible' && isOwned)}
            onClick={() => onBuy(item)}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
              isOwned 
              ? 'bg-green-50 border-green-200 opacity-80' 
              : 'bg-white border-white shadow-sm hover:border-yellow-300'
            }`}
          >
            <div className="text-4xl mb-2 filter drop-shadow-sm">{item.icon}</div>
            <div className="font-bold text-slate-700 leading-tight mb-1">{item.name}</div>
            
            {isOwned ? (
              <div className="mt-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                OWNED
              </div>
            ) : (
              <div className={`mt-auto text-sm font-bold px-3 py-1 rounded-lg w-full ${
                balance >= item.price ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-400'
              }`}>
                {item.type === 'reward' ? 'Request' : 'Buy'} ${item.price}
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default Shop;