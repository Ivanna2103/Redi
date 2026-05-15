import { Recurso, Categoria } from "@/types";

export const mockCategorias: Categoria[] = [
  { id: 'cat_graficos', nombre: 'Gráficos', slug: 'graficos' },
  { id: 'cat_fotos', nombre: 'Fotos', slug: 'fotos' },
  { id: 'cat_fuentes', nombre: 'Fuentes', slug: 'fuentes' },
  { id: 'cat_mockups', nombre: 'Mock ups', slug: 'mockups' },
  { id: 'cat_videos', nombre: 'Videos', slug: 'videos' },
  { id: 'cat_3d', nombre: '3D', slug: '3d' },
  { id: 'cat_ilustraciones', nombre: 'Ilustraciones', slug: 'ilustraciones' },
  { id: 'cat_plantillas', nombre: 'Plantillas', slug: 'plantillas' },
];

export const mockCarreras = [
  { id: 'grafico', nombre: 'Gráfico' },
  { id: 'industrial', nombre: 'Industrial' },
  { id: 'modas', nombre: 'Modas' },
  { id: 'interiores', nombre: 'Interiores' },
  { id: 'fotografico', nombre: 'Fotográfico' },
  { id: 'multimedia', nombre: 'Multimedia' },
];

export const mockCentralCards = [
  { id: 'c1', titulo: 'Fotos', imagen_url: '/categorias/fotos.jpg', categoria_id: 'cat_fotos' },
  { id: 'c2', titulo: '3D', imagen_url: '/categorias/3d.jpg', categoria_id: 'cat_3d' },
  { id: 'c3', titulo: 'Ilustraciones', imagen_url: '/categorias/ilustraciones.jpg', categoria_id: 'cat_ilustraciones' },
  { id: 'c4', titulo: 'Gráficos', imagen_url: '/categorias/gráficos.jpg', categoria_id: 'cat_graficos' },
  { id: 'c5', titulo: 'Fuentes', imagen_url: '/categorias/fuentes.jpg', categoria_id: 'cat_fuentes' },
  { id: 'c6', titulo: 'Mock ups', imagen_url: '/categorias/mock ups.jpg', categoria_id: 'cat_mockups' },
  { id: 'c7', titulo: 'Videos', imagen_url: '/categorias/videos.jpg', categoria_id: 'cat_videos' },
  { id: 'c8', titulo: 'Plantillas', imagen_url: '/categorias/plantillas.jpg', categoria_id: 'cat_plantillas' },
  
  ...Array.from({ length: 32 }).map((_, i) => ({
    id: `extra_${i}`,
    titulo: `Recurso ${i + 9}`,
    imagen_url: `https://images.unsplash.com/photo-${[
      '1618005182384-a83a8bd57fbe', '1614850523296-d8c1af93d400', '1561070791-2526d30994b5',
      '1550684848-fac1c5b4e853', '1523381210434-271e8be1f52b', '1574717024653-61fd2cf4d44d',
      '1507238691740-187a5b1d37b8', '1626785774573-4b799315345d', '1517154421773-0529f29ea451',
      '1477959858617-67f85cf4f1df', '1511497584788-876760111969', '1534528741775-53994a69daeb'
    ][i % 12]}?q=80&w=800&auto=format&fit=crop`,
    categoria_id: ['cat_graficos', 'cat_fotos', 'cat_3d', 'cat_ilustraciones'][i % 4],
  }))
];

export const mockRecursos: Recurso[] = [
  { id: 'f1', titulo: 'Recurso 1', imagen_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800', categoria_id: 'cat_fotos', tags: ['paisaje'] },
  { id: 'f2', titulo: 'Recurso 2', imagen_url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800', categoria_id: 'cat_fotos', tags: ['fondo'] },
  { id: 'f3', titulo: 'Recurso 3', imagen_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800', categoria_id: 'cat_fotos', tags: ['cielo'] },
  { id: 'f4', titulo: 'Recurso 4', imagen_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800', categoria_id: 'cat_fotos', tags: ['paisaje'] },
  
  { id: 'fn1', titulo: 'Recurso 13', imagen_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800', categoria_id: 'cat_fuentes', tags: ['serif'] },
  { id: 'fn2', titulo: 'Recurso 14', imagen_url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800', categoria_id: 'cat_fuentes', tags: ['san serif'] },
  { id: 'fn3', titulo: 'Recurso 14b', imagen_url: 'https://images.unsplash.com/photo-1554446422-d05db23719d2?q=80&w=800', categoria_id: 'cat_fuentes', tags: ['caligrafía'] },
  
  { id: '3d1', titulo: 'Recurso 5', imagen_url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800', categoria_id: 'cat_3d', tags: ['modelos'] },
  { id: '3d2', titulo: 'Recurso 6', imagen_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800', categoria_id: 'cat_3d', tags: ['plantillas'] },
  { id: '3d3', titulo: 'Recurso 7', imagen_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800', categoria_id: 'cat_3d', tags: ['representaciones'] },
  
  { id: 'il1', titulo: 'Recurso 9', imagen_url: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?q=80&w=800', categoria_id: 'cat_ilustraciones', tags: ['vector'] },
  { id: 'il2', titulo: 'Recurso 10', imagen_url: 'https://images.unsplash.com/photo-1566373059449-304cf640f41c?q=80&w=800', categoria_id: 'cat_ilustraciones', tags: ['por capas'] },
  { id: 'il3', titulo: 'Recurso 10b', imagen_url: 'https://images.unsplash.com/photo-1607434472257-d9f8e57a643d?q=80&w=800', categoria_id: 'cat_ilustraciones', tags: ['repetible'] },
  
  { id: 'gr1', titulo: 'Recurso 11', imagen_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800', categoria_id: 'cat_graficos', tags: ['objetos'] },
  { id: 'gr2', titulo: 'Recurso 12', imagen_url: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800', categoria_id: 'cat_graficos', tags: ['íconos'] },
  { id: 'gr3', titulo: 'Recurso 12b', imagen_url: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=800', categoria_id: 'cat_graficos', tags: ['ilustraciones'] },
  { id: 'gr4', titulo: 'Recurso 12c', imagen_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800', categoria_id: 'cat_graficos', tags: ['texturas'] },

  { id: 'mk1', titulo: 'Recurso 15', imagen_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800', categoria_id: 'cat_mockups', tags: ['branding'] },
  { id: 'vd1', titulo: 'Recurso 17', imagen_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800', categoria_id: 'cat_videos', tags: ['drone'] },
  { id: 'pl1', titulo: 'Recurso 18', imagen_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800', categoria_id: 'cat_plantillas', tags: ['web'] },
];
