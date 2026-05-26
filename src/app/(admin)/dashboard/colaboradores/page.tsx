'use client'

import { useEffect, useState } from 'react'
import { useCollaborators } from '@/hooks/useCollaborators'
import CollaboratorTable from '@/components/admin/CollaboratorTable'
import type { Collaborator } from '@/types/collaborator'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'

export default function ColaboradoresPage() {
  const { fetchCollaborators, deleteCollaborator, loading } = useCollaborators()
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  useEffect(() => {
    fetchCollaborators().then(setCollaborators)
  }, [])

  const handleDelete = async (id: string) => {
    const ok = await deleteCollaborator(id)
    if (ok) setCollaborators((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-steel-900 tracking-tight">Colaboradores</h1>
          <p className="text-steel-500 mt-1 text-sm">Gerencie os cartões virtuais dos colaboradores.</p>
        </div>
        <Link
          href="/dashboard/colaboradores/novo"
          className="inline-flex items-center gap-2 bg-steel-950 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-steel-800 transition-colors"
        >
          <Plus size={16} />
          Novo Colaborador
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-steel-400 gap-3">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm">Carregando...</span>
        </div>
      ) : (
        <CollaboratorTable collaborators={collaborators} onDelete={handleDelete} />
      )}
    </div>
  )
}
