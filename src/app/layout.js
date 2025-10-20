import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PuntaCana eSIM - Stay Connected Worldwide',
  description: 'Instant eSIM for your travels. No physical SIM needed. Global coverage with fast 5G connectivity.',
  icons: {
    icon: [
      {
        url: 'https://storage.googleapis.com/triptap/logo%20eSIM%20PC.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: 'https://storage.googleapis.com/triptap/logo%20eSIM%20PC.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: 'https://storage.googleapis.com/triptap/logo%20eSIM%20PC.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: [
      {
        url: 'https://storage.googleapis.com/triptap/logo%20eSIM%20PC.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: [
      {
        url: 'https://storage.googleapis.com/triptap/logo%20eSIM%20PC.png',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon tradicional para navegadores antiguos */}
        <link rel="icon" href="https://storage.googleapis.com/triptap/logo%20eSIM%20PC.png" type="image/png" />
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="https://storage.googleapis.com/triptap/logo%20eSIM%20PC.png" />
        {/* Para Windows */}
        <meta name="msapplication-TileImage" content="https://storage.googleapis.com/triptap/logo%20eSIM%20PC.png" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}