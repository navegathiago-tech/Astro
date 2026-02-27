import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'AstroSoul - Mapa Astral & Alma Gêmea',
  description: 'Descubra seu destino celestial e sua alma gêmea.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${mono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent libraries from trying to overwrite fetch if it's read-only
              (function() {
                var originalFetch = window.fetch;
                try {
                  Object.defineProperty(window, 'fetch', {
                    configurable: true,
                    enumerable: true,
                    get: function() { return originalFetch; },
                    set: function(v) { console.warn('Attempted to overwrite fetch ignored'); }
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#0a0502] text-stone-200 min-h-screen selection:bg-amber-500/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
