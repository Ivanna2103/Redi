import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad | Redi',
  description: 'Política de Privacidad de la plataforma Redi.',
};

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          <p className="text-sm opacity-60 font-medium">
            Última actualización: Junio, 2026
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-redi-vino/10 dark:border-redi-beige/10 mb-12" />

        {/* Content */}
        <div className="space-y-10 text-[15px] font-medium leading-relaxed opacity-80">

          <p>
            Bienvenido/a a Redi, la plataforma web de recursos gráficos del Instituto Metropolitano de Diseño. Nos tomamos muy en serio la privacidad y la protección de los datos de nuestra comunidad estudiantil y docente. A continuación, te detallamos cómo recopilamos, usamos, almacenamos y protegemos tu información personal dentro de este sistema.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">1. Responsable del Tratamiento de Datos</h2>
            <p>
              El tratamiento de los datos recolectados en esta plataforma es gestionado internamente con fines estrictamente académicos y de colaboración comunitaria para el Instituto Metropolitano de Diseño (Quito, Ecuador).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">2. Datos Personales que Recopilamos</h2>
            <p>
              Para el correcto funcionamiento de la plataforma, la gestión de perfiles y la descarga/subida de recursos, recopilamos los siguientes datos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Datos de Identificación:</strong> Nombres y apellidos completos.</li>
              <li><strong>Datos de Contacto:</strong> Dirección de correo electrónico (preferiblemente institucional).</li>
              <li><strong>Información Académica:</strong> Carrera o facultad a la que perteneces dentro del instituto.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">3. Finalidad del Tratamiento de Datos</h2>
            <p>
              Los datos solicitados se utilizan exclusivamente para los siguientes fines:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Gestión de Cuentas:</strong> Crear, verificar y mantener tu perfil de usuario en Redi.</li>
              <li><strong>Atribución de Recursos:</strong> Identificar y dar crédito de manera correcta a los autores de los recursos gráficos (fuentes, mockups, vectores, modelos 3D, imágenes) subidos a la plataforma.</li>
              <li><strong>Seguridad y Moderación:</strong> Garantizar que el uso de la plataforma sea exclusivo para miembros legítimos de la Comunidad Metro.</li>
              <li><strong>Interacción:</strong> Permitir el envío de consultas o sugerencias a través de nuestro formulario de contacto.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">4. Base Legal para el Tratamiento</h2>
            <p>
              El procesamiento de tus datos se basa en el consentimiento explícito del usuario al registrarse en la plataforma y en el interés legítimo de proveer un entorno académico colaborativo seguro y organizado para los estudiantes y docentes del instituto.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">5. Conservación de los Datos</h2>
            <p>
              Tus datos personales se conservarán mientras mantengas activa tu cuenta en Redi o durante el periodo en que la plataforma preste sus servicios académicos para la comunidad del Instituto Metropolitano de Diseño. Si decides eliminar tu cuenta, tus datos personales identificativos serán borrados, aunque los recursos gráficos que hayas decidido compartir bajo licencias libres podrían permanecer anonimizados si así se requiere para no afectar la disponibilidad del catálogo.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">6. Compartición y Transferencia de Datos</h2>
            <p>
              <strong>Nota importante:</strong> Redi no vende, alquila ni comercializa tus datos personales con terceros. Los datos se visualizan únicamente de forma interna en los perfiles de la plataforma para fomentar la colaboración entre estudiantes y profesores.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">7. Derechos del Usuario (Derechos ARCO)</h2>
            <p>
              De acuerdo con la legislación ecuatoriana de protección de datos, tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Acceso:</strong> Conocer qué datos tuyos tenemos almacenados.</li>
              <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o desactualizados.</li>
              <li><strong>Eliminación/Cancelación:</strong> Solicitar el borrado de tu cuenta y datos personales del sistema.</li>
              <li><strong>Oposición:</strong> Oponerte al uso de tus datos para fines específicos.</li>
            </ul>
            <p className="pt-2">
              Para ejercer cualquiera de estos derechos, puedes gestionar tu información directamente desde la sección &quot;Mi Perfil&quot; o enviarnos un mensaje detallado utilizando el formulario de contacto integrado en el pie de página de la plataforma.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">8. Seguridad de la Información</h2>
            <p>
              Implementamos medidas técnicas y organizativas estándar (como bases de datos protegidas y conexiones seguras) para salvaguardar tu información frente a accesos no autorizados, pérdidas o alteraciones. Sin embargo, recuerda que ningún sistema de transmisión en internet es 100% seguro.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black opacity-100 text-redi-vino dark:text-redi-beige">9. Cambios en esta Política de Privacidad</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política para adaptarla a futuras mejoras de la plataforma o cambios legislativos. Cualquier modificación importante será notificada a través de la interfaz web de Redi.
            </p>
          </section>

          <p className="pt-4 border-t border-redi-vino/10 dark:border-redi-beige/10">
            Al registrarte y utilizar la plataforma Redi, declaras que comprendes y aceptas los términos descritos en esta Política de Privacidad.
          </p>

        </div>
      </div>
    </div>
  );
}
