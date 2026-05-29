import React from "react";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-stone-200 bg-[#f9f8f4] shrink-0">
      {/* Box Kiri Header */}
      <div className="w-8 h-8 border border-stone-800 rounded flex items-center justify-center bg-white shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <path d="M3 3l18 18M21 3L3 21"></path>
        </svg>
      </div>

      {/* Area Kanan: Notifikasi & Profil */}
      <div className="flex items-center gap-4">
        {/* Tombol Notifikasi */}
        <button className="relative p-2.5 bg-white border border-stone-200 rounded-xl shadow-sm hover:bg-stone-50 transition">
          <Bell size={18} className="text-stone-600" />
          <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#a63737] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#f9f8f4]">
            3
          </span>
        </button>

        {/* Profil User */}
        <div className="flex items-center gap-3 bg-white border border-stone-200 py-1.5 px-3 rounded-xl shadow-sm cursor-pointer hover:bg-stone-50 transition">
          <div className="w-8 h-8 bg-[#c2e0d1] text-[#117a5b] font-bold text-[13px] flex items-center justify-center rounded-full">
            AI
          </div>
          <div className="flex flex-col pr-2">
            <span className="text-[12px] font-bold text-stone-800 leading-tight">Alif Ihsan</span>
            <span className="text-[10px] text-stone-500">Karyawan</span>
          </div>
        </div>
      </div>
    </header>
  );
}