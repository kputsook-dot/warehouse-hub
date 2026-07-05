import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { ciphers: 'SSLv3' },
})

export async function sendInquiryNotification({
  ownerEmail,
  warehouseName,
  companyName,
  contactName,
  phone,
  email,
  months,
  totalEstimate,
  note,
}: {
  ownerEmail: string
  warehouseName: string
  companyName: string
  contactName?: string
  phone: string
  email?: string
  months: number
  totalEstimate?: number
  note?: string
}) {
  await transporter.sendMail({
    from: `"WarehouseOK" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `มีผู้สนใจเช่าคลัง "${warehouseName}"`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <div style="background:#1d4ed8;color:white;padding:20px 24px;border-radius:12px 12px 0 0">
          <h2 style="margin:0;font-size:20px">มีผู้สนใจเช่าคลังของคุณ!</h2>
          <p style="margin:8px 0 0;opacity:0.8;font-size:14px">คลัง: ${warehouseName}</p>
        </div>
        <div style="background:white;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#6b7280;width:140px">บริษัท/ผู้เช่า</td><td style="padding:8px 0;font-weight:600;color:#111827">${companyName}</td></tr>
            ${contactName ? `<tr><td style="padding:8px 0;color:#6b7280">ชื่อผู้ติดต่อ</td><td style="padding:8px 0;color:#111827">${contactName}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#6b7280">เบอร์โทร</td><td style="padding:8px 0"><a href="tel:${phone}" style="color:#1d4ed8;font-weight:600">${phone}</a></td></tr>
            ${email ? `<tr><td style="padding:8px 0;color:#6b7280">อีเมล</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#1d4ed8">${email}</a></td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#6b7280">ระยะเวลาเช่า</td><td style="padding:8px 0;color:#111827">${months} เดือน</td></tr>
            ${totalEstimate ? `<tr><td style="padding:8px 0;color:#6b7280">ประมาณการรวม</td><td style="padding:8px 0;font-weight:600;color:#1d4ed8">฿${totalEstimate.toLocaleString()}</td></tr>` : ''}
            ${note ? `<tr><td style="padding:8px 0;color:#6b7280">หมายเหตุ</td><td style="padding:8px 0;color:#111827">${note}</td></tr>` : ''}
          </table>
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e5e7eb">
            <a href="https://warehouse-hub-bx31.vercel.app/dashboard/inquiries" style="background:#1d4ed8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">ดู Inquiries ทั้งหมด</a>
          </div>
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px">WarehouseOK · warehouseok.com</p>
      </div>
    `,
  })
}
