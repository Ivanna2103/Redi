"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Info, Maximize, FileType } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Recurso } from "@/types";

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!recurso) return <div className="p-20 text-center">Recurso no encontrado.</div>;

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans">
      {/* Header / Nav */}
      <nav className="h-20 px-6 flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">Volver</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user && (
            <Link href="/perfil" className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-[0.2em] transition-colors">
              Mi Perfil
            </Link>
          )}
          {user ? (
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
              className="px-5 py-2 bg-gray-50 text-gray-500 text-xs font-bold rounded-full hover:bg-red-50 hover:text-red-600 transition-all tracking-wide"
            >
              CERRAR SESION
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-all shadow-md tracking-wide"
            >
              INICIAR SESION
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-12 flex flex-col lg:flex-row items-center gap-16">
        {/* Lado Izquierdo: Imagen más contenida */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative aspect-square w-full max-w-[500px] rounded-[40px] overflow-hidden shadow-2xl bg-white border border-gray-100 group">
            <Image
              src={recurso.imagen_url}
              alt={recurso.titulo}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Lado Derecho: Información */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
              {recurso.categorias?.nombre || 'Recurso'}
            </span>
            <h1 className="text-4xl font-bold leading-tight mb-4">{recurso.titulo}</h1>
            <p className="text-gray-500 leading-relaxed italic">
              {recurso.descripcion || "Sin descripción disponible."}
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm">
              <Maximize className="w-4 h-4 mb-3 text-gray-300" />
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Dimensiones</div>
              <div className="text-sm font-bold">{recurso.dimensiones || "2530 x 2533 px"}</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm">
              <FileType className="w-4 h-4 mb-3 text-gray-300" />
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Formatos</div>
              <div className="text-sm font-bold">{recurso.formato || "PSD, JPG"}</div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={async () => {
                if (!(recurso.url_archivo || recurso.archivo_url)) {
                  alert("El archivo de descarga aún no está disponible para este recurso.");
                  return;
                }
                
                // 1. Registrar la descarga en Supabase si el usuario está logueado
                if (user) {
                  try {
                    await supabase.from('descargas').insert({
                      user_id: user.id,
                      recurso_id: recurso.id
                    });
                  } catch (err) {
                    console.error("Error silencioso al registrar:", err);
                  }
                }

                // 2. Iniciar la descarga real
                const link = document.createElement('a');
                link.href = recurso.url_archivo || recurso.archivo_url;
                link.target = '_blank';
                link.download = `${recurso.titulo}.psd`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className={`w-full bg-black text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-black/10 group ${!(recurso.url_archivo || recurso.archivo_url) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            >
              <Download className="w-5 h-5 transition-transform group-hover:translate-y-1" />
              {(recurso.url_archivo || recurso.archivo_url) ? 'DESCARGAR AHORA' : 'ARCHIVO NO DISPONIBLE'}
            </button>
            <p className="text-[10px] text-center text-gray-400 font-medium">
              Uso gratuito para proyectos académicos y personales.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
