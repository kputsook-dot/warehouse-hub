'use client';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Warehouse } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';

export default function BookingForm({ warehouse: w }: { warehouse: Warehouse }) {
  const [form, setForm] = useState({ company: '', name: '', phone: '', email: '', months: String(w.minRentMonths), note: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const months = parseInt(form.months) || w.minRentMonths;
  const total = w.pricePerMonth * months;
  const commission = Math.round(total * 0.07);

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.phone) return;
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: err } = await supabase.from('inquiries').insert({
        warehouse_id: w.id,
        company_name: form.company,
        contact_name: form.name,
        phone: form.phone,
        email: form.email,
        months: months,
        note: form.note,
        total_estimate: total + commission,
      });
      if (err) throw err;
      setSent(true);
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">ส่งคำขอสำเร็จ!</h3>
        <p className="text-gray-500 text-sm">เจ้าของคลังจะติดต่อกลับภายใน 24 ชั่วโมง</p>
        <button onClick={() => setSent(false)} className="mt-4 text-blue-600 text-sm font-medium hover:underline">
          ส่งคำขออีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-5 text-white">
        <div className="text-xs text-blue-200 mb-1">ส่งคำขอข้อมูล / จอง</div>
        <div className="text-2xl font-extrabold">฿{w.pricePerMonth.toLocaleString()}</div>
        <div className="text-sm text-blue-200">ต่อเดือน · เช่าขั้นต่ำ {w.minRentMonths} เดือน</div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-3">
        {error && <div className="text-red-600 text-xs bg-red-50 rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">ชื่อบริษัท / ผู้เช่า *</label>
          <input required value={form.company} onChange={e => set('company', e.target.value)} placeholder="บริษัท ABC จำกัด" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">ชื่อผู้ติดต่อ</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="คุณสมชาย" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">เบอร์โทร *</label>
            <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08x-xxx-xxxx" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">อีเมล</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="name@company.com" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">ระยะเวลาเช่า (เดือน)</label>
          <input type="number" min={w.minRentMonths} max={24} value={form.months} onChange={e => set('months', e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">หมายเหตุ</label>
          <textarea value={form.note} onChange={e => set('note', e.target.value)} rows={2} placeholder="ประเภทสินค้าที่จะเก็บ, ความต้องการพิเศษ..." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 resize-none" />
        </div>

        <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
          <div className="flex justify-between text-gray-600">
            <span>ค่าเช่า ({months} เดือน)</span>
            <span>฿{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-400 text-xs">
            <span>ค่าบริการแพลตฟอร์ม (7%)</span>
            <span>฿{commission.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1 mt-1">
            <span>ประมาณการ</span>
            <span className="text-blue-700">฿{(total + commission).toLocaleString()}</span>
          </div>
        </div>

        <button type="submit" disabled={loading || !w.available}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors text-sm">
          {loading
            ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Send size={15} />}
          {w.available ? 'ส่งคำขอจอง' : 'คลังนี้ไม่ว่าง'}
        </button>
        <p className="text-xs text-center text-gray-400">ไม่มีค่าใช้จ่ายในการส่งคำขอ · ข้อมูลปลอดภัย</p>
      </form>
    </div>
  );
}
