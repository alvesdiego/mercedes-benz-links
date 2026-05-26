import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Users, UserCheck, UserX, Plus } from 'lucide-react'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const { data: all } = await supabase
    .from('collaborators')
    .select('id, is_active')

  const total = all?.length ?? 0
  const active = all?.filter((c) => c.is_active).length ?? 0
  const inactive = total - active

  const stats = [
    {
      label: 'Total de Colaboradores',
      value: total,
      icon: Users,
      color: 'text-steel-700',
      bg: 'bg-steel-100',
    },
    {
      label: 'Colaboradores Ativos',
      value: active,
      icon: UserCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Colaboradores Inativos',
      value: inactive,
      icon: UserX,
      color: 'text-red-700',
      bg: 'bg-red-50',
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-steel-900 tracking-tight">Dashboard</h1>
          <p className="text-steel-500 mt-1 text-sm">Visão geral dos colaboradores.</p>
        </div>
        <Link href="/dashboard/colaboradores/novo" className="btn-primary bg-steel-950 text-white hover:bg-steel-800 active:bg-steel-700">
          <Plus size={16} />
          Novo Colaborador
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card-admin p-6 flex items-center gap-5">
            <div className={`${bg} rounded-2xl p-4`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-3xl font-bold text-steel-900">{value}</p>
              <p className="text-sm text-steel-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick link */}
      <div className="card-admin p-6">
        <h2 className="font-semibold text-steel-900 mb-2">Acesso Rápido</h2>
        <p className="text-sm text-steel-500 mb-4">
          Gerencie todos os colaboradores cadastrados, edite informações e ative ou desative cartões.
        </p>
        <Link
          href="/dashboard/colaboradores"
          className="text-sm font-medium text-steel-700 hover:text-steel-900 underline underline-offset-2"
        >
          Ver todos os colaboradores →
        </Link>
      </div>
    </div>
  )
}
