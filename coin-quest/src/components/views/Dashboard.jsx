import React from 'react';

const Dashboard = ({ state }) => (
  <div className="space-y-6 animate-slide-up pb-24">
    {/* Trophy Case */}
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
        🏆 Trophy Case
        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{state.inventory.length} items</span>
      </h3>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 min-h-[80px]">
        {state.inventory.length === 0 ? (
          <div className="w-full text-center text-slate-400 text-sm py-4 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No treasures yet. Visit the Shop!
          </div>
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

    {/* Pending Requests Status */}
    {state.requests.filter(r => r.status === 'pending').length > 0 && (
      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
        <h4 className="font-bold text-orange-800 text-sm mb-2">⏳ Waiting for Parent Approval</h4>
        <div className="space-y-2">
          {state.requests.filter(r => r.status === 'pending').map(req => (
            <div key={req.id} className="flex justify-between text-xs text-orange-700 bg-white/50 p-2 rounded-lg">
              <span>{req.name}</span>
              <span className="font-bold">${req.price}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Activity Feed */}
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-700 mb-4">📜 Adventure Log</h3>
      <div className="space-y-4">
        {state.history.length === 0 ? (
          <p className="text-slate-400 text-center text-sm">Start your adventure today!</p>
        ) : (
          state.history.slice(0, 5).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm">
              <div className={`w-2 h-2 rounded-full ${item.amount > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <div className="flex-1 text-slate-600 truncate">{item.desc}</div>
              <div className={`font-bold ${item.amount > 0 ? 'text-green-600' : 'text-slate-800'}`}>
                {item.amount > 0 ? '+' : ''}{item.amount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default Dashboard;