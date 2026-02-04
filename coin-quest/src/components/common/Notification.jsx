import React from 'react';

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

export default Notification;