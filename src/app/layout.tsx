import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'findafriend',
  description: 'Meet people around you.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
