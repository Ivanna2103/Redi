"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Recurso, Carrera, Categoria } from "@/types";

interface ResourceCardProps {
  recurso: Recurso;
  carrera?: Carrera;
  categoria?: Categoria;
  onClick: (recurso: Recurso) => void;
}

export function ResourceCard({ recurso, carrera, categoria, onClick }: ResourceCardProps) {
  return (
    <Card 
      className="group overflow-hidden cursor-pointer border-transparent hover:border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={() => onClick(recurso)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
        <Image
          src={recurso.imagen_url}
          alt={recurso.titulo}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <CardContent className="p-5">
        <div className="flex gap-2 mb-3">
          {carrera && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800 font-medium text-xs px-2 py-0.5 rounded-sm">
              {carrera.nombre}
            </Badge>
          )}
          {categoria && (
            <Badge variant="outline" className="text-gray-500 border-gray-200 font-medium text-xs px-2 py-0.5 rounded-sm">
              {categoria.nombre}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1 truncate">
          {recurso.titulo}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {recurso.descripcion}
        </p>
      </CardContent>
    </Card>
  );
}
