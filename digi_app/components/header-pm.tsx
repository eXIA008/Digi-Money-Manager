"use client";

import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderPMProps {
  onOpenSidebar: () => void;
}

export default function HeaderPM({
  onOpenSidebar
}: HeaderPMProps) {
  return (
    <header className="bg-background backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition cursor-pointer" onClick={onOpenSidebar}>
          <Menu size={22} />
        </button>
        <div className="w-7 h-7 border border-slate-300 rounded flex items-center justify-center text-slate-400 text-xs font-mono select-none">✕</div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-slate-700 cursor-pointer">
          <Bell size={18} />
          <span className="absolute -top-1.5 -right-1.5 bg-rose-700 text-white font-extrabold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white select-none">3</span>
        </button>

        <div className="flex items-center gap-3 bg-white border border-slate-300 rounded-lg px-3.5 py-1.5 select-none">
          <div className="w-8 h-8 bg-red-50 border border-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-[11px] tracking-wider shrink-0 shadow-inner">MAA</div>
          <div className="text-left hidden sm:block max-w-[150px]">
            <h4 className="text-xs font-bold text-slate-800 leading-tight truncate">Muhammad Alvin Ababil</h4>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">Project Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
