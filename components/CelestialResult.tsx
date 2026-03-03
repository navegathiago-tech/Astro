'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Heart, Camera, Download, Share2, Star, Moon, Sun, Sparkles, Wand2 } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import * as d3 from 'd3';
import { GoogleGenAI } from "@google/genai";

interface UserData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  soulmateGender: string;
  birthPlace: string;
}

export default function CelestialResult({ userData }: { userData: UserData }) {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [alignmentImageUrl, setAlignmentImageUrl] = useState<string | null>(null);
  const [soulmateDesc, setSoulmateDesc] = useState('');
  const [astroData, setAstroData] = useState('');
  const [error, setError] = useState('');
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const generateAll = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) throw new Error("Chave de API não encontrada.");
        
        const ai = new GoogleGenAI({ apiKey });

        // 1. Generate Soulmate Description
        const soulmatePrompt = `
          Com base nos dados de nascimento de ${userData.fullName} (${userData.gender}), nascido em ${userData.birthDate} às ${userData.birthTime} em ${userData.birthPlace}.
          Descreva fisicamente a alma gêmea ideal (gênero: ${userData.soulmateGender}) para esta pessoa.
          A descrição deve ser baseada em compatibilidade astral profunda (Vênus, Marte e Casa 7).
          Seja poético e detalhado. Retorne apenas a descrição física em um parágrafo curto, focando em traços marcantes e olhar.
        `;

        const soulmateDescRes = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: soulmatePrompt,
        });
        const visualDesc = soulmateDescRes.text || '';
        setSoulmateDesc(visualDesc);

        // 2. Generate Soulmate Image
        const visualPrompt = `
          A highly detailed, professional artistic portrait of a ${userData.soulmateGender} soulmate. 
          Style: Ethereal charcoal and graphite sketch on vintage parchment paper. 
          The person has a deep, soulful gaze and features described as: ${visualDesc}.
          Incorporate subtle, glowing golden astrological symbols and constellations in the background. 
          Masterpiece, cinematic lighting, fine art quality, realistic human features.
        `;

        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: visualPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "3:4"
            }
          }
        });

        const imagePart = imageResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (imagePart?.inlineData) {
          setImageUrl(`data:image/png;base64,${imagePart.inlineData.data}`);
        }

        // 3. Generate Celestial Alignment Image
        const alignmentPrompt = `
          A cinematic, high-quality artistic rendering of a celestial alignment. 
          Glowing constellations, nebulae in shades of amber, gold and deep violet. 
          A mystical star chart with sacred geometry symbols. 
          The alignment of Venus and Mars in a beautiful cosmic dance. 
          4k resolution, ethereal, breathtaking space art.
        `;
        
        const alignmentResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: alignmentPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9"
            }
          }
        });

        const alignmentPart = alignmentResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (alignmentPart?.inlineData) {
          setAlignmentImageUrl(`data:image/png;base64,${alignmentPart.inlineData.data}`);
        }

        // 4. Generate Astro Chart focusing on Love and the Soulmate Image
        const astroPrompt = `
          Gere um mapa astral detalhado e místico para ${userData.fullName} (${userData.gender}), nascido em ${userData.birthDate}.
          FOCO TOTAL EM AMOR, COMPATIBILIDADE E DESTINO.
          O usuário busca uma alma gêmea do gênero ${userData.soulmateGender}.
          
          IMPORTANTE: Relacione a interpretação com a revelação visual da alma gêmea: "${visualDesc}".
          Explique como as constelações e o alinhamento de Vênus e Marte no momento do nascimento criaram o caminho para encontrar essa pessoa específica.
          
          Use seções Markdown ricas:
          # 🌌 O Oráculo do Seu Coração
          ## ✨ Alinhamento Sagrado: Vênus e Marte
          ## 🔮 A Revelação: Por que esta Alma Gêmea?
          ## 🌠 O Caminho das Estrelas para o Encontro
          ## 🕯️ Conselho Final do Destino
          
          Seja extremamente detalhado, use muitos emojis e uma linguagem mística e acolhedora.
        `;

        const astroRes = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: astroPrompt,
        });
        setAstroData(astroRes.text || '');

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff']
        });

      } catch (err: any) {
        console.error("Erro na geração celestial:", err);
        setError('O cosmos está nublado hoje. Verifique sua chave de API e tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    generateAll();
  }, [userData]);

  // D3 Star Chart Visualization
  useEffect(() => {
    if (!loading && chartRef.current) {
      const svg = d3.select(chartRef.current);
      svg.selectAll("*").remove();

      const width = 400;
      const height = 400;
      const radius = Math.min(width, height) / 2 - 40;

      const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      // Draw outer circle
      g.append("circle")
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "rgba(251, 191, 36, 0.3)")
        .attr("stroke-width", 2);

      // Draw zodiac lines
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * (Math.PI / 180);
        g.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", radius * Math.cos(angle))
          .attr("y2", radius * Math.sin(angle))
          .attr("stroke", "rgba(251, 191, 36, 0.1)")
          .attr("stroke-width", 1);
      }

      // Add random stars
      const stars = Array.from({ length: 50 }, () => ({
        x: (Math.random() - 0.5) * radius * 1.8,
        y: (Math.random() - 0.5) * radius * 1.8,
        r: Math.random() * 2 + 1
      }));

      g.selectAll(".star")
        .data(stars)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r)
        .attr("fill", "#fbbf24")
        .attr("opacity", 0.6)
        .attr("class", "star");

      // Animate stars
      g.selectAll(".star")
        .transition()
        .duration(2000)
        .attr("opacity", 1)
        .on("end", function repeat() {
          d3.select(this)
            .transition()
            .duration(Math.random() * 2000 + 1000)
            .attr("opacity", 0.2)
            .transition()
            .duration(Math.random() * 2000 + 1000)
            .attr("opacity", 1)
            .on("end", repeat);
        });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border-2 border-dashed border-amber-500/30 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Wand2 className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-display text-amber-100">Tecendo seu Destino...</h3>
          <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">Alinhando planetas e desenhando almas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Soulmate Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-display text-amber-200">Sua Alma Gêmea Revelada</h2>
          <p className="text-stone-400 max-w-2xl mx-auto italic">
            &quot;As estrelas não apenas guiam, elas desenham os encontros que estavam escritos antes do tempo.&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-3xl overflow-hidden border-8 border-white/5 shadow-[0_0_50px_rgba(245,158,11,0.1)]"
          >
            {imageUrl && (
              <Image 
                src={imageUrl}
                alt="Alma Gêmea"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex gap-3">
               <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                <Download className="w-4 h-4" /> Salvar
              </button>
              <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                <Share2 className="w-4 h-4" /> Partilhar
              </button>
            </div>
          </motion.div>

          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl border-amber-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Heart className="w-24 h-24 fill-current text-amber-500" />
              </div>
              <h3 className="text-2xl font-display text-amber-200 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                A Conexão Sagrada
              </h3>
              <p className="text-stone-300 leading-relaxed italic font-serif text-xl">
                &quot;{soulmateDesc}&quot;
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-2xl text-center">
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Sincronicidade</p>
                <p className="text-2xl font-display text-amber-400">99.8%</p>
              </div>
              <div className="glass p-4 rounded-2xl text-center">
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Alinhamento</p>
                <p className="text-2xl font-display text-amber-400">Perfeito</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center items-center gap-8 opacity-20">
        <div className="h-px w-full bg-gradient-to-r from-transparent to-amber-500" />
        <Star className="w-8 h-8 text-amber-500 shrink-0" />
        <div className="h-px w-full bg-gradient-to-l from-transparent to-amber-500" />
      </div>

      {/* Astro Chart Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-4xl font-display text-amber-100">Seu Oráculo de Amor Detalhado</h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
            
            <div className="markdown-body relative z-10">
              <ReactMarkdown>{astroData}</ReactMarkdown>
            </div>
          </motion.div>

          {/* Extra Love Insight Card */}
          <div className="bg-gradient-to-br from-amber-500/10 to-pink-500/10 p-8 rounded-3xl border border-white/10 text-center space-y-4">
            <Heart className="w-12 h-12 text-pink-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-display text-amber-200">Conselho Final de Vênus</h3>
            <p className="text-stone-300 italic max-w-xl mx-auto">
              &quot;O amor não é algo que você encontra, é algo que você constrói quando as estrelas finalmente se alinham. Sua jornada está apenas começando.&quot;
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl sticky top-8 border-amber-500/10 shadow-2xl">
            <h4 className="text-xl font-display text-amber-200 mb-8 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Mapa Estelar de Nascimento
            </h4>
            
            <div className="flex justify-center mb-8 bg-black/20 rounded-full p-4 border border-white/5">
              <svg ref={chartRef} width="400" height="400" className="max-w-full h-auto" />
            </div>

            <div className="space-y-4">
              {[
                { name: 'Sol', icon: Sun, color: 'text-yellow-400', val: 'Essência Vital' },
                { name: 'Lua', icon: Moon, color: 'text-blue-200', val: 'Mundo Emocional' },
                { name: 'Vênus', icon: Heart, color: 'text-pink-400', val: 'Linguagem do Amor' },
                { name: 'Marte', icon: Star, color: 'text-red-500', val: 'Paixão e Impulso' },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-black/40 ${p.color}`}>
                      <p.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 uppercase font-bold">{p.name}</p>
                      <p className="text-stone-200 font-medium">{p.val}</p>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-500/30" />
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-sm text-stone-500 italic">
                &quot;As estrelas sussurram segredos que só o coração pode ouvir.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Visual Images - Constellations and Star Alignments */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl">
          {alignmentImageUrl ? (
            <Image 
              src={alignmentImageUrl}
              alt="Alinhamento Sagrado"
              fill
              className="object-cover group-hover:scale-105 transition-all duration-1000"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
            <div>
              <p className="text-amber-200 text-sm uppercase tracking-widest font-bold mb-2">Alinhamento Sagrado</p>
              <p className="text-stone-400 text-xs">O momento exato em que as estrelas se alinharam para o seu destino.</p>
            </div>
          </div>
        </div>

        <div className="group relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl">
          <Image 
            src={`https://picsum.photos/seed/zodiac-stars-galaxy/1200/800?blur=1`}
            alt="Mapa Estelar"
            fill
            className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
            <div>
              <p className="text-amber-200 text-sm uppercase tracking-widest font-bold mb-2">Caminho do Destino</p>
              <p className="text-stone-400 text-xs">As constelações que guardam os segredos do seu futuro amoroso.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
