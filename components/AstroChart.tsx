'use client';

import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Loader2, Star, Moon, Sun, Heart, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface UserData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  birthPlace: string;
}

export default function AstroChart({ 
  userData, 
  onDataGenerated,
  onNext
}: { 
  userData: UserData;
  onDataGenerated: (data: string) => void;
  onNext: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [interpretation, setInterpretation] = useState('');
  const [planets, setPlanets] = useState<any[]>([]);

  useEffect(() => {
    const generateChart = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
        const prompt = `
          Você é um astrólogo mestre. Gere um mapa astral completo e detalhado para:
          Nome: ${userData.fullName}
          Nascimento: ${userData.birthDate} às ${userData.birthTime}
          Local: ${userData.birthPlace}
          Gênero: ${userData.gender}

          O foco principal deve ser a VIDA AMOROSA e RELACIONAMENTOS.
          
          Retorne em formato Markdown com as seguintes seções:
          1. Introdução (Essência da Alma)
          2. Sol, Lua e Ascendente (O Triângulo da Personalidade)
          3. Vênus e Marte (Desejo e Atração - FOCO TOTAL AQUI)
          4. Casas Astrológicas Relevantes (Casa 5 e Casa 7)
          5. Desafios e Potenciais no Amor
          6. Conclusão Celestial

          Seja poético, profundo e místico. Use emojis.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });

        const text = response.text || '';
        setInterpretation(text);
        onDataGenerated(text);

        // Simulate planet positions for visual
        setPlanets([
          { name: 'Sol', icon: Sun, color: 'text-yellow-400', sign: 'Leão' },
          { name: 'Lua', icon: Moon, color: 'text-blue-200', sign: 'Câncer' },
          { name: 'Vênus', icon: Heart, color: 'text-pink-400', sign: 'Touro' },
          { name: 'Marte', icon: Star, color: 'text-red-500', sign: 'Áries' },
        ]);

      } catch (err) {
        console.error(err);
        setInterpretation('Erro ao alinhar as estrelas. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    generateChart();
  }, [userData, onDataGenerated]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-amber-500 animate-pulse" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-display text-amber-100">Consultando os Oráculos...</h3>
          <p className="text-stone-500 text-sm">Mapeando a posição dos planetas no momento do seu nascimento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl"
        >
          <div className="markdown-body">
            <ReactMarkdown>{interpretation}</ReactMarkdown>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <div className="glass p-6 rounded-3xl sticky top-8">
          <h4 className="text-lg font-display text-amber-200 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Configuração Planetária
          </h4>
          
          <div className="space-y-4">
            {planets.map((p, i) => (
              <motion.div 
                key={p.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-black/40 ${p.color}`}>
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase font-bold">{p.name}</p>
                    <p className="text-stone-200 font-medium">{p.sign}</p>
                  </div>
                </div>
                <div className="w-12 h-12 relative opacity-50">
                   <Image 
                    src={`https://picsum.photos/seed/${p.name}/100/100`}
                    alt={p.name}
                    fill
                    className="rounded-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                   />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-sm text-stone-400 mb-6 italic">
              &quot;As estrelas inclinam, mas não obrigam. Seu destino amoroso está sendo revelado.&quot;
            </p>
            <button
              onClick={onNext}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-amber-100 transition-all flex items-center justify-center gap-2 group"
            >
              Ver Alma Gêmea
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
