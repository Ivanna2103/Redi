import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Recursos Gráficos | Plataforma para Estudiantes',
  description: 'Explora, filtra y descarga recursos gráficos para tus proyectos de diseño en Quito.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <div className="flex flex-col min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
