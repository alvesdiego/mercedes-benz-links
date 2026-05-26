'use client'

import type { Collaborator } from '@/types/collaborator'
import { getInitials, formatPhone } from '@/lib/utils'
import { Phone, Mail, Globe } from 'lucide-react'
import QRCodeDisplay from './QRCodeDisplay'
import ShareButton from './ShareButton'

interface Props {
  collaborator: Collaborator
  cardUrl: string
}

export default function VirtualCard({ collaborator, cardUrl }: Props) {
  const initials = getInitials(collaborator.full_name)

  return (
    <div className="min-h-screen bg-steel-950 flex items-center justify-center px-4 py-10">
      {/* Subtle noise/grain background */}
      <div className="dot-grid absolute inset-0 opacity-[0.03]" />

      {/* Gradient glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-steel-800/20 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Silver gradient border wrapper */}
        <div className="p-px rounded-3xl bg-gradient-to-br from-steel-400 via-steel-700 to-steel-500 shadow-2xl">
          <div className="bg-steel-950 rounded-3xl overflow-hidden">

            {/* ── Header band ── */}
            <div className="bg-gradient-to-r from-steel-900 to-steel-800 px-6 pt-7 pb-5 flex items-center gap-3 border-b border-steel-800/60">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/logo_mercedes.jpg"
                  alt="Mercedes-Benz"
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML =
                        '<span class="font-bold text-[10px] text-steel-950 tracking-tight">MB</span>'
                    }
                  }}
                />
              </div>
              <div>
                <p className="text-white text-xs font-semibold tracking-widest uppercase">
                  Mercedes-Benz
                </p>
                <p className="text-steel-500 text-[10px] tracking-wider">Links</p>
              </div>
            </div>

            {/* ── Avatar & Identity ── */}
            <div className="px-6 pt-7 pb-5 text-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-steel-700 to-steel-800 border-2 border-steel-700 flex items-center justify-center mx-auto mb-4 shadow-glow-sm">
                <span className="text-2xl font-bold text-white tracking-tight">{initials}</span>
              </div>

              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                {collaborator.full_name}
              </h1>
              <p className="text-steel-300 text-sm mt-1 font-medium">{collaborator.position}</p>
              <p className="text-steel-500 text-xs mt-0.5">{collaborator.area}</p>
            </div>

            {/* ── Divider ── */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-steel-700 to-transparent" />

            {/* ── Contact Info ── */}
            <div className="px-6 py-5 space-y-3">
              <a
                href={`tel:${collaborator.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-steel-800 flex items-center justify-center shrink-0 group-hover:bg-steel-700 transition-colors">
                  <Phone size={14} className="text-steel-400" />
                </div>
                <span className="text-steel-300 text-sm group-hover:text-white transition-colors">
                  {formatPhone(collaborator.phone)}
                </span>
              </a>

              <a
                href={`mailto:${collaborator.email}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-steel-800 flex items-center justify-center shrink-0 group-hover:bg-steel-700 transition-colors">
                  <Mail size={14} className="text-steel-400" />
                </div>
                <span className="text-steel-300 text-sm group-hover:text-white transition-colors break-all">
                  {collaborator.email}
                </span>
              </a>

              <a
                href="https://www.mercedes-benz.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-steel-800 flex items-center justify-center shrink-0 group-hover:bg-steel-700 transition-colors">
                  <Globe size={14} className="text-steel-400" />
                </div>
                <span className="text-steel-300 text-sm group-hover:text-white transition-colors">
                  mercedes-benz.com.br
                </span>
              </a>
            </div>

            {/* ── Divider ── */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-steel-700 to-transparent" />

            {/* ── QR Code ── */}
            <div className="px-6 py-6 flex flex-col items-center gap-3">
              <QRCodeDisplay value={cardUrl} size={160} />
              <p className="text-steel-600 text-xs text-center">
                Escaneie para acessar este cartão
              </p>
            </div>

            {/* ── Divider ── */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-steel-700 to-transparent" />

            {/* ── Share actions ── */}
            <div className="px-6 py-6">
              <ShareButton collaborator={collaborator} cardUrl={cardUrl} />
            </div>

          </div>
        </div>

        {/* Watermark */}
        <p className="text-center text-steel-700 text-[10px] mt-4 tracking-wider">
          MERCEDES-BENZ LINKS
        </p>
      </div>
    </div>
  )
}
