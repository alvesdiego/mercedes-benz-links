'use client'

import { useEffect, useState } from 'react'
import { useCollaborators } from '@/hooks/useCollaborators'
import CollaboratorForm from '@/components/admin/CollaboratorForm'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Collaborator, CollaboratorInsert } from '@/types/collaborator'

export default function EditarColaboradorPage() {
  const { id } = useParams<{ id: string }>()
  const { fetchCollaboratorById, updateCollaborator } = useCollaborators()
  const router = useRouter()
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollaboratorById(id).then((data) => {
      setCollaborator(data)
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (data: CollaboratorInsert) => {
    const result = await updateCollaborator(id, data)
    if (result) router.push('/dashboard/colaboradores')
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-steel-400">
        <Loader2 size={22} className="animate-spin" />
        <span className="text-sm">Carregando...</span>
      </div>
    )
  }

  if (!collaborator) {
    return (
      <div className="p-8">
        <p className="text-steel-500">Colaborador não encontrado.</p>
        <Link href="/dashboard/colaboradores" className="text-sm text-steel-700 hover:underline mt-2 inline-block">
          ← Voltar
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/colaboradores"
          className="text-steel-500 hover:text-steel-900 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-steel-900 tracking-tight">Editar Colaborador</h1>
          <p className="text-steel-500 mt-1 text-sm">{collaborator.full_name}</p>
        </div>
      </div>

      <CollaboratorForm defaultValues={collaborator} onSubmit={handleSubmit} />
    </div>
  )
}
