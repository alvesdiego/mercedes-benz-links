import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase-server'
import { corsHeaders } from '@/lib/cors'
import { z } from 'zod'

const insertSchema = z.object({
  full_name: z.string().min(2),
  position:  z.string().min(1),
  area:      z.string().min(1),
  phone:     z.string().min(8),
  email:     z.string().email(),
  slug:      z.string().min(2).regex(/^[a-z0-9-]+$/),
  is_active: z.boolean().default(true),
})

/** GET /api/colaboradores — public, returns only active collaborators */
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin')
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('collaborators')
    .select('id, full_name, position, area, slug')
    .eq('is_active', true)
    .order('full_name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders(origin) })
  }

  return NextResponse.json(data, { headers: corsHeaders(origin) })
}

/** POST /api/colaboradores — admin only */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const headers = corsHeaders(origin)

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })

  const adminClient = await createAdminClient()
  const { data: role } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle()

  if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers })
  }

  const parsed = insertSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422, headers })
  }

  const { data, error } = await adminClient
    .from('collaborators')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })

  return NextResponse.json(data, { status: 201, headers })
}
