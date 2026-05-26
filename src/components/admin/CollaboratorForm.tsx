'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { Loader2, Save, RefreshCw } from 'lucide-react'
import { generateSlug, cn } from '@/lib/utils'
import type { Collaborator, CollaboratorInsert } from '@/types/collaborator'

const schema = z.object({
  full_name: z.string().min(2, 'Nome completo é obrigatório'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  area: z.string().min(1, 'Área é obrigatória'),
  phone: z.string().min(8, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
  slug: z
    .string()
    .min(2, 'Slug inválido')
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífens'),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  defaultValues?: Partial<Collaborator>
  onSubmit: (data: CollaboratorInsert) => Promise<void>
}

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string
  error?: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-steel-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function CollaboratorForm({ defaultValues, onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: defaultValues?.full_name ?? '',
      position: defaultValues?.position ?? '',
      area: defaultValues?.area ?? '',
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      slug: defaultValues?.slug ?? '',
      is_active: defaultValues?.is_active ?? true,
    },
  })

  const fullName = watch('full_name')
  const slug = watch('slug')
  const isEditing = !!defaultValues?.id

  // Auto-generate slug from name (only when creating)
  useEffect(() => {
    if (!isEditing && fullName) {
      setValue('slug', generateSlug(fullName), { shouldValidate: true })
    }
  }, [fullName, isEditing, setValue])

  const handleRegenerateSlug = () => {
    setValue('slug', generateSlug(fullName), { shouldValidate: true })
  }

  const handleFormSubmit = async (data: FormValues) => {
    setSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="card-admin p-6 space-y-5">
        <h2 className="font-semibold text-steel-800 text-sm uppercase tracking-wider">
          Dados Pessoais
        </h2>

        <Field label="Nome Completo" error={errors.full_name?.message}>
          <input
            {...register('full_name')}
            placeholder="Ex: João da Silva"
            className={cn('admin-input', errors.full_name && 'border-red-400 focus:ring-red-400')}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Cargo" error={errors.position?.message}>
            <input
              {...register('position')}
              placeholder="Ex: Gerente de Vendas"
              className={cn('admin-input', errors.position && 'border-red-400')}
            />
          </Field>

          <Field label="Área / Departamento" error={errors.area?.message}>
            <input
              {...register('area')}
              placeholder="Ex: Vendas & Marketing"
              className={cn('admin-input', errors.area && 'border-red-400')}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Telefone" error={errors.phone?.message}>
            <input
              {...register('phone')}
              type="tel"
              placeholder="Ex: 11 99999-9999"
              className={cn('admin-input', errors.phone && 'border-red-400')}
            />
          </Field>

          <Field label="E-mail" error={errors.email?.message}>
            <input
              {...register('email')}
              type="email"
              placeholder="joao.silva@mercedes-benz.com.br"
              className={cn('admin-input', errors.email && 'border-red-400')}
            />
          </Field>
        </div>
      </div>

      <div className="card-admin p-6 space-y-5">
        <h2 className="font-semibold text-steel-800 text-sm uppercase tracking-wider">
          Link do Cartão
        </h2>

        <Field
          label="Slug (URL do cartão)"
          error={errors.slug?.message}
          hint={`O cartão ficará disponível em: ${process.env.NEXT_PUBLIC_APP_URL ?? ''}/${slug || '...'}`}
        >
          <div className="flex gap-2">
            <input
              {...register('slug')}
              placeholder="ex: joao-silva"
              className={cn('admin-input flex-1', errors.slug && 'border-red-400')}
            />
            <button
              type="button"
              onClick={handleRegenerateSlug}
              className="px-3 py-2.5 border border-steel-300 rounded-xl text-steel-500 hover:text-steel-800 hover:border-steel-400 transition-colors"
              title="Gerar slug a partir do nome"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </Field>

        <Field label="Status">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('is_active')}
              className="w-4 h-4 rounded accent-steel-800 cursor-pointer"
            />
            <span className="text-sm text-steel-700">Colaborador ativo (cartão visível publicamente)</span>
          </label>
        </Field>
      </div>

      {/* Fixed website info */}
      <div className="card-admin p-6">
        <p className="text-sm text-steel-500">
          <span className="font-medium text-steel-700">Site da empresa (fixo):</span>{' '}
          <a
            href="https://www.mercedes-benz.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-steel-700 hover:underline"
          >
            www.mercedes-benz.com.br
          </a>{' '}
          — este campo é fixo e aparece em todos os cartões.
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <button type="submit" disabled={submitting} className="btn-primary bg-steel-950 text-white hover:bg-steel-800 active:bg-steel-700">
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={16} />
              {defaultValues?.id ? 'Salvar Alterações' : 'Criar Colaborador'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
