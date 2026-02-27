'use client';

import { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (email: string) => {
    setUser({ email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0502]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="atmosphere" />
      
      {!user ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-display text-amber-200 tracking-tight">AstroSoul</h1>
              <p className="text-stone-400 font-light tracking-wide">
                Conecte-se com o cosmos e descubra sua alma gêmea.
              </p>
            </div>
            <AuthForm onAuthSuccess={handleLogin} />
          </div>
        </div>
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </main>
  );
}
