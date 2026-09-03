import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

interface LoginViewProps {
  onLogin: (email: string, pass: string) => void;
  onNavigateToSignup: () => void;
  errorMsg: string | null;
}

const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigateToSignup, errorMsg }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = (data: LoginForm) => {
    onLogin(data.email, data.password);
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 py-12 flex justify-center items-center">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-lg" data-aos="fade-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">login</span>
          </div>
          <h2 className="font-headline text-2xl font-semibold text-slate-900 text-center">Masuk ke Akun</h2>
          <p className="font-body text-sm text-slate-500 text-center mt-2">
            Akses dashboard warga atau panel admin.
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
              Email / No. HP
            </label>
            <input
              type="text"
              {...register('email')}
              className="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 font-body text-sm text-slate-900 focus:bg-white focus:outline-none shadow-sm"
              placeholder="Masukkan email atau no. HP"
            />
            {errors.email && <p className="text-rose-500 text-xs font-bold mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-label text-xs font-medium text-slate-900">
                Password
              </label>
              <button type="button" className="text-xs font-label text-primary-600 font-bold hover:underline" onClick={() => toast.info('Fitur Lupa Password segera hadir')}>
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 pr-10 font-body text-sm text-slate-900 focus:bg-white focus:outline-none shadow-sm"
                placeholder="Masukkan password Anda"
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
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-primary-600 text-white border border-slate-200 rounded-lg py-3 font-headline text-sm uppercase font-bold hover:bg-primary-700 transition-all shadow-md active:scale-95"
          >
            MASUK
          </button>
        </form>

        <div className="mt-6 border-t-2 border-slate-200 pt-4 text-center">
          <p className="font-body text-sm text-slate-500">
            Belum punya akun?{' '}
            <button
              onClick={onNavigateToSignup}
              className="font-label font-bold text-slate-900 hover:text-primary-600 hover:underline uppercase"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
