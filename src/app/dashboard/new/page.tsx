import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NewWarehouseForm from './NewWarehouseForm'

export default async function NewWarehousePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  return <NewWarehouseForm userId={user.id} />
}
