// app/layout.tsx
// Root layout — applies global styles and fonts

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'FreezeFlow Ops',
    template: '%s | FreezeFlow Ops',
  },
  description: 'Ice block production management platform',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
