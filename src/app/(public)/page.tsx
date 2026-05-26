import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import type { Metadata } from 'next'
import LogoImage from '@/components/public/LogoImage'

export const metadata: Metadata = {
  title: 'Mercedes-Benz Links',
  description: 'Encontre o cartão virtual dos colaboradores Mercedes-Benz.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createServerClient()
  const { data: collaborators } = await supabase
    .from('collaborators')
    .select('id, full_name, position, area, slug')
    .eq('is_active', true)
    .order('full_name')

  const list = collaborators ?? []

  return (
    <div className="min-h-screen bg-steel-950">
      {/* Subtle grid */}
      <div className="dot-grid fixed inset-0 opacity-[0.03] pointer-events-none" />

      {/* Hero */}
      <header className="relative px-6 pt-16 pb-12 text-center">
        <div className="w-28 h-28 flex items-center justify-center mx-auto mb-6">
          <LogoImage />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
          Mercedes-Benz Links
        </h1>
        <p className="text-steel-400 text-sm max-w-xs mx-auto">
          Cartões virtuais dos colaboradores. Encontre e compartilhe.
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-steel-500 hover:text-white text-xs border border-steel-800 hover:border-steel-600 rounded-lg px-4 py-2 transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Área Administrativa
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-2xl mx-auto px-6 pb-16">
        {list.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-steel-500 text-sm">Nenhum colaborador disponível no momento.</p>
          </div>
        ) : (
          <>
            <p className="text-steel-500 text-xs text-center mb-6 uppercase tracking-widest">
              {list.length} colaborador{list.length !== 1 ? 'es' : ''} disponível{list.length !== 1 ? 'is' : ''}
            </p>
            <div className="space-y-3">
              {list.map((c) => (
                <Link
                  key={c.id}
                  href={`/${c.slug}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-steel-900/60 border border-steel-800/60 hover:border-steel-600 hover:bg-steel-800/60 transition-all group"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-steel-800 border border-steel-700 flex items-center justify-center text-white text-sm font-bold shrink-0 group-hover:border-steel-500 transition-colors">
                    {c.full_name
                      .split(' ')
                      .slice(0, 2)
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate group-hover:text-white">
                      {c.full_name}
                    </p>
                    <p className="text-steel-500 text-xs truncate">
                      {c.position} · {c.area}
                    </p>
                  </div>
                  <span className="ml-auto text-steel-600 group-hover:text-steel-300 transition-colors text-lg">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative text-center pb-8">
        <p className="text-steel-700 text-xs tracking-wider uppercase">Mercedes-Benz Links</p>
      </footer>
    </div>
  )
}
