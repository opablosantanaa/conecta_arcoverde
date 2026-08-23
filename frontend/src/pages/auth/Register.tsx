import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { getPortalRoute } from '@/components/auth/SmartRedirect';

const registerSchema = z.object({
  nome:  z.string().min(3, 'Informe seu nome completo'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Mínimo de 8 caracteres')
            .regex(/[A-Z]/, 'Deve conter uma letra maiúscula')
            .regex(/[0-9]/, 'Deve conter um número'),
  confirmarSenha: z.string(),
  termos: z.boolean().refine(v => v === true, 'Você precisa aceitar os termos'),
}).refine(d => d.senha === d.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

type FormData = z.infer<typeof registerSchema>;

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { termos: false },
  });
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();
  const senha = watch('senha') || '';
  const strength = getPasswordStrength(senha);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/registro/candidato', {
        nome:  data.nome,
        email: data.email,
        senha: data.senha,
      });

      // Buscar dados completos do usuário
      let userData = {
        ...res.data,
        email: data.email,
        nome: data.nome,
        perfil: res.data.perfil || 'CANDIDATO',
      };

      try {
        const meRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${res.data.token}` }
        });
        userData = { ...res.data, ...meRes.data };
      } catch {
        // Se /auth/me falhar, usa os dados do registro
      }

      setAuth(res.data.token, userData);

      // Redirecionar para o portal correto
      const destino = getPortalRoute(userData.perfil || 'CANDIDATO');
      navigate(destino);
    } catch (err: any) {
      setError('root', {
        message: err?.response?.data?.erro || 'Não foi possível criar a conta. Tente novamente.',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Branding */}
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
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Comece sua jornada profissional
          </h1>
          <p className="text-white/90 text-lg leading-relaxed mb-8">
            Cadastre-se gratuitamente e tenha acesso a centenas de vagas e cursos de capacitação em Arcoverde.
          </p>
          <ul className="space-y-3">
            {[
              'Currículo validado pela ACA',
              'Acompanhamento de candidaturas',
              'Cursos gratuitos de capacitação',
              'Notificações de novas vagas',
            ].map(item => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white/90 flex-shrink-0" />
                <span className="text-white/95">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-sm text-white/70">
          Prefeitura Municipal de Arcoverde
        </div>
      </div>

      {/* Form */}
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

          <h2 className="text-3xl font-bold text-content dark:text-content-dark mb-2">
            Criar sua conta
          </h2>
          <p className="text-content-secondary dark:text-content-secondary mb-8">
            Preencha os dados abaixo para começar.
          </p>

          <Card padding="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nome completo"
                placeholder="Seu nome"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.nome?.message}
                {...register('nome')}
              />

              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div>
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  error={errors.senha?.message}
                  hint="Mínimo 8 caracteres, uma maiúscula e um número"
                  {...register('senha')}
                />
                {senha && (
                  <div className="mt-2 flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div
                        key={i}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-colors',
                          i <= strength
                            ? strength <= 2 ? 'bg-error' : strength === 3 ? 'bg-warning' : 'bg-success'
                            : 'bg-surface-tertiary dark:bg-surface-dark-tertiary'
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="Confirmar senha"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirmarSenha?.message}
                {...register('confirmarSenha')}
              />

              <label className="flex items-start gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-border dark:border-border-dark text-primary-500 focus:ring-primary-500"
                  {...register('termos')}
                />
                <span className="text-content-secondary dark:text-content-secondary">
                  Li e aceito os{' '}
                  <Link to="/termos" className="text-primary-500 hover:underline">Termos de Uso</Link>
                  {' '}e a{' '}
                  <Link to="/privacidade" className="text-primary-500 hover:underline">Política de Privacidade</Link>.
                </span>
              </label>
              {errors.termos && (
                <p className="text-xs text-error">{errors.termos.message}</p>
              )}

              {errors.root && (
                <div className="p-3 rounded-btn bg-error/10 text-error text-sm border border-error/20" role="alert">
                  {errors.root.message}
                </div>
              )}

              <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
                Criar conta <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-content-secondary dark:text-content-secondary mt-6">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}