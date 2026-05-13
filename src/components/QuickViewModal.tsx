"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Recurso, Carrera, Categoria } from "@/types";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recurso: Recurso | null;
  carrera?: Carrera;
  categoria?: Categoria;
  isLoggedIn: boolean;
}

export function QuickViewModal({
  isOpen,
  onClose,
  recurso,
  carrera,
  categoria,
  isLoggedIn,
}: QuickViewModalProps) {
  if (!recurso) return null;

  const handleDownload = () => {
    if (!isLoggedIn) {
      alert("Por favor inicia sesión para descargar este recurso.");
      // Aquí iría la lógica o redirección al modal/página de login
    } else {
      // Simular descarga
      alert("Descargando: " + recurso.titulo);
      window.open(recurso.url_archivo || (recurso as any).archivo_url, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white border-none shadow-2xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-100">
            <Image
              src={recurso.imagen_url}
              alt={recurso.titulo}
              fill
              className="object-cover"
              sizes="(max-w-768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col p-8 w-full md:w-1/2 justify-between">
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold font-sans text-gray-900 mb-2">
                  {recurso.titulo}
                </DialogTitle>
                <div className="flex gap-2 mb-4">
                  {carrera && <Badge variant="secondary" className="bg-blue-50 text-blue-700">{carrera.nombre}</Badge>}
                  {categoria && <Badge variant="outline" className="border-gray-200 text-gray-600">{categoria.nombre}</Badge>}
                </div>
                <DialogDescription className="text-gray-600 text-base leading-relaxed">
                  {recurso.descripcion}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
                 <span>{recurso.formato || 'PSD'} • {recurso.dimensiones || '2530px'}</span>
              </div>
            </div>

            <div className="mt-8">
              <Button onClick={handleDownload} className="w-full bg-black hover:bg-gray-800 text-white shadow-lg transition-transform active:scale-95">
                {isLoggedIn ? "Descargar Recurso" : "Iniciar Sesión para Descargar"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
