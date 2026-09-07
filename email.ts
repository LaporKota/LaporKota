/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Pengirim email pakai Resend (https://resend.com) lewat REST API langsung (fetch bawaan
// Node.js) — sengaja TIDAK pakai package nodemailer/resend-sdk supaya tidak perlu
// nambah dependency baru sama sekali.
//
// CARA AKTIFKAN:
// 1. Daftar gratis di https://resend.com (tier gratisnya cukup untuk ratusan email/hari).
// 2. Verifikasi domain pengirim (atau pakai domain uji `onboarding@resend.dev` bawaan
//    Resend kalau cuma mau coba-coba dulu — tapi ini hanya bisa kirim ke email akun
//    Resend kamu sendiri, bukan ke sembarang alamat).
// 3. Ambil API key dari dashboard Resend, lalu di Railway: Project Settings -> Variables,
//    tambahkan RESEND_API_KEY dan RESEND_FROM_EMAIL.
// 4. Kalau kedua env var itu TIDAK diisi, fungsi ini otomatis diam saja (skip) —
//    jadi fitur daftar relawan tetap jalan normal walau email belum disetel.

interface VolunteerEmailPayload {
  to: string;
  volunteerName: string;
  reportTitle: string;
  location: string;
  schedule: string;
  role: string;
  whatsappChannelUrl: string;
}

export async function sendVolunteerConfirmationEmail(payload: VolunteerEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.log('[email] RESEND_API_KEY / RESEND_FROM_EMAIL belum diset — lewati pengiriman email konfirmasi relawan.');
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <div style="background:#0d9488; padding: 20px; text-align:center;">
        <h1 style="color:#fff; margin:0; font-size:18px; letter-spacing:0.05em;">LAPORKOTA</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
        <h2 style="font-size:20px; margin-top:0;">Terima kasih, ${escapeHtml(payload.volunteerName)}! 🙌</h2>
        <p>Anda telah resmi terdaftar sebagai relawan untuk aksi:</p>
        <p style="font-weight:bold; font-size:16px;">"${escapeHtml(payload.reportTitle)}"</p>

        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding:6px 0; color:#64748b; width:130px;">Titik Kumpul</td>
            <td style="padding:6px 0;">${escapeHtml(payload.location)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#64748b;">Waktu</td>
            <td style="padding:6px 0;">${escapeHtml(payload.schedule)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#64748b;">Peran Anda</td>
            <td style="padding:6px 0;">${escapeHtml(payload.role)}</td>
          </tr>
        </table>

        <p>Supaya tidak ketinggalan info koordinasi lapangan, yuk gabung saluran WhatsApp resmi LaporKota:</p>
        <p style="text-align:center; margin: 20px 0;">
          <a href="${payload.whatsappChannelUrl}" style="background:#16a34a; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block;">
            Gabung Saluran WhatsApp
          </a>
        </p>

        <p style="font-size:12px; color:#94a3b8; margin-top: 24px;">
          Email ini dikirim otomatis oleh LaporKota karena Anda baru saja mendaftar sebagai relawan.
        </p>
      </div>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: payload.to,
        subject: `Konfirmasi: Anda terdaftar sebagai relawan — ${payload.reportTitle}`,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[email] Gagal mengirim email konfirmasi relawan:', res.status, errText);
    }
  } catch (err) {
    console.error('[email] Error saat mengirim email konfirmasi relawan:', err);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
