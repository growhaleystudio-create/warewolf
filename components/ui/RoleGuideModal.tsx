"use client";

import React, { useState } from "react";
import { RoleId } from "@/lib/types";
import { ROLES } from "@/lib/roles";
import { RoleIcon } from "../illustrations/RoleIcon";
import { RoleIllustration } from "../illustrations/RoleIllustration";
import { X, BookOpen, Sparkles, Shield, Skull, HelpCircle, Trophy } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface RoleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoleDetailInfo {
  roleId: RoleId;
  strategy: string;
  nightAbility: string;
  winCondition: string;
}

const ROLE_DETAILS: Record<RoleId, RoleDetailInfo> = {
  WEREWOLF: {
    roleId: "WEREWOLF",
    nightAbility: "Membuka mata di malam hari bersama kawanan serigala dan memilih 1 warga untuk dibunuh.",
    strategy: "Menyamarlah sebagai warga desa biasa di siang hari. Bersikap aktif berdiskusi dan lempar kecurigaan ke pemain lain tanpa terlalu agresif.",
    winCondition: "Jumlah Serigala yang hidup sama dengan atau lebih banyak dari jumlah Warga Desa yang tersisa.",
  },
  VILLAGER: {
    roleId: "VILLAGER",
    nightAbility: "Tidak memiliki aksi malam (mata tetap terpejam).",
    strategy: "Perhatikan gerak-gerik, nada bicara, dan pola voting pemain lain di siang hari. Gunakan kekuatan voting bersama warga untuk menggantung serigala.",
    winCondition: "Seluruh kawanan Serigala berhasil dimusnahkan.",
  },
  SEER: {
    roleId: "SEER",
    nightAbility: "Menerawang 1 pemain setiap malam untuk mengetahui apakah target adalah Serigala atau Bukan.",
    strategy: "Simpan informasi dengan hati-hati. Jika terburu-buru mengaku sebagai Peramal di awal game, Serigala akan langsung mengincar Anda di malam berikutnya!",
    winCondition: "Seluruh kawanan Serigala berhasil dimusnahkan.",
  },
  DOCTOR: {
    roleId: "DOCTOR",
    nightAbility: "Menyembuhkan 1 pemain setiap malam agar kebal dari serangan Serigala.",
    strategy: "Prediksi siapa yang paling mungkin diserang Serigala (misal: pemain yang vokal atau diduga Peramal). Boleh menyembuhkan diri sendiri jika merasa terancam.",
    winCondition: "Seluruh kawanan Serigala berhasil dimusnahkan.",
  },
  BODYGUARD: {
    roleId: "BODYGUARD",
    nightAbility: "Melindungi 1 pemain lain dari kematian akibat serangan Serigala.",
    strategy: "Fokus menjaga pemain-pemain penting desa. Tidak boleh melindungi diri sendiri dan jangan melindungi pemain yang sama dua malam berturut-turut.",
    winCondition: "Seluruh kawanan Serigala berhasil dimusnahkan.",
  },
  WITCH: {
    roleId: "WITCH",
    nightAbility: "Memiliki 1× Ramuan Penyembuh (menyelamatkan korban serigala malam itu) dan 1× Ramuan Racun (membunuh 1 pemain langsung).",
    strategy: "Gunakan ramuan penyembuh saat pemain krusial (seperti Peramal) diserang, dan gunakan racun hanya jika Anda sudah yakin 100% siapa serigalanya.",
    winCondition: "Seluruh kawanan Serigala berhasil dimusnahkan.",
  },
  HUNTER: {
    roleId: "HUNTER",
    nightAbility: "Tidak ada aksi malam aktif, namun jika mati (baik diserang serigala, diracun, atau digantung), dapat langsung menembak mati 1 pemain lain.",
    strategy: "Jangan takut mati! Manfaatkan ancaman tembakan balasan Anda untuk menekan pemain yang mencurigakan saat musyawarah siang.",
    winCondition: "Seluruh kawanan Serigala berhasil dimusnahkan.",
  },
  JESTER: {
    roleId: "JESTER",
    nightAbility: "Tidak memiliki aksi malam (mata tetap terpejam).",
    strategy: "Berperilakulah mencurigakan, berbohong tipis-tipis, atau buat diri Anda tampak seperti Serigala yang tertangkap basah agar warga desa menggantung Anda di siang hari!",
    winCondition: "Menang mutlak secara tunggal jika berhasil dieksekusi gantung melalui voting siang hari.",
  },
};

export function RoleGuideModal({ isOpen, onClose }: RoleGuideModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>("WEREWOLF");

  if (!isOpen) return null;

  const roleDef = ROLES[selectedRoleId];
  const roleInfo = ROLE_DETAILS[selectedRoleId];

  const handleSelectRole = (r: RoleId) => {
    audioEngine.playTap();
    setSelectedRoleId(r);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-3xl bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-100">
              Ensiklopedia & Panduan Peran — Lembah Bayang
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (2 Columns on Tablet/Desktop) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left List of Roles */}
          <div className="md:col-span-4 p-3 bg-stone-950/60 border-b md:border-b-0 md:border-r border-stone-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2">
              Daftar Peran:
            </span>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
              {(Object.keys(ROLES) as RoleId[]).map((rId) => {
                const r = ROLES[rId];
                const isSelected = selectedRoleId === rId;
                return (
                  <button
                    key={rId}
                    type="button"
                    onClick={() => handleSelectRole(rId)}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-amber-500/20 border border-amber-500/50 text-amber-200"
                        : "hover:bg-stone-800/60 text-stone-300 border border-transparent"
                    }`}
                  >
                    <RoleIcon role={rId} className="w-7 h-7 shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">{r.name}</div>
                      <div className="text-[9px] text-stone-400">
                        {r.faction === "WEREWOLF" ? "🐺 Serigala" : r.faction === "NEUTRAL" ? "🎭 Netral" : "🛡️ Warga"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Detail Pane */}
          <div className="md:col-span-8 p-5 sm:p-6 space-y-5 bg-stone-900 overflow-y-auto">
            {/* Role Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-stone-800">
              <RoleIllustration role={selectedRoleId} size="sm" className="shrink-0 w-28 h-36" />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="font-serif text-2xl font-extrabold text-amber-200">{roleDef.name}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-stone-950 text-amber-300 border-amber-500/40">
                    {roleDef.faction === "WEREWOLF" ? "Faksi Serigala" : roleDef.faction === "NEUTRAL" ? "Faksi Netral" : "Faksi Desa"}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">{roleDef.description}</p>
              </div>
            </div>

            {/* Night Ability */}
            <div className="p-3.5 bg-stone-950/70 rounded-2xl border border-stone-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Kemampuan & Aksi Malam:
              </span>
              <p className="text-xs text-stone-200 leading-relaxed">{roleInfo.nightAbility}</p>
            </div>

            {/* Strategy */}
            <div className="p-3.5 bg-stone-950/70 rounded-2xl border border-stone-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Tips Strategi Bermain:
              </span>
              <p className="text-xs text-stone-200 leading-relaxed">{roleInfo.strategy}</p>
            </div>

            {/* Win Condition */}
            <div className="p-3.5 bg-stone-950/70 rounded-2xl border border-stone-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Kondisi Kemenangan:
              </span>
              <p className="text-xs text-stone-200 leading-relaxed">{roleInfo.winCondition}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
