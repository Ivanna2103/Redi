import Link from 'next/link';

export const metadata = {
  title: 'Licencias | Redi',
  description: 'Información sobre las licencias de uso de los recursos en la plataforma Redi.',
};

export default function LicenciasPage() {
  return (
    <div className="min-h-screen bg-redi-beige dark:bg-redi-vino text-redi-vino dark:text-redi-beige transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

        {/* Volver */}
        <Link
          href="/"
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-redi-vino/50 dark:text-redi-beige/50 hover:text-redi-red transition-colors mb-12 inline-block"
        >
          ← Volver al inicio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-redi-vino/50 dark:text-redi-beige/50 mb-3">
            Plataforma Redi · La Metro
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Licencias de Uso
          </h1>
          <p className="text-sm opacity-60 font-medium">
            Última actualización: junio 2025
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-redi-vino/10 dark:border-redi-beige/10 mb-12" />

        {/* Intro */}
        <p className="text-[15px] font-medium leading-relaxed opacity-80 mb-10">
          Todos los recursos disponibles en Redi están sujetos a condiciones de uso específicas. A continuación se describen los tipos de licencias que aplican a los materiales de la plataforma. Te pedimos leer cuidadosamente cada categoría antes de utilizar cualquier recurso.
        </p>

        {/* Content */}
        <div className="space-y-10 text-[15px] font-medium leading-relaxed opacity-80">

          <section className="space-y-4 p-6 rounded-2xl border border-redi-vino/10 dark:border-redi-beige/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-redi-vino/10 dark:bg-redi-beige/10 text-redi-vino dark:text-redi-beige">
                Licencia Académica
              </span>
            </div>
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">Uso educativo interno</h2>
            <p>
              La mayoría de los recursos en Redi están disponibles bajo una licencia de uso académico restringido. Esto significa que puedes descargarlos y usarlos libremente para proyectos, tareas y actividades dentro del Instituto Superior Tecnológico Metropolitano (La Metro), siempre que se dé crédito al autor original cuando corresponda.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Permitido</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-vino dark:bg-redi-beige mt-1.5 shrink-0" />Uso en trabajos académicos y presentaciones.</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-vino dark:bg-redi-beige mt-1.5 shrink-0" />Modificación para proyectos de clase.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">No permitido</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-red mt-1.5 shrink-0" />Uso comercial o venta de los recursos.</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-red mt-1.5 shrink-0" />Redistribución fuera de la comunidad La Metro.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4 p-6 rounded-2xl border border-redi-vino/10 dark:border-redi-beige/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-redi-vino/10 dark:bg-redi-beige/10 text-redi-vino dark:text-redi-beige">
                Licencia de Autor
              </span>
            </div>
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">Recursos con derechos reservados</h2>
            <p>
              Algunos recursos son aportados por docentes, estudiantes o colaboradores externos que conservan todos los derechos sobre su obra. Estos recursos estarán claramente señalados y requieren autorización expresa del autor para cualquier uso más allá del académico personal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Permitido</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-vino dark:bg-redi-beige mt-1.5 shrink-0" />Visualización y referencia para aprendizaje.</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-vino dark:bg-redi-beige mt-1.5 shrink-0" />Uso personal no comercial con mención del autor.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">No permitido</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-red mt-1.5 shrink-0" />Modificación sin permiso del autor.</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-red mt-1.5 shrink-0" />Reproducción pública o distribución.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4 p-6 rounded-2xl border border-redi-vino/10 dark:border-redi-beige/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-redi-vino/10 dark:bg-redi-beige/10 text-redi-vino dark:text-redi-beige">
                Creative Commons
              </span>
            </div>
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">Recursos de libre acceso</h2>
            <p>
              Ciertos recursos disponibles en Redi provienen de fuentes abiertas bajo licencias Creative Commons (CC). El tipo específico de licencia CC se indica en la descripción de cada recurso. En general, estos materiales permiten una mayor flexibilidad de uso, siempre respetando las condiciones de atribución establecidas por el autor.
            </p>
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Consideraciones</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-vino dark:bg-redi-beige mt-1.5 shrink-0" />Uso y modificación según tipo de licencia CC.</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-vino dark:bg-redi-beige mt-1.5 shrink-0" />Distribución si la licencia específica lo permite.</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-redi-vino dark:bg-redi-beige mt-1.5 shrink-0" />Siempre verificar el tipo exacto de licencia CC indicado en cada recurso antes de su uso.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">¿Tienes dudas sobre la licencia de un recurso?</h2>
            <p>
              Si no estás seguro sobre el tipo de licencia que aplica a un recurso específico o deseas solicitar permiso para un uso especial, comunícate con el equipo administrador de Redi a través del formulario de contacto en la plataforma.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
