import React from 'react';

const Give = ({ donations, balance, onDonate }) => (
  <div className="space-y-6 animate-slide-up pb-24 text-center">
    <div className="bg-purple-500 text-white p-6 rounded-3xl shadow-lg shadow-purple-200 relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-5xl mb-2">❤️</div>
        <h2 className="font-bold text-2xl">Kindness Fund</h2>
        <p className="text-purple-100 text-sm mt-1">Helping others makes you richer.</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <p className="text-slate-500 text-sm uppercase tracking-wide font-bold mb-2">Total Given</p>
      <div className="text-5xl font-black text-purple-500 mb-6">${donations}</div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 5, 10].map(amt => (
          <button
            key={amt}
            onClick={() => onDonate(amt)}
            disabled={balance < amt}
            className="bg-purple-50 text-purple-600 py-3 rounded-xl font-bold border-2 border-transparent hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed active:bg-purple-100 transition-all"
          >
            Give ${amt}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default Give;