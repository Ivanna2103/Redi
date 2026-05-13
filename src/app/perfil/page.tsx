"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, User, Clock, Package } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [descargas, setDescargas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }
      
      setUser(user);

      // Traer las descargas del usuario con info del recurso
      const { data, error } = await supabase
        .from('descargas')
        .select(`
          id,
          creado_en,
          recursos:recurso_id (
            id,
            titulo,
            imagen_url,
            url_archivo
          )
        `)
        .eq('user_id', user.id)
        .order('creado_en', { ascending: false });

      let finalData = data;

      if (error || !data) {
        // Si falla por el nombre en español, intentamos la consulta básica
        const { data: retryData } = await supabase
          .from('descargas')
          .select('*, recursos:recurso_id(*)')
          .eq('user_id', user.id)
          .order('id', { ascending: false });
        
        finalData = retryData;
      }

      if (finalData) {
        // Filtrar para que cada recurso salga solo una vez (el más reciente)
        const uniqueResources = finalData.reduce((acc: any[], current: any) => {
          const recursoId = current.recursos?.id || current.recurso_id;
          const exists = acc.find(item => (item.recursos?.id || item.recurso_id) === recursoId);
          if (!exists) {
            return [...acc, current];
          }
          return acc;
        }, []);

        setDescargas(uniqueResources);
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans">Cargando perfil...</div>;

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans">
      {/* Header */}
      <nav className="h-20 px-6 flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">Volver</span>
        </Link>
        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
          Mi Perfil
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 md:p-12">
        {/* User Info Card */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white shadow-xl shadow-black/10">
            <User className="w-10 h-10" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-2 lowercase tracking-tight">{user.email?.split('@')[0]}</h1>
            <p className="text-gray-400 text-sm mb-6">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-gray-50 px-4 py-2 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Miembro desde {new Date(user.created_at).getFullYear()}
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 flex items-center gap-2">
                <Package className="w-3 h-3" />
                {descargas.length} Descargas
              </div>
            </div>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            className="px-8 py-3 bg-red-50 text-red-600 text-xs font-black rounded-2xl hover:bg-red-100 transition-all uppercase tracking-widest"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Downloads History */}
        <div>
          <h2 className="text-xl font-bold mb-8 px-2 lowercase tracking-tight">Mi Historial de Descargas</h2>
          
          {descargas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {descargas.map((item) => (
                <div key={item.id} className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                  <div className="relative aspect-square rounded-[24px] overflow-hidden mb-4 bg-gray-50">
                    <Image
                      src={item.recursos.imagen_url}
                      alt={item.recursos.titulo}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="font-bold text-sm mb-1 truncate">{item.recursos?.titulo || 'Recurso'}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                      {new Date(item.creado_en || item.created_at).toLocaleDateString()}
                    </p>
                    <Link 
                      href={`/recursos/${item.recursos.id}`}
                      className="w-full h-10 bg-gray-50 text-black text-[10px] font-black rounded-xl flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all uppercase tracking-widest"
                    >
                      <Download className="w-3 h-3" />
                      Volver a bajar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Aún no has descargado ningún recurso.</p>
              <Link href="/" className="text-black font-bold text-sm mt-4 inline-block hover:underline">
                Explorar catálogo
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
