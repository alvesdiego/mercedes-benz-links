'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Phone, Mail, Download } from 'lucide-react'
import type { Collaborator } from '@/types/collaborator'
import { formatPhone } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  collaborator: Collaborator
  cardUrl: string
}

export default function ShareButton({ collaborator, cardUrl }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${collaborator.full_name} — Mercedes-Benz`,
          text: `${collaborator.position} | ${collaborator.area}`,
          url: cardUrl,
        })
      } catch {
        // user cancelled
      }
    } else {
      handleCopy()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  const handleVCard = () => {
    const phone = collaborator.phone.replace(/\D/g, '')
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${collaborator.full_name}`,
      `TITLE:${collaborator.position}`,
      `ORG:Mercedes-Benz;${collaborator.area}`,
      `TEL;TYPE=CELL:+55${phone}`,
      `EMAIL:${collaborator.email}`,
      'URL:https://www.mercedes-benz.com.br',
      'END:VCARD',
    ].join('\r\n')

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${collaborator.slug}.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const actions = [
    {
      label: 'Compartilhar',
      icon: Share2,
      onClick: handleShare,
      active: false,
    },
    {
      label: copied ? 'Copiado!' : 'Copiar Link',
      icon: copied ? Check : Copy,
      onClick: handleCopy,
      active: copied,
    },
    {
      label: 'Ligar',
      icon: Phone,
      href: `tel:${collaborator.phone.replace(/\D/g, '')}`,
    },
    {
      label: 'E-mail',
      icon: Mail,
      href: `mailto:${collaborator.email}`,
    },
    {
      label: 'Salvar Contato',
      icon: Download,
      onClick: handleVCard,
      active: false,
    },
  ]

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {actions.map(({ label, icon: Icon, onClick, href, active }) =>
        href ? (
          <a
            key={label}
            href={href}
            className={cn(
              'inline-flex flex-col items-center gap-1 px-4 py-3 rounded-2xl',
              'bg-steel-800/60 border border-steel-700/50 text-steel-300',
              'hover:bg-steel-700/60 hover:text-white transition-all text-xs font-medium',
              'min-w-[72px]'
            )}
          >
            <Icon size={18} />
            {label}
          </a>
        ) : (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              'inline-flex flex-col items-center gap-1 px-4 py-3 rounded-2xl',
              'border transition-all text-xs font-medium min-w-[72px]',
              active
                ? 'bg-emerald-900/40 border-emerald-700/50 text-emerald-400'
                : 'bg-steel-800/60 border-steel-700/50 text-steel-300 hover:bg-steel-700/60 hover:text-white'
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        )
      )}
    </div>
  )
}
