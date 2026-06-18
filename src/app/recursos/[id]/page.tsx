"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Maximize, FileType, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { FontPreview } from "@/components/font-preview";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RecursoDetallePage() {
  const { id } = useParams();
  const [recurso, setRecurso] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    async function fetchRecurso() {
      const { data, error } = await supabase
        .from('recursos')
        .select('*, categorias(nombre)')
        .eq('id', id)
        .single();
      
      if (data) setRecurso(data);
      setLoading(false);
    }
    fetchRecurso();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-redi-beige dark:bg-redi-vino">
      <div className="w-8 h-8 border-4 border-redi-vino dark:border-redi-beige border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!recurso) return <div className="p-20 text-center text-redi-vino dark:text-redi-beige">Recurso no encontrado.</div>;

  const nombreCat = (recurso.categorias?.nombre || recurso.categoria || "").toLowerCase();
  const formatoStr = (recurso.formato || "").toLowerCase();
  const urlStr = (recurso.url_archivo || recurso.archivo_url || "").toLowerCase();
  const esFuente = nombreCat.includes("fuente") || 
                   nombreCat.includes("tipograf") || 
                   nombreCat.includes("font") ||
                   formatoStr.includes("otf") || 
                   formatoStr.includes("ttf") ||
                   urlStr.endsWith(".otf") ||
                   urlStr.endsWith(".ttf");

  const handleDownload = async () => {
    if (!(recurso.url_archivo || recurso.archivo_url)) {
      alert("El archivo de descarga aún no está disponible para este recurso.");
      return;
    }
    
    try {
      await supabase.from('descargas').insert({
        user_id: user.id,
        recurso_id: recurso.id
      });
    } catch (err) {
      console.error("Error al registrar descarga:", err);
    }

    const link = document.createElement('a');
    link.href = recurso.url_archivo || recurso.archivo_url;
    link.target = '_blank';
    link.click();
  };

  return (
    <main className="min-h-screen bg-redi-beige dark:bg-redi-vino text-redi-vino dark:text-redi-beige font-sans transition-colors duration-300">
      {/* Header / Nav */}
      <nav className="h-20 px-6 flex items-center justify-between bg-redi-beige/80 dark:bg-redi-vino/80 backdrop-blur-md border-b border-redi-vino/10 dark:border-redi-beige/25 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-redi-vino/60 hover:text-redi-red dark:text-redi-beige/60 dark:hover:text-redi-red transition-colors w-1/4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Volver</span>
        </Link>

        <div className="w-2/4 flex justify-center">
          <Link href="/" className="flex items-center">
            <div 
              className="w-[210px] h-[80px] scale-125 bg-redi-vino dark:bg-redi-beige"
              style={{
                maskImage: 'url(/redi-logo.svg)',
                WebkitMaskImage: 'url(/redi-logo.svg)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center'
              }}
              aria-label="Redi Logo"
            />
          </Link>
        </div>
        
        <div className="flex items-center justify-end gap-6 w-1/4">
          <ThemeToggle />
          {user && (
            <Link href="/perfil" className="text-[10px] font-bold text-redi-vino/60 dark:text-redi-beige/60 hover:text-redi-red dark:hover:text-redi-red uppercase tracking-[0.2em] transition-colors hidden md:block">
              Mi Perfil
            </Link>
          )}
          {!user && (
            <Link
              href="/auth/login"
              className="px-5 py-2 bg-redi-red text-white text-[10px] font-bold rounded-full hover:scale-105 shadow-lg shadow-redi-red/20 transition-all tracking-widest uppercase"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* VISTA ESTÁNDAR PARA TODOS LOS RECURSOS */}
        <div className="flex flex-col lg:flex-row items-start gap-16">
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className={`relative aspect-square w-full ${esFuente ? 'max-w-[450px]' : 'max-w-[550px]'} rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-redi-vino/40 border border-redi-vino/10 dark:border-redi-beige/25 group`}>
              <Image
                src={recurso.imagen_url || "https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/placeholder.jpg"}
                alt={recurso.titulo}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-redi-vino/40 dark:text-redi-beige/40 mb-2 block">
                {recurso.categorias?.nombre || recurso.categoria || 'Recurso'}
                {(recurso.autor || recurso.Autor) && ` • POR ${(recurso.autor || recurso.Autor).toUpperCase()}`}
              </span>
              <h1 className="text-4xl font-bold leading-tight mb-4 text-redi-vino dark:text-redi-beige">{recurso.titulo}</h1>
              <p className="text-redi-vino/70 dark:text-redi-beige/70 leading-relaxed italic">
                {recurso.descripcion || "Sin descripción disponible."}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-10">
              {(recurso.dimensiones && recurso.dimensiones.toLowerCase() !== 'variable') && (
                <div className="bg-white/50 dark:bg-redi-vino/40 px-6 py-4 rounded-3xl border border-redi-vino/10 dark:border-redi-beige/25 shadow-sm min-w-[160px]">
                  <Maximize className="w-4 h-4 mb-2 text-redi-vino/30 dark:text-redi-beige/30" />
                  <div className="text-[10px] font-bold text-redi-vino/40 dark:text-redi-beige/40 uppercase mb-1">Dimensiones</div>
                  <div className="text-sm font-bold text-redi-vino dark:text-redi-beige">{recurso.dimensiones}</div>
                </div>
              )}
              
              <div className="bg-white/50 dark:bg-redi-vino/40 px-6 py-4 rounded-3xl border border-redi-vino/10 dark:border-redi-beige/25 shadow-sm min-w-[160px]">
                <FileType className="w-4 h-4 mb-3 text-redi-vino/30 dark:text-redi-beige/30" />
                <div className="text-[10px] font-bold text-redi-vino/40 dark:text-redi-beige/40 uppercase mb-1">Formatos</div>
                <div className="text-sm font-bold text-redi-vino dark:text-redi-beige">{recurso.formato || (esFuente ? "OTF, TTF" : "PSD, JPG")}</div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col items-start w-full">
              {user ? (
                <button
                  onClick={handleDownload}
                  className={`w-full max-w-[280px] bg-white/50 dark:bg-redi-vino/40 text-redi-vino dark:text-redi-beige border border-redi-vino/10 dark:border-redi-beige/25 shadow-sm h-16 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 group ${!(recurso.url_archivo || recurso.archivo_url) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:bg-white/80 dark:hover:bg-redi-vino/60'}`}
                >
                  <Download className="w-5 h-5 transition-transform group-hover:translate-y-1 text-redi-vino/50 dark:text-redi-beige/50" />
                  DESCARGAR
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full max-w-[280px] bg-white/50 dark:bg-redi-vino/40 text-redi-vino dark:text-redi-beige border border-redi-vino/10 dark:border-redi-beige/25 shadow-sm h-16 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 group hover:scale-105 hover:bg-white/80 dark:hover:bg-redi-vino/60"
                >
                  <Download className="w-5 h-5 transition-transform group-hover:translate-y-1 text-redi-vino/50 dark:text-redi-beige/50" />
                  DESCARGAR
                </Link>
              )}
              <p className="text-[10px] text-left pl-4 text-redi-vino/50 dark:text-redi-beige/50 font-medium">
                Uso gratuito para proyectos académicos y personales.
              </p>
            </div>
          </div>
        </div>

        {/* PREVISUALIZADOR INTERACTIVO SOLO PARA FUENTES */}
        {esFuente && (
          <div className="mt-10 border-t border-redi-vino/10 dark:border-redi-beige/25 pt-10">
            <FontPreview 
              fontFamily={recurso.titulo} 
              fontUrl={recurso.url_archivo || recurso.archivo_url}
              designer={recurso.autor || recurso.Autor}
              downloadUrl={recurso.url_archivo || recurso.archivo_url}
            />
          </div>
        )}
      </div>
    </main>
  );
}
