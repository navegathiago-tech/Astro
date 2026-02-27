'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Clock, MapPin, Venus, Mars, ChevronRight } from 'lucide-react';

interface UserData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  birthPlace: string;
}

export default function BirthDataForm({ 
  onSubmit, 
  initialData 
}: { 
  onSubmit: (data: UserData) => void;
  initialData: UserData | null;
}) {
  const [formData, setFormData] = useState<UserData>(initialData || {
    fullName: '',
    birthDate: '',
    birthTime: '',
    gender: 'feminino',
    birthPlace: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-display text-amber-100">Seu Portal Astral</h3>
        <p className="text-stone-500">Insira seus detalhes de nascimento para alinhar as estrelas.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold ml-1">
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="Como você é conhecido(a)?"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold ml-1">
              Data de Nascimento
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold ml-1">
              Horário
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
              <input
                type="time"
                required
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold ml-1">
            Gênero
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: 'feminino' })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                formData.gender === 'feminino' 
                  ? 'bg-pink-500/20 border-pink-500 text-pink-200' 
                  : 'bg-black/40 border-white/10 text-stone-500 hover:border-white/20'
              }`}
            >
              <Venus className="w-5 h-5" />
              Feminino
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: 'masculino' })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                formData.gender === 'masculino' 
                  ? 'bg-blue-500/20 border-blue-500 text-blue-200' 
                  : 'bg-black/40 border-white/10 text-stone-500 hover:border-white/20'
              }`}
            >
              <Mars className="w-5 h-5" />
              Masculino
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold ml-1">
            Local de Nascimento
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
            <input
              type="text"
              required
              value={formData.birthPlace}
              onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="Cidade, Estado, País"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          Gerar Mapa Astral
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
