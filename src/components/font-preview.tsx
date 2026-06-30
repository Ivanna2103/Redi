"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface FontVariant {
  label: string;
  fontWeight: number;
  fontStyle: "normal" | "italic";
}

const defaultVariants: FontVariant[] = [
  { label: "Thin 100", fontWeight: 100, fontStyle: "normal" },
  { label: "Light 300", fontWeight: 300, fontStyle: "normal" },
  { label: "Regular 400", fontWeight: 400, fontStyle: "normal" },
  { label: "Medium 500", fontWeight: 500, fontStyle: "normal" },
  { label: "Semibold 600", fontWeight: 600, fontStyle: "normal" },
  { label: "Bold 700", fontWeight: 700, fontStyle: "normal" },
  { label: "Black 900", fontWeight: 900, fontStyle: "normal" },
];

interface FontPreviewProps {
  fontFamily: string;
  fontUrl?: string;
  designer?: string;
  downloadUrl?: string;
}

export function FontPreview({ fontFamily, fontUrl, designer, downloadUrl }: FontPreviewProps) {
  const isPiramidal = fontFamily.toLowerCase() === 'piramidal';
  const [text, setText] = useState(
    isPiramidal ? "ESCRIBE AQUÍ PARA PREVISUALIZAR" : "Escribe aquí para previsualizar"
  );
  const [size, setSize] = useState(48);
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    setText(isPiramidal ? "ESCRIBE AQUÍ PARA PREVISUALIZAR" : "Escribe aquí para previsualizar");
  }, [fontFamily, isPiramidal]);

  // Cargar la fuente dinámicamente si hay URL
  useEffect(() => {
    if (fontUrl && fontFamily) {
      // Es crucial envolver la URL en comillas dentro de url("") por si el archivo tiene paréntesis o espacios, ej: "(4).otf"
      const fontFace = new FontFace(fontFamily, `url("${fontUrl}")`);
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        setIsFontLoaded(true);
      }).catch(err => console.error("Error cargando fuente:", err));
    }
  }, [fontUrl, fontFamily]);

  return (
    <div className="w-full bg-white/50 border border-redi-vino/10 rounded-[40px] p-8 md:p-12 shadow-sm transition-colors">
      {/* Header del Previsualizador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 
            className="text-5xl md:text-7xl font-bold tracking-tighter text-redi-vino"
            style={{ fontFamily: isFontLoaded ? `"${fontFamily}"` : 'inherit' }}
          >
            {fontFamily.toUpperCase()}
          </h2>
          {designer && (
            <p className="text-redi-vino/40 mt-4 text-sm font-medium uppercase tracking-widest">
              Diseñada por <span className="text-redi-vino">{designer}</span>
            </p>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12 bg-white/50 p-6 rounded-[32px] border border-redi-vino/10">
        <div className="flex-1 w-full">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(isPiramidal ? e.target.value.toUpperCase() : e.target.value)}
            placeholder="Prueba la fuente aquí..."
            className="w-full bg-white/50 border border-redi-vino/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-redi-red transition-all text-redi-vino"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto min-w-[250px]">
          <span className="text-[10px] font-bold text-redi-vino/40 uppercase tracking-widest min-w-[40px]">
            {size}px
          </span>
          <input
            type="range"
            min={16}
            max={160}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="flex-1 h-1.5 bg-redi-vino/20 rounded-lg appearance-none cursor-pointer accent-redi-red"
          />
        </div>
      </div>
      
      {/* Lista de Variantes */}
      <div className="space-y-12">
        {defaultVariants.map((variant, i) => (
          <div key={i} className="border-t border-redi-vino/10 pt-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-redi-vino/50 uppercase tracking-[0.3em]">
                {variant.label}
              </span>
              <span className="text-[9px] text-redi-vino/30 font-bold uppercase">
                Preview Mode
              </span>
            </div>
            <p
              className="text-redi-vino transition-all leading-tight break-words"
              style={{
                fontFamily: isFontLoaded ? `"${fontFamily}"` : 'inherit',
                fontWeight: variant.fontWeight,
                fontStyle: variant.fontStyle,
                fontSize: `${size}px`,
              }}
            >
              {text || (isPiramidal ? "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG" : "The quick brown fox jumps over the lazy dog")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
