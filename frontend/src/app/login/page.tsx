'use client';

import { useRouter } from 'next/navigation';
import { LoginFormSchema } from '../../../models/loginSchema';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  const router = useRouter();

  const onSubmit = async (data: LoginFormSchema) => {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/');
    } else {
      console.error('Login failed:', await response.json());
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
};

export default Login;
