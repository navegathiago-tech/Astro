'use client';

import { useState } from 'react';
import BirthDataForm from './BirthDataForm';
import CelestialResult from './CelestialResult';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Sparkles, Map, Heart } from 'lucide-react';

interface UserData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  soulmateGender: string;
  birthPlace: string;
}

export default function Dashboard({ user, onLogout }: { user: { email: string }, onLogout: () => void }) {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    setStep('result');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen flex flex-col">
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
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xl mx-auto w-full"
              >
                <div className="text-center mb-12 space-y-4">
                  <h3 className="text-4xl font-display text-amber-200">Seu Portal Celestial</h3>
                  <p className="text-stone-400">Insira seus dados de nascimento para abrir os portais do destino.</p>
                </div>
                <BirthDataForm onSubmit={handleFormSubmit} initialData={userData} />
              </motion.div>
            ) : (
              userData && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full"
                >
                  <CelestialResult userData={userData} />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
