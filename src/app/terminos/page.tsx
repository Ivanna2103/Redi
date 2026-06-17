import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones | Redi',
  description: 'Términos y condiciones de uso de la plataforma Redi.',
};

export default function TerminosPage() {
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
            Términos y Condiciones
          </h1>
          <p className="text-sm opacity-60 font-medium">
            Última actualización: junio 2025
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-redi-vino/10 dark:border-redi-beige/10 mb-12" />

        {/* Content */}
        <div className="space-y-10 text-[15px] font-medium leading-relaxed opacity-80">

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar la plataforma Redi, el usuario acepta estar sujeto a los presentes Términos y Condiciones de uso. Si no está de acuerdo con alguna de estas condiciones, le pedimos que se abstenga de utilizar la plataforma. El uso continuado de Redi constituye la aceptación plena de estos términos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">2. Descripción del servicio</h2>
            <p>
              Redi es una plataforma de distribución de recursos gráficos digitales creada para uso exclusivo de la comunidad estudiantil y docente del Instituto Superior Tecnológico Metropolitano (La Metro). Su finalidad es facilitar el acceso a materiales de apoyo académico como tipografías, ilustraciones, mockups y otros archivos de diseño.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">3. Uso permitido</h2>
            <p>
              Los recursos disponibles en Redi están destinados únicamente a fines académicos y de aprendizaje dentro de La Metro. Queda expresamente prohibido el uso de los recursos con fines comerciales, su redistribución a terceros o su publicación en otras plataformas sin autorización previa por escrito del administrador de la plataforma.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Uso en proyectos académicos y trabajos de clase.</li>
              <li>Descarga para uso personal en el contexto educativo.</li>
              <li>Exploración y aprendizaje de técnicas de diseño gráfico.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">4. Responsabilidades del usuario</h2>
            <p>
              El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que se realicen bajo su cuenta. Cualquier uso no autorizado o sospechoso debe ser reportado de inmediato al equipo administrador de la plataforma.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">5. Propiedad intelectual</h2>
            <p>
              El diseño, logotipos, marcas y contenidos propios de la plataforma Redi son propiedad del Instituto Superior Tecnológico Metropolitano. Los recursos subidos por usuarios o colaboradores conservan los derechos correspondientes a sus autores originales, tal como se indica en las licencias adjuntas a cada recurso.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">6. Modificaciones</h2>
            <p>
              Redi se reserva el derecho de modificar estos términos en cualquier momento. Las actualizaciones serán notificadas a través de la plataforma. El uso continuado de Redi después de dichos cambios implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">7. Contacto</h2>
            <p>
              Si tienes alguna pregunta acerca de estos Términos y Condiciones, puedes comunicarte con el equipo de Redi a través del formulario de contacto disponible en la plataforma o directamente con las autoridades del Instituto Superior Tecnológico Metropolitano.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
