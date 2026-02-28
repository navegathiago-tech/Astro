import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, visualPrompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY não configurada no servidor." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Se visualPrompt for enviado, geramos a imagem diretamente
    if (visualPrompt) {
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

      const part = imageResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        return NextResponse.json({ image: part.inlineData.data });
      }
      return NextResponse.json({ error: "Nenhuma imagem gerada" }, { status: 500 });
    }

    // Caso contrário, geramos a descrição textual primeiro (se necessário, mas aqui vamos focar na imagem)
    return NextResponse.json({ error: "Prompt visual ausente" }, { status: 400 });

  } catch (error: any) {
    console.error("Erro na API Soulmate:", error);
    return NextResponse.json({ error: error.message || "Erro interno no servidor" }, { status: 500 });
  }
}
