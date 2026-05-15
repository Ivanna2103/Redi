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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!recurso) return <div className="p-20 text-center dark:text-white">Recurso no encontrado.</div>;

  const esFuente = recurso.categorias?.nombre?.toLowerCase().includes("fuente") || 
                   recurso.categoria?.toLowerCase().includes("fuente");

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
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Header / Nav */}
      <nav className="h-20 px-6 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-50 dark:border-zinc-900 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors w-1/4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">Volver</span>
        </Link>

        <div className="w-2/4 flex justify-center">
          <Link href="/">
            <Image src="/redi-logo.svg" alt="Redi" width={110} height={50} className="object-contain dark:invert" />
          </Link>
        </div>
        
        <div className="flex items-center justify-end gap-6 w-1/4">
          <ThemeToggle />
          {user && (
            <Link href="/perfil" className="text-[10px] font-bold text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-[0.2em] transition-colors hidden md:block">
              Mi Perfil
            </Link>
          )}
          {!user && (
            <Link
              href="/auth/login"
              className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full hover:scale-105 transition-all tracking-widest uppercase"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {esFuente ? (
          /* VISTA ESPECIAL PARA FUENTES */
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 mb-2 block">
                  {recurso.categorias?.nombre || 'Tipografía'}
                </span>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 dark:text-white">{recurso.titulo}</h1>
                <p className="text-gray-500 dark:text-zinc-400 leading-relaxed text-lg">
                  {recurso.descripcion || "Una fuente versátil diseñada para proyectos modernos."}
                </p>
              </div>
              
              <div className="w-full md:w-auto bg-gray-50 dark:bg-zinc-900 p-8 rounded-[32px] border border-gray-100 dark:border-zinc-800 min-w-[300px]">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-zinc-800">
                      <FileType className="w-5 h-5 text-gray-400" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Formato</p>
                     <p className="font-bold dark:text-white">{recurso.formato || "OTF, TTF"}</p>
                   </div>
                </div>
                {user ? (
                  <button
                    onClick={handleDownload}
                    className="w-full bg-black dark:bg-white text-white dark:text-black h-14 rounded-2xl font-bold text-xs tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> DESCARGAR FUENTE
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="w-full bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white h-14 rounded-2xl font-bold text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all active:scale-95 border border-gray-100 dark:border-zinc-800 shadow-sm"
                  >
                    <Lock className="w-4 h-4" /> LOGIN PARA BAJAR
                  </Link>
                )}
              </div>
            </div>

            <FontPreview 
              fontFamily={recurso.titulo} 
              fontUrl={recurso.url_archivo || recurso.archivo_url}
              designer={recurso.descripcion?.split('.')[0]}
              downloadUrl={recurso.url_archivo || recurso.archivo_url}
            />
          </div>
        ) : (
          /* VISTA ESTÁNDAR PARA OTROS RECURSOS */
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative aspect-square w-full max-w-[500px] rounded-[40px] overflow-hidden shadow-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 group">
                <Image
                  src={recurso.imagen_url}
                  alt={recurso.titulo}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 mb-2 block">
                  {recurso.categorias?.nombre || 'Recurso'}
                </span>
                <h1 className="text-4xl font-bold leading-tight mb-4 dark:text-white">{recurso.titulo}</h1>
                <p className="text-gray-500 dark:text-zinc-400 leading-relaxed italic">
                  {recurso.descripcion || "Sin descripción disponible."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-50 dark:border-zinc-800 shadow-sm">
                  <Maximize className="w-4 h-4 mb-3 text-gray-300 dark:text-zinc-600" />
                  <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Dimensiones</div>
                  <div className="text-sm font-bold dark:text-white">{recurso.dimensiones || "2530 x 2533 px"}</div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-50 dark:border-zinc-800 shadow-sm">
                  <FileType className="w-4 h-4 mb-3 text-gray-300 dark:text-zinc-600" />
                  <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Formatos</div>
                  <div className="text-sm font-bold dark:text-white">{recurso.formato || "PSD, JPG"}</div>
                </div>
              </div>

              <div className="space-y-4">
                {user ? (
                  <button
                    onClick={handleDownload}
                    className={`w-full bg-black dark:bg-white text-white dark:text-black h-16 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-black/10 group ${!(recurso.url_archivo || recurso.archivo_url) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 dark:hover:bg-zinc-200'}`}
                  >
                    <Download className="w-5 h-5 transition-transform group-hover:translate-y-1" />
                    {(recurso.url_archivo || recurso.archivo_url) ? 'DESCARGAR AHORA' : 'ARCHIVO NO DISPONIBLE'}
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-95 border border-gray-200 dark:border-zinc-700"
                  >
                    <Lock className="w-5 h-5" />
                    INICIA SESIÓN PARA DESCARGAR
                  </Link>
                )}
                <p className="text-[10px] text-center text-gray-400 dark:text-zinc-500 font-medium">
                  Uso gratuito para proyectos académicos y personales.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
