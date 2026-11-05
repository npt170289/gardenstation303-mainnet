import React, { useState } from 'https://esm.sh/react@18.3.1';

export default function App() {
  const [status, setStatus] = useState('Online');

  return (
    <div class="min-h-screen p-6 flex flex-col items-center justify-center">
      {/* Khối Card chính */}
      <div class="w-full max-w-xl bg-[var(--card)] border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
        
        {/* Header */}
        <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-[var(--green)] animate-pulse"></div>
            <h1 class="text-xl font-bold text-[var(--gold)] tracking-wide">
              SYSTEM CONTROL
            </h1>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            Status: {status}
          </span>
        </div>

        {/* Nội dung Dashboard */}
        <div class="space-y-4">
          <p class="text-sm text-slate-400">
            Hệ thống đã được bóc tách thành các file nhỏ độc lập, sẵn sàng để đồng bộ với GitHub Repository.
          </p>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="bg-[var(--card2)] p-4 rounded-xl border border-slate-800/80">
              <span class="text-xs text-slate-500 block mb-1">Màu chủ đạo</span>
              <div class="text-base font-semibold text-[var(--gold)]">#D4AF37 (Gold)</div>
            </div>
            <div class="bg-[var(--card2)] p-4 rounded-xl border border-slate-800/80">
              <span class="text-xs text-slate-500 block mb-1">Theme</span>
              <div class="text-base font-semibold text-purple-400">Dark Mode</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
