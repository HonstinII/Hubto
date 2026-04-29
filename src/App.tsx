import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CTA } from './components/CTA';
import { LanguageProvider } from './lib/i18n';
import { AuthProvider } from './lib/AuthContext';
import { Outlet } from '@tanstack/react-router';

function AppContent() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="fixed inset-0 z-0">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-100">
          <source
            src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/89e9004d716a7803fc7c9aab18c985af783f5a36.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_50%_30%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,1)_95%)]" />

      <div className="relative z-10">
        <div className="fixed-navbar fixed top-0 z-50 w-full border-b border-white/0 bg-black/70 backdrop-blur-md">
          <Navbar />
        </div>
        <Hero />
        <Features />
        <CTA />

        <footer className="w-full py-10 text-center text-sm text-zinc-400/80 backdrop-blur-sm">
          Provided by Passto Technology Limited
        </footer>
      </div>
    </div>
  );
}

export function HomePage() {
  return <AppContent />;
}

export function Root() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Outlet />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default function App() {
  return <Root />;
}
