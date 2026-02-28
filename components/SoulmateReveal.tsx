'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Heart, Camera, Download, Share2 } from 'lucide-react';
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
    // Check if image already exists for this user in localStorage (simulating one per user)
    const storageKey = `soulmate_${userData.fullName.replace(/\s/g, '_')}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      const { url, desc } = JSON.parse(savedData);
      setImageUrl(url);
      setDescription(desc);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Step 1: Generate visual description via Astro Chart API (reusing text model)
      const descPrompt = `
        Com base neste mapa astral: ${astroData.substring(0, 2000)}
        Descreva fisicamente como seria a alma gêmea ideal para esta pessoa.
        Considere que o usuário é do gênero ${userData.gender}.
        A descrição deve ser focada em traços faciais realistas, olhar profundo e aura.
        Retorne um parágrafo curto e poético.
      `;

      const descResponse = await fetch('/api/astro-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: descPrompt }),
      });
      const descData = await descResponse.json();
      if (descData.error) throw new Error(descData.error);
      
      const visualDesc = descData.text || '';
      setDescription(visualDesc);

      // Step 2: Generate Image via Soulmate API (Image model)
      const visualPrompt = `
        A hyper-realistic, highly detailed artistic hand-drawn sketch portrait of a person. 
        Black and white charcoal and graphite style with fine textures. 
        The person should look like a real human soulmate based on this description: ${visualDesc}.
        Focus on incredibly realistic eyes, skin texture within a sketch medium, and a soulful expression. 
        Professional fine-art drawing, high contrast, cinematic lighting.
        The person should be of the opposite gender of ${userData.gender} (or compatible based on soulmate concept).
        Vintage high-quality paper texture background.
      `;

      const imageResponse = await fetch('/api/soulmate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visualPrompt }),
      });
      const imageData = await imageResponse.json();
      if (imageData.error) throw new Error(imageData.error);

      if (imageData.image) {
        const url = `data:image/png;base64,${imageData.image}`;
        setImageUrl(url);
        
        // Save to local storage to prevent re-generation
        localStorage.setItem(storageKey, JSON.stringify({ url, desc: visualDesc }));

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff']
        });
      } else {
        throw new Error('Nenhuma imagem foi gerada.');
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
        </div>
      </div>
    </div>
  );
}
