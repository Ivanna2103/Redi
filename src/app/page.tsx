"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Categoria } from "@/types";
import { mockCategorias, mockCentralCards, mockCarreras } from "@/lib/mockData";
import { ThemeToggle } from "@/components/theme-toggle";

function HomeContent() {
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState("");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<string | null>(null);
  const queryCategoria = searchParams.get('categoria');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(
    queryCategoria
  );

  useEffect(() => {
    setCategoriaSeleccionada(queryCategoria);
  }, [queryCategoria]);
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

    let selectedCat = categoriaSeleccionada;
    if (selectedCat) {
      if (selectedCat.toLowerCase() === 'vectores') {
        selectedCat = 'Ilustraciones';
      } else if (selectedCat.toLowerCase() === 'imágenes') {
        selectedCat = 'Fotos';
      } else if (selectedCat.toLowerCase() === 'mockups') {
        selectedCat = 'Mock ups';
      } else if (selectedCat.toLowerCase() === 'modelos 3d') {
        selectedCat = '3D';
      }
    }

    const categoryObj = categorias.find(cat => 
      cat.id === selectedCat || 
      cat.nombre?.toLowerCase() === selectedCat?.toLowerCase() ||
      cat.slug?.toLowerCase() === selectedCat?.toLowerCase()
    );

    const cumpleCategoria = !selectedCat || 
      recurso.categoria_id === selectedCat ||
      (categoryObj && recurso.categoria_id === categoryObj.id) ||
      recurso.categoria?.nombre?.toLowerCase() === selectedCat?.toLowerCase();

    return cumpleBusqueda && cumpleCarrera && cumpleCategoria;
  });

  return (
    <main className="min-h-screen bg-redi-beige dark:bg-redi-vino text-redi-vino dark:text-redi-beige font-sans transition-colors duration-300">
      <nav className="border-b border-redi-vino/10 dark:border-redi-beige/25 flex flex-col sticky top-0 bg-redi-beige/80 dark:bg-redi-vino/80 backdrop-blur-md z-50 shadow-sm">
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
              <div 
                className="w-[220px] h-[100px] md:w-[280px] md:h-[120px] scale-150 md:scale-125 bg-redi-vino dark:bg-redi-beige"
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
            </button>
          </div>

          {/* Buscador */}
          <div className="hidden md:flex flex-1 justify-center px-10">
            <div className="w-full max-w-lg relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-redi-beige/60 dark:text-redi-vino/60" />
              <Input
                type="text"
                placeholder="Búsqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-12 h-11 bg-redi-vino dark:bg-redi-beige border-none rounded-full text-sm focus:ring-2 focus:ring-redi-red transition-all text-redi-beige dark:text-redi-vino placeholder:text-redi-beige/50 dark:placeholder:text-redi-vino/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <ThemeToggle />
            {user && (
              <Link 
                href="/admin" 
                className="px-6 py-2.5 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino/70 dark:text-redi-beige/70 text-[10px] font-bold rounded-full hover:bg-redi-red/10 hover:text-redi-red dark:hover:bg-redi-red/20 dark:hover:text-redi-red transition-all active:scale-95 tracking-widest uppercase hidden md:flex items-center justify-center"
              >
                Admin
              </Link>
            )}
            {user && (
              <Link 
                href="/perfil" 
                className="px-6 py-2.5 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino/70 dark:text-redi-beige/70 text-[10px] font-bold rounded-full hover:bg-redi-red/10 hover:text-redi-red dark:hover:bg-redi-red/20 dark:hover:text-redi-red transition-all active:scale-95 tracking-widest uppercase flex items-center justify-center"
              >
                Mi Perfil
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino/70 dark:text-redi-beige/70 text-[10px] font-bold rounded-full hover:bg-redi-red/10 hover:text-redi-red dark:hover:bg-redi-red/20 dark:hover:text-redi-red transition-all active:scale-95 tracking-widest uppercase flex items-center justify-center"
              >
                Salir
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="px-8 py-2.5 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino/70 dark:text-redi-beige/70 text-[10px] font-bold rounded-full hover:bg-redi-red/10 hover:text-redi-red dark:hover:bg-redi-red/20 dark:hover:text-redi-red transition-all active:scale-95 tracking-widest uppercase flex items-center justify-center"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {/* Buscador para Móvil */}
        <div className="md:hidden px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-redi-beige/60 dark:text-redi-vino/60" />
            <Input
              type="text"
              placeholder="Búsqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-12 h-12 bg-redi-vino dark:bg-redi-beige border-none rounded-2xl text-sm focus:ring-2 focus:ring-redi-red transition-all text-redi-beige dark:text-redi-vino placeholder:text-redi-beige/50 dark:placeholder:text-redi-vino/50"
            />
          </div>
        </div>

        {/* Careers Bar */}
        <div className="w-full bg-redi-beige dark:bg-redi-vino">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 py-4 px-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCarreraSeleccionada(null)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                carreraSeleccionada === null
                  ? "bg-redi-red text-white border-redi-red shadow-md shadow-redi-red/20"
                  : "bg-transparent text-redi-vino/60 dark:text-redi-beige/60 border-redi-vino/10 dark:border-redi-beige/25 hover:border-redi-red hover:text-redi-red dark:hover:text-redi-red"
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
                    ? "bg-redi-red text-white border-redi-red shadow-md shadow-redi-red/20"
                    : "bg-transparent text-redi-vino/60 dark:text-redi-beige/60 border-redi-vino/10 dark:border-redi-beige/25 hover:border-redi-red hover:text-redi-red dark:hover:text-redi-red"
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
        <aside className="w-64 border-r border-redi-vino/10 dark:border-redi-beige/25 p-6 hidden md:block bg-redi-beige dark:bg-redi-vino h-[calc(100vh-5rem)] sticky top-20 transition-colors">
          <h2 className="text-[10px] font-bold text-redi-vino/40 dark:text-redi-beige/40 uppercase tracking-[0.2em] mb-6 text-center">Categorías</h2>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setCategoriaSeleccionada(null)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  categoriaSeleccionada === null 
                  ? "bg-redi-red text-white shadow-lg shadow-redi-red/20" 
                  : "text-redi-vino/60 dark:text-redi-beige/60 hover:text-redi-red hover:bg-redi-red/10"
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
                    (categoriaSeleccionada === cat.id || 
                     (categoriaSeleccionada && (
                       cat.nombre?.toLowerCase() === categoriaSeleccionada.toLowerCase() ||
                       cat.slug?.toLowerCase() === categoriaSeleccionada.toLowerCase() ||
                       (categoriaSeleccionada.toLowerCase() === 'vectores' && cat.nombre?.toLowerCase() === 'ilustraciones') ||
                       (categoriaSeleccionada.toLowerCase() === 'imágenes' && cat.nombre?.toLowerCase() === 'fotos') ||
                       (categoriaSeleccionada.toLowerCase() === 'mockups' && cat.nombre?.toLowerCase() === 'mock ups') ||
                       (categoriaSeleccionada.toLowerCase() === 'modelos 3d' && cat.nombre?.toLowerCase() === '3d')
                     )))
                    ? "bg-redi-red text-white shadow-lg shadow-redi-red/20" 
                    : "text-redi-vino/60 dark:text-redi-beige/60 hover:text-redi-red hover:bg-redi-red/10"
                  }`}
                >
                  {(cat.nombre || 'Sin nombre').toLowerCase() === '3d' ? '3D' : (cat.nombre || '').toLowerCase()}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 bg-transparent transition-colors">
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
                  <div 
                    className="relative aspect-square w-full bg-white dark:bg-redi-vino/40 rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-redi-red/10 hover:-translate-y-1"
                    style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                  >
                    <Image
                      src={item.imagen_url || item.imagen}
                      alt={item.titulo}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-redi-vino/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-3 px-2">
                    <h3 className="font-bold text-xs text-redi-vino dark:text-redi-beige truncate">{item.titulo}</h3>
                    <p className="text-[9px] text-redi-vino/50 dark:text-redi-beige/50 font-bold uppercase tracking-widest">{item.categoria}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-16 h-16 bg-white dark:bg-redi-vino/40 rounded-2xl flex items-center justify-center shadow-sm border border-redi-vino/10 dark:border-redi-beige/25 mb-4">
                <Search className="w-6 h-6 text-redi-vino/20 dark:text-redi-beige/20" />
              </div>
              <h3 className="text-redi-vino dark:text-redi-beige font-bold">No encontramos resultados</h3>
              <p className="text-redi-vino/60 dark:text-redi-beige/60 text-sm mt-1 max-w-xs">Prueba con otra palabra o cambia los filtros.</p>
              <button 
                onClick={() => { setBusqueda(""); setCarreraSeleccionada(null); setCategoriaSeleccionada(null); }}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-redi-vino/40 dark:text-redi-beige/40 hover:text-redi-red dark:hover:text-redi-red transition-colors"
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-redi-beige dark:bg-redi-vino">
        <div className="w-8 h-8 border-4 border-redi-vino dark:border-redi-beige border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
