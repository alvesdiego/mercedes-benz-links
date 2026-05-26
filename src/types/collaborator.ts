export interface Collaborator {
  id: string
  full_name: string
  position: string
  area: string
  phone: string
  email: string
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CollaboratorInsert = Omit<Collaborator, 'id' | 'created_at' | 'updated_at'>
export type CollaboratorUpdate = Partial<CollaboratorInsert>
