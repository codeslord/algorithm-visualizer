import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Algorithm Visualizer',
  description:
    'Algorithm Visualizer is an interactive online platform that visualizes algorithms from code with beautiful glassmorphic design.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="gradient-bg min-h-screen">
        {/* Animated mesh gradient background */}
        <div className="fixed inset-0 gradient-mesh opacity-60" />
        <div className="fixed inset-0 bg-gray-950/70" />

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'glass-card',
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          }}
        />
      </body>
    </html>
  );
}
