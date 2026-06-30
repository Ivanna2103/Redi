"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, Image as ImageIcon, FileBox, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [recursosList, setRecursosList] = useState<any[]>([]);

  // Form State
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dimensiones, setDimensiones] = useState("");
  const [formato, setFormato] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [linkDescarga, setLinkDescarga] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Fetch categorias para el dropdown
      const { data: catData } = await supabase.from('categorias').select('*');
      if (catData) setCategorias(catData);

      // Fetch recursos para la lista de administración
      const { data: recData } = await supabase
        .from('recursos')
        .select('*, categorias(nombre)')
        .order('created_at', { ascending: false });
      if (recData) setRecursosList(recData);
      
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      let imagen_url = "";
      let url_archivo = "";

      // 1. Subir Imagen al bucket 'recursos' si existe
      if (imagenFile) {
        try {
          const fileExt = imagenFile.name.split('.').pop();
          const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('recursos')
            .upload(fileName, imagenFile);
          
          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage.from('recursos').getPublicUrl(fileName);
          imagen_url = publicUrl;
        } catch (uploadError) {
          console.warn("Storage upload failed, falling back to Base64:", uploadError);
          // Convert image file to Base64 data URL
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imagenFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (err) => reject(err);
          });
          imagen_url = base64;
        }
      }

      // 2. Usar el link de descarga directo
      url_archivo = linkDescarga;

      // 3. Guardar el nuevo recurso en la base de datos
      const { error: insertError } = await supabase.from('recursos').insert({
        titulo,
        descripcion,
        dimensiones,
        formato,
        categoria_id: categoriaId || null,
        imagen_url,
        archivo_url: url_archivo // Solo enviamos archivo_url ya que url_archivo no existe en la BD
      });

      if (insertError) throw insertError;

      // Limpiar formulario y mostrar éxito
      setSuccess(true);
      setTitulo("");
      setDescripcion("");
      setDimensiones("");
      setFormato("");
      setCategoriaId("");
      setImagenFile(null);
      setLinkDescarga("");
      
      // Resetear file inputs
      (document.getElementById('imagenInput') as HTMLInputElement).value = '';

      // Re-fetch list to include the newly added resource
      const { data: recData } = await supabase
        .from('recursos')
        .select('*, categorias(nombre)')
        .order('created_at', { ascending: false });
      if (recData) setRecursosList(recData);

      setTimeout(() => setSuccess(false), 5000);

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Ocurrió un error al guardar el recurso.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecurso = async (id: string, titulo: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el recurso "${titulo}"?`)) {
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('recursos')
        .delete()
        .eq('id', id)
        .select();
      
      if (error) throw error;

      if (!data || data.length === 0) {
        alert("Aviso: El recurso no se pudo eliminar. Esto se debe a que las políticas de seguridad (RLS) en tu panel de Supabase no tienen habilitada una política para permitir la acción 'DELETE' desde la web. Puedes borrar el recurso directamente en tu tabla de Supabase o configurar una política que permita eliminar registros.");
        return;
      }
      
      // Update local state list
      setRecursosList(recursosList.filter(rec => rec.id !== id));
      alert("¡Recurso eliminado con éxito!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al eliminar el recurso.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-redi-beige dark:bg-redi-vino font-sans">
      <div className="w-8 h-8 border-4 border-redi-vino dark:border-redi-beige border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-redi-beige dark:bg-redi-vino text-redi-vino dark:text-redi-beige font-sans transition-colors duration-300 pb-20">
      {/* Header */}
      <nav className="h-20 px-6 flex items-center justify-between bg-redi-beige/80 dark:bg-redi-vino/80 backdrop-blur-md border-b border-redi-vino/10 dark:border-redi-beige/10 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-redi-vino/60 hover:text-redi-red dark:text-redi-beige/60 dark:hover:text-redi-red transition-colors w-1/4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden md:inline">Volver</span>
        </Link>
        
        <div className="w-2/4 flex justify-center text-[10px] font-black text-redi-vino/40 dark:text-redi-beige/40 uppercase tracking-[0.3em]">
          Panel de Control
        </div>
        
        <div className="flex items-center justify-end gap-6 w-1/4">
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6 md:p-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Subir Recurso</h1>
          <p className="text-redi-vino/60 dark:text-redi-beige/60 font-medium">Añade nuevas tipografías, fotos, vectores y plantillas a la plataforma directamente desde aquí.</p>
        </div>

        {success && (
          <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center gap-4 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold text-sm">¡Recurso subido exitosamente!</p>
              <p className="text-xs opacity-80 mt-1">Ya está disponible en la plataforma para todos los estudiantes.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-redi-beige dark:bg-redi-vino/40 p-8 md:p-12 rounded-[40px] border border-redi-vino/15 dark:border-redi-beige/20 shadow-sm">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-redi-vino dark:text-redi-beige uppercase tracking-widest ml-1 block">Título del Recurso</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Sketchyfont o Mockup de iPhone"
              className="w-full h-14 px-6 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-2xl focus:ring-2 focus:ring-redi-red outline-none transition-all font-medium text-sm text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/50 dark:placeholder:text-redi-beige/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-redi-vino dark:text-redi-beige uppercase tracking-widest ml-1 block">Categoría</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full h-14 px-6 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-2xl focus:ring-2 focus:ring-redi-red outline-none transition-all font-medium text-sm text-redi-vino dark:text-redi-beige appearance-none"
                required
              >
                <option value="" disabled className="text-redi-vino/50 dark:text-redi-beige/50">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id} className="text-black">{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-redi-vino dark:text-redi-beige uppercase tracking-widest ml-1 block">Formato</label>
              <input
                type="text"
                value={formato}
                onChange={(e) => setFormato(e.target.value)}
                placeholder="Ej. PSD, JPG o OTF, TTF"
                className="w-full h-14 px-6 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-2xl focus:ring-2 focus:ring-redi-red outline-none transition-all font-medium text-sm text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/50 dark:placeholder:text-redi-beige/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-redi-vino dark:text-redi-beige uppercase tracking-widest ml-1 block">Descripción (Opcional)</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Añade un texto atractivo..."
              className="w-full p-6 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-2xl focus:ring-2 focus:ring-redi-red outline-none transition-all font-medium text-sm text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/50 dark:placeholder:text-redi-beige/50 min-h-[120px] resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-redi-vino dark:text-redi-beige uppercase tracking-widest ml-1 block">Dimensiones</label>
            <input
              type="text"
              value={dimensiones}
              onChange={(e) => setDimensiones(e.target.value)}
              placeholder="Ej. 1920x1080px o Variable"
              className="w-full h-14 px-6 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-2xl focus:ring-2 focus:ring-redi-red outline-none transition-all font-medium text-sm text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/50 dark:placeholder:text-redi-beige/50"
              required
            />
          </div>

          <div className="pt-8 border-t border-redi-vino/10 dark:border-redi-beige/10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Imagen Upload */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-redi-vino dark:text-redi-beige uppercase tracking-widest ml-1 block flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Imagen de Portada
              </label>
              <div className="relative overflow-hidden group border border-redi-vino/20 dark:border-redi-beige/20 rounded-2xl h-32 flex items-center justify-center hover:border-redi-red transition-all cursor-pointer bg-transparent">
                <input 
                  type="file" 
                  id="imagenInput"
                  accept="image/*"
                  onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  required
                />
                <div className="text-center px-4">
                  <span className="block text-sm font-bold text-redi-vino dark:text-redi-beige mb-1 group-hover:text-redi-red transition-colors">
                    {imagenFile ? imagenFile.name : 'Haz clic para subir imagen'}
                  </span>
                  <span className="text-[10px] text-redi-vino/50 dark:text-redi-beige/50">PNG, JPG, WEBP (Max 5MB)</span>
                </div>
              </div>
            </div>

            {/* Link Descargable */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-redi-vino dark:text-redi-beige uppercase tracking-widest ml-1 block flex items-center gap-2">
                <FileBox className="w-3 h-3" /> Link de Descarga (Google Drive, etc.)
              </label>
              <input
                type="url"
                value={linkDescarga}
                onChange={(e) => setLinkDescarga(e.target.value)}
                placeholder="Ej. https://drive.google.com/..."
                className="w-full h-14 px-6 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-2xl focus:ring-2 focus:ring-redi-red outline-none transition-all font-medium text-sm text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/50 dark:placeholder:text-redi-beige/50"
                required
              />
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={saving}
              className="w-full h-16 bg-redi-red text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-redi-red/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-redi-red/20 uppercase tracking-widest text-xs"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <> <Upload className="w-5 h-5" /> Subir Recurso a la Plataforma </>}
            </button>
          </div>

        </form>

        {/* Resources List Section */}
        <div className="mt-16 bg-white/50 dark:bg-redi-vino/40 p-8 md:p-12 rounded-[40px] border border-redi-vino/15 dark:border-redi-beige/20 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Administrar Recursos</h2>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
            {recursosList.length > 0 ? (
              recursosList.map((rec) => (
                <div key={rec.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-redi-beige/50 dark:bg-redi-vino/20 rounded-2xl border border-redi-vino/10 dark:border-redi-beige/10 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-redi-vino/5 dark:bg-redi-beige/5 shrink-0">
                      <img 
                        src={rec.imagen_url || "https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/placeholder.jpg"} 
                        alt={rec.titulo} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-redi-vino dark:text-redi-beige">{rec.titulo}</h3>
                      <p className="text-[10px] text-redi-vino/50 dark:text-redi-beige/50 font-bold uppercase tracking-wider">
                        {rec.categorias?.nombre || "Sin Categoría"} • {rec.formato || "Sin Formato"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteRecurso(rec.id, rec.titulo)}
                    className="px-5 py-2 border border-redi-red/20 text-redi-red hover:bg-redi-red/10 text-[10px] font-bold rounded-full transition-all uppercase tracking-widest self-end sm:self-center"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-redi-vino/50 dark:text-redi-beige/50 text-sm font-medium">No se encontraron recursos subidos.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
