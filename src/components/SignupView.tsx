import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface SignupViewProps {
  onSignup: (name: string, email: string, pass: string, domicile: string) => void;
  onNavigateToLogin: () => void;
  errorMsg: string | null;
}

const signupSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z
    .string()
    .email('Format email tidak valid')
    .refine((val) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(val), {
      message: 'Wajib menggunakan email Gmail (contoh: namakamu@gmail.com)',
    }),
  domicile: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf kapital')
    .regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka'),
  confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

// Menilai kekuatan password secara real-time berdasarkan variasi karakter dan panjangnya
function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (!password) {
    return { label: '', color: 'bg-slate-200', width: '0%' };
  }

  const isLongEnough = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (!isLongEnough) {
    return { label: 'Belum 8 karakter', color: 'bg-rose-500', width: '20%' };
  }

  const score = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (score <= 1) {
    return { label: 'Lemah', color: 'bg-rose-500', width: '33%' };
  }
  if (score <= 2) {
    return { label: 'Sedang', color: 'bg-amber-500', width: '66%' };
  }
  return { label: 'Kuat', color: 'bg-emerald-500', width: '100%' };
}

export const SignupView: React.FC<SignupViewProps> = ({ onSignup, onNavigateToLogin, errorMsg }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordValue = watch('password', '');
  const passwordStrength = getPasswordStrength(passwordValue);

  const onSubmit = (data: SignupForm) => {
    onSignup(data.name, data.email, data.password, data.domicile || '');
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 py-12 flex justify-center items-center">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-lg" data-aos="fade-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">person_add</span>
          </div>
          <h2 className="font-headline text-2xl font-semibold text-slate-900 text-center">Daftar Akun Warga</h2>
          <p className="font-body text-sm text-slate-500 text-center mt-2">
            Bergabung untuk mulai melapor dan ikut aksi gotong royong.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border-2 border-rose-200 p-3 mb-4 text-rose-500 font-label text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block font-label text-xs font-medium text-slate-900 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 font-body text-sm text-slate-900 focus:bg-white focus:outline-none shadow-sm"
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && <p className="text-rose-500 text-xs font-bold mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block font-label text-xs font-medium text-slate-900 mb-1">
              Email (Gmail)
            </label>
            <input
              type="text"
              {...register('email')}
              className="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 font-body text-sm text-slate-900 focus:bg-white focus:outline-none shadow-sm"
              placeholder="namakamu@gmail.com"
            />
            {errors.email && <p className="text-rose-500 text-xs font-bold mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-label text-xs font-medium text-slate-900 mb-1">
              Domisili (Opsional)
            </label>
            <input
              type="text"
              {...register('domicile')}
              className="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 font-body text-sm text-slate-900 focus:bg-white focus:outline-none shadow-sm"
              placeholder="Kota atau Kabupaten domisili"
            />
          </div>

          <div>
            <label className="block font-label text-xs font-medium text-slate-900 mb-1">
              Password (Min. 8 Karakter)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 pr-10 font-body text-sm text-slate-900 focus:bg-white focus:outline-none shadow-sm"
                placeholder="Minimal 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-primary-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-rose-500 text-xs font-bold mt-1">{errors.password.message}</p>}

            {passwordValue && (
              <div className="mt-2">
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
                <p className="text-xs font-label font-medium mt-1 text-slate-500">
                  Kekuatan password: <span className="font-bold">{passwordStrength.label}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Gunakan kombinasi huruf kapital, huruf kecil, dan angka untuk password yang kuat.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block font-label text-xs font-medium text-slate-900 mb-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                className="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 pr-10 font-body text-sm text-slate-900 focus:bg-white focus:outline-none shadow-sm"
                placeholder="Ketik ulang password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-primary-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-rose-500 text-xs font-bold mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-primary-600 text-white border border-slate-200 rounded-lg py-3 font-headline text-sm uppercase font-bold hover:bg-primary-700 transition-all shadow-md active:scale-95"
          >
            DAFTAR SEKARANG
          </button>
        </form>

        <div className="mt-6 border-t-2 border-slate-200 pt-4 text-center">
          <p className="font-body text-sm text-slate-500">
            Sudah punya akun?{' '}
            <button
              onClick={onNavigateToLogin}
              className="font-label font-bold text-slate-900 hover:text-primary-600 hover:underline uppercase"
            >
              Masuk
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
