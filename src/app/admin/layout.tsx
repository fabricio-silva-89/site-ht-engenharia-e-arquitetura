'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary">Carregando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Admin topbar */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Painel Administrativo
          </h2>
          <button
            onClick={async () => {
              const { signOut } = await import('@/lib/firebase/auth');
              await signOut();
              router.push('/admin/login');
            }}
            className="text-sm text-secondary hover:text-error transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </div>
  );
}
