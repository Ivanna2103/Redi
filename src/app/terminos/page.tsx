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
            Última actualización: junio 2026
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

          <section className="space-y-4">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">5. Propiedad intelectual y autoría del estudiante</h2>
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-redi-vino dark:text-redi-beige">5.1. Autoría Exclusiva del Estudiante</h3>
                <p>
                  Se reconoce de manera explícita y definitiva que la autoría y propiedad intelectual de todos los recursos gráficos (diseños, ilustraciones, animaciones, identidades visuales, etc.) desarrollados dentro del entorno académico pertenecen directa y exclusivamente al estudiante creador.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-redi-vino dark:text-redi-beige">5.2. Derecho de Uso y Difusión para el Instituto</h3>
                <p>
                  Como contraparte al proceso formativo y de mentoría, el estudiante otorga a La Metro el derecho permanente y no exclusivo para utilizar, exhibir, reproducir y difundir dichos recursos gráficos en sus plataformas digitales, página web, redes sociales oficiales, portafolios institucionales y material de difusión académica.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-redi-vino dark:text-redi-beige">5.3. Modelo Ganar-Ganar y Restricción Comercial de la Institución</h3>
                <p>
                  Este acuerdo se fundamenta en una relación de beneficio mutuo (ganar-ganar):
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <span className="font-bold">Para La Metro:</span> El instituto se compromete estrictamente a no comercializar, vender ni lucrar de ninguna forma con los recursos gráficos de los estudiantes. Su uso se limita únicamente a la visibilidad y prestigio institucional a través de la exposición de trabajos de calidad en su plataforma.
                  </li>
                  <li>
                    <span className="font-bold">Para el Estudiante:</span> El estudiante obtiene una plataforma de alta visibilidad para exponer su talento al público y al mercado laboral. Asimismo, el estudiante conserva la plena y absoluta libertad de comercializar, vender o licenciar sus recursos en el ámbito profesional de manera independiente, sin ninguna restricción por parte del instituto.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-redi-vino dark:text-redi-beige">5.4. Visibilidad de Autoría (Crédito Obligatorio)</h3>
                <p>
                  Para que el principio de \"ganar-ganar\" sea efectivo, toda publicación o exhibición que realice La Metro de un recurso gráfico dentro de su plataforma o canales de difusión deberá mostrar de forma clara y visible el nombre del autor.
                </p>
                <div className="p-4 bg-redi-vino/5 rounded-xl border border-redi-vino/10 font-bold text-xs">
                  Formato de Crédito: \"Recurso creado por [Nombre del Estudiante] — Estudiante de La Metro\".
                </div>
                <p>
                  Por su parte, el estudiante se compromete a mencionar a La Metro como la institución donde se gestó el proyecto al incluirlo en sus portafolios personales o profesionales.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-redi-vino dark:text-redi-beige">5.5. Responsabilidad de Originalidad</h3>
                <p>
                  El estudiante es el único responsable de garantizar que el recurso entregado es de su autoría original y que no vulnera derechos de propiedad intelectual de terceros (como tipografías, imágenes de stock o vectores), liberando a la institución de cualquier reclamación legal.
                </p>
              </div>

              <div className="p-5 bg-redi-vino/5 rounded-2xl border border-redi-red/20 font-medium text-xs mt-6 leading-relaxed">
                <span className="font-black uppercase tracking-wider block mb-1.5 text-redi-red">Formato de Aceptación Digital</span>
                Al subir y registrar este recurso gráfico en las plataformas de La Metro, el estudiante ratifica su autoría y acepta los términos de este acuerdo de visibilidad mutua, autorizando su uso institucional no comercial bajo el esquema de reconocimiento de créditos establecido.
              </div>
            </div>
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
