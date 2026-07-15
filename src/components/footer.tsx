"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAuth = pathname.startsWith('/auth');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuth) return null;

  return (
    <footer className={`w-full bg-redi-beige dark:bg-redi-vino text-redi-vino dark:text-redi-beige pt-16 pb-8 px-6 md:px-12 mt-auto border-t border-redi-vino/10 dark:border-redi-beige/25 transition-colors duration-300 ${isHome ? 'md:ml-64 md:w-[calc(100%-16rem)]' : ''}`}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 mb-16">
        
        {/* Logo Columna y Social */}
        <div className="lg:w-1/4 flex flex-col gap-6 items-start">
          <div className="flex flex-col gap-2 items-start">
            <Link href="https://redi.framer.media/">
              <div 
                className="w-[80px] h-[31px] bg-redi-vino dark:bg-redi-beige"
                style={{
                  maskImage: 'url(/redi-logo.svg)',
                  WebkitMaskImage: 'url(/redi-logo.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                  WebkitMaskPosition: 'left center'
                }}
                aria-label="Redi Logo"
              />
            </Link>
            <div className="mt-1">
              <div 
                className="w-[95px] h-[32px] bg-redi-vino dark:bg-redi-beige opacity-80"
                style={{
                  maskImage: 'url(https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/LA-METRO.png)',
                  WebkitMaskImage: 'url(https://gaevhcrlpvophttdwnmh.supabase.co/storage/v1/object/public/recursos/LA-METRO.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                  WebkitMaskPosition: 'left center'
                }}
                aria-label="La Metro Logo"
              />
            </div>
          </div>
          
          <div className="flex gap-5">
            <Link href="https://www.instagram.com/lametro.design/" target="_blank" rel="noopener noreferrer" className="text-redi-vino/60 dark:text-redi-beige/60 hover:text-redi-red dark:hover:text-redi-red transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="https://www.facebook.com/lametro.design" target="_blank" rel="noopener noreferrer" className="text-redi-vino/60 dark:text-redi-beige/60 hover:text-redi-red dark:hover:text-redi-red transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </Link>

            <Link href="https://www.tiktok.com/@lametro.design?lang=es" target="_blank" rel="noopener noreferrer" className="text-redi-vino/60 dark:text-redi-beige/60 hover:text-redi-red dark:hover:text-redi-red transition-colors" aria-label="TikTok">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </Link>
            <Link href="https://mx.pinterest.com/lametrodesign/_created/" target="_blank" rel="noopener noreferrer" className="text-redi-vino/60 dark:text-redi-beige/60 hover:text-redi-red dark:hover:text-redi-red transition-colors" aria-label="Pinterest">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.181 0 7.424 2.979 7.424 6.945 0 4.156-2.618 7.502-6.257 7.502-1.22 0-2.37-.633-2.762-1.385l-.752 2.868c-.272 1.038-.999 2.336-1.488 3.13 1.155.352 2.376.541 3.642.541 6.621 0 11.988-5.367 11.988-11.988 0-6.62-5.367-11.987-11.988-11.987z"/></svg>
            </Link>
          </div>
        </div>

        {/* Recursos Columna */}
        <div className="lg:w-1/6 space-y-5">
          <h4 className="text-sm font-bold">Recursos</h4>
          <ul className="space-y-4 text-[13px] font-medium opacity-80">
            <li><Link href="/?categoria=Fuentes" className="hover:underline underline-offset-4">Fuentes</Link></li>
            <li><Link href="/?categoria=Mock ups" className="hover:underline underline-offset-4">Mockups</Link></li>
            <li><Link href="/?categoria=Ilustraciones" className="hover:underline underline-offset-4">Vectores</Link></li>
            <li><Link href="/?categoria=3D" className="hover:underline underline-offset-4">Modelos 3D</Link></li>
            <li><Link href="/?categoria=Fotos" className="hover:underline underline-offset-4">Imágenes</Link></li>
          </ul>
        </div>

        {/* Plataforma Columna */}
        <div className="lg:w-1/6 space-y-5">
          <h4 className="text-sm font-bold">Plataforma</h4>
          <ul className="space-y-4 text-[13px] font-medium opacity-80">
            <li><Link href="/perfil" className="hover:underline underline-offset-4">Mi Perfil</Link></li>
            {user && (user.email === 'ivannanicolet2103@gmail.com' || user.email === 'redi@lametro.edu.ec') && (
              <li><Link href="/admin" className="hover:underline underline-offset-4">Subir un recurso</Link></li>
            )}
          </ul>
        </div>

        {/* Message Box */}
        <div className="lg:w-1/3 space-y-4">
          <h4 className="text-sm font-bold">Déjanos un mensaje</h4>
          <p className="text-xs font-medium opacity-80">¿Tienes dudas o sugerencias? Escríbenos.</p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <textarea 
              placeholder="Escribe tu mensaje aquí..." 
              className="w-full p-4 bg-transparent border border-redi-vino/20 dark:border-redi-beige/35 rounded-2xl focus:ring-2 focus:ring-redi-red outline-none transition-all font-medium text-sm text-redi-vino dark:text-redi-beige placeholder:text-redi-vino/50 dark:placeholder:text-redi-beige/50 min-h-[100px] resize-y"
              required
            ></textarea>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-redi-red text-white text-[10px] font-bold rounded-xl hover:bg-redi-red/90 shadow-lg shadow-redi-red/20 transition-all tracking-widest uppercase self-start"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Legal Bar */}
      <div className="max-w-7xl mx-auto border-t border-redi-vino/10 dark:border-redi-beige/25 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xs font-medium opacity-70">
          © {new Date().getFullYear()} Redi La Metro. Todos los derechos reservados.
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-xs font-medium opacity-80">
          <Link href="/privacidad" className="hover:underline underline-offset-4">
            Política de privacidad
          </Link>
          <Link href="/terminos" className="hover:underline underline-offset-4">
            Términos y condiciones
          </Link>
          <Link href="/licencias" className="hover:underline underline-offset-4">
            Licencias
          </Link>
        </div>
      </div>
    </footer>
  );
}
