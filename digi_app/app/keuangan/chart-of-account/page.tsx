'use client';

import React, { useState, useMemo } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import SidebarKeuangan from '@/components/sidebar-keuangan';
import HeaderKeuangan from '@/components/header-keuangan';

// Inisialisasi konfigurasi font Plus Jakarta Sans
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Data Dummy Utama sesuai skema relasi ChartOfAccounts Anda
const initialAccountsDummy = [
  { nomor_akun: '1-1101', nama_akun: 'Kas', tipe: 'Aset', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 12 },
  { nomor_akun: '1-1102', nama_akun: 'Bank BCA - Operasional', tipe: 'Aset', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 5 },
  { nomor_akun: '1-1103', nama_akun: 'Bank Mandiri - Payroll', tipe: 'Aset', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 8 },
  { nomor_akun: '1-1201', nama_akun: 'Piutang Usaha', tipe: 'Aset', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 2 },
  { nomor_akun: '1-1301', nama_akun: 'Persediaan Material', tipe: 'Aset', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 0 },
  { nomor_akun: '2-2101', nama_akun: 'Persediaan Material', tipe: 'Liabilitas', standar: 'PSAK', saldo_normal: 'Kredit', transactionCount: 14 },
  { nomor_akun: '2-2102', nama_akun: 'Persediaan Material', tipe: 'Liabilitas', standar: 'PSAK', saldo_normal: 'Kredit', transactionCount: 4 },
  { nomor_akun: '3-3101', nama_akun: 'Modal Disetor', tipe: 'Ekuitas', standar: 'PSAK', saldo_normal: 'Kredit', transactionCount: 1 },
  { nomor_akun: '3-3101', nama_akun: 'Pendapatan Proyek', tipe: 'Pendapatan', standar: 'PSAK', saldo_normal: 'Kredit', transactionCount: 20 },
  { nomor_akun: '5-5101', nama_akun: 'Beban Material Proyek', tipe: 'Beban', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 35 },
  { nomor_akun: '5-5102', nama_akun: 'Beban Tenaga Kerja Lapangan', tipe: 'Beban', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 9 },
  { nomor_akun: '5-5201', nama_akun: 'Beban Transportasi Proyek', tipe: 'Beban', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 0 },
  { nomor_akun: '5-5202', nama_akun: 'Beban Konsumsi & Akomodasi', tipe: 'Beban', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 11 },
  { nomor_akun: '5-5301', nama_akun: 'Beban Sewa Alat', tipe: 'Beban', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 3 },
  { nomor_akun: '5-5401', nama_akun: 'Beban Administrasi Proyek', tipe: 'Beban', standar: 'PSAK', saldo_normal: 'Debit', transactionCount: 0 },
];

