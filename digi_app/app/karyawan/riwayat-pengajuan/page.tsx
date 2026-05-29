"use client";

import React, { useState } from "react";
import { Filter, Eye } from "lucide-react";
import Sidebar from "@/components/sidebar-karyawan";
import Header from "@/components/header-karyawan";

// Tipe Data untuk Tabel
type Submission = {
  id: string;
  date: string;
  merchant: string;
  project: string;
  pos: string;
  amount: string;
  status: "Menunggu PM" | "Verifikasi Keuangan" | "Dicairkan" | "Ditolak";
};

// Data Dummy Sesuai Figma
const mockData: Submission[] = [
  { id: "RB-2026-004", date: "18/05/2026", merchant: "Gramedia Merdeka", project: "Renovasi Kantor Cabang Bandung", pos: "Perlengkapan & ATK", amount: "Rp 150.000", status: "Menunggu PM" },
  { id: "RB-2026-003", date: "19/04/2026", merchant: "SPBU Pertamina 34.121", project: "Pembangunan Gudang Fase 2", pos: "Transportasi & Logistik", amount: "Rp 450.000", status: "Verifikasi Keuangan" },
  { id: "RB-2026-002", date: "5/04/2026", merchant: "Solaria Resto Bandung", project: "Pembangunan Gudang Fase 2", pos: "Transportasi & Logistik", amount: "Rp 150.000", status: "Dicairkan" },
  { id: "RB-2026-001", date: "12/03/2026", merchant: "Indomaret Bandung", project: "Data Center Bandung Tier-3", pos: "Konsumsi", amount: "Rp 150.000", status: "Ditolak" },
];

const TABS = ["Semua", "Menunggu PM", "Menunggu Keuangan", "Dicairkan", "Ditolak"];

// Helper untuk warna Badge Status
const getStatusBadge = (status: Submission["status"]) => {
  switch (status) {
    case "Menunggu PM":
      return "bg-[#fdf3e6] text-[#b46b2b]"; // Oranye
    case "Verifikasi Keuangan":
      return "bg-[#e1f5fe] text-[#0277bd]"; // Biru
    case "Dicairkan":
      return "bg-[#e2f1eb] text-[#117a5b]"; // Hijau
    case "Ditolak":
      return "bg-[#fee2e2] text-[#be123c]"; // Merah
    default:
      return "bg-stone-100 text-stone-600";
  }
};

export default function RiwayatPengajuanPage() {
  const [activeTab, setActiveTab] = useState("Semua");

  // Logika Filtering berdasarkan Tab
  const filteredData = mockData.filter((item) => {
    if (activeTab === "Semua") return true;
    // Di Figma, tab nya bernama "Menunggu Keuangan", tapi status realnya "Verifikasi Keuangan"
    if (activeTab === "Menunggu Keuangan") return item.status === "Verifikasi Keuangan";
    return item.status === activeTab;
  });

  return (
    <div className="flex min-h-screen w-full bg-[#f9f8f4] font-sans text-stone-800">
      <Sidebar />

      {/* Area Konten Kanan */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Judul Halaman */}
          <div className="mb-8">
            <h1 className="text-[24px] font-bold text-stone-900">Riwayat Pengajuan</h1>
            <p className="text-[14px] text-stone-500 mt-1.5">
              Semua reimbursement yang pernah kamu ajukan, lengkap dengan status dan jejak audit.
            </p>
          </div>

          {/* Baris Filter & Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5 p-1 bg-stone-200/40 rounded-full border border-stone-200/60">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-[13px] rounded-full transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white text-stone-900 font-semibold shadow-sm"
                      : "text-stone-500 font-medium hover:text-stone-700 hover:bg-stone-200/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full shadow-sm text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition">
              <Filter size={14} className="text-stone-500" /> Filter
            </button>
          </div>

          {/* Tabel Data */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f5f4ef] border-b border-stone-200 text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 rounded-tl-2xl">ID Pengajuan</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Merchant</th>
                  <th className="px-6 py-4">Proyek</th>
                  <th className="px-6 py-4">Pos</th>
                  <th className="px-6 py-4">Nominal</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center rounded-tr-2xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-stone-600">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-stone-50 transition border-b border-stone-100 ${
                        index === filteredData.length - 1 ? "border-none" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-stone-500">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-stone-800">{item.merchant}</td>
                      <td className="px-6 py-4">{item.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-stone-100 border border-stone-200/60 px-2 py-1 rounded-md text-[11px] font-medium text-stone-600">
                          {item.pos}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-stone-800">{item.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button className="text-stone-400 hover:text-stone-800 transition p-1.5 hover:bg-stone-100 rounded-lg">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-stone-400">
                      Tidak ada data yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}