import type { Metadata } from 'next';
import './reset.css';

export const metadata: Metadata = {
  title: 'Testes no Next.js',
  description: 'Teste utilizando Next.js'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <body>{children}</body>
    </html>
  );
}
