import React from 'https://esm.sh/react@18.3.1';

export default function App() {
  return React.createElement(
    'div',
    { className: 'min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6' },
    React.createElement(
      'div',
      { className: 'max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center' },
      React.createElement(
        'h1',
        { className: 'text-2xl font-bold text-amber-500 mb-2' },
        'Garden Station 303'
      ),
      React.createElement(
        'p',
        { className: 'text-slate-400 text-sm' },
        'Hệ thống modular đã hoạt động thành công trên Vercel!'
      )
    )
  );
}
