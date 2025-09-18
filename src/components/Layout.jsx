import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Layers,
  Rocket,
  FileText,
  Menu,
  X,
  Sparkles,
  FileText as Template,
  Zap
} from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import LanguageSwitcher from './LanguageSwitcher';
import { createPageUrl } from '@/utils';

const getNavigationItems = (t) => [
  {
    title: t('common.dashboard'),
    url: createPageUrl("dashboard"),
    icon: BarChart3
  },
  {
    title: t('common.projects'),
    url: createPageUrl("projects"),
    icon: Layers
  },
  {
    title: t('common.phases'),
    url: createPageUrl("phases"),
    icon: Rocket
  },
  {
    title: t('common.tasks'),
    url: createPageUrl("tasks"),
    icon: FileText
  },
  {
    title: t('common.templates'),
    url: createPageUrl("templates"),
    icon: Template
  },
  {
    title: "Agent Studio",
    url: createPageUrl("agent-studio"),
    icon: Zap
  },
  {
    title: "Aura Builder",
    url: "/aura-templates",
    icon: Sparkles
  }
];

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  
  const navigationItems = getNavigationItems(t);

  return (
    <div className="min-h-screen w-full">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 liquid-glass transition-all duration-300" style={{ height: 'var(--header-h)' }}>
        <div className="flex items-center justify-between h-full px-4 lg:px-6 xl:px-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Aura
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 xl:space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url || 
                (item.url === '/aura-templates' && 
                 (location.pathname.startsWith('/aura-templates') || 
                  location.pathname.startsWith('/builder') || 
                  location.pathname.startsWith('/preview')));
              
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 glass-button
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 shadow-lg backdrop-blur-sm border border-purple-200/30' 
                      : 'text-gray-600 hover:bg-white/30 hover:text-gray-900 hover:shadow-md hover:backdrop-blur-sm'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-3 lg:space-x-4">
            <LanguageSwitcher />
            <button
              className="md:hidden glass-button p-2 rounded-lg transition-all duration-300 hover:bg-white/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: mobileMenuOpen ? 1 : 0, 
          y: mobileMenuOpen ? 0 : -20 
        }}
        transition={{ duration: 0.3 }}
        className={`md:hidden fixed left-0 right-0 z-40 liquid-glass border-b border-white/10 ${mobileMenuOpen ? 'block' : 'hidden'}`}
        style={{ top: 'var(--header-h)' }}
      >
        <nav className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 glass-button w-full
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 shadow-lg backdrop-blur-sm border border-purple-200/30' 
                      : 'text-gray-600 hover:bg-white/30 hover:text-gray-900 hover:shadow-md hover:backdrop-blur-sm'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
        </nav>
      </motion.div>

      <main
        id="main-scroll-container"
        className="min-h-[calc(100dvh-var(--header-h))] pt-[var(--header-h)] overflow-y-auto transition-all duration-300"
      >
        {/* اجعل ارتفاع المحتوى مرنًا داخل الحاوية القابلة للتمرير */}
        <div className="min-h-0">{children}</div>
      </main>

      <div className="pointer-events-none fixed inset-0 -z-10">
        <AnimatedBackground />
      </div>
    </div>
  );
};

export default Layout;