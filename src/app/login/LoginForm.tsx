'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Mail, Lock, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'
import LogoImage from '@/components/public/LogoImage'
import Link from 'next/link'

export default function LoginForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(`Erro ao fazer login: ${error.message} (${error.status ?? 'sem status'})`)
      setLoading(false)
      return
    }

    const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'
    router.push(redirectTo)
  }

  return (
    <div className="min-h-screen bg-steel-950 flex items-center justify-center px-4">
      {/* Subtle dot grid background */}
      <div className="dot-grid absolute inset-0 opacity-[0.04]" />

      <div className="relative w-full max-w-sm animate-fade-in">
        {/* Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-steel-500 hover:text-white text-xs mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar à página inicial
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 flex items-center justify-center mx-auto mb-5">
            <LogoImage />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mercedes-Benz Links</h1>
          <p className="text-steel-400 text-sm mt-1">Painel Administrativo</p>
        </div>

        {/* Card */}
        <div className="bg-steel-900 border border-steel-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={18} className="text-steel-400" />
            <h2 className="text-base font-semibold text-steel-100">Acesso seguro</h2>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-900/60 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exemplo.com"
                  autoComplete="email"
                  required
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="input-field pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-500 hover:text-steel-300 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
