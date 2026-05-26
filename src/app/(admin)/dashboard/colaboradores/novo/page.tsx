'use client'

import CollaboratorForm from '@/components/admin/CollaboratorForm'
import { useCollaborators } from '@/hooks/useCollaborators'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { CollaboratorInsert } from '@/types/collaborator'

export default function NovoColaboradorPage() {
  const { createCollaborator } = useCollaborators()
  const router = useRouter()

  const handleSubmit = async (data: CollaboratorInsert) => {
    const result = await createCollaborator(data)
    if (result) router.push('/dashboard/colaboradores')
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
          <h1 className="text-3xl font-bold text-steel-900 tracking-tight">Novo Colaborador</h1>
          <p className="text-steel-500 mt-1 text-sm">Preencha os dados para gerar o cartão virtual.</p>
        </div>
      </div>

      <CollaboratorForm onSubmit={handleSubmit} />
    </div>
  )
}
