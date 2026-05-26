import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase-server'
import { corsHeaders } from '@/lib/cors'
import { z } from 'zod'

const updateSchema = z.object({
  full_name: z.string().min(2).optional(),
  position:  z.string().min(1).optional(),
  area:      z.string().min(1).optional(),
  phone:     z.string().min(8).optional(),
  email:     z.string().email().optional(),
  slug:      z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  is_active: z.boolean().optional(),
})

type Params = { params: Promise<{ id: string }> }

/** GET /api/colaboradores/[id] — public if active */
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params
  const origin = req.headers.get('origin')
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('collaborators')
    .select('id, full_name, position, area, slug, phone, email')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders(origin) })
  }

  return NextResponse.json(data, { headers: corsHeaders(origin) })
}

/** PATCH /api/colaboradores/[id] — admin only */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
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

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422, headers })
  }

  const { data, error } = await adminClient
    .from('collaborators')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })

  return NextResponse.json(data, { headers })
}

/** DELETE /api/colaboradores/[id] — admin only */
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
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

  const { error } = await adminClient.from('collaborators').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })

  return new NextResponse(null, { status: 204, headers })
}
