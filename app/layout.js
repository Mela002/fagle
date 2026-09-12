import '@/styles/globals.css';

export const metadata = {
  title: 'FáGlè | Intelligence décisionnelle agricole',
  description: 'FáGlè transforme les données du terrain en décisions agricoles plus éclairées.',
  icons: {
    icon: '/brand/fagle-emblem.png',
    apple: '/brand/fagle-emblem.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
