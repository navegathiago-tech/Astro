'use client';

import { useState } from 'react';
import BirthDataForm from './BirthDataForm';
import AstroChart from './AstroChart';
import SoulmateReveal from './SoulmateReveal';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Sparkles, Map, Heart } from 'lucide-react';

interface UserData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  birthPlace: string;
}

export default function Dashboard({ user, onLogout }: { user: { email: string }, onLogout: () => void }) {
  const [step, setStep] = useState<'form' | 'chart' | 'soulmate'>('form');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [astroData, setAstroData] = useState<string>('');

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    setStep('chart');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen flex flex-col">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-display text-amber-100">AstroSoul</h2>
            <p className="text-xs text-stone-500 uppercase tracking-widest">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-500 hover:text-red-400"
          title="Sair"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex flex-col">
        <nav className="flex justify-center mb-12">
          <div className="glass p-1 rounded-full flex gap-1">
            {[
              { id: 'form', icon: Sparkles, label: 'Dados' },
              { id: 'chart', icon: Map, label: 'Mapa Astral' },
              { id: 'soulmate', icon: Heart, label: 'Alma Gêmea' }
            ].map((s) => (
              <button
                key={s.id}
                disabled={step === 'form' && s.id !== 'form'}
                onClick={() => userData && setStep(s.id as any)}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all
                  ${step === s.id 
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                    : 'text-stone-500 hover:text-stone-300 disabled:opacity-30'}
                `}
              >
                <s.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-xl mx-auto w-full"
              >
                <BirthDataForm onSubmit={handleFormSubmit} initialData={userData} />
              </motion.div>
            )}

            {step === 'chart' && userData && (
              <motion.div
                key="chart"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full"
              >
                <AstroChart 
                  userData={userData} 
                  onDataGenerated={(data) => setAstroData(data)}
                  onNext={() => setStep('soulmate')}
                />
              </motion.div>
            )}

            {step === 'soulmate' && userData && (
              <motion.div
                key="soulmate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <SoulmateReveal userData={userData} astroData={astroData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
