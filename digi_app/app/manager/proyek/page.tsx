"use client";

import React, { useEffect, useState } from "react";
import { FolderPlus, Loader2, Check, X, Search, Calendar, Users, Briefcase, DollarSign, Plus, Trash2 } from "lucide-react";

type Project = {
  id: number;
  nama: string;
  deskripsi: string | null;
  status: string;
  tanggalMulai: string;
  tanggalSelesai: string | null;
  budget?: {
    id: number;
    rabTotal: string;
    totalPengeluaran: string;
    totalReimbursement: string;
    sisaBudget: string;
    posAnggaran: { id: number; namaPos: string; nominalAlokasi: string }[];
  } | null;
};

type Member = {
  id: number;
  nama: string;
  email: string;
  role: string;
  divisi: string | null;
};

export default function KelolaProyekPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAssignMembers, setShowAssignMembers] = useState<Project | null>(null);
  const [showInitBudget, setShowInitBudget] = useState<Project | null>(null);

  // Forms state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const [projectForm, setProjectForm] = useState({
    nama: "",
    deskripsi: "",
    tanggalMulai: "",
    tanggalSelesai: "",
  });

  // Assign members state
  const [selectedProjectMembers, setSelectedProjectMembers] = useState<{ userId: number; role: string }[]>([]);
  
  // Budget initialization state
  const [rabTotal, setRabTotal] = useState("");
  const [posAnggaranList, setPosAnggaranList] = useState<{ deskripsi: string; nominalAlokasi: string }[]>([
    { deskripsi: "Akomodasi & Transportasi", nominalAlokasi: "" },
    { deskripsi: "Konsumsi", nominalAlokasi: "" },
    { deskripsi: "Perlengkapan & ATK", nominalAlokasi: "" },
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [proyekRes, membersRes] = await Promise.all([
        fetch("/api/proyek"),
        fetch("/api/manager/members"),
      ]);
      const [proyekData, membersData] = await Promise.all([proyekRes.json(), membersRes.json()]);
      setProjects(proyekData.projects ?? []);
      setMembers(membersData.members ?? []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/proyek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: projectForm.nama,
          deskripsi: projectForm.deskripsi,
          tanggalMulai: projectForm.tanggalMulai,
          tanggalSelesai: projectForm.tanggalSelesai || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "Gagal membuat proyek");
        return;
      }

      setSuccess(`Proyek "${projectForm.nama}" berhasil dibuat!`);
      setProjectForm({ nama: "", deskripsi: "", tanggalMulai: "", tanggalSelesai: "" });
      setShowAddProject(false);
      fetchData();
    } catch {
      setFormError("Terjadi kesalahan koneksi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveMembers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignMembers) return;
    setFormError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/manager/proyek/${showAssignMembers.id}/members`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          members: selectedProjectMembers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "Gagal mengatur anggota proyek");
        return;
      }

      setSuccess(`Anggota proyek untuk "${showAssignMembers.nama}" berhasil disimpan!`);
      setShowAssignMembers(null);
      fetchData();
    } catch {
      setFormError("Terjadi kesalahan koneksi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInitBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showInitBudget) return;
    setFormError("");
    setSuccess("");

    const total = parseFloat(rabTotal);
    if (isNaN(total) || total <= 0) {
      setFormError("Total RAB harus berupa angka positif");
      return;
    }

    // Validate pos anggaran sum matches rabTotal
    const sum = posAnggaranList.reduce((acc, pos) => acc + (parseFloat(pos.nominalAlokasi) || 0), 0);
    if (Math.abs(sum - total) > 0.01) {
      setFormError(`Jumlah alokasi item (Rp ${sum.toLocaleString()}) harus sama dengan total RAB (Rp ${total.toLocaleString()})`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/proyek/${showInitBudget.id}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rabTotal: total,
          posAnggaran: posAnggaranList.map((pos) => ({
            deskripsi: pos.deskripsi,
            nominalAlokasi: parseFloat(pos.nominalAlokasi),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "Gagal menginisialisasi budget");
        return;
      }

      setSuccess(`Budget RAB untuk "${showInitBudget.nama}" berhasil diinisialisasi!`);
      setShowInitBudget(null);
      setRabTotal("");
      setPosAnggaranList([
        { deskripsi: "Akomodasi & Transportasi", nominalAlokasi: "" },
        { deskripsi: "Konsumsi", nominalAlokasi: "" },
        { deskripsi: "Perlengkapan & ATK", nominalAlokasi: "" },
      ]);
      fetchData();
    } catch {
      setFormError("Terjadi kesalahan koneksi");
    } finally {
      setSubmitting(false);
    }
  };

  const openAssignModal = (project: Project) => {
    // Fetch currently assigned members for this project
    setLoading(true);
    fetch(`/api/manager/proyek/${project.id}/members`)
      .then((res) => res.json())
      .then((data) => {
        const assignedMembers = data.members?.map((m: any) => ({
          userId: m.id,
          role: m.roleInProyek || (m.role === 'Project Manager' ? 'Project Manager' : 'Anggota Lapangan'),
        })) || [];
        setSelectedProjectMembers(assignedMembers);
        setShowAssignMembers(project);
      })
      .catch((err) => console.error("Error loading assigned members:", err))
      .finally(() => setLoading(false));
  };

  const formatRupiah = (valStr: string | number | undefined) => {
    if (!valStr) return "Rp 0";
    const num = typeof valStr === "string" ? parseFloat(valStr) : valStr;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-[1400px] w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 leading-tight">Kelola Proyek</h1>
              <p className="text-sm text-stone-500 mt-1">
                Pantau daftar proyek, tambahkan proyek baru, assign anggota tim, dan konfigurasi alokasi dana proyek.
              </p>
            </div>
            <button
              onClick={() => setShowAddProject(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2d6a4f] hover:bg-[#1e5038] text-white text-[13px] font-bold rounded-xl shadow-sm transition cursor-pointer whitespace-nowrap"
            >
              <FolderPlus size={16} />
              Tambah Proyek
            </button>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <Check size={16} />
              {success}
            </div>
          )}

          {/* List of Projects Grid */}
          {loading && projects.length === 0 ? (
            <div className="flex items-center justify-center py-24 gap-3 text-stone-400">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Memuat data proyek...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-400 space-y-3">
              <Briefcase size={40} className="mx-auto text-stone-300" />
              <p className="text-sm font-medium">Belum ada proyek aktif terdaftar.</p>
              <button 
                onClick={() => setShowAddProject(true)}
                className="px-4 py-2 bg-[#2d6a4f] hover:bg-[#1e5038] text-white text-xs font-bold rounded-xl"
              >
                Buat Proyek Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => {
                const hasBudget = !!project.budget;
                const totalRAB = hasBudget ? parseFloat(project.budget!.rabTotal) : 0;
                const sisa = hasBudget ? parseFloat(project.budget!.sisaBudget) : 0;
                
                return (
                  <div key={project.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                          PRJ-{String(project.id).padStart(3, "0")}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          project.status === "AKTIF" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-stone-100 text-stone-500"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-base text-stone-900 leading-snug truncate">
                        {project.nama}
                      </h3>
                      
                      <p className="text-xs text-stone-400 leading-normal line-clamp-2">
                        {project.deskripsi || "Tidak ada deskripsi."}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                        <Calendar size={13} className="text-stone-400" />
                        <span>
                          {new Date(project.tanggalMulai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          {project.tanggalSelesai && ` - ${new Date(project.tanggalSelesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-stone-100 pt-3.5 space-y-3">
                      {/* Financial summary if budget is set */}
                      {hasBudget ? (
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-stone-400 block font-medium">TOTAL BUDGET RAB</span>
                            <span className="font-mono font-bold text-stone-800 text-[13px]">
                              {formatRupiah(totalRAB)}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-400 block font-medium">SISA BUDGET</span>
                            <span className="font-mono font-bold text-emerald-700 text-[13px]">
                              {formatRupiah(sisa)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-100 text-amber-700 p-2.5 rounded-xl text-[11px] font-medium flex items-center gap-1.5">
                          <DollarSign size={13} />
                          <span>RAB budget belum diinisialisasi</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => openAssignModal(project)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-850 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          <Users size={13} />
                          Anggota
                        </button>
                        {!hasBudget && (
                          <button
                            onClick={() => { setShowInitBudget(project); setRabTotal(""); }}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            <DollarSign size={13} />
                            Set RAB
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAMBAH PROYEK MODAL */}
          {showAddProject && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full overflow-hidden animate-scale-up">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <h3 className="font-bold text-[15px] text-stone-900">Buat Proyek Baru</h3>
                  <button onClick={() => setShowAddProject(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddProject} className="p-6 space-y-4">
                  <div>
                    <label className="block text-[12px] font-bold text-stone-600 mb-1.5">Nama Proyek *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.nama}
                      onChange={(e) => setProjectForm({ ...projectForm, nama: e.target.value })}
                      placeholder="e.g. Renovasi Kantor Cabang Bandung"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-[13px] text-stone-850 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/30 focus:border-[#2d6a4f] transition bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-stone-600 mb-1.5">Deskripsi Proyek</label>
                    <textarea
                      rows={3}
                      value={projectForm.deskripsi}
                      onChange={(e) => setProjectForm({ ...projectForm, deskripsi: e.target.value })}
                      placeholder="Detail mengenai target dan ruang lingkup proyek..."
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-[13px] text-stone-850 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/30 focus:border-[#2d6a4f] transition bg-white resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-stone-600 mb-1.5">Tanggal Mulai *</label>
                      <input
                        type="date"
                        required
                        value={projectForm.tanggalMulai}
                        onChange={(e) => setProjectForm({ ...projectForm, tanggalMulai: e.target.value })}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-[13px] text-stone-850 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/30 focus:border-[#2d6a4f] transition bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-stone-600 mb-1.5">Tanggal Selesai (Opsional)</label>
                      <input
                        type="date"
                        value={projectForm.tanggalSelesai}
                        onChange={(e) => setProjectForm({ ...projectForm, tanggalSelesai: e.target.value })}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-[13px] text-stone-850 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/30 focus:border-[#2d6a4f] transition bg-white"
                      />
                    </div>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[12px] font-medium flex items-center gap-2">
                      <X size={14} />
                      {formError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowAddProject(false)}
                      className="flex-1 py-2.5 border border-stone-200 rounded-xl text-[13px] font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-[#2d6a4f] hover:bg-[#1e5038] disabled:opacity-60 text-white text-[13px] font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader2 size={13} className="animate-spin" />}
                      Buat Proyek
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ASSIGN MEMBERS MODAL */}
          {showAssignMembers && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full overflow-hidden animate-scale-up">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <h3 className="font-bold text-[15px] text-stone-900">Atur Anggota Proyek</h3>
                  <button onClick={() => setShowAssignMembers(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">PROYEK</h4>
                    <p className="font-bold text-stone-850 text-sm">{showAssignMembers.nama}</p>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-bold text-stone-600 mb-2">Pilih Anggota Tim</label>
                    <div className="border border-stone-200 rounded-xl max-h-[260px] overflow-y-auto divide-y divide-stone-100 p-1 bg-stone-50/20">
                      {members.map((member) => {
                        const isChecked = selectedProjectMembers.some((m) => m.userId === member.id);
                        return (
                          <label key={member.id} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-lg cursor-pointer transition select-none">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProjectMembers([...selectedProjectMembers, {
                                      userId: member.id,
                                      role: member.role === 'Project Manager' ? 'Project Manager' : 'Anggota Lapangan'
                                    }]);
                                  } else {
                                    setSelectedProjectMembers(selectedProjectMembers.filter((m) => m.userId !== member.id));
                                  }
                                }}
                                className="accent-[#2d6a4f]"
                              />
                              <div className="min-w-0 text-left">
                                <p className="text-[13px] font-bold text-stone-800 leading-tight">{member.nama}</p>
                                <p className="text-[11px] text-stone-400 font-mono mt-0.5">{member.email}</p>
                              </div>
                            </div>
                            
                            {isChecked ? (
                              <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={selectedProjectMembers.find((m) => m.userId === member.id)?.role || 'Anggota Lapangan'}
                                  onChange={(e) => {
                                    setSelectedProjectMembers(
                                      selectedProjectMembers.map((m) =>
                                        m.userId === member.id ? { ...m, role: e.target.value } : m
                                      )
                                    );
                                  }}
                                  className="border border-stone-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-stone-650 bg-white cursor-pointer focus:outline-none"
                                >
                                  <option value="Anggota Lapangan">Anggota Lapangan</option>
                                  <option value="Project Manager">Project Manager</option>
                                </select>
                              </div>
                            ) : (
                              <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                                {member.role}
                              </span>
                            )}
                          </label>
                        );
                      })}
                      {members.length === 0 && (
                        <p className="p-4 text-center text-xs text-stone-400 italic">Belum ada anggota tim terdaftar</p>
                      )}
                    </div>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[12px] font-medium flex items-center gap-2">
                      <X size={14} />
                      {formError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowAssignMembers(null)}
                      className="flex-1 py-2.5 border border-stone-200 rounded-xl text-[13px] font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveMembers}
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-[#2d6a4f] hover:bg-[#1e5038] disabled:opacity-60 text-white text-[13px] font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader2 size={13} className="animate-spin" />}
                      Simpan Penugasan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INITIALIZE BUDGET MODAL */}
          {showInitBudget && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full overflow-hidden animate-scale-up">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <h3 className="font-bold text-[15px] text-stone-900">Inisialisasi RAB Budget</h3>
                  <button onClick={() => setShowInitBudget(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleInitBudget} className="p-6 space-y-4">
                  <div className="bg-amber-50/50 border border-amber-200/60 p-3.5 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-amber-800">Proyek</h4>
                    <p className="text-[13px] font-bold text-stone-800">{showInitBudget.nama}</p>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-stone-600 mb-1.5">Total Anggaran RAB (Rupiah)</label>
                    <input
                      type="number"
                      required
                      value={rabTotal}
                      onChange={(e) => setRabTotal(e.target.value)}
                      placeholder="e.g. 50000000"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-[13px] text-stone-850 font-bold focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/30 focus:border-[#2d6a4f] transition bg-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[12px] font-bold text-stone-600">Breakdown Pos Anggaran</label>
                      <button
                        type="button"
                        onClick={() => setPosAnggaranList([...posAnggaranList, { deskripsi: "", nominalAlokasi: "" }])}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2d6a4f] hover:underline"
                      >
                        <Plus size={12} /> Tambah Item
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {posAnggaranList.map((pos, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            required
                            value={pos.deskripsi}
                            onChange={(e) => {
                              const newList = [...posAnggaranList];
                              newList[idx].deskripsi = e.target.value;
                              setPosAnggaranList(newList);
                            }}
                            placeholder="Deskripsi Pos Anggaran"
                            className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-[12px] text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/30 bg-white"
                          />
                          <input
                            type="number"
                            required
                            value={pos.nominalAlokasi}
                            onChange={(e) => {
                              const newList = [...posAnggaranList];
                              newList[idx].nominalAlokasi = e.target.value;
                              setPosAnggaranList(newList);
                            }}
                            placeholder="Nominal (Rp)"
                            className="w-28 border border-stone-200 rounded-xl px-3 py-2 text-[12px] text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/30 bg-white font-mono text-right"
                          />
                          {posAnggaranList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setPosAnggaranList(posAnggaranList.filter((_, i) => i !== idx))}
                              className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-50 transition cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[12px] font-medium flex items-center gap-2">
                      <X size={14} />
                      {formError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowInitBudget(null)}
                      className="flex-1 py-2.5 border border-stone-200 rounded-xl text-[13px] font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-[#2d6a4f] hover:bg-[#1e5038] disabled:opacity-60 text-white text-[13px] font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader2 size={13} className="animate-spin" />}
                      Simpan RAB
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

    </main>
  );
}
