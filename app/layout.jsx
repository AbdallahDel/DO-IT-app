import Head from 'next/head';
import './globals.css';

export const metadata = {
  title: 'DO-IT',
  description: 'A fast and flexible web-based todo list app. No account required.',
  icons: {
    icon: [
      {
        url: "/logo.ico",
        href: "logo.ico",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <body>{children}</body>
    </html>
  );
}