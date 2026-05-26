const getAllowedOrigins = (): string[] => {
  const raw =
    process.env.ALLOWED_ORIGINS ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000'
  return raw.split(',').map((o) => o.trim()).filter(Boolean)
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  return getAllowedOrigins().includes(origin)
}

export function corsHeaders(origin: string | null): HeadersInit {
  if (!origin || !isAllowedOrigin(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}
