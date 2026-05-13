import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Categoria } from "@/types";
import { Search } from "lucide-react";

interface FilterSidebarProps {
  categorias: Categoria[];
  busqueda: string;
  setBusqueda: (val: string) => void;
  categoriaSeleccionada: string | null;
  setCategoriaSeleccionada: (val: string | null) => void;
}

export function FilterSidebar({
  categorias,
  busqueda,
  setBusqueda,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
}: FilterSidebarProps) {
  return (
    <div className="w-full md:w-64 space-y-8 flex-shrink-0">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Buscar</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar recursos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-black rounded-lg font-medium"
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Filtrar por Categoría</h2>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={categoriaSeleccionada === null ? "default" : "outline"}
            className={`cursor-pointer transition-colors font-medium px-3 py-1 ${categoriaSeleccionada === null ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"}`}
            onClick={() => setCategoriaSeleccionada(null)}
          >
            Todas
          </Badge>
          {categorias.map((cat) => (
            <Badge
              key={cat.id}
              variant={categoriaSeleccionada === cat.id ? "default" : "outline"}
              className={`cursor-pointer transition-colors font-medium px-3 py-1 ${categoriaSeleccionada === cat.id ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={() => setCategoriaSeleccionada(cat.id)}
            >
              {cat.nombre}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
