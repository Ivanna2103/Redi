"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Categoria } from "@/types";
import { mockCategorias, mockCentralCards, mockCarreras } from "@/lib/mockData";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [busqueda, setBusqueda] = useState("");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<string | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [recursos, setRecursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    async function fetchData() {
      setLoading(true);
      try {
        const { data: catData } = await supabase.from('categorias').select('*');
        if (catData && catData.length > 0) setCategorias(catData);
        else setCategorias(mockCategorias as any);

        const { data: recData } = await supabase.from('recursos').select('*').order('created_at', { ascending: false });
        
        if (recData && recData.length > 0) {
          setRecursos(recData);
        } else {
          setRecursos(mockCentralCards);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRecursos(mockCentralCards);
        setCategorias(mockCategorias as any);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  const recursosFiltrados = recursos.filter((recurso) => {
    const cumpleBusqueda = 
      recurso.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      recurso.tags?.some((tag: string) => tag.toLowerCase().includes(busqueda.toLowerCase()));
    
    const cumpleCarrera = !carreraSeleccionada || 
      recurso.tags?.some((tag: string) => tag.toLowerCase() === carreraSeleccionada.toLowerCase()) ||
      recurso.carrera?.toLowerCase() === carreraSeleccionada.toLowerCase();

    const cumpleCategoria = !categoriaSeleccionada || 
      recurso.categoria_id === categoriaSeleccionada ||
      recurso.categoria?.nombre?.toLowerCase() === categoriaSeleccionada.toLowerCase();

    return cumpleBusqueda && cumpleCarrera && cumpleCategoria;
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      <nav className="border-b border-gray-100 dark:border-zinc-800 flex flex-col sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 shadow-sm">
        {/* Top row */}
        <div className="h-16 md:h-20 flex items-center justify-between px-6 md:px-10">
          <div className="flex-shrink-0">
            <button 
              onClick={() => {
                setBusqueda("");
                setCarreraSeleccionada(null);
                setCategoriaSeleccionada(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center -ml-4"
            >
              <Image src="/redi-logo.svg" alt="Redi" width={220} height={100} className="md:w-[280px] md:h-[120px] object-contain scale-150 md:scale-125 dark:invert" priority />
            </button>
          </div>

          {/* Buscador */}
          <div className="hidden md:flex flex-1 justify-center px-10">
            <div className="w-full max-w-lg relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <Input
                type="text"
                placeholder="Búsqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-12 h-11 bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 rounded-full text-sm focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <ThemeToggle />
            {user && (
              <Link 
                href="/perfil" 
                className="px-6 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 text-xs font-bold rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95 tracking-widest uppercase"
              >
                Mi Perfil
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs font-bold rounded-full hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all active:scale-95 tracking-widest uppercase"
              >
                Salir
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="px-8 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-black/10 tracking-widest uppercase"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {/* Buscador para Móvil */}
        <div className="md:hidden px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
            <Input
              type="text"
              placeholder="Búsqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-12 h-12 bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 rounded-2xl text-sm dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Careers Bar */}
        <div className="w-full bg-white dark:bg-black">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 py-4 px-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCarreraSeleccionada(null)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                carreraSeleccionada === null
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md shadow-black/10"
                  : "bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border-gray-100 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 hover:text-black dark:hover:text-white"
              }`}
            >
              Todas
            </button>
            {mockCarreras.map((carrera) => (
              <button
                key={carrera.id}
                onClick={() => setCarreraSeleccionada(carrera.nombre)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  carreraSeleccionada === carrera.nombre
                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md shadow-black/10"
                    : "bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border-gray-100 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 hover:text-black dark:hover:text-white"
                }`}
              >
                {carrera.nombre}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="flex w-full min-h-[calc(100vh-7rem)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-100 dark:border-zinc-900 p-6 hidden md:block bg-white dark:bg-black h-[calc(100vh-5rem)] sticky top-20 transition-colors">
          <h2 className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-6 text-center">Categorías</h2>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setCategoriaSeleccionada(null)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  categoriaSeleccionada === null 
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10" 
                  : "text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900"
                }`}
              >
                Todas las categorías
              </button>
            </li>
            {categorias.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setCategoriaSeleccionada(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all capitalize ${
                    categoriaSeleccionada === cat.id 
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10" 
                    : "text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  {(cat.nombre || 'Sin nombre').toLowerCase() === '3d' ? '3D' : (cat.nombre || '').toLowerCase()}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 bg-gray-50/30 dark:bg-zinc-950 transition-colors">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recursosFiltrados.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recursosFiltrados.map((item) => (
                <Link
                  href={`/recursos/${item.id}`}
                  key={item.id}
                  className="group block"
                >
                  <div className="relative aspect-square w-full bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                    <Image
                      src={item.imagen_url || item.imagen}
                      alt={item.titulo}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-3 px-2">
                    <h3 className="font-bold text-xs text-gray-900 dark:text-zinc-100 truncate">{item.titulo}</h3>
                    <p className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">{item.categoria}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-zinc-800 mb-4">
                <Search className="w-6 h-6 text-gray-200 dark:text-zinc-700" />
              </div>
              <h3 className="text-gray-900 dark:text-zinc-100 font-bold">No encontramos resultados</h3>
              <p className="text-gray-400 dark:text-zinc-500 text-sm mt-1 max-w-xs">Prueba con otra palabra o cambia los filtros.</p>
              <button 
                onClick={() => { setBusqueda(""); setCarreraSeleccionada(null); setCategoriaSeleccionada(null); }}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </main>
  );
}
