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

const SUBCATEGORIAS_DEFAULT = ["Vectores", "Texturas", "Fuentes", "3D", "Plantillas", "Mockups"];

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      recurso.tags?.some((tag: string) => {
        const t = tag.toLowerCase();
        const s = subcategoriaSeleccionada.toLowerCase();
        if (s === 'vectores') return t === 'vectores' || t === 'vector' || t === 'ilustraciones' || t === 'gráficos' || t === 'graficos';
        if (s === 'mockups') return t === 'mockups' || t === 'mock ups' || t === 'branding';
        return t === s;
      }) ||
      recurso.subcategoria?.toLowerCase() === subcategoriaSeleccionada.toLowerCase() ||
      (() => {
        const s = subcategoriaSeleccionada.toLowerCase();
        const catId = recurso.categoria_id || "";
        const catObj = categorias.find(c => c.id === catId);
        const catNombre = (catObj?.nombre || "").toLowerCase();
        const catSlug = (catObj?.slug || "").toLowerCase();
        
        if (s === 'vectores') {
          return catNombre === 'ilustraciones' || catNombre === 'gráficos' || catNombre === 'graficos' || catSlug === 'ilustraciones' || catSlug === 'graficos';
        }
        if (s === 'fuentes') {
          return catNombre === 'fuentes' || catSlug === 'fuentes';
        }
        if (s === '3d') {
          return catNombre === '3d' || catSlug === '3d';
        }
        if (s === 'mockups') {
          return catNombre === 'mock ups' || catNombre === 'mockups' || catSlug === 'mockups' || catSlug === 'mock-ups';
        }
        if (s === 'plantillas') {
          return catNombre === 'plantillas' || catSlug === 'plantillas';
        }
        if (s === 'fotos') {
          return catNombre === 'fotos' || catSlug === 'fotos';
        }
        return false;
      })();

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
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[100] transition-opacity md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-redi-beige border-r border-redi-vino/10 p-6 flex flex-col gap-2 z-[101] transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Close Button Only */}
        <div className="flex items-center justify-end mb-6">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-redi-vino/60 hover:text-redi-red transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Categories (Drawer) */}
        <div className="overflow-y-auto no-scrollbar flex-1">
          <h3 className="text-[10px] font-black text-redi-vino/30 uppercase tracking-[0.2em] mb-4 pl-4">Categorías</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => {
                  handleSelectCategoria(null);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all ${
                  categoriaSeleccionada === null
                    ? "bg-redi-red text-white shadow-md shadow-redi-red/10"
                    : "text-redi-vino/70 hover:bg-redi-red/5 hover:text-redi-red"
                }`}
              >
                Todas las categorías
              </button>
            </li>
            {categorias.map((cat) => {
              const isSelected = categoriaSeleccionada && (
                categoriaSeleccionada.toLowerCase() === cat.nombre?.toLowerCase() ||
                categoriaSeleccionada.toLowerCase() === cat.id?.toLowerCase() ||
                categoriaSeleccionada.toLowerCase() === cat.slug?.toLowerCase()
              );
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      handleSelectCategoria(cat.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all ${
                      isSelected
                        ? "bg-redi-red text-white shadow-md shadow-redi-red/10"
                        : "text-redi-vino/70 hover:bg-redi-red/5 hover:text-redi-red"
                    }`}
                  >
                    {cat.nombre}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Section (Drawer) */}
        <div className="pt-4 border-t border-redi-vino/10 space-y-2 mt-auto">
          {user ? (
            <div className="space-y-1">
              <Link 
                href="/perfil" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-redi-red/5 rounded-2xl transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-redi-vino flex items-center justify-center text-redi-beige text-xs font-bold shrink-0">
                  {user.email?.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[11px] font-black text-redi-vino truncate">Mi Perfil</p>
                  <p className="text-[9px] font-bold text-redi-vino/40 uppercase tracking-wider truncate">Mi cuenta</p>
                </div>
              </Link>

              {user && (user.email === 'ivannanicolet2103@gmail.com' || user.email === 'redi@lametro.edu.ec') && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-redi-red/5 rounded-2xl transition-all group text-redi-vino/70 hover:text-redi-red"
                >
                  <Upload className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] font-black tracking-wider uppercase">Subir recurso</span>
                </Link>
              )}

              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-redi-red/5 rounded-2xl transition-all text-redi-red"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-black tracking-wider uppercase">Cerrar sesión</span>
              </button>
            </div>
          ) : (
            <Link 
              href="/auth/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-redi-red/5 rounded-2xl transition-all group text-redi-vino/70 hover:text-redi-red"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-black tracking-wider uppercase">Iniciar sesión</span>
            </Link>
          )}
        </div>
      </div>

      <nav className="border-b border-redi-vino/10 flex flex-col sticky top-0 bg-redi-beige z-30 shadow-sm md:ml-64">
        {/* Top row */}
        <div className="h-16 md:h-20 flex items-center justify-between pl-6 pr-6 md:pl-6 md:pr-10">
          <div className="flex items-center gap-3 md:hidden">
            {/* Hamburger button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-redi-vino hover:text-redi-red transition-colors"
              aria-label="Abrir menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link 
              href="https://redi.framer.media/"
              className="flex items-center"
            >
              <div 
                className="w-[80px] h-[31px] bg-redi-vino"
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
            </Link>
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
          <div className="max-w-5xl mx-auto flex items-center justify-start md:justify-center gap-3 py-4 px-6 overflow-x-auto no-scrollbar">
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
            <Link 
              href="https://redi.framer.media/"
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
            </Link>
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
                {(user.email === 'ivannanicolet2103@gmail.com' || user.email === 'redi@lametro.edu.ec') && (
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-3 px-4 py-2.5 text-redi-vino/70 hover:text-redi-red hover:bg-redi-red/5 rounded-2xl text-xs font-bold transition-all"
                  >
                    <Upload className="w-4 h-4 text-redi-vino/60 group-hover:text-redi-red" />
                    Subir recurso
                  </Link>
                )}

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
