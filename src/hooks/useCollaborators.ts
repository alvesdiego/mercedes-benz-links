'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Collaborator, CollaboratorInsert, CollaboratorUpdate } from '@/types/collaborator'

export function useCollaborators() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function fetchCollaborators(): Promise<Collaborator[]> {
    setLoading(true)
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')
      .order('full_name')
    setLoading(false)
    if (error) { console.error('fetchCollaborators error:', error.code, error.message, error.details); return [] }
    return data ?? []
  }

  async function fetchCollaboratorById(id: string): Promise<Collaborator | null> {
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')
      .eq('id', id)
      .single()
    if (error) { console.error(error); return null }
    return data
  }

  async function createCollaborator(payload: CollaboratorInsert): Promise<Collaborator | null> {
    const { data, error } = await supabase
      .from('collaborators')
      .insert(payload)
      .select()
      .single()
    if (error) { console.error(error); return null }
    return data
  }

  async function updateCollaborator(
    id: string,
    payload: CollaboratorUpdate
  ): Promise<Collaborator | null> {
    const { data, error } = await supabase
      .from('collaborators')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) { console.error(error); return null }
    return data
  }

  async function deleteCollaborator(id: string): Promise<boolean> {
    const { error } = await supabase.from('collaborators').delete().eq('id', id)
    if (error) { console.error(error); return false }
    return true
  }

  return {
    loading,
    fetchCollaborators,
    fetchCollaboratorById,
    createCollaborator,
    updateCollaborator,
    deleteCollaborator,
  }
}
