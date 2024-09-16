'use client';

import Button from '@/app/components/Button';
import Input from '@/app/components/input/Input';
import registerService from '@/app/services/register';
import { AxiosError } from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users');
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    setVariant((prev) => (prev === 'LOGIN' ? 'REGISTER' : 'LOGIN'));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { username: '', fullname: '', password: '' },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      registerService(data as any).then(async (_) => {
        toast.success('Account created!');
        await signIn('credentials', data);
      }).catch((err) => {
        console.log('err here', err);

        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message, {
            duration: 5000,
          });
        }
      }).finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then(async (res) => {
          if (res?.error) {
            toast.error(res.error);
          }

          if (res?.ok && !res?.error) {
            toast.success('Entering app!');
            router.push('/users');
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <section className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        {/* Auth Form (Login/Register) */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id="fullname"
              label="Nama Lengkap"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="username"
            type="text"
            label="Username"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          <div>
            <Button disabled={isLoading} type="submit" fullWidth>
              {variant === 'REGISTER' ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </form>

        {/* Toggle Login/Register */}
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <span>
            {variant === 'REGISTER'
              ? 'Already have an account?'
              : 'New to Nexus?'}
          </span>
          <button
            type="button"
            onClick={toggleVariant}
            className="underline text-blue-500 hover:text-blue-600"
          >
            {variant === 'REGISTER' ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </section>
  );
};
export default AuthForm;
