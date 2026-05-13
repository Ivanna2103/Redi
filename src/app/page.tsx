"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Categoria, Recurso } from "@/types";
import { mockCategorias, mockCentralCards, mockCarreras } from "@/lib/mockData";

export default function Home() {
  const [busqueda, setBusqueda] = useState("");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [recursos, setRecursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Verificar usuario actual
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
    window.location.reload(); // Recargar para limpiar estados
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="border-b border-gray-100 flex flex-col sticky top-0 bg-white z-50 shadow-sm">
        {/* Top row */}
        <div className="h-16 flex items-center justify-between px-6">
          <div className="w-1/4">
            <Link href="/" className="group flex items-center">
              <Image src="/redi-logo.svg" alt="Redi" width={130} height={58} className="object-contain" priority />
            </Link>
          </div>

          <div className="w-2/4 flex justify-center">
            <div className="w-full max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar recursos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-gray-100 rounded-full text-sm"
              />
            </div>
          </div>

          <div className="w-1/4 flex justify-end items-center gap-6">
            {user && (
              <Link href="/perfil" className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-[0.2em] transition-colors">
                Mi Perfil
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-full hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 tracking-wide"
              >
                CERRAR SESION
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-all active:scale-95 shadow-md shadow-black/10 tracking-wide"
              >
                INICIAR SESION
              </Link>
            )}
          </div>
        </div>

        {/* Careers Bar RESTAURADA */}
        <div className="w-full border-t border-gray-50 bg-white/90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 py-3 px-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCarreraSeleccionada(null)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                carreraSeleccionada === null
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black"
              }`}
            >
              Todas
            </button>
            {mockCarreras.map((carrera) => (
              <button
                key={carrera.id}
                onClick={() => setCarreraSeleccionada(carrera.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  carreraSeleccionada === carrera.id
                    ? "bg-black text-white border-black shadow-md shadow-black/10"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black"
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
        <aside className="w-64 border-r border-gray-100 p-6 hidden md:block bg-white">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Categorías</h2>
          <ul className="space-y-1">
            {categorias.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/categorias/${cat.slug || cat.id}`}
                  className="w-full text-left block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 capitalize"
                >
                  {cat.nombre.toLowerCase() === '3d' ? '3D' : cat.nombre.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 bg-gray-50/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recursos.map((item) => (
              <Link
                href={`/recursos/${item.id}`}
                key={item.id}
                className="group relative aspect-square w-full bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <Image
                  src={item.imagen_url || item.imagen}
                  alt={item.titulo}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </main>
  );
}
