import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendInquiryNotification } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { warehouse_id, company_name, contact_name, phone, email, months, note, total_estimate } = body

    if (!warehouse_id || !company_name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Save inquiry to DB
    const { error: dbError } = await supabase.from('inquiries').insert({
      warehouse_id,
      company_name,
      contact_name,
      phone,
      email,
      months,
      note,
      total_estimate,
    })
    if (dbError) throw dbError

    // Send email — await but don't fail if email errors
    try {
      const { data: warehouse } = await supabase
        .from('warehouses')
        .select('name, user_id')
        .eq('id', warehouse_id)
        .single()
      if (warehouse?.user_id) {
        const admin = createAdminClient()
        const { data: userData } = await admin.auth.admin.getUserById(warehouse.user_id)
        const ownerEmail = userData?.user?.email
        if (ownerEmail) {
          await sendInquiryNotification({
            ownerEmail,
            warehouseName: warehouse.name,
            companyName: company_name,
            contactName: contact_name,
            phone,
            email,
            months,
            totalEstimate: total_estimate,
            note,
          })
        }
      }
    } catch (e) {
      console.error('Email failed (non-fatal):', e)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Inquiry error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