export default function ChartOfAccountPage() {
  // State manajemen filter & pencarian internal
  const [selectedTab, setSelectedTab] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = ['Semua', 'Aset', 'Liabilitas', 'Ekuitas', 'Pendapatan', 'Beban'];

  // Memastikan filter berjalan sinkron antara tab aktif dan kata kunci pencarian
  const filteredAccounts = useMemo(() => {
    return initialAccountsDummy.filter((account) => {
      const matchesTab = selectedTab === 'Semua' || account.tipe === selectedTab;
      const matchesSearch = 
        account.nomor_akun.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.nama_akun.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [selectedTab, searchQuery]);

  const getBadgeStyles = (tipe: string) => {
    switch (tipe) {
      case 'Aset': return { bg: 'bg-[#EEF6F2]', text: 'text-[#005836]' };
      case 'Liabilitas': return { bg: 'bg-[#FDF3F2]', text: 'text-[#902F33]' };
      case 'Ekuitas': return { bg: 'bg-[#E9E8F4]', text: 'text-[#483E90]' };
      case 'Pendapatan': return { bg: 'bg-[#F0F7FB]', text: 'text-[#005D8D]' };
      case 'Beban': return { bg: 'bg-[#FCF7F0]', text: 'text-[#894C06]' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  return (
    <div className={`flex h-screen w-full bg-[#F6F4EF] overflow-hidden ${plusJakartaSans.className}`}>
      
      {/* Sidebar Keuangan Kelompok */}
      <SidebarKeuangan />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        
        {/* Header Keuangan Kelompok */}
        <HeaderKeuangan />
        
        <div className="w-full h-0 border-b border-[#E6E1D4]"></div>

        <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          
          {/* Title Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-[#14130F]">Chart of Accounts</h1>
            <p className="text-sm text-[#6A6660]">
              Daftar akun yang menjadi referensi seluruh jurnal sistem. Sesuai standar PSAK / IFRS.
            </p>
          </div>

          {/* Action Bar (Filters, Search, Buttons) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Filter Tabs - Fokus visual diperbaiki dengan latar belakang putih kontras */}
            <div className="p-1 bg-[#F1EEE6] rounded-xl border border-[#E6E1D4] inline-flex items-center gap-1 overflow-x-auto z-10 relative">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedTab === tab
                      ? 'bg-white text-[#14130F] shadow-sm font-semibold border border-[#E4E0D9]/40'
                      : 'text-[#6A6660] hover:text-[#14130F] hover:bg-white/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Input & Action Buttons */}
            <div className="flex items-center gap-3 self-end lg:self-auto w-full lg:w-auto justify-end">
              <input
                type="text"
                placeholder="Cari kode atau nama akun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-white border border-[#E4E0D9] rounded-xl text-sm text-[#14130F] placeholder-[#9A948B] focus:outline-none focus:ring-2 focus:ring-[#009162] w-full max-w-xs transition-all"
              />
              
              <button 
                type="button"
                className="h-10 px-4 bg-white border border-[#E4E0D9] rounded-xl text-sm font-medium text-[#14130F] hover:bg-gray-50 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Import</span>
              </button>

              {/* Tombol Tambah Akun - Diperbaiki dari teks bungkus (akun kebawah) & transisi warna */}
              <button 
                type="button"
                className="h-10 px-4 bg-[#009162] hover:bg-[#00734D] active:bg-[#005836] text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                <span>+ Tambah Akun</span>
              </button>
            </div>

          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-[#E4E0D9] shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F1EEE6] border-b border-[#E6E1D4] text-xs font-semibold text-[#9A948B] uppercase tracking-wider">
                    <th className="px-6 py-4 w-1/6">Nomor Akun</th>
                    <th className="px-6 py-4 w-2/5">Nama Akun</th>
                    <th className="px-6 py-4 w-1/6">Tipe</th>
                    <th className="px-6 py-4 w-1/6">Standar</th>
                    <th className="px-6 py-4 w-1/6 text-right">Saldo Normal</th>
                    <th className="px-6 py-4 w-12 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D4] text-sm text-[#14130F]">
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account, index) => {
                      const badge = getBadgeStyles(account.tipe);
                      return (
                        <tr key={`${account.nomor_akun}-${index}`} className="hover:bg-[#FDFDFD] transition-colors duration-150">
                          <td className="px-6 py-4 font-mono font-medium text-gray-900 tracking-wide">
                            {account.nomor_akun}
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {account.nama_akun}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}>
                              {account.tipe}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {account.standar}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-gray-700">
                            {account.saldo_normal}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              type="button"
                              className="w-8 h-8 rounded-lg border border-[#E4E0D9] hover:bg-gray-50 inline-flex items-center justify-center gap-0.5 transition-all cursor-pointer"
                              title="Menu Opsi"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#14130F]"></span>
                              <span className="w-1 h-1 rounded-full bg-[#14130F]"></span>
                              <span className="w-1 h-1 rounded-full bg-[#14130F]"></span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#9A948B]">
                        Tidak ada pos akun yang cocok dengan pencarian atau filter aktif Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}