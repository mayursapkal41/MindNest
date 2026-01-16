import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import FloatingParticles from './ui/FloatingParticles';

interface LayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  showParticles?: boolean;
}

const Layout = ({ children, showBackButton = false, showParticles = true }: LayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-calm relative overflow-x-hidden">
      {showParticles && <FloatingParticles />}
      
      {/* Navigation */}
      {!isHome && (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link 
              to="/"
              className="flex items-center gap-3 px-5 py-3 bg-card/80 backdrop-blur-md rounded-full shadow-soft hover:shadow-hover transition-all duration-300 group"
            >
              {showBackButton ? (
                <>
                  <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                  <span className="text-foreground font-medium hidden sm:inline">Back</span>
                </>
              ) : (
                <>
                  <Home className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium hidden sm:inline">MindNest</span>
                </>
              )}
            </Link>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
