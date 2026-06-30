"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Upload, LogOut, LogIn, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Categoria } from "@/types";
import { mockCategorias, mockCentralCards } from "@/lib/mockData";
import { ThemeToggle } from "@/components/theme-toggle";

const SUBCATEGORIAS_POR_CATEGORIA: Record<string, string[]> = {
  fuentes: ["Serif", "Sans serif", "Script", "Decorative", "Monospace", "Handwritten", "Blackletter", "Symbols", "Duo"],
  "mock ups": ["Dispositivos", "Papelería", "Editorial", "Ropa", "Packaging", "Cartelería"],
  mockups: ["Dispositivos", "Papelería", "Editorial", "Ropa", "Packaging", "Cartelería"],
  ilustraciones: ["Personajes", "Iconos", "Patrones", "Abstracto", "Elementos", "Isométrico"],
  vectores: ["Personajes", "Iconos", "Patrones", "Abstracto", "Elementos", "Isométrico"],
  fotos: ["Naturaleza", "Personas", "Arquitectura", "Texturas", "Objetos", "Estudio"],
  "3d": ["Modelos", "Personajes", "Objetos", "Texturas", "Low Poly"],
  videos: ["Bucles", "Fondos", "Transiciones", "Efectos"],
  plantillas: ["Presentaciones", "Redes Sociales", "Portafolios", "Impresos", "Web / UI"],
  gráficos: ["Texturas", "Pinceles", "Gradientes", "Formas"]
};

