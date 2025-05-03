import type { Metadata } from 'next';
import { Roboto } from 'next/font/google'; // Import Roboto
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

// Configure Roboto font
const roboto = Roboto({
  weight: ['400', '500', '700'], // Load desired weights
  subsets: ['latin'],
  variable: '--font-roboto', // Optional: define a CSS variable
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Clean Hands Tracker', // Updated title
  description: 'Registro de Higiene das Mãos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR"> {/* Set language to Portuguese */}
      <body className={`${roboto.variable} font-sans antialiased`}> {/* Use Roboto font */}
        <div className="flex flex-col min-h-screen">
          {/* Header and Footer will be part of the page content for this simple app */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster /> {/* Add Toaster for notifications */}
        </div>
      </body>
    </html>
  );
}
