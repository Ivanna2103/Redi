export interface Carrera {
  id: string;
  nombre: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

export interface Recurso {
  id: string;
  titulo: string;
  imagen_url: string;
  url_archivo?: string;
  categoria_id: string;
  descripcion?: string;
  dimensiones?: string;
  formato?: string;
  tags?: string[];
  created_at?: string;
}
