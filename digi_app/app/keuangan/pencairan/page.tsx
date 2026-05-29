// app/pencairan/page.tsx
import React from "react";
import { 
  Filter, Download, LayoutGrid, Wallet, BookOpen, 
  List, FileBarChart, Bell, Zap, X
} from "lucide-react";

import Sidebar from "@/components/sidebar-keuangan";
import Header from "@/components/header-keuangan";

export default function PencairanPage() {
  const queueList = [
    {
      id: "RB-2026-004",
      name: "Alif Ihsan",
      projectDesc: "Gramedia Merdeka · Renovasi Kantor Cabang Bandung",
      amount: "Rp 150.000",
      active: true,
    },
    {
      id: "RB-2026-003",
      name: "Alif Ihsan",
      projectDesc: "SPBU Pertamina 34.121 · Pembangunan Gudang Fase 2",
      amount: "Rp 450.000",
      active: false,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f4f2ec] font-sans text-stone-800 overflow-hidden">
    
        {/* Sidebar */}
        <Sidebar />

      {/* ================= AREA KONTEN (KANAN) ================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f6f4f0]">

        {/* Header dipindah ke sini, di dalam kolom kanan */}
        <Header />

        {/* Halaman Utama */}
        <main className="flex-1 overflow-hidden flex flex-col px-8 pb-8 pt-2">
          
          {/* Bagian Judul & Filter (Lebar Penuh) */}
          <div className="shrink-0 mb-6">
            <h1 className="text-[22px] font-bold text-stone-900">Antrian Pencairan</h1>
            <p className="text-[13px] text-stone-500 mt-1.5">
              Pengajuan yang telah divalidasi PM dan siap dicairkan. Jurnal Debit-Kredit akan ter-generate otomatis.
            </p>

            <div className="flex items-center gap-2 mt-6">
              <div className="flex bg-white rounded-full border border-stone-200/80 p-1 shadow-sm">
                <button className="px-4 py-1.5 text-xs font-semibold rounded-full bg-stone-100 text-stone-800">
                  Diteruskan (2)
                </button>
                <button className="px-4 py-1.5 text-xs font-medium rounded-full text-stone-400 hover:text-stone-600 transition">
                  Selesai (7)
                </button>
              </div>
              <button className="ml-auto px-4 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-full flex items-center gap-2 text-stone-600 hover:bg-stone-50 shadow-sm transition">
                <Filter size={14} className="text-stone-400" /> Filter
              </button>
            </div>
          </div>

          {/* Kolom Flex Bawah (List dan Detail) */}
          <div className="flex flex-1 gap-6 min-h-0">
            
            {/* === KOLOM KIRI: DAFTAR ANTRIAN === */}
            <div className="w-[45%] flex flex-col gap-3 overflow-y-auto pb-4 pr-1 custom-scrollbar">
              {queueList.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex flex-col gap-2 transition cursor-pointer ${
                    item.active
                      ? "bg-[#e2f1eb] border-[#b8e0d0] shadow-sm"
                      : "bg-white border-stone-200 hover:border-stone-300 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        item.active ? "bg-[#b8e0d0] text-[#117a5b]" : "bg-[#e0e0e0] text-stone-600"
                      }`}>
                        AI
                      </div>
                      <div className="mt-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-stone-900">{item.name}</span>
                          <span className="text-[11px] text-stone-400">· {item.id}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">{item.projectDesc}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-sm font-bold text-stone-900">{item.amount}</span>
                      <span className="text-[10px] font-semibold text-[#0277bd] bg-[#e1f5fe] px-2 py-0.5 rounded border border-[#b3e5fc]">
                        Verifikasi Keuangan
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* === KOLOM KANAN: DETAIL PENGAJUAN === */}
            <div className="flex-1 flex flex-col bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden h-full">
              
              {/* Body Detail (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-7 space-y-6">
                
                {/* Header Detail */}
                <div className="flex justify-between items-start border-b border-stone-100 pb-5">
                  <div>
                    <span className="text-[11px] text-stone-400 font-mono tracking-wider">RB-2026-004</span>
                    <h2 className="text-2xl font-bold text-stone-900 mt-1">Gramedia Merdeka</h2>
                    <p className="text-[11px] text-stone-500 mt-1.5">
                      oleh <span className="font-semibold text-stone-800">Alif Ihsan</span> · 6 Mei 2026, 13:32
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0277bd] bg-[#e1f5fe] px-3 py-1.5 rounded-lg border border-[#b3e5fc]">
                    Verifikasi Keuangan
                  </span>
                </div>

                {/* Tabel Informasi */}
                <div className="space-y-0.5 text-[12px]">
                  <div className="grid grid-cols-3 py-2.5 border-b border-stone-100">
                    <span className="text-stone-400">Proyek</span>
                    <span className="col-span-2 font-medium text-stone-800 text-right md:text-left">Renovasi Kantor Cabang Bandung</span>
                  </div>
                  <div className="grid grid-cols-3 py-2.5 border-b border-stone-100">
                    <span className="text-stone-400">Pos Anggaran</span>
                    <span className="col-span-2 font-medium text-stone-800 text-right md:text-left">Perlengkapan & ATK</span>
                  </div>
                  <div className="grid grid-cols-3 py-2.5 border-b border-stone-100">
                    <span className="text-stone-400">Tanggal Transaksi</span>
                    <span className="col-span-2 font-medium text-stone-800 text-right md:text-left">18 Mei 2026</span>
                  </div>
                  <div className="grid grid-cols-3 py-2.5 border-b border-stone-100">
                    <span className="text-stone-400">Pengaju</span>
                    <span className="col-span-2 font-medium text-stone-800 text-right md:text-left">Alif Ihsan</span>
                  </div>
                  <div className="grid grid-cols-3 py-2.5 border-b border-stone-100">
                    <span className="text-stone-400">Divalidasi PM</span>
                    <span className="col-span-2 font-medium text-stone-800 text-right md:text-left">Muhammad Alvin Ababil</span>
                  </div>
                  <div className="grid grid-cols-3 py-2.5 border-b border-stone-100">
                    <span className="text-stone-400">Nominal</span>
                    <span className="col-span-2 font-bold text-stone-900 text-right md:text-left">Rp 150.000</span>
                  </div>
                </div>

                {/* Box Jurnal Akuntansi */}
                <div className="bg-[#f9f8f6] border border-stone-200/80 rounded-xl p-4">
                  <div className="flex justify-between items-center text-[10px] text-stone-400 mb-3">
                    <span>Preview Jurnal Akuntansi (Auto-generated)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-[13px] font-bold text-stone-800 bg-stone-200/50 px-2 py-0.5 rounded font-mono">JE - 2026 - 0892</h4>
                    <span className="text-[11px] text-stone-400">6 Mei 2026</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-4 mt-2">Pencairan reimbursement Alif Ihsan - Perlengkapan & ATK</p>
                  
                  <div className="space-y-2 text-[11px] font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">
                        <span className="text-emerald-600 font-bold mr-1">Dr</span> 5-5101 Beban Material Proyek
                      </span>
                      <span className="text-stone-800 font-medium">Rp 1.875.000</span>
                    </div>
                    <div className="flex justify-between items-center pl-4">
                      <span className="text-stone-600">
                        <span className="text-red-600 font-bold mr-1">Cr</span> 1-1102 Bank BCA - Operasional
                      </span>
                      <span className="text-stone-800 font-medium">Rp 1.875.000</span>
                    </div>
                  </div>
                </div>

                {/* Keterangan */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-stone-500">Keterangan dari pengaju</label>
                  <div className="bg-[#fcfbf9] border border-stone-200 rounded-xl p-3.5 text-[12px] text-stone-600 italic leading-relaxed">
                    "Pembelian kertas A4, log book, dan papan klip untuk kebutuhan administrasi site."
                  </div>
                </div>

                {/* Catatan PM */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-stone-500">Catatan dari Project Manager (Muhammad Alvin Ababil)</label>
                  <div className="bg-[#fcfbf9] border border-stone-200 rounded-xl p-3.5 text-[12px] text-stone-400">
                    -
                  </div>
                </div>

                {/* Alur Approval Stepper */}
                <div className="space-y-3 pt-2">
                  <label className="text-[12px] font-bold text-stone-800">Alur Approval</label>
                  <div className="relative pl-[26px] mt-2 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
                    
                    {/* Step 1 */}
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-[30px] bg-[#008f5d] rounded-full w-[20px] h-[20px] flex items-center justify-center z-10 border-[3px] border-white ring-1 ring-white/50">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div className="text-[12px] leading-tight mt-0.5">
                        <p className="font-medium text-stone-800">Pengajuan dikirim</p>
                        <p className="text-[10px] text-stone-400 mt-1">Alif Ihsan · 6 Mei 2026, 13:32</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-[30px] bg-[#008f5d] rounded-full w-[20px] h-[20px] flex items-center justify-center z-10 border-[3px] border-white ring-1 ring-white/50">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div className="text-[12px] leading-tight mt-0.5">
                        <p className="font-medium text-stone-800">Validasi Project Manager</p>
                        <p className="text-[10px] text-stone-400 mt-1">Muhammad Alvin Ababil · 7 Mei 2026, 08:14</p>
                      </div>
                    </div>

                    {/* Step 3 (Current) */}
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-[31px] bg-[#f59e0b] rounded-full w-[22px] h-[22px] flex items-center justify-center text-[10px] font-bold text-white z-10 border-[3px] border-white shadow-sm">
                        3
                      </div>
                      <div className="text-[12px] leading-tight mt-0.5">
                        <p className="font-medium text-stone-800">Verifikasi Tim Keuangan</p>
                        <p className="text-[10px] text-stone-400 mt-1">Menunggu · -</p>
                      </div>
                    </div>

                    {/* Step 4 (Pending) */}
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-[31px] bg-stone-200 rounded-full w-[22px] h-[22px] flex items-center justify-center text-[10px] font-bold text-stone-500 z-10 border-[3px] border-white">
                        4
                      </div>
                      <div className="text-[12px] leading-tight mt-0.5">
                        <p className="font-medium text-stone-500">Dicairkan</p>
                        <p className="text-[10px] text-stone-400 mt-1">Jurnal otomatis · -</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Action Footer (Fixed di bawah) */}
              <div className="border-t border-stone-200 px-7 py-4 bg-white flex items-center justify-between shrink-0">
                <button className="flex items-center gap-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition px-3 py-2 rounded-lg">
                  <Download size={14} />
                  <span>Download bukti</span>
                </button>

                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#9c3131] hover:bg-[#832626] transition px-5 py-2.5 rounded-lg shadow-sm">
                    <X size={14} strokeWidth={2.5} />
                    <span>Tolak</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#008f5d] hover:bg-[#00754c] transition px-5 py-2.5 rounded-lg shadow-sm">
                    <Zap size={14} fill="currentColor" className="text-white" />
                    <span>Cairkan & Generate Jurnal</span>
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