"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError("Credenciales incorrectas");
    else router.push("/");
    setLoading(false);
  };

  return (
    <main className="h-screen w-full bg-redi-beige dark:bg-redi-vino flex items-center justify-center p-0 md:p-6 lg:p-8 overflow-hidden font-sans transition-colors duration-300">
      <div className="w-full max-w-[1200px] h-full max-h-[850px] bg-redi-beige dark:bg-redi-vino rounded-none md:rounded-[40px] shadow-2xl shadow-redi-red/10 flex overflow-hidden border border-redi-vino/20 dark:border-redi-beige/20">
        
        {/* Lado Izquierdo: Formulario Totalmente Estático */}
        <div className="w-full lg:w-[45%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center overflow-y-auto no-scrollbar bg-transparent">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex flex-col items-center mt-0">
              <div 
                className="w-[300px] h-[115px] md:w-[420px] md:h-[160px] bg-redi-vino dark:bg-redi-beige"
                style={{
                  maskImage: 'url(/redi-logo.svg)',
                  WebkitMaskImage: 'url(/redi-logo.svg)',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'bottom',
                  WebkitMaskPosition: 'bottom'
                }}
                aria-label="Redi Logo"
              />
              <div className="-mt-4 md:-mt-10 opacity-40 dark:invert relative z-10">
                <Image src="https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/LA-METRO.png" alt="La Metro Logo" width={80} height={25} className="object-contain grayscale" />
              </div>
            </div>
            <p className="text-redi-vino/50 dark:text-redi-beige/50 text-[9px] font-medium tracking-tight text-center mb-8 mt-1 max-w-[240px]">
              Plataforma de recursos gráficos exclusiva para la comunidad de La Metro
            </p>

            {error && (
              <div className="w-full mb-3 p-2 bg-redi-red/10 text-redi-red text-[10px] font-bold rounded-xl border border-redi-red/20 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <div>
                <label className="text-[8px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 mb-1 block">Correo Institucional</label>
                <Input
                  type="email"
                  placeholder="nombre@lametro.edu.ec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl border border-redi-vino/20 dark:border-redi-beige/20 bg-transparent pl-5 focus:ring-redi-red text-xs text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/30 dark:placeholder:text-redi-beige/30"
                  required
                />
              </div>

              <div>
                <label className="text-[8px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 mb-1 block">Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-xl border border-redi-vino/20 dark:border-redi-beige/20 bg-transparent pl-5 focus:ring-redi-red text-xs text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/30 dark:placeholder:text-redi-beige/30"
                  required
                />
              </div>

              <div className="flex items-center justify-between px-1 mb-1">
                <label className="flex items-center gap-2 text-[10px] text-redi-vino/50 dark:text-redi-beige/50 cursor-pointer">
                  <input type="checkbox" className="rounded border-redi-vino/30 dark:border-redi-beige/30 bg-transparent text-redi-red focus:ring-redi-red" />
                  Recordarme
                </label>
                <button type="button" className="text-[10px] text-redi-vino/50 dark:text-redi-beige/50 font-bold hover:text-redi-red transition-colors">¿Olvidaste tu contraseña?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-redi-red text-white rounded-xl font-bold text-[11px] tracking-widest hover:bg-redi-red/90 transition-all shadow-lg shadow-redi-red/20 flex items-center justify-center gap-2 group"
              >
                {loading ? "CARGANDO..." : "INICIAR SESIÓN"}
                {!loading && <span className="transition-transform group-hover:translate-x-1">→</span>}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-redi-vino/20 dark:border-redi-beige/20"></div></div>
                <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest text-redi-vino/80 dark:text-redi-beige/80 bg-redi-beige dark:bg-redi-vino px-4">O continúa con</div>
              </div>

              <button
                type="button"
                className="w-full h-10 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 text-redi-vino dark:text-redi-beige rounded-xl font-bold text-[11px] flex items-center justify-center gap-3 hover:bg-redi-vino/5 dark:hover:bg-redi-beige/5 transition-all shadow-sm"
              >
                <div className="w-3.5 h-3.5 relative">
                   <Image src="https://www.google.com/favicon.ico" alt="Google" fill />
                </div>
                Google
              </button>
            </form>

            <p className="mt-4 text-[11px] text-redi-vino/50 dark:text-redi-beige/50">
              ¿No tienes cuenta? <Link href="/auth/signup" className="text-redi-vino dark:text-redi-beige font-bold hover:text-redi-red transition-colors hover:underline">Regístrate gratis</Link>
            </p>
          </div>

          <div className="text-center mt-4">
            <p className="text-[8px] text-redi-vino/30 dark:text-redi-beige/30 font-medium tracking-tight uppercase">
              © 2026 Redi Assets. Todos los derechos reservados.<br/>
              <span className="text-redi-vino/50 dark:text-redi-beige/50">INSTITUTO METROPOLITANO DE DISEÑO</span>
            </p>
          </div>
        </div>

        {/* Lado Derecho: Imagen Artística Limpia */}
        <div className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-redi-beige dark:bg-redi-vino">
          <Image
            src="https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/buaya.jpg"
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  );
}
