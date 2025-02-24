import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginFormSchema, formSchema } from '../../../models/loginSchema';

interface LoginFormProps {
  onSubmit: (data: LoginFormSchema) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <LogIn className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Bienvenue sur PriceBuddy</h1>
        <p className="text-muted-foreground">
          Connectez-vous pour accéder à vos comparaisons de prix
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow-sm border">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="exemple@email.com" {...form.register('email')} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" {...form.register('password')} required />
        </div>
        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>
      <p className="text-sm text-center text-muted-foreground">
        Pas encore de compte ?{' '}
        <a href="/register" className="text-primary hover:underline">
          S&apos;inscrire
        </a>
      </p>
    </div>
  );
};
