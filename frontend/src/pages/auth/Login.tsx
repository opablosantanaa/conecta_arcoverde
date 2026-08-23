import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { getPortalRoute } from '@/components/auth/SmartRedirect';

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  senha: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post('/auth/login', data);
      let userData = { ...res.data, email: data.email };

      try {
        const meRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${res.data.token}` }
        });
        userData = { ...res.data, ...meRes.data };
      } catch {
        // fallback
      }

      setAuth(res.data.token, userData);

      // Redireciona para o portal correto do perfil
      const destino = getPortalRoute(userData.perfil || 'CANDIDATO');
      navigate(destino);
    } catch (err: any) {
      setError('root', {
        message: err?.response?.data?.erro || 'E-mail ou senha incorretos.',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-btn bg-white/20 backdrop-blur flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl">ConectaArcoverde</span>
          </Link>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold mb-4 leading-tight">Bem-vindo de volta</h1>
          <p className="text-white/90 text-lg leading-relaxed">
            Acesse sua conta para continuar sua jornada profissional. Estamos felizes em vê-lo novamente.
          </p>
        </div>
        <div className="relative text-sm text-white/70">Prefeitura Municipal de Arcoverde</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface dark:bg-surface-dark">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-btn bg-primary-500 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-content dark:text-content-dark">
                Conecta<span className="text-primary-500">Arcoverde</span>
              </span>
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-content dark:text-content-dark mb-2">Entrar na sua conta</h2>
          <p className="text-content-secondary dark:text-content-secondary mb-8">
            Insira suas credenciais para acessar a plataforma.
          </p>

          <Card padding="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="E-mail"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.senha?.message}
                {...register('senha')}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary-500 focus:ring-primary-500" />
                  <span className="text-content-secondary dark:text-content-secondary">Lembrar-me</span>
                </label>
                <Link to="/recuperar-senha" className="text-primary-500 hover:underline font-medium">
                  Esqueci minha senha
                </Link>
              </div>

              {errors.root && (
                <div className="p-3 rounded-btn bg-error/10 text-error text-sm border border-error/20" role="alert">
                  {errors.root.message}
                </div>
              )}

              <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
                Entrar <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-content-secondary dark:text-content-secondary mt-6">
            Não tem uma conta?{' '}
            <Link to="/registro" className="text-primary-500 font-semibold hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}