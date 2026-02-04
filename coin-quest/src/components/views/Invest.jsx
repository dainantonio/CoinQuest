import React from 'react';

const Invest = ({ stocks, balance, onBuy, onSell }) => (
  <div className="space-y-4 animate-slide-up pb-24">
    <div className="bg-blue-600 text-white p-5 rounded-3xl relative overflow-hidden shadow-lg shadow-blue-200">
      <div className="relative z-10">
        <h2 className="font-bold text-xl">📈 Trend City</h2>
        <p className="text-blue-100 text-sm">Prices update live! Buy low, sell high.</p>
      </div>
      <div className="absolute -right-4 -bottom-8 text-8xl opacity-20">🏙️</div>
    </div>
    <div className="grid gap-3">
      {Object.entries(stocks).map(([ticker, stock]) => (
        <div key={ticker} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-700">{stock.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider">{ticker}</span>
                <span className="text-xs text-slate-400">Owned: {stock.owned}</span>
              </div>
            </div>
            <div className={`text-xl font-black ${stock.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${stock.price}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button 
              onClick={() => onSell(ticker)}
              disabled={stock.owned <= 0}
              className="py-2 rounded-xl font-bold text-sm bg-red-50 text-red-500 disabled:opacity-50 hover:bg-red-100 transition-colors"
            >
              Sell
            </button>
            <button 
              onClick={() => onBuy(ticker)}
              disabled={balance < stock.price}
              className="py-2 rounded-xl font-bold text-sm bg-blue-500 text-white shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none hover:scale-[1.02] active:scale-95 transition-all"
            >
              Buy
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Invest;