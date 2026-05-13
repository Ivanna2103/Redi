"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fcfcfc] font-sans items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Volver al login
        </Link>

        {submitted ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Revisa tu correo</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor revisa tu bandeja de entrada.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-sm font-bold text-black hover:underline"
            >
              Intentar con otro correo
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recuperar cuenta</h2>
              <p className="text-gray-500 text-sm">Ingresa tu correo y te enviaremos los pasos para cambiar tu contraseña.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded-2xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tu Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@estudiante.com"
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-black/10"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ENVIAR ENLACE"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
