"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, GraduationCap, User, Mail, Lock } from "lucide-react";
import { mockCarreras } from "@/lib/mockData";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");

  const [isSignUp, setIsSignUp] = useState(false);
  const [nombre, setNombre] = useState("");
  const [carrera, setCarrera] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (modeParam === "signup") {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [modeParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: nombre,
              career: carrera,
            }
          }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          alert("¡Registro exitoso! Tu cuenta ha sido creada.");
          router.push("/");
        }
      } else {
        // Login Flow
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
          setError("Credenciales incorrectas");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión con Google");
    }
  };

  return (
    <main className="h-screen w-full bg-redi-beige dark:bg-redi-vino flex items-center justify-center p-0 md:p-6 lg:p-8 overflow-hidden font-sans transition-colors duration-300">
      <div className="w-full max-w-[1200px] h-full max-h-[850px] bg-redi-beige dark:bg-redi-vino rounded-none md:rounded-[40px] shadow-2xl shadow-redi-red/10 flex overflow-hidden border border-redi-vino/20 dark:border-redi-beige/20">
        
        {/* Lado Izquierdo: Formulario */}
        <div className="w-full lg:w-[45%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center overflow-y-auto no-scrollbar bg-transparent">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex flex-col items-center mt-0 gap-1">
              <button onClick={() => router.push("/")} className="flex flex-col items-center gap-1">
                <div 
                  className="w-[80px] h-[31px] bg-redi-vino dark:bg-redi-beige"
                  style={{
                    maskImage: 'url(/redi-logo.svg)',
                    WebkitMaskImage: 'url(/redi-logo.svg)',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center'
                  }}
                  aria-label="Redi Logo"
                />
              </button>
              <div className="opacity-40 dark:invert relative z-10 mt-1">
                <Image src="https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/LA-METRO.png" alt="La Metro Logo" width={80} height={25} className="object-contain grayscale" />
              </div>
            </div>
            <p className="text-redi-vino/50 dark:text-redi-beige/50 text-[9px] font-medium tracking-tight text-center mb-6 mt-1 max-w-[240px]">
              Plataforma de recursos gráficos exclusiva para la comunidad de La Metro
            </p>

            {error && (
              <div className="w-full mb-3 p-2 bg-redi-red/10 text-redi-red text-[10px] font-bold rounded-xl border border-redi-red/20 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-3">
              {isSignUp && (
                <>
                  {/* Nombre completo */}
                  <div>
                    <label className="text-[8px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 mb-1 block">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-redi-vino/40 dark:text-redi-beige/40" />
                      <Input
                        type="text"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="h-10 rounded-xl border border-redi-vino/20 dark:border-redi-beige/20 bg-transparent pl-11 focus:ring-redi-red text-xs text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/30 dark:placeholder:text-redi-beige/30"
                        required={isSignUp}
                      />
                    </div>
                  </div>

                  {/* Carrera */}
                  <div>
                    <label className="text-[8px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 mb-1 block">Carrera</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-redi-vino/40 dark:text-redi-beige/40" />
                      <select
                        value={carrera}
                        onChange={(e) => setCarrera(e.target.value)}
                        className="w-full h-10 pl-11 pr-5 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-xl focus:ring-2 focus:ring-redi-red focus:border-transparent outline-none appearance-none text-xs text-redi-vino dark:text-redi-beige"
                        required={isSignUp}
                      >
                        <option value="" disabled className="text-redi-vino/30 dark:text-redi-beige/30 bg-redi-beige dark:bg-redi-vino">Selecciona tu carrera</option>
                        {mockCarreras.map((c) => (
                          <option key={c.id} value={c.nombre} className="text-black bg-redi-beige dark:bg-redi-vino dark:text-redi-beige">{c.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Correo */}
              <div>
                <label className="text-[8px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 mb-1 block">Correo Institucional</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-redi-vino/40 dark:text-redi-beige/40" />
                  <Input
                    type="email"
                    placeholder="nombre@lametro.edu.ec"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-xl border border-redi-vino/20 dark:border-redi-beige/20 bg-transparent pl-11 focus:ring-redi-red text-xs text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/30 dark:placeholder:text-redi-beige/30"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="text-[8px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 mb-1 block">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-redi-vino/40 dark:text-redi-beige/40" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-xl border border-redi-vino/20 dark:border-redi-beige/20 bg-transparent pl-11 pr-10 focus:ring-redi-red text-xs text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/30 dark:placeholder:text-redi-beige/30"
                    required
                    minLength={isSignUp ? 6 : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-redi-vino/40 dark:text-redi-beige/40 hover:text-redi-red transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between px-1 mb-1">
                  <label className="flex items-center gap-2 text-[10px] text-redi-vino/50 dark:text-redi-beige/50 cursor-pointer">
                    <input type="checkbox" className="rounded border-redi-vino/30 dark:border-redi-beige/30 bg-transparent text-redi-red focus:ring-redi-red" />
                    Recordarme
                  </label>
                  <Link
                    href="/auth/reset-password"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-redi-vino/50 dark:text-redi-beige/50 font-bold hover:text-redi-red transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-redi-red text-white rounded-xl font-bold text-[11px] tracking-widest hover:bg-redi-red/90 transition-all shadow-lg shadow-redi-red/20 flex items-center justify-center gap-2 group mt-4"
              >
                {isSignUp ? (loading ? "CREANDO..." : "CREAR CUENTA") : (loading ? "CARGANDO..." : "INICIAR SESIÓN")}
                {!loading && <span className="transition-transform group-hover:translate-x-1">→</span>}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-redi-vino/20 dark:border-redi-beige/20"></div></div>
                <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest text-redi-vino/80 dark:text-redi-beige/80 bg-redi-beige dark:bg-redi-vino px-4">O continúa con</div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-10 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 text-redi-vino dark:text-redi-beige rounded-xl font-bold text-[11px] flex items-center justify-center gap-3 hover:bg-redi-vino/5 dark:hover:bg-redi-beige/5 transition-all shadow-sm"
              >
                <div className="w-3.5 h-3.5 relative">
                   <Image src="https://www.google.com/favicon.ico" alt="Google" fill />
                 </div>
                Google
              </button>
            </form>

            {isSignUp ? (
              <p className="mt-4 text-[11px] text-redi-vino/50 dark:text-redi-beige/50 text-center">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className="text-redi-vino dark:text-redi-beige font-bold hover:text-redi-red transition-colors hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            ) : (
              <p className="mt-4 text-[11px] text-redi-vino/50 dark:text-redi-beige/50 text-center">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className="text-redi-vino dark:text-redi-beige font-bold hover:text-redi-red transition-colors hover:underline"
                >
                  Regístrate gratis
                </button>
              </p>
            )}
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
