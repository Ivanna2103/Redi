import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: 'Redi | Recursos Gráficos para La Metro',
  description: 'Explora, filtra y descarga recursos gráficos exclusivos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
