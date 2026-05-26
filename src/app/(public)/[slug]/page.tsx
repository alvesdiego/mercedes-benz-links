import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase-server'
import VirtualCard from '@/components/public/VirtualCard'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('collaborators')
    .select('full_name, position, area')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!data) return { title: 'Colaborador não encontrado' }

  return {
    title: `${data.full_name} — Mercedes-Benz`,
    description: `${data.position} | ${data.area} — Mercedes-Benz Links`,
    openGraph: {
      title: `${data.full_name} — Mercedes-Benz`,
      description: `${data.position} | ${data.area}`,
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function CollaboratorCardPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: collaborator } = await supabase
    .from('collaborators')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!collaborator) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const cardUrl = `${appUrl}/${collaborator.slug}`

  return <VirtualCard collaborator={collaborator} cardUrl={cardUrl} />
}
