"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Categoria, Recurso } from "@/types";
import { mockCategorias, mockRecursos } from "@/lib/mockData";

export default function CategoriaPage() {
  const { id } = useParams();
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [recursosBase, setRecursosBase] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    async function fetchCategoryData() {
      setLoading(true);
      try {
        // 1. Obtener info de la categoría (usando slug o id)
        const { data: catData } = await supabase
          .from('categorias')
          .select('*')
          .or(`id.eq.${id},slug.eq.${id}`)
          .single();
        
        if (catData) setCategoria(catData);
        else setCategoria(mockCategorias.find(c => c.id === id || c.slug === id) as any);

        // 2. Obtener recursos de esta categoría
        const categoryId = catData?.id || id;
        const { data: recData } = await supabase
          .from('recursos')
          .select('*')
          .eq('categoria_id', categoryId);

        if (recData) {
          setRecursosBase(recData);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryData();
  }, [id]);

  const tags = useMemo(() => {
    const allTags = recursosBase.flatMap(r => r.tags || []);
    return Array.from(new Set(allTags));
  }, [recursosBase]);

  const recursosFiltrados = useMemo(() => {
    if (!filtroActivo) return recursosBase;
    return recursosBase.filter(r => r.tags?.includes(filtroActivo));
  }, [recursosBase, filtroActivo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-200" />
      </div>
    );
  }

  if (!categoria) return <div className="p-20 text-center">Categoría no encontrada.</div>;

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b border-gray-50 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-2 hover:bg-gray-50 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-black" />
            </Link>
            <h1 className="text-xl font-bold lowercase tracking-tight">
              {categoria.nombre.toLowerCase() === '3d' ? '3D' : categoria.nombre.toLowerCase()}
            </h1>
          </div>

          <div className="flex items-center gap-6">
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
        </div>

        {tags.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFiltroActivo(null)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filtroActivo === null ? "bg-black text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              Todos
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setFiltroActivo(tag)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filtroActivo === tag ? "bg-black text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </header>

      <section className="max-w-7xl mx-auto p-6 md:p-10">
        {recursosFiltrados.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recursosFiltrados.map((recurso) => (
              <Link 
                href={`/recursos/${recurso.id}`}
                key={recurso.id} 
                className="group relative aspect-square bg-gray-50 rounded-[24px] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <Image
                  src={recurso.imagen_url}
                  alt={recurso.titulo}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm text-black p-3 rounded-full shadow-xl">
                    <Download className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold mb-2">No hay recursos aún</h3>
            <p className="text-gray-400 max-w-xs mx-auto text-sm">
              Estamos trabajando para subir contenido en esta sección. ¡Vuelve pronto!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
