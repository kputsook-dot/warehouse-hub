import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditWarehouseForm from './EditWarehouseForm'

interface Props { params: Promise<{ id: string }> }

export default async function EditWarehousePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: warehouse } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!warehouse) notFound()

  return <EditWarehouseForm warehouse={warehouse} userId={user.id} />
}
