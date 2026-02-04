import React, { useState } from 'react';
import { ClipboardCheck, PlusCircle } from 'lucide-react';

const ParentDashboard = ({ state, onApprove, onDeny, onAddChore }) => {
  const [newChore, setNewChore] = useState({ text: '', reward: 10 });
  const pendingRequests = state.requests.filter(r => r.status === 'pending');

  const handleAddChore = () => {
    if(!newChore.text) return;
    onAddChore(newChore);
    setNewChore({ text: '', reward: 10 });
  };

  return (
    <div className="space-y-6 animate-slide-up pb-24">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-bold uppercase">Child Balance</p>
          <p className="text-2xl font-black text-slate-800">${state.balance}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-bold uppercase">Lifetime Giving</p>
          <p className="text-2xl font-black text-purple-500">${state.donations}</p>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <ClipboardCheck className="text-orange-500" /> 
          Approval Queue
          {pendingRequests.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingRequests.length}</span>}
        </h3>
        
        {pendingRequests.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
            <p className="text-slate-400 text-sm">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-700">{req.name}</span>
                  <span className="font-bold text-orange-500">${req.price}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onApprove(req.id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => onDeny(req.id)}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-200"
                  >
                    Deny (Refund)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Chore */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <PlusCircle className="text-indigo-500" /> 
          Add Custom Chore
        </h3>
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Chore name (e.g. Wash Car)" 
            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-indigo-500"
            value={newChore.text}
            onChange={e => setNewChore({...newChore, text: e.target.value})}
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-3 text-slate-400">$</span>
              <input 
                type="number" 
                className="w-full p-3 pl-6 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-indigo-500"
                value={newChore.reward}
                onChange={e => setNewChore({...newChore, reward: parseInt(e.target.value) || 0})}
              />
            </div>
            <button 
              onClick={handleAddChore}
              className="bg-indigo-600 text-white px-6 rounded-xl font-bold text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;