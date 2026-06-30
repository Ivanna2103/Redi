"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, User, Clock, Package, Box, Camera, Key, Bookmark } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [descargas, setDescargas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedResources, setSavedResources] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"descargas" | "guardados">("descargas");
  const gridRef = useRef<HTMLDivElement>(null);

  const scrollToGrid = (tab: "descargas" | "guardados") => {
    setActiveTab(tab);
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/perfil`, // En producción deberías tener una página dedicada a nueva contraseña
      });
      if (error) throw error;
      alert("¡Listo! Te hemos enviado un correo electrónico con las instrucciones para cambiar tu contraseña.");
    } catch (err: any) {
      alert(err.message || "Error al intentar enviar el correo de recuperación.");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Intentamos subir la imagen al bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        alert("Aviso: Para poder subir fotos, primero debes crear un 'Storage Bucket' llamado 'avatars' en tu panel de Supabase y hacerlo público.");
        return;
      }

      // Obtener la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Actualizar los datos del usuario en la base de datos de Auth
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;
      
      // Actualizar la vista local
      setUser({ ...user, user_metadata: { ...user.user_metadata, avatar_url: publicUrl } });
      alert("¡Foto de perfil actualizada con éxito!");

    } catch (err: any) {
      console.error(err);
      alert("Error inesperado al subir la imagen.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }
      
      setUser(user);

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
        const { data: retryData } = await supabase
          .from('descargas')
          .select('*, recursos:recurso_id(*)')
          .eq('user_id', user.id)
          .order('id', { ascending: false });
        
        finalData = retryData;
      }

      if (finalData) {
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

      // Fetch saved resources from localStorage
      if (typeof window !== "undefined") {
        const savedIds = JSON.parse(localStorage.getItem("saved_resources") || "[]");
        if (savedIds.length > 0) {
          try {
            const { data: savedData } = await supabase
              .from('recursos')
              .select('*')
              .in('id', savedIds);
            
            if (savedData) {
              setSavedResources(savedData);
            }
          } catch (err) {
            console.error("Error fetching saved resources:", err);
          }
        } else {
          setSavedResources([]);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-redi-beige dark:bg-redi-vino font-sans">
      <div className="w-8 h-8 border-4 border-redi-vino dark:border-redi-beige border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-redi-beige dark:bg-redi-vino text-redi-vino dark:text-redi-beige font-sans transition-colors duration-300">
      {/* Header */}
      <nav className="h-20 px-6 flex items-center justify-between bg-redi-beige/80 dark:bg-redi-vino/80 backdrop-blur-md border-b border-redi-vino/10 dark:border-redi-beige/10 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-redi-vino/60 hover:text-redi-red dark:text-redi-beige/60 dark:hover:text-redi-red transition-colors w-1/4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden md:inline">Volver</span>
        </Link>
        
        <div className="w-2/4 flex justify-center text-[10px] font-black text-redi-vino/40 dark:text-redi-beige/40 uppercase tracking-[0.3em]">
          Mi Perfil
        </div>
        
        <div className="flex items-center justify-end gap-6 w-1/4">
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 md:p-12">
        {/* User Info Card */}
        <div className="bg-white/50 dark:bg-redi-vino/40 rounded-[40px] p-8 md:p-12 border border-redi-vino/10 dark:border-redi-beige/10 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full">
            
            {/* Avatar Section */}
            <div 
              className="relative group cursor-pointer shrink-0" 
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 bg-redi-vino dark:bg-redi-beige rounded-full flex items-center justify-center shadow-xl overflow-hidden relative border-4 border-transparent group-hover:border-redi-red/20 transition-all">
                {user.user_metadata?.avatar_url ? (
                  <Image src={user.user_metadata.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  <User className="text-redi-beige dark:text-redi-vino w-10 h-10" />
                )}
                {/* Hover overlay para subir foto */}
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all backdrop-blur-[2px]">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                className="hidden" 
              />
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-black text-redi-vino dark:text-redi-beige tracking-tight mb-1">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </h1>
              <p className="text-redi-vino/50 dark:text-redi-beige/50 text-sm font-medium mb-6">{user.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                <span className="px-4 py-1.5 bg-white/50 dark:bg-redi-vino/20 border border-redi-vino/10 dark:border-redi-beige/10 rounded-full text-[10px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Miembro desde {new Date(user.created_at).getFullYear()}
                </span>
                <button 
                  onClick={() => scrollToGrid("descargas")}
                  className="px-4 py-1.5 bg-white/50 dark:bg-redi-vino/20 border border-redi-vino/10 dark:border-redi-beige/10 rounded-full text-[10px] font-bold text-redi-vino/55 dark:text-redi-beige/55 uppercase tracking-widest flex items-center gap-2 hover:bg-redi-vino/10 hover:text-redi-vino dark:hover:bg-redi-beige/10 dark:hover:text-redi-beige transition-all cursor-pointer"
                >
                  <Box className="w-3 h-3" /> {descargas.length} Descargas
                </button>
                <button 
                  onClick={() => scrollToGrid("guardados")}
                  className="px-4 py-1.5 bg-white/50 dark:bg-redi-vino/20 border border-redi-vino/10 dark:border-redi-beige/10 rounded-full text-[10px] font-bold text-redi-vino/55 dark:text-redi-beige/55 uppercase tracking-widest flex items-center gap-2 hover:bg-redi-vino/10 hover:text-redi-vino dark:hover:bg-redi-beige/10 dark:hover:text-redi-beige transition-all cursor-pointer"
                >
                  <Bookmark className="w-3 h-3 text-redi-red" /> {savedResources.length} Guardados
                </button>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button 
                  onClick={handleResetPassword}
                  className="px-5 py-2 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 text-redi-vino dark:text-redi-beige text-[10px] font-bold rounded-full hover:bg-redi-vino/5 dark:hover:bg-redi-beige/5 transition-all tracking-widest uppercase flex items-center gap-2"
                >
                  <Key className="w-3 h-3 text-redi-red" />
                  Cambiar Contraseña
                </button>
                <button 
                  onClick={() => scrollToGrid("guardados")}
                  className="px-5 py-2 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 text-redi-vino dark:text-redi-beige text-[10px] font-bold rounded-full hover:bg-redi-vino/5 dark:hover:bg-redi-beige/5 transition-all tracking-widest uppercase flex items-center gap-2"
                >
                  <Bookmark className="w-3.5 h-3.5 text-redi-red" />
                  Ver Recursos Guardados
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-redi-red text-white text-[10px] font-bold rounded-full hover:scale-105 shadow-lg shadow-redi-red/20 transition-all active:scale-95 tracking-widest uppercase mt-6 md:mt-0 shrink-0"
          >
            Cerrar Sesión
          </button>
        </div>

         {/* Tabs Section */}
        <div ref={gridRef} className="scroll-mt-24">
          <div className="flex border-b border-redi-vino/10 dark:border-redi-beige/10 mb-8 gap-6 px-2">
            <button
              onClick={() => setActiveTab("descargas")}
              className={`pb-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "descargas"
                  ? "border-redi-red text-redi-red font-black"
                  : "border-transparent text-redi-vino/40 dark:text-redi-beige/40 hover:text-redi-vino/70 dark:hover:text-redi-beige/70"
              }`}
            >
              Mi Historial de Descargas ({descargas.length})
            </button>
            <button
              onClick={() => setActiveTab("guardados")}
              className={`pb-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "guardados"
                  ? "border-redi-red text-redi-red font-black"
                  : "border-transparent text-redi-vino/40 dark:text-redi-beige/40 hover:text-redi-vino/70 dark:hover:text-redi-beige/70"
              }`}
            >
              Mis Recursos Guardados ({savedResources.length})
            </button>
          </div>

          {activeTab === "descargas" ? (
            descargas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {descargas.map((item) => (
                  <div key={item.id} className="bg-white/50 dark:bg-redi-vino/40 rounded-[32px] p-4 border border-redi-vino/10 dark:border-redi-beige/10 shadow-sm group hover:shadow-md transition-all">
                    <div className="relative aspect-square rounded-[24px] overflow-hidden mb-4 bg-redi-vino/5 dark:bg-redi-beige/5">
                      <Image
                        src={item.recursos?.imagen_url || "https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/placeholder.jpg"}
                        alt={item.recursos?.titulo || 'Recurso'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-2 pb-2">
                      <h3 className="font-bold text-sm mb-1 truncate text-redi-vino dark:text-redi-beige">{item.recursos?.titulo || 'Recurso'}</h3>
                      <p className="text-[10px] text-redi-vino/40 dark:text-redi-beige/40 font-bold uppercase tracking-widest mb-4">
                        {new Date(item.creado_en || item.created_at).toLocaleDateString()}
                      </p>
                      <Link 
                        href={`/recursos/${item.recursos?.id || item.recurso_id}`}
                        className="w-full h-10 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino dark:text-redi-beige text-[10px] font-black rounded-xl flex items-center justify-center gap-2 hover:bg-redi-vino dark:hover:bg-redi-beige hover:text-redi-beige dark:hover:text-redi-vino transition-all uppercase tracking-widest"
                      >
                        <Download className="w-3 h-3" />
                        Volver a bajar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/50 dark:bg-redi-vino/40 rounded-[40px] border border-dashed border-redi-vino/20 dark:border-redi-beige/20">
                <Package className="w-12 h-12 text-redi-vino/20 dark:text-redi-beige/20 mx-auto mb-4" />
                <p className="text-redi-vino/50 dark:text-redi-beige/50 text-sm font-medium">Aún no has descargado ningún recurso.</p>
                <Link href="/" className="text-redi-vino dark:text-redi-beige font-bold text-sm mt-4 inline-block hover:text-redi-red transition-colors">
                  Explorar catálogo
                </Link>
              </div>
            )
          ) : (
            savedResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedResources.map((item) => (
                  <div key={item.id} className="bg-white/50 dark:bg-redi-vino/40 rounded-[32px] p-4 border border-redi-vino/10 dark:border-redi-beige/10 shadow-sm group hover:shadow-md transition-all">
                    <div className="relative aspect-square rounded-[24px] overflow-hidden mb-4 bg-redi-vino/5 dark:bg-redi-beige/5">
                      <Image
                        src={item.imagen_url || "https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/placeholder.jpg"}
                        alt={item.titulo || 'Recurso'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-2 pb-2">
                      <h3 className="font-bold text-sm mb-1 truncate text-redi-vino dark:text-redi-beige">{item.titulo || 'Recurso'}</h3>
                      <p className="text-[10px] text-redi-vino/40 dark:text-redi-beige/40 font-bold uppercase tracking-widest mb-4">
                        recurso guardado
                      </p>
                      <Link 
                        href={`/recursos/${item.id}`}
                        className="w-full h-10 bg-redi-vino/5 dark:bg-redi-beige/5 text-redi-vino dark:text-redi-beige text-[10px] font-black rounded-xl flex items-center justify-center gap-2 hover:bg-redi-vino dark:hover:bg-redi-beige hover:text-redi-beige dark:hover:text-redi-vino transition-all uppercase tracking-widest"
                      >
                        Ver recurso
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/50 dark:bg-redi-vino/40 rounded-[40px] border border-dashed border-redi-vino/20 dark:border-redi-beige/20">
                <Bookmark className="w-12 h-12 text-redi-vino/20 dark:text-redi-beige/20 mx-auto mb-4" />
                <p className="text-redi-vino/50 dark:text-redi-beige/50 text-sm font-medium">Aún no has guardado ningún recurso.</p>
                <Link href="/" className="text-redi-vino dark:text-redi-beige font-bold text-sm mt-4 inline-block hover:text-redi-red transition-colors">
                  Explorar catálogo
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
