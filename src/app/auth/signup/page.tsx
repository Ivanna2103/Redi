"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, GraduationCap, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { mockCarreras } from "@/lib/mockData";

export default function SignUpPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [carrera, setCarrera] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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
        alert("¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.");
        router.push("/auth/login");
      }
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-redi-beige dark:bg-redi-vino font-sans transition-colors duration-300">
      {/* Lado Izquierdo: Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-transparent flex-col justify-between p-12 text-redi-vino dark:text-redi-beige transition-colors duration-300">
        {/* Top: Logo */}
        <div 
          className="w-[110px] h-[43px] bg-redi-vino dark:bg-redi-beige"
          style={{
            maskImage: 'url(/redi-logo.svg)',
            WebkitMaskImage: 'url(/redi-logo.svg)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'left',
            WebkitMaskPosition: 'left'
          }}
          aria-label="Redi Logo"
        />

        {/* Center: Slogans */}
        <div className="max-w-xl my-auto py-8">
          <h1 className="text-5xl font-bold leading-tight mb-6">Donde las grandes mentes crean juntas.</h1>
          <p className="text-2xl font-normal">Únete al club creativo</p>
        </div>

        {/* Bottom: Copyright */}
        <div className="text-sm text-redi-vino/50 dark:text-redi-beige/50 font-medium">© 2026 Redi Assets. Todos los derechos reservados.</div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-12 overflow-y-auto bg-transparent">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-12 flex justify-center">
            <div 
              className="w-[110px] h-[43px] bg-redi-vino dark:bg-redi-beige"
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
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-redi-vino dark:text-redi-beige leading-tight">Crea tu cuenta</h2>
            <p className="text-redi-vino/60 dark:text-redi-beige/60 text-sm mt-3">
              ¿Ya tienes cuenta? {" "}
              <Link href="/auth/login" className="text-redi-vino dark:text-redi-beige font-bold hover:text-redi-red transition-colors hover:underline">Inicia sesión</Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-redi-red/10 border border-redi-red/20 rounded-xl flex items-center gap-3 text-redi-red text-sm font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 block">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-redi-vino/40 dark:text-redi-beige/40" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full h-12 pl-11 pr-4 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-xl focus:ring-2 focus:ring-redi-red text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/30 dark:placeholder:text-redi-beige/30 outline-none transition-all text-sm font-normal"
                  required
                />
              </div>
            </div>

            {/* Carrera */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 block">Carrera</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-redi-vino/40 dark:text-redi-beige/40" />
                <select
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  className={`w-full h-12 pl-11 pr-4 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-xl focus:ring-2 focus:ring-redi-red outline-none transition-all appearance-none text-sm font-normal ${
                    carrera === "" ? "text-redi-vino/30 dark:text-redi-beige/30" : "text-redi-vino dark:text-redi-beige"
                  }`}
                  required
                >
                  <option value="" disabled className="text-redi-vino/30 dark:text-redi-beige/30 bg-redi-beige dark:bg-redi-vino">Selecciona tu carrera</option>
                  {mockCarreras.map((c) => (
                    <option key={c.id} value={c.nombre} className="text-black bg-redi-beige dark:bg-redi-vino dark:text-redi-beige">{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 block">Email Institucional</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-redi-vino/40 dark:text-redi-beige/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@lametro.edu.ec"
                  className="w-full h-12 pl-11 pr-4 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-xl focus:ring-2 focus:ring-redi-red text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/30 dark:placeholder:text-redi-beige/30 outline-none transition-all text-sm font-normal"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-redi-vino/50 dark:text-redi-beige/50 uppercase tracking-widest ml-1 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-redi-vino/40 dark:text-redi-beige/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full h-12 pl-11 pr-4 bg-transparent border border-redi-vino/20 dark:border-redi-beige/20 rounded-xl focus:ring-2 focus:ring-redi-red text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/30 dark:placeholder:text-redi-beige/30 outline-none transition-all text-sm font-normal"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full h-14 bg-redi-red text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-redi-red/90 transition-all active:scale-[0.98] disabled:opacity-50 mt-8 shadow-xl shadow-redi-red/20 uppercase tracking-widest text-xs"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Crear cuenta <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
