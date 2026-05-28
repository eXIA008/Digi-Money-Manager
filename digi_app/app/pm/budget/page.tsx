"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  FileCheck, 
  Wallet, 
  BarChart3, 
  Menu, 
  X, 
  Plus, 
  AlertCircle,
  ChevronDown,
  Download,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function BudgetProyek() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // DATA MOCK 
  const projects = [
    {
      id: "PRJ-2026-001",
      client: "PT Sinar Logistik Nusantara",
      title: "Renovasi Kantor Cabang Bandung",
      status: "Aktif",
      timeline: "12 Jan 2026 - 30 Sep 2026",
      pm: "Muhammad Alvin Ababil",
      totalRAB: 4800000000, 
      pengeluaran: 3100000000, 
      reimbursement: 412000000, 
      sisa: 1700000000, 

      posAnggaran: [
        { id: "POS-101", name: "Material Konstruksi", used: 1.7, total: 2.4, unit: "M" },
        { id: "POS-182", name: "Tenaga Kerja Lapangan", used: 820, total: 1200, unit: "jt" },
        { id: "POS-103", name: "Sewa Alat Berat", used: 418, total: 606, unit: "jt" },
        { id: "RDS-103", name: "Transportasi & Logistik", used: 145, total: 328, unit: "jt" },
        { id: "PDS-164", name: "Konsumsi & Akomodasi", used: 52.6, total: 180.0, unit: "jt" },
        { id: "POS-105", name: "Perlengkapan & ATK", used: 13.0, total: 100.0, unit: "jt" },
      ],
      
      pengajuanReimbursement: [
        { id: "RB-2026-004", pemohon: "Alif Ihsan", initials: "AI", merchant: "Gramedia Merdeka", pos: "Perlengkapan & ATK", nominal: "Rp150.000", status: "Menunggu PM", statusColor: "bg-[#FCEFD9] text-[#A76F28]" },
        { id: "RB-2026-004", pemohon: "Alif Ihsan", initials: "AI", merchant: "Gramedia Merdeka", pos: "Perlengkapan & ATK", nominal: "Rp150.000", status: "Menunggu PM", statusColor: "bg-[#FCEFD9] text-[#A76F28]" },
        { id: "RB-2026-004", pemohon: "Alif Ihsan", initials: "AI", merchant: "Gramedia Merdeka", pos: "Perlengkapan & ATK", nominal: "Rp150.000", status: "Verifikasi Keuangan", statusColor: "bg-[#E3F2FD] text-[#1D63B8]" },
        { id: "RB-2026-004", pemohon: "Alif Ihsan", initials: "AI", merchant: "Gramedia Merdeka", pos: "Perlengkapan & ATK", nominal: "Rp150.000", status: "Dicairkan", statusColor: "bg-[#E2F0D9] text-[#385723]" },
        { id: "RB-2026-004", pemohon: "Alif Ihsan", initials: "AI", merchant: "Gramedia Merdeka", pos: "Perlengkapan & ATK", nominal: "Rp150.000", status: "Dicairkan", statusColor: "bg-[#E2F0D9] text-[#385723]" },
      ]
    },
    {
      id: "PRJ-2026-002",
      client: "PT Telko Global Indonesia",
      title: "Instalasi Jaringan Fiber Optik BSD",
      status: "Aktif",
      timeline: "01 Feb 2026 - 31 Des 2026",
      pm: "Muhammad Alvin Ababil",
      totalRAB: 2500000000,
      pengeluaran: 1200000000,
      reimbursement: 180000000,
      sisa: 1300000000,

      posAnggaran: [
        { id: "POS-201", name: "Kabel & Perangkat FO", used: 0.8, total: 1.5, unit: "M" },
        { id: "POS-202", name: "Jasa Gali & Penarikan", used: 300, total: 700, unit: "jt" },
      ],
      pengajuanReimbursement: [
        { id: "RB-2026-010", pemohon: "Budi Santoso", initials: "BS", merchant: "Toko Sinar Abadi", pos: "Kabel & Perangkat FO", nominal: "Rp4.500.000", status: "Dicairkan", statusColor: "bg-[#E2F0D9] text-[#385723]" },
      ]
    }
  ];

  const currentProject = projects[selectedProjectIndex];
  const posAnggaran = currentProject.posAnggaran;
  const pengajuanReimbursement = currentProject.pengajuanReimbursement;

  const pctTotalPengeluaran = (currentProject.pengeluaran / currentProject.totalRAB) * 100; 
  const pctReimbursement = (currentProject.reimbursement / currentProject.totalRAB) * 100; 
  const pctMurniPengeluaran = pctTotalPengeluaran - pctReimbursement; 

  const formatRupiahShort = (value: number): string => {
    if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
    } else if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1)} jt`;
    } else {
      return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
    }
  };

  const displayMetrics = {
    total: formatRupiahShort(currentProject.totalRAB),
    pengeluaran: formatRupiahShort(currentProject.pengeluaran),
    reimbursement: formatRupiahShort(currentProject.reimbursement),
    sisa: formatRupiahShort(currentProject.sisa)
  };

  const entriesPerPage = 5;
  const totalEntries = pengajuanReimbursement.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = pengajuanReimbursement.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="min-h-screen bg-background flex text-slate-800 font-sans">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-black transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex lg:flex-col border-r border-slate-200
      `}>
        <div className="p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-xl">D</div>
            <div>
              <h1 className="font-bold text-sm leading-tight">Digi Money Manager</h1>
            </div>
          </div>
          <button className="lg:hidden text-slate-900 hover:text-black" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-black hover:bg-[#E9E5DD] transition">
            <LayoutDashboard size={18} /> Beranda PM
          </a>
          <a href="#" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-black hover:bg-[#E9E5DD] transition">
            <div className="flex items-center gap-3">
              <FileCheck size={18} /> Antrian Approval
            </div>
            <span className="bg-green-900 text-white font-bold text-xs px-2 py-0.5 rounded-full">2</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-white text-black hover:bg-[#E9E5DD] font-medium">
            <Wallet size={18} /> Budget Proyek
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-black hover:bg-[#E9E5DD] transition">
            <BarChart3 size={18} /> Service Score
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        <header className="bg-background backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="w-7 h-7 border border-slate-300 rounded flex items-center justify-center text-slate-400 text-xs font-mono select-none">✕</div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <Bell size={18} />
              <span className="absolute -top-1.5 -right-1.5 bg-rose-700 text-white font-extrabold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white">3</span>
            </button>

            <div className="flex items-center gap-3 bg-white border border-slate-300 rounded-lg px-3.5 py-1.5">
              <div className="w-8 h-8 bg-red-50 border border-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-[11px] tracking-wider">MAA</div>
              <div className="text-left hidden sm:block">
                <h4 className="text-xs font-bold text-slate-800 leading-tight">Muhammad Alvin Ababil</h4>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Project Manager</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Budget Proyek
              </h1>
              <p className="text-sm font-medium text-slate-500 flex items-center flex-wrap gap-x-1.5">
                <span>{currentProject.client}</span>
                <span className="text-slate-300">•</span>
                <span>{currentProject.timeline}</span>
                <span className="text-slate-300">•</span>
                <span>PM: {currentProject.pm}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start lg:self-center w-full sm:w-auto" ref={dropdownRef}>
              <div className="relative w-full sm:w-64">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all"
                >
                  <span className="truncate">{currentProject.title}</span>
                  <ChevronDown size={14} className={`text-slate-400 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                    {projects.map((proj, idx) => (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => { setSelectedProjectIndex(idx); setCurrentPage(1); setIsDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 block transition ${idx === selectedProjectIndex ? 'text-blue-600 bg-blue-50/40' : 'text-slate-700'}`}
                      >
                        {proj.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition shrink-0">
                <Download size={14} className="stroke-[2.5]" />
                Laporan
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{currentProject.title}</h2>
                  <span className="inline-flex text-[10px] font-bold bg-[#E2F0D9] text-[#385723] px-2.5 py-0.5 rounded-md">
                    {currentProject.status}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 font-mono tracking-wide">
                  {currentProject.id} · {currentProject.client}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 block uppercase">TOTAL RAB</span>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-mono">
                  {displayMetrics.total}
                </span>
              </div>
            </div>

            <div className="w-full bg-white border border-slate-200 p-0.5 h-8 rounded-full flex overflow-hidden shadow-inner">
              <div 
                className="bg-[#004D34] h-full rounded-l-full transition-all duration-500"
                style={{ width: `${pctMurniPengeluaran}%` }}
              />
              <div 
                className="bg-[#00A86B] h-full transition-all duration-500"
                style={{ width: `${pctReimbursement}%` }}
              />
              <div className="h-full bg-transparent flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F6F5F1] rounded-xl p-4 flex items-start gap-3 border border-slate-100">
                <div className="w-3.5 h-3.5 bg-[#004D34] rounded mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 block uppercase">PENGELUARAN (termasuk reimbursement)</span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xl font-extrabold text-[#8B2635] font-mono">{displayMetrics.pengeluaran}</span>
                    <span className="text-[11px] font-semibold text-slate-400">{pctTotalPengeluaran.toFixed(1)}% dari RAB</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F6F5F1] rounded-xl p-4 flex items-start gap-3 border border-slate-100">
                <div className="w-3.5 h-3.5 bg-[#00A86B] rounded mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 block uppercase">REIMBURSEMENT</span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xl font-extrabold text-[#1D63B8] font-mono">{displayMetrics.reimbursement}</span>
                    <span className="text-[11px] font-semibold text-slate-400">{((currentProject.reimbursement / currentProject.pengeluaran) * 100).toFixed(1)}% dari pengeluaran</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F6F5F1] rounded-xl p-4 flex items-start gap-3 border border-slate-100">
                <div className="w-3.5 h-3.5 border border-dashed border-slate-400 bg-transparent rounded mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 block uppercase">SISA</span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xl font-extrabold text-[#036240] font-mono">{displayMetrics.sisa}</span>
                    <span className="text-[11px] font-semibold text-slate-400">{((currentProject.sisa / currentProject.totalRAB) * 100).toFixed(1)}% dari RAB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-3xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-xl flex items-center gap-2 text-slate-900">
                   Realisasi per Pos Anggaran
                </h3>
                <button className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition">
                  <Plus size={14} /> Tambah Pos
                </button>
              </div>

              <div className="space-y-4 pt-1">
                {posAnggaran.map((pos, idx) => {
                  const percentage = Math.min(Math.round((pos.used / pos.total) * 100), 100);
                  const isWarning = percentage >= 80;

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <div>
                          <span className="font-bold text-slate-800">{pos.name}</span>
                          <span className="ml-1.5 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                            {pos.id}
                          </span>
                        </div>
                        <div className="text-slate-500 font-mono">
                          <span className="font-bold text-slate-800">Rp {pos.used}</span> / Rp {pos.total} {pos.unit}
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isWarning ? 'bg-amber-500' : 'bg-blue-600'}`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Terpakai: {percentage}%</span>
                        {isWarning && (
                          <span className="text-amber-600 font-medium flex items-center gap-0.5">
                            <AlertCircle size={10} /> Mendekati batas limit anggaran
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-225 border-collapse">
                  <thead>
                    <tr className="bg-[#F5F4F0] text-[#A3A29D] font-bold text-[11px] tracking-wider border-b border-slate-200">
                      <th className="py-4 px-6 font-medium">ID PENGAJUAN</th>
                      <th className="py-4 px-4 font-medium">PENGAJU</th>
                      <th className="py-4 px-4 font-medium">MERCHANT</th>
                      <th className="py-4 px-4 font-medium">POS</th>
                      <th className="py-4 px-4 font-medium">NOMINAL</th>
                      <th className="py-4 px-6 font-medium text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentEntries.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40 transition">
                        <td className="py-4 px-6 font-mono text-slate-400 text-xs">
                          {item.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-[#DDF2E8] text-[#198754] rounded-full flex items-center justify-center font-bold text-[11px] select-none shrink-0">
                              {item.initials}
                            </div>
                            <span className="font-bold text-slate-800 text-xs">{item.pemohon}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-800 text-xs">
                          {item.merchant}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-[#F5F4F0] text-slate-500 font-medium text-[11px]">
                            {item.pos}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-800 text-xs font-sans">
                          <span className="text-slate-400 font-normal mr-0.5">Rp</span>
                          {item.nominal.replace("Rp", "")}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-xl text-[11px] font-bold text-center min-w-32.5 ${item.statusColor}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center items-center py-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-4 bg-[#F5F4F0] px-4 py-2 rounded-full shadow-inner text-xs font-medium select-none text-slate-600">
        
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`w-5 h-5 rounded-full bg-[#8A6240] text-white flex items-center justify-center font-bold text-[10px] hover:opacity-90 transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <ChevronLeft size={18}/>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === currentPage;
                    return isActive ? (
                      <span key={pageNum} className="w-4 h-4 rounded bg-[#EBE9E1] text-slate-800 font-bold flex items-center justify-center cursor-pointer">
                        {pageNum}
                      </span>
                    ) : (
                      <span key={pageNum} onClick={() => setCurrentPage(pageNum)} className="hover:text-slate-900 cursor-pointer transition">
                        {pageNum}
                      </span>
                    );
                  })}
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`w-5 h-5 rounded-full bg-[#8A6240] text-white flex items-center justify-center font-bold text-[10px] hover:opacity-90 transition ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <ChevronRight size={18}/>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}