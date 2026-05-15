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
    <main className="h-screen w-full bg-[#fcfcfc] flex items-center justify-center p-0 md:p-6 lg:p-8 overflow-hidden font-sans">
      <div className="w-full max-w-[1200px] h-full max-h-[850px] bg-white rounded-none md:rounded-[40px] shadow-2xl shadow-black/5 flex overflow-hidden border border-gray-100">
        
        {/* Lado Izquierdo: Formulario Totalmente Estático */}
        <div className="w-full lg:w-[45%] p-6 md:p-10 lg:p-12 flex flex-col justify-between overflow-hidden bg-white">
          <div className="flex flex-col items-center">
            <div className="mb-1 flex flex-col items-center scale-90 md:scale-100">
              <Image src="/redi-logo.svg" alt="Redi Logo" width={150} height={60} className="object-contain" />
              <div className="mt-0 opacity-40">
                <Image src="https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/LA-METRO.png" alt="La Metro Logo" width={90} height={30} className="object-contain grayscale" />
              </div>
            </div>
            <p className="text-gray-400 text-[9px] font-medium tracking-tight text-center mb-6 mt-1 max-w-[240px]">
              Plataforma de recursos gráficos exclusiva para la comunidad de La Metro
            </p>

            {error && (
              <div className="w-full mb-3 p-2 bg-gray-50 text-black text-[10px] font-bold rounded-xl border border-gray-100 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Correo Institucional</label>
                <Input
                  type="email"
                  placeholder="nombre@lametro.edu.ec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-gray-100 bg-gray-50/50 pl-5 focus:ring-black text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-gray-100 bg-gray-50/50 pl-5 focus:ring-black text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-between px-1 mb-1">
                <label className="flex items-center gap-2 text-[10px] text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                  Recordarme
                </label>
                <button type="button" className="text-[10px] text-gray-400 font-bold hover:text-black transition-colors">¿Olvidaste tu contraseña?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-black text-white rounded-xl font-bold text-[11px] tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 group"
              >
                {loading ? "CARGANDO..." : "INICIAR SESIÓN"}
                {!loading && <span className="transition-transform group-hover:translate-x-1">→</span>}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-[8px] uppercase tracking-widest text-gray-300 bg-white px-4">O continúa con</div>
              </div>

              <button
                type="button"
                className="w-full h-11 bg-white border border-gray-100 text-gray-600 rounded-xl font-bold text-[11px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="w-3.5 h-3.5 relative">
                   <Image src="https://www.google.com/favicon.ico" alt="Google" fill />
                </div>
                Google
              </button>
            </form>

            <p className="mt-5 text-[11px] text-gray-400">
              ¿No tienes cuenta? <Link href="/auth/signup" className="text-black font-bold hover:underline">Regístrate gratis</Link>
            </p>
          </div>

          <div className="text-center mt-4">
            <p className="text-[8px] text-gray-300 font-medium tracking-tight uppercase">
              © 2026 Redi Assets. Todos los derechos reservados.<br/>
              <span className="text-gray-200">INSTITUTO METROPOLITANO DE DISEÑO</span>
            </p>
          </div>
        </div>

        {/* Lado Derecho: Imagen Artística Limpia */}
        <div className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-gray-50">
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
