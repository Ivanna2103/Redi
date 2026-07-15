"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Maximize, FileType, Lock, Link2, Check, Bookmark, X, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { FontPreview } from "@/components/font-preview";
import { ThemeToggle } from "@/components/theme-toggle";

const getDirectDownloadUrl = (url: string): string => {
  if (!url) return "";
  
  // 1. Google Drive Link
  if (url.includes("drive.google.com")) {
    let fileId = "";
    if (url.includes("/file/d/")) {
      const parts = url.split("/file/d/");
      if (parts[1]) {
        fileId = parts[1].split("/")[0];
      }
    } else if (url.includes("id=")) {
      const parts = url.split("id=");
      if (parts[1]) {
        fileId = parts[1].split("&")[0];
      }
    }
    if (fileId) {
      return `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
    }
  }

  // 2. Supabase Storage Link
  if (url.includes("supabase.co") && url.includes("/storage/")) {
    if (!url.includes("download=")) {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}download=`;
    }
  }

  return url;
};

export default function RecursoDetallePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoriaRef = searchParams.get('categoria');
  const [recurso, setRecurso] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [recursosSimilares, setRecursosSimilares] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [descargaOpciones, setDescargaOpciones] = useState<{ label: string; url: string; }[]>([]);
  const [showTrialLimitModal, setShowTrialLimitModal] = useState(false);
  const [showDownloadOptionsModal, setShowDownloadOptionsModal] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    async function fetchRecurso() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('recursos')
          .select('*, categorias(nombre)')
          .eq('id', id)
          .single();
        
        if (data) {
          setRecurso(data);
          if (typeof window !== "undefined") {
            const saved = JSON.parse(localStorage.getItem("saved_resources") || "[]");
            setIsSaved(saved.includes(data.id));
          }
          
          // Fetch similar resources (same category)
          const { data: simData } = await supabase
            .from('recursos')
            .select('*, categorias(nombre)')
            .eq('categoria_id', data.categoria_id)
            .neq('id', data.id)
            .limit(4);
          
          if (simData && simData.length > 0) {
            setRecursosSimilares(simData);
          } else {
            // Fallback: fetch other resources
            const { data: fallbackData } = await supabase
              .from('recursos')
              .select('*, categorias(nombre)')
              .neq('id', data.id)
              .limit(4);
            if (fallbackData) setRecursosSimilares(fallbackData);
          }
        }
      } catch (err) {
        console.error("Error fetching resource/similar:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecurso();
  }, [id]);

  useEffect(() => {
    if (recurso) {
      const formatsArray = recurso.formato 
        ? recurso.formato.split(',').map((f: string) => f.trim().toUpperCase())
        : [];

      const getFormatFromUrl = (url: string, index: number, defaultFormat: string): string => {
        if (!url) return "";
        try {
          const cleanUrl = url.split('?')[0]; // Remove query params
          const ext = cleanUrl.split('.').pop()?.toLowerCase() || "";
          if (["ai", "png", "jpg", "jpeg", "otf", "ttf", "woff", "psd", "pdf", "zip", "svg", "eps"].includes(ext)) {
            return ext.toUpperCase();
          }
        } catch (e) {}
        
        // Fallback to the format written by the user at that index
        if (formatsArray[index]) {
          return formatsArray[index];
        }
        return defaultFormat.toUpperCase() || "FORMATO";
      };

      const options = [];
      const primaryUrl = recurso.url_archivo || recurso.archivo_url;
      const primaryFormat = recurso.formato || "Principal";

      if (primaryUrl) {
        options.push({
          label: getFormatFromUrl(primaryUrl, 0, primaryFormat),
          url: getDirectDownloadUrl(primaryUrl)
        });
      }

      if (recurso.archivo_url_2) {
        options.push({
          label: getFormatFromUrl(recurso.archivo_url_2, 1, "Formato 2"),
          url: getDirectDownloadUrl(recurso.archivo_url_2)
        });
      }

      if (recurso.archivo_url_3) {
        options.push({
          label: getFormatFromUrl(recurso.archivo_url_3, 2, "Formato 3"),
          url: getDirectDownloadUrl(recurso.archivo_url_3)
        });
      }

      setDescargaOpciones(options);
    }
  }, [recurso]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-redi-beige dark:bg-redi-vino">
      <div className="w-8 h-8 border-4 border-redi-vino dark:border-redi-beige border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!recurso) return <div className="p-20 text-center text-redi-vino dark:text-redi-beige">Recurso no encontrado.</div>;

  const nombreCat = (recurso.categorias?.nombre || recurso.categoria || "").toLowerCase();
  const formatoStr = (recurso.formato || "").toLowerCase();
  const urlStr = (recurso.url_archivo || recurso.archivo_url || "").toLowerCase();
  const esFuente = nombreCat.includes("fuente") || 
                   nombreCat.includes("tipograf") || 
                   nombreCat.includes("font") ||
                   formatoStr.includes("otf") || 
                   formatoStr.includes("ttf") ||
                   urlStr.endsWith(".otf") ||
                   urlStr.endsWith(".ttf");

  const getFormatDescription = (format: string): string => {
    const f = format.toLowerCase();
    if (f === "png") return "Imagen con fondo transparente";
    if (f === "jpg" || f === "jpeg") return "Imagen comprimida de alta calidad";
    if (f === "svg") return "Vector infinitamente escalable";
    if (f === "ai") return "Archivo original de Adobe Illustrator";
    if (f === "psd") return "Documento de Adobe Photoshop";
    if (f === "pdf") return "Documento PDF listo para imprimir";
    if (f === "otf" || f === "ttf" || f === "woff") return "Archivo de tipografía instalable";
    if (f === "zip") return "Paquete comprimido con todos los archivos";
    if (f === "eps") return "Formato vectorial encapsulado";
    return "Archivo listo para descargar";
  };

  const handleDownloadSingleOption = async (op: { label: string; url: string }) => {
    if (!op.url) return;

    // 1. Verificar límite de descargas de prueba para usuarios invitados (no logueados)
    if (!user) {
      const trialDownloadsStr = localStorage.getItem("redi_trial_downloads");
      const trialDownloads = trialDownloadsStr ? JSON.parse(trialDownloadsStr) : [];
      const currentId = recurso.id;
      const hasDownloadedThis = trialDownloads.includes(currentId);

      if (!hasDownloadedThis) {
        if (trialDownloads.length >= 3) {
          setShowDownloadOptionsModal(false);
          setShowTrialLimitModal(true);
          return;
        } else {
          trialDownloads.push(currentId);
          localStorage.setItem("redi_trial_downloads", JSON.stringify(trialDownloads));
        }
      }
    }

    // 2. Solo registramos en la base de datos si el usuario está autenticado
    if (user) {
      try {
        await supabase.from('descargas').insert({
          user_id: user.id,
          recurso_id: recurso.id
        });
      } catch (err) {
        console.error("Error al registrar descarga:", err);
      }
    }

    // 3. Descargar el archivo
    const link = document.createElement('a');
    link.href = op.url;
    link.target = '_blank';
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cerrar el modal de opciones
    setShowDownloadOptionsModal(false);
  };

  const handleDownload = async () => {
    // 1. Verificar límite de descargas de prueba para usuarios invitados (no logueados)
    if (!user) {
      const trialDownloadsStr = localStorage.getItem("redi_trial_downloads");
      const trialDownloads = trialDownloadsStr ? JSON.parse(trialDownloadsStr) : [];
      const currentId = recurso.id;
      const hasDownloadedThis = trialDownloads.includes(currentId);

      if (!hasDownloadedThis && trialDownloads.length >= 3) {
        setShowTrialLimitModal(true);
        return;
      }
    }

    // Si hay más de un formato, mostramos el modal para elegir
    if (descargaOpciones && descargaOpciones.length > 1) {
      setShowDownloadOptionsModal(true);
      return;
    }

    // Si solo hay un formato (o ninguno guardado en descargaOpciones), procedemos con la descarga directa
    const urlsToDownload: string[] = [];
    if (descargaOpciones && descargaOpciones.length === 1) {
      if (descargaOpciones[0].url) urlsToDownload.push(descargaOpciones[0].url);
    } else {
      const singleUrl = recurso.url_archivo || recurso.archivo_url;
      if (singleUrl) urlsToDownload.push(getDirectDownloadUrl(singleUrl));
    }

    if (urlsToDownload.length === 0) {
      alert("El archivo de descarga aún no está disponible para este recurso.");
      return;
    }

    // Registrar descarga de prueba si es invitado
    if (!user) {
      const trialDownloadsStr = localStorage.getItem("redi_trial_downloads");
      const trialDownloads = trialDownloadsStr ? JSON.parse(trialDownloadsStr) : [];
      const currentId = recurso.id;
      const hasDownloadedThis = trialDownloads.includes(currentId);

      if (!hasDownloadedThis) {
        trialDownloads.push(currentId);
        localStorage.setItem("redi_trial_downloads", JSON.stringify(trialDownloads));
      }
    }

    // Registrar en BD si está autenticado
    if (user) {
      try {
        await supabase.from('descargas').insert({
          user_id: user.id,
          recurso_id: recurso.id
        });
      } catch (err) {
        console.error("Error al registrar descarga:", err);
      }
    }

    urlsToDownload.forEach((url, idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 350);
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado al portapapeles!");
    }
  };

  const handleSaveResource = () => {
    if (typeof window !== "undefined" && recurso) {
      let saved = JSON.parse(localStorage.getItem("saved_resources") || "[]");
      if (saved.includes(recurso.id)) {
        saved = saved.filter((rId: string) => rId !== recurso.id);
        localStorage.setItem("saved_resources", JSON.stringify(saved));
        setIsSaved(false);
        alert("Recurso eliminado de tu colección.");
      } else {
        saved.push(recurso.id);
        localStorage.setItem("saved_resources", JSON.stringify(saved));
        setIsSaved(true);
        alert("¡Recurso guardado en tu colección!");
      }
    }
  };

  // Dynamic properties based on category and tags
  const catNombreStr = (recurso.categorias?.nombre || recurso.categoria || "").toLowerCase();
  
  const detailsList = [];

  // En bucle (looping video)
  if (catNombreStr.includes("video") || catNombreStr.includes("animac")) {
    detailsList.push({ label: "En bucle", value: recurso.en_bucle ? "Sí" : "No" });
  }

  // Vector / Scalable
  if (catNombreStr.includes("ilustra") || catNombreStr.includes("grafi") || catNombreStr.includes("vector") || catNombreStr.includes("plantilla")) {
    detailsList.push({ label: "Vector", value: catNombreStr.includes("mock") ? "No" : "Sí" });
  } else if (catNombreStr.includes("foto")) {
    detailsList.push({ label: "Vector", value: "No" });
  }

  // En capas (layered files like PSD, AI)
  if (catNombreStr.includes("mock") || catNombreStr.includes("plantilla") || catNombreStr.includes("ilustra") || catNombreStr.includes("grafi") || catNombreStr.includes("3d")) {
    detailsList.push({ label: "En capas", value: "Sí" });
  } else if (catNombreStr.includes("foto") || catNombreStr.includes("video") || catNombreStr.includes("fuente")) {
    detailsList.push({ label: "En capas", value: "No" });
  }

  // Repetible (seamless pattern)
  if (catNombreStr.includes("ilustra") || catNombreStr.includes("grafi")) {
    const esRepetible = recurso.tags?.some((t: string) => t.toLowerCase().includes("repetible") || t.toLowerCase().includes("patrón") || t.toLowerCase().includes("pattern"));
    detailsList.push({ label: "Repetible", value: esRepetible ? "Sí" : "No" });
  }

  // Animado
  if (catNombreStr.includes("video")) {
    detailsList.push({ label: "Animado", value: "Sí" });
  } else if (catNombreStr.includes("foto") || catNombreStr.includes("fuente") || catNombreStr.includes("mock") || catNombreStr.includes("3d")) {
    detailsList.push({ label: "Animado", value: "No" });
  }

  // Tipos de archivo (file types)
  let fileTypes = "PSD, JPG";
  if (recurso.formato) {
    fileTypes = recurso.formato.toUpperCase();
  } else if (descargaOpciones && descargaOpciones.length > 0) {
    fileTypes = descargaOpciones.map(op => op.label.toUpperCase()).join(", ");
  } else {
    if (catNombreStr.includes("fuente") || catNombreStr.includes("tipo")) {
      fileTypes = "OTF, TTF, WOFF";
    } else if (catNombreStr.includes("ilustra") || catNombreStr.includes("grafi")) {
      fileTypes = "AI, EPS, SVG, PNG";
    } else if (catNombreStr.includes("mock")) {
      fileTypes = "PSD";
    } else if (catNombreStr.includes("foto")) {
      fileTypes = "JPG, PNG, WEBP";
    } else if (catNombreStr.includes("video")) {
      fileTypes = "MP4, MOV";
    } else if (catNombreStr.includes("3d")) {
      fileTypes = "OBJ, FBX, GLTF, BLEND";
    } else if (catNombreStr.includes("plantilla")) {
      fileTypes = "INDD, AI, PSD, FIG";
    }
  }
  detailsList.push({ label: "Tipos de archivo", value: fileTypes });

  // Aplicaciones compatibles (compatible software)
  let compatibleApps = "Cualquier visor compatible";
  if (catNombreStr.includes("fuente") || catNombreStr.includes("tipo")) {
    compatibleApps = "Adobe Photoshop, Adobe Illustrator, InDesign, Word, Pages, Figma";
  } else if (catNombreStr.includes("ilustra") || catNombreStr.includes("grafi") || catNombreStr.includes("plantilla")) {
    compatibleApps = "Adobe Illustrator, Adobe Photoshop, Figma, Sketch";
  } else if (catNombreStr.includes("mock")) {
    compatibleApps = "Adobe Photoshop";
  } else if (catNombreStr.includes("foto")) {
    compatibleApps = "Cualquier editor de imágenes, Adobe Photoshop, Lightroom";
  } else if (catNombreStr.includes("video")) {
    compatibleApps = "Adobe Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro";
  } else if (catNombreStr.includes("3d")) {
    compatibleApps = "Blender, Cinema 4D, Maya, Unity, Unreal Engine";
  }
  detailsList.push({ label: "Aplicaciones compatibles", value: compatibleApps });

  // Helper for description enrichment
  const getEnrichedDescription = (title: string, category: string, baseDesc?: string) => {
    const parts = [];
    if (baseDesc && baseDesc.trim().length > 0) {
      parts.push(baseDesc);
    } else {
      parts.push(`Este es un recurso exclusivo de la categoría ${category || 'Gráficos'} para la comunidad de La Metro.`);
    }

    parts.push(
      `Optimiza tus proyectos de diseño con este recurso de alta calidad. Ha sido seleccionado especialmente para cumplir con los estándares académicos y profesionales exigidos en el Instituto Metropolitano de Diseño (Quito, Ecuador).`
    );

    return parts;
  };

  return (
    <main className="min-h-screen bg-redi-beige text-redi-vino font-sans pb-16">
      {/* Top action bar */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 flex justify-between items-center border-b border-redi-vino/10">
        <Link 
          href={categoriaRef ? `/?categoria=${encodeURIComponent(categoriaRef)}` : "/"} 
          className="w-9 h-9 rounded-full bg-redi-vino/5 hover:bg-redi-vino/10 text-redi-vino flex items-center justify-center transition-all"
          aria-label="Cerrar y volver al inicio"
        >
          <X className="w-4 h-4" />
        </Link>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyLink}
            className="w-9 h-9 rounded-full bg-redi-vino/5 hover:bg-redi-vino/10 text-redi-vino flex items-center justify-center transition-all"
            title="Copiar enlace"
          >
            <Link2 className="w-4 h-4 text-redi-vino/70" />
          </button>
          
          <Link 
            href="/licencias" 
            target="_blank" 
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-xl bg-redi-vino/5 hover:bg-redi-vino/10 text-redi-vino/80 text-xs font-bold flex items-center gap-2 transition-all border border-redi-vino/10"
          >
            <Check className="w-3.5 h-3.5 text-redi-red" />
            Licencias
          </Link>
          
          {user && (
            <button 
              onClick={handleSaveResource}
              className={`h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${isSaved ? 'bg-redi-red/10 border-redi-red/20 text-redi-red' : 'bg-redi-vino/5 hover:bg-redi-vino/10 text-redi-vino/80 border-redi-vino/10'}`}
            >
              <Bookmark className={`w-3.5 h-3.5 text-redi-red ${isSaved ? 'fill-redi-red' : ''}`} />
              {isSaved ? 'Guardado' : 'Guardar'}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-12 justify-center">
          
          {/* Left Column: Main Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative aspect-square w-full max-w-[480px] rounded-2xl overflow-hidden bg-white border border-redi-vino/10 group">
              <Image
                src={recurso.imagen_url || "https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/placeholder.jpg"}
                alt={recurso.titulo}
                fill
                className="object-cover p-0"
                priority
              />
            </div>
          </div>

          {/* Right Column: Title, actions, details box */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-2xl font-black text-redi-vino tracking-tight leading-tight mb-1.5">{recurso.titulo}</h1>
            {(recurso.autor || recurso.Autor) && (
              <p className="text-xs text-redi-vino/60 mb-6">
                por <span className="font-bold text-redi-vino">{recurso.autor || recurso.Autor}</span>
              </p>
            )}

            {/* Brand-colored download button */}
            <div className="mb-6 w-full max-w-[300px]">
              <button
                onClick={handleDownload}
                disabled={descargaOpciones.length === 0 && !(recurso.url_archivo || recurso.archivo_url)}
                className={`w-full h-11 bg-redi-red hover:bg-redi-red/90 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] text-xs tracking-wide ${(descargaOpciones.length === 0 && !(recurso.url_archivo || recurso.archivo_url)) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className="w-4 h-4" />
                Descargar
              </button>
            </div>

            {/* Tags section */}
            {recurso.tags && recurso.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {recurso.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-redi-vino/5 text-redi-vino/70 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Details Box */}
            <div className="border border-redi-vino/10 rounded-2xl overflow-hidden bg-white/50 shadow-sm w-full max-w-[480px]">
              <button 
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full px-5 py-4 flex justify-between items-center bg-redi-vino/[0.01] hover:bg-redi-vino/[0.02] border-b border-redi-vino/10 transition-colors"
              >
                <span className="text-xs font-black text-redi-vino uppercase tracking-widest">Detalles</span>
                <ChevronDown className={`w-4 h-4 text-redi-vino/60 transition-transform duration-300 ${isDetailsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDetailsOpen && (
                <div className="px-5 py-2 divide-y divide-redi-vino/5 text-xs text-redi-vino/80 font-medium">
                  {detailsList.map((detail, index) => (
                    <div key={index} className="py-3 flex justify-between items-start gap-4">
                      <span className="opacity-60 shrink-0 text-redi-vino">{detail.label}</span>
                      <span className="font-bold text-redi-vino text-right leading-tight">{detail.value}</span>
                    </div>
                  ))}
                  
                  {recurso.dimensiones && (
                    <div className="py-3 flex justify-between items-center gap-4">
                      <span className="opacity-60 text-redi-vino">Dimensiones</span>
                      <span className="font-bold text-redi-vino text-right">{recurso.dimensiones}</span>
                    </div>
                  )}

                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="opacity-60 text-redi-vino">DPI</span>
                    <span className="font-bold text-redi-vino text-right">
                      {catNombreStr.includes("fuente") || catNombreStr.includes("video") || catNombreStr.includes("3d") ? "-" : "300"}
                    </span>
                  </div>

                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="opacity-60 text-redi-vino">Términos de la licencia</span>
                    <Link href="/licencias" target="_blank" rel="noopener noreferrer" className="font-bold text-redi-red hover:underline text-right">
                      Licencia Académica
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 border-t border-redi-vino/10 pt-10">
          <h2 className="text-sm font-black text-redi-vino uppercase tracking-widest mb-4">Acerca de este recurso</h2>
          <div className="space-y-4 text-sm text-redi-vino/80 leading-relaxed font-medium">
            {getEnrichedDescription(recurso.titulo, recurso.categorias?.nombre || recurso.categoria, recurso.descripcion).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            
            <div className="bg-redi-vino/[0.01] border border-redi-vino/10 rounded-2xl p-5 mt-6">
              <h3 className="text-xs font-bold text-redi-vino uppercase tracking-wider mb-2">Características Principales:</h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-redi-vino/70">
                <li>Descarga directa e instantánea.</li>
                <li>Formato totalmente compatible con los programas de diseño estándar.</li>
                <li>Uso libre autorizado para fines académicos y entregas de portafolio.</li>
                <li>Resolución optimizada para presentaciones digitales e impresas.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Font Preview (Full width) */}
        {esFuente && (
          <div className="w-full mt-12 border-t border-redi-vino/10 pt-10">
            <FontPreview 
              fontFamily={recurso.titulo} 
              fontUrl={recurso.url_archivo || recurso.archivo_url}
              designer={recurso.autor || recurso.Autor}
              downloadUrl={recurso.url_archivo || recurso.archivo_url}
            />
          </div>
        )}
      </div>

      {/* Similar Resources Section */}
      {recursosSimilares.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-8 pt-12 pb-16 border-t border-redi-vino/10">
          <h2 className="text-sm font-black text-redi-vino uppercase tracking-widest mb-8 flex items-center gap-2">
            Recursos similares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recursosSimilares.map((item) => {
              const catName = item.categorias?.nombre || item.categoria || "";
              return (
                <Link
                  href={`/recursos/${item.id}`}
                  key={item.id}
                  className="group block"
                >
                  <div 
                    className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-redi-red/10 hover:-translate-y-1 border border-redi-vino/5"
                    style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                  >
                    <Image
                      src={item.imagen_url || "https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/placeholder.jpg"}
                      alt={item.titulo}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-redi-vino/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-3 px-2">
                    <h3 className="font-bold text-xs text-redi-vino truncate">{item.titulo}</h3>
                    <p className="text-[9px] text-redi-red font-bold uppercase tracking-widest">{catName}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {showTrialLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-redi-vino/40 dark:bg-black/60 backdrop-blur-md" 
            onClick={() => setShowTrialLimitModal(false)}
          />
          
          <div className="relative w-full max-w-md bg-redi-beige dark:bg-redi-vino p-8 md:p-10 rounded-[32px] border border-redi-vino/15 dark:border-redi-beige/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-redi-red/10 text-redi-red rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-black text-redi-vino dark:text-redi-beige tracking-tight mb-4 uppercase">
              Límite Alcanzado
            </h3>
            
            <p className="text-sm text-redi-vino/70 dark:text-redi-beige/70 font-medium leading-relaxed mb-8">
              Has alcanzado tu límite de <span className="font-bold text-redi-red">3 descargas de prueba</span>. Crea una cuenta gratuita para seguir descargando recursos de forma ilimitada.
            </p>
            
            <div className="w-full flex flex-col gap-3">
              <Link
                href="/auth/login?mode=signup"
                className="w-full h-12 bg-redi-red hover:bg-redi-red/90 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] text-xs font-black tracking-widest uppercase"
              >
                Crear cuenta gratis
              </Link>
              
              <button
                onClick={() => setShowTrialLimitModal(false)}
                className="w-full h-12 bg-transparent hover:bg-redi-vino/5 dark:hover:bg-redi-beige/5 text-redi-vino/60 dark:text-redi-beige/60 font-bold rounded-full flex items-center justify-center transition-all text-xs tracking-widest uppercase"
              >
                Volver después
              </button>
            </div>
          </div>
        </div>
      )}

      {showDownloadOptionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-redi-vino/40 dark:bg-black/60 backdrop-blur-md" 
            onClick={() => setShowDownloadOptionsModal(false)}
          />
          
          <div className="relative w-full max-w-md bg-redi-beige dark:bg-redi-vino p-8 md:p-10 rounded-[32px] border border-redi-vino/15 dark:border-redi-beige/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-redi-red/10 text-redi-red rounded-full flex items-center justify-center mb-6">
              <Download className="w-6 h-6 animate-bounce" />
            </div>
            
            <h3 className="text-xl font-black text-redi-vino dark:text-redi-beige tracking-tight mb-2 uppercase">
              Elige el Formato
            </h3>
            
            <p className="text-xs text-redi-vino/70 dark:text-redi-beige/70 font-medium leading-relaxed mb-6">
              Este recurso está disponible en varios formatos. Selecciona el que deseas descargar:
            </p>
            
            <div className="w-full flex flex-col gap-3">
              {descargaOpciones.map((op, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDownloadSingleOption(op)}
                  className="w-full p-4 bg-white dark:bg-redi-vino/20 border border-redi-vino/10 dark:border-redi-beige/10 hover:border-redi-red dark:hover:border-redi-red hover:bg-redi-red/5 dark:hover:bg-redi-red/5 text-redi-vino dark:text-redi-beige rounded-2xl flex items-center justify-between transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-redi-vino/5 dark:bg-redi-beige/5 flex items-center justify-center text-xs font-black text-redi-vino dark:text-redi-beige group-hover:text-redi-red group-hover:bg-redi-red/10 transition-colors">
                      {op.label}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider group-hover:text-redi-red transition-colors">
                        Descargar {op.label}
                      </p>
                      <p className="text-[10px] text-redi-vino/50 dark:text-redi-beige/50 font-bold uppercase tracking-wider mt-0.5">
                        {getFormatDescription(op.label)}
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-redi-vino/40 dark:text-redi-beige/40 group-hover:text-redi-red group-hover:translate-y-0.5 transition-all" />
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowDownloadOptionsModal(false)}
              className="mt-6 text-xs font-black text-redi-vino/40 dark:text-redi-beige/40 hover:text-redi-red dark:hover:text-redi-red uppercase tracking-widest transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
