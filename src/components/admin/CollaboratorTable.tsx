'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Pencil, Trash2, ExternalLink, CheckCircle2, XCircle, Search } from 'lucide-react'
import type { Collaborator } from '@/types/collaborator'
import { cn } from '@/lib/utils'

interface Props {
  collaborators: Collaborator[]
  onDelete: (id: string) => void
}

export default function CollaboratorTable({ collaborators, onDelete }: Props) {
  const [query, setQuery] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = collaborators.filter(
    (c) =>
      c.full_name.toLowerCase().includes(query.toLowerCase()) ||
      c.position.toLowerCase().includes(query.toLowerCase()) ||
      c.area.toLowerCase().includes(query.toLowerCase())
  )

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setConfirmDelete((curr) => (curr === id ? null : curr)), 3000)
    }
  }

  if (collaborators.length === 0) {
    return (
      <div className="card-admin p-12 text-center">
        <p className="text-steel-400 text-sm">Nenhum colaborador cadastrado ainda.</p>
        <Link
          href="/dashboard/colaboradores/novo"
          className="mt-4 inline-block text-sm font-medium text-steel-700 hover:underline"
        >
          Cadastrar o primeiro →
        </Link>
      </div>
    )
  }

  return (
    <div className="card-admin overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b border-steel-200">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, cargo ou área..."
            className="admin-input pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steel-200 bg-steel-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-steel-500 uppercase tracking-wider">
                Colaborador
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-steel-500 uppercase tracking-wider">
                Cargo / Área
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-steel-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-steel-500 uppercase tracking-wider">
                Link
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-steel-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-steel-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {c.full_name
                        .split(' ')
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-steel-900">{c.full_name}</p>
                      <p className="text-steel-400 text-xs">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-steel-700">{c.position}</p>
                  <p className="text-steel-400 text-xs">{c.area}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
                      c.is_active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-steel-100 text-steel-500'
                    )}
                  >
                    {c.is_active ? (
                      <><CheckCircle2 size={11} /> Ativo</>
                    ) : (
                      <><XCircle size={11} /> Inativo</>
                    )}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <a
                    href={`${appUrl}/${c.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-steel-500 hover:text-steel-900 text-xs transition-colors"
                  >
                    /{c.slug}
                    <ExternalLink size={11} />
                  </a>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/dashboard/colaboradores/${c.id}`}
                      className="p-2 text-steel-400 hover:text-steel-800 hover:bg-steel-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className={cn(
                        'p-2 rounded-lg transition-colors text-sm',
                        confirmDelete === c.id
                          ? 'bg-red-100 text-red-600 font-medium px-3'
                          : 'text-steel-400 hover:text-red-500 hover:bg-red-50'
                      )}
                      title={confirmDelete === c.id ? 'Clique novamente para confirmar' : 'Excluir'}
                    >
                      {confirmDelete === c.id ? (
                        'Confirmar?'
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-steel-400">
            Nenhum resultado para &ldquo;{query}&rdquo;.
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-steel-200 bg-steel-50 text-xs text-steel-400">
        {filtered.length} de {collaborators.length} colaborador(es)
      </div>
    </div>
  )
}
