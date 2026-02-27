'use client';

import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Heart, Camera, RefreshCw, Download, Share2 } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

interface UserData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  birthPlace: string;
}

export default function SoulmateReveal({ 
  userData, 
  astroData 
}: { 
  userData: UserData;
  astroData: string;
}) {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const generateSoulmate = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      
      // Step 1: Generate visual description based on astro data
      const descResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          Com base neste mapa astral: ${astroData.substring(0, 2000)}
          Descreva fisicamente como seria a alma gêmea ideal para esta pessoa.
          Considere que o usuário é do gênero ${userData.gender}.
          A descrição deve ser focada em traços faciais, olhar e aura.
          Retorne um parágrafo curto e poético.
        `,
      });
      
      const visualDesc = descResponse.text || '';
      setDescription(visualDesc);

      // Step 2: Generate Image
      const prompt = `
        A realistic, artistic hand-drawn sketch portrait of a person. 
        Black and white charcoal style. 
        The person should look like a soulmate based on this description: ${visualDesc}.
        Focus on a deep, soulful look in the eyes. 
        High contrast, fine lines, professional artistic drawing.
        The person should be of the opposite gender of ${userData.gender} (or compatible based on soulmate concept).
        Vintage paper texture background.
      `;

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      let foundImage = false;
      if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64 = part.inlineData.data;
            setImageUrl(`data:image/png;base64,${base64}`);
            foundImage = true;
            
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#fbbf24', '#ffffff']
            });
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error('Nenhuma imagem foi gerada pelo modelo.');
      }

    } catch (err: any) {
      console.error('Erro na geração:', err);
      setError(err.message || 'Erro ao conectar com o cosmos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSoulmate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-display text-amber-200">Sua Alma Gêmea</h3>
        <p className="text-stone-400 max-w-lg mx-auto">
          As estrelas convergiram para revelar a face daquele(a) que ressoa com a frequência do seu coração.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 glass rounded-3xl flex flex-col items-center justify-center space-y-4 border-amber-500/20"
              >
                <div className="relative">
                  <Camera className="w-12 h-12 text-amber-500/50 animate-pulse" />
                  <Loader2 className="absolute -top-1 -right-1 w-6 h-6 text-amber-500 animate-spin" />
                </div>
                <p className="text-stone-500 text-sm font-mono uppercase tracking-widest">Desenhando Destino...</p>
              </motion.div>
            ) : imageUrl ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative h-full w-full"
              >
                <div className="absolute -inset-4 bg-amber-500/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-full w-full rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                  <Image 
                    src={imageUrl}
                    alt="Sua Alma Gêmea"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex gap-4 w-full">
                      <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-2 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <Download className="w-4 h-4" />
                        Salvar
                      </button>
                      <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-2 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <Share2 className="w-4 h-4" />
                        Partilhar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="absolute inset-0 glass rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-4">
                <p className="text-red-400">{error || 'Falha ao materializar imagem.'}</p>
                <button 
                  onClick={generateSoulmate}
                  className="text-amber-500 hover:underline text-sm"
                >
                  Tentar novamente
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-8 rounded-3xl space-y-6"
          >
            <div className="flex items-center gap-3 text-amber-200">
              <Heart className="w-6 h-6 fill-current" />
              <h4 className="text-xl font-display">A Conexão Sagrada</h4>
            </div>
            
            <p className="text-stone-300 leading-relaxed italic font-serif text-lg">
              &quot;{description || 'Aguardando a revelação das estrelas...'}&quot;
            </p>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <p className="text-sm text-stone-400">Sincronicidade Espiritual: 98%</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <p className="text-sm text-stone-400">Alinhamento de Vênus: Perfeito</p>
              </div>
            </div>
          </motion.div>

          <button
            onClick={generateSoulmate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-stone-500 hover:text-amber-200 transition-colors py-4 border border-white/5 rounded-2xl hover:bg-white/5"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Tentar nova revelação
          </button>
        </div>
      </div>
    </div>
  );
}