const SUBCATEGORIAS_DEFAULT = ["Vectores", "Texturas", "Fuentes", "3D", "Fondos", "Plantillas", "Mockups"];

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState<string | null>(null);
  const queryCategoria = searchParams.get('categoria');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(
    queryCategoria
  );
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [recursos, setRecursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setCategoriaSeleccionada(queryCategoria);
    setSubcategoriaSeleccionada(null); // Reset subcategory filter when category query parameter changes
  }, [queryCategoria]);

  const handleSelectCategoria = (catId: string | null) => {
    setSubcategoriaSeleccionada(null); // Reset subcategory filter when category changes
    if (catId === null) {
      router.push('/');
    } else {
      const cat = categorias.find(c => c.id === catId);
      const catName = cat ? cat.nombre : catId;
      router.push(`/?categoria=${encodeURIComponent(catName)}`);
    }
  };

  const resetAllFilters = () => {
    setBusqueda("");
    setSubcategoriaSeleccionada(null);
    router.push('/');
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentCategoryName = (() => {
    if (!categoriaSeleccionada) return null;
    const cat = categorias.find(c => 
      c.id === categoriaSeleccionada || 
      c.nombre?.toLowerCase() === categoriaSeleccionada.toLowerCase() ||
      c.slug?.toLowerCase() === categoriaSeleccionada.toLowerCase()
    );
    return cat ? cat.nombre : categoriaSeleccionada;
  })();

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
    
    const cumpleSubcategoria = !subcategoriaSeleccionada || 
      recurso.tags?.some((tag: string) => tag.toLowerCase() === subcategoriaSeleccionada.toLowerCase()) ||
      recurso.subcategoria?.toLowerCase() === subcategoriaSeleccionada.toLowerCase();

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

    return cumpleBusqueda && cumpleSubcategoria && cumpleCategoria;
  });

  const subcategorias = (() => {
    if (!categoriaSeleccionada) {
      return SUBCATEGORIAS_DEFAULT;
    }
    const catKey = categoriaSeleccionada.toLowerCase();
    return SUBCATEGORIAS_POR_CATEGORIA[catKey] || [];
  })();

  return (
    <main className="min-h-screen bg-redi-beige dark:bg-redi-vino text-redi-vino dark:text-redi-beige font-sans transition-colors duration-300">
      <nav className="border-b border-redi-vino/10 flex flex-col sticky top-0 bg-redi-beige z-30 shadow-sm md:ml-64">
        {/* Top row */}
        <div className="h-16 md:h-20 flex items-center justify-between pl-6 pr-6 md:pl-6 md:pr-10">
          <div className="flex-shrink-0 md:hidden">
            <button 
              onClick={resetAllFilters}
              className="flex items-center"
            >
              <div 
                className="w-[129px] h-[50px] bg-redi-vino dark:bg-redi-beige"
                style={{
                  maskImage: 'url(/redi-logo.svg)',
                  WebkitMaskImage: 'url(/redi-logo.svg)',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                  WebkitMaskPosition: 'left center'
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
                className="px-6 py-2.5 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino/70 dark:text-redi-beige/70 text-[10px] font-bold rounded-full hover:bg-redi-red/10 hover:text-redi-red dark:hover:bg-redi-red/20 dark:hover:text-redi-red transition-all active:scale-95 tracking-widest uppercase flex md:hidden items-center justify-center"
              >
                Admin
              </Link>
            )}
            {user && (
              <Link 
                href="/perfil" 
                className="px-6 py-2.5 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino/70 dark:text-redi-beige/70 text-[10px] font-bold rounded-full hover:bg-redi-red/10 hover:text-redi-red dark:hover:bg-redi-red/20 dark:hover:text-redi-red transition-all active:scale-95 tracking-widest uppercase flex md:hidden items-center justify-center"
              >
                Mi Perfil
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino/70 dark:text-redi-beige/70 text-[10px] font-bold rounded-full hover:bg-redi-red/10 hover:text-redi-red dark:hover:bg-redi-red/20 dark:hover:text-redi-red transition-all active:scale-95 tracking-widest uppercase flex md:hidden items-center justify-center"
              >
                Salir
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="px-8 py-2.5 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino/70 dark:text-redi-beige/70 text-[10px] font-bold rounded-full hover:bg-redi-red/10 hover:text-redi-red dark:hover:bg-redi-red/20 dark:hover:text-redi-red transition-all active:scale-95 tracking-widest uppercase flex md:hidden items-center justify-center"
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

        {/* Subcategories Bar */}
        <div className="w-full bg-redi-beige dark:bg-redi-vino">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 py-4 px-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSubcategoriaSeleccionada(null)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                subcategoriaSeleccionada === null
                  ? "bg-redi-red text-white border-redi-red shadow-md shadow-redi-red/20"
                  : "bg-transparent text-redi-vino/60 dark:text-redi-beige/60 border-redi-vino/10 dark:border-redi-beige/25 hover:border-redi-red hover:text-redi-red dark:hover:text-redi-red"
              }`}
            >
              Todas
            </button>
            {subcategorias.map((subcat) => (
              <button
                key={subcat}
                onClick={() => setSubcategoriaSeleccionada(subcat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  subcategoriaSeleccionada === subcat
                    ? "bg-redi-red text-white border-redi-red shadow-md shadow-redi-red/20"
                    : "bg-transparent text-redi-vino/60 dark:text-redi-beige/60 border-redi-vino/10 dark:border-redi-beige/25 hover:border-redi-red hover:text-redi-red dark:hover:text-redi-red"
                }`}
              >
                {subcat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="flex w-full min-h-[calc(100vh-7rem)] relative">
        {/* Sidebar */}
        <aside className="w-64 border-r border-redi-vino/10 p-6 hidden md:flex flex-col bg-redi-beige h-screen fixed top-0 left-0 transition-colors overflow-y-auto no-scrollbar gap-2 z-50">
          {/* Logo inside sidebar */}
          <div className="mb-4 pt-2 px-4">
            <button 
              onClick={resetAllFilters}
              className="flex items-center"
            >
              <div 
                className="w-[80px] h-[31px] bg-redi-vino dark:bg-redi-beige"
                style={{
                  maskImage: 'url(/redi-logo.svg)',
                  WebkitMaskImage: 'url(/redi-logo.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                  WebkitMaskPosition: 'left center'
                }}
                aria-label="Redi Logo"
              />
            </button>
          </div>

          <div>
            <h2 className="text-[10px] font-bold text-redi-vino/40 uppercase tracking-[0.2em] mb-4 text-left px-4">Categorías</h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleSelectCategoria(null)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    categoriaSeleccionada === null 
                    ? "bg-redi-red text-white shadow-lg shadow-redi-red/20" 
                    : "text-redi-vino/60 hover:text-redi-red hover:bg-redi-red/10"
                  }`}
                >
                  Todas las categorías
                </button>
              </li>
              {categorias.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleSelectCategoria(cat.id)}
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
                      : "text-redi-vino/60 hover:text-redi-red hover:bg-redi-red/10"
                    }`}
                  >
                    {(cat.nombre || 'Sin nombre').toLowerCase() === '3d' ? '3D' : (cat.nombre || '').toLowerCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* User Section (placed at the bottom of the sidebar) */}
          <div className="pt-4 border-t border-redi-vino/10 space-y-2 mt-auto">
            {user ? (
              <div className="space-y-1">
                {/* User Info (Profile link) */}
                <Link href="/perfil" className="flex items-center gap-3 px-4 py-2 hover:bg-redi-red/5 rounded-2xl transition-all group">
                  <div className="w-8 h-8 rounded-full bg-redi-vino text-redi-beige flex items-center justify-center font-bold text-xs overflow-hidden relative border border-redi-vino/10">
                    {user.user_metadata?.avatar_url ? (
                      <Image src={user.user_metadata.avatar_url} alt="Avatar" fill className="object-cover" />
                    ) : (
                      user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-redi-vino truncate">{user.user_metadata?.full_name || 'Mi Perfil'}</p>
                    <p className="text-[9px] text-redi-vino/50 font-bold uppercase tracking-wider truncate">Mi Cuenta</p>
                  </div>
                </Link>

                {/* Subir un recurso (Admin) */}
                <Link 
                  href="/admin" 
                  className="flex items-center gap-3 px-4 py-2.5 text-redi-vino/70 hover:text-redi-red hover:bg-redi-red/5 rounded-2xl text-xs font-bold transition-all"
                >
                  <Upload className="w-4 h-4 text-redi-vino/60 group-hover:text-redi-red" />
                  Subir recurso
                </Link>

                {/* Salir */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-redi-vino/50 hover:text-redi-red hover:bg-redi-red/5 rounded-2xl text-xs font-bold transition-all text-left"
                >
                  <LogOut className="w-4 h-4 text-redi-vino/40" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login" 
                className="flex items-center gap-3 px-4 py-2 hover:bg-redi-red/5 rounded-2xl transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-redi-vino/10 dark:bg-redi-beige/10 text-redi-vino dark:text-redi-beige flex items-center justify-center relative border border-redi-vino/10 group-hover:bg-redi-red/10 group-hover:text-redi-red transition-all">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-redi-vino group-hover:text-redi-red transition-colors">Iniciar sesión</p>
                  <p className="text-[9px] text-redi-vino/50 font-bold uppercase tracking-wider truncate">Mi Cuenta</p>
                </div>
              </Link>
            )}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 md:ml-64 p-6 md:p-10 bg-transparent transition-colors">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recursosFiltrados.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recursosFiltrados.map((item) => {
                const resourceLink = currentCategoryName 
                  ? `/recursos/${item.id}?categoria=${encodeURIComponent(currentCategoryName)}` 
                  : `/recursos/${item.id}`;
                return (
                  <Link
                    href={resourceLink}
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
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-16 h-16 bg-white dark:bg-redi-vino/40 rounded-2xl flex items-center justify-center shadow-sm border border-redi-vino/10 dark:border-redi-beige/25 mb-4">
                <Search className="w-6 h-6 text-redi-vino/20 dark:text-redi-beige/20" />
              </div>
              <h3 className="text-redi-vino dark:text-redi-beige font-bold">No encontramos resultados</h3>
              <p className="text-redi-vino/60 dark:text-redi-beige/60 text-sm mt-1 max-w-xs">Prueba con otra palabra o cambia los filtros.</p>
              <button 
                onClick={resetAllFilters}
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
