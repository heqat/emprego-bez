import { Menu, X, Briefcase, LogOut, User, Building2 } from 'lucide-react';
import { useState } from 'react';
import type { Page, UserRole } from '@/types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  userName?: string;
  userRole?: UserRole;
  companyName?: string;
  onLogout: () => void;
}

export default function Header({
  currentPage,
  onNavigate,
  isLoggedIn,
  userName,
  userRole,
  companyName,
  onLogout,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompany = userRole === 'empresa';

  const navLink = (label: string, page: Page) => (
    <button
      onClick={() => {
        onNavigate(page);
        setMenuOpen(false);
      }}
      className={`text-sm font-medium transition-colors hover:text-sky-600 ${
        currentPage === page ? 'text-sky-600' : 'text-slate-600'
      }`}
    >
      {label}
    </button>
  );

  const dashboardPage: Page = isCompany ? 'company-dashboard' : 'dashboard';
  const displayName = isCompany ? companyName || userName : userName;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:opacity-90 transition-colors ${isCompany ? 'bg-amber-600' : 'bg-sky-600'}`}>
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-800 text-sm leading-tight block">
                Bezerros Conecta
              </span>
              <span className={`font-semibold text-xs block ${isCompany ? 'text-amber-600' : 'text-sky-600'}`}>
                Empregos
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLink('Início', 'landing')}
            {navLink(isCompany ? 'Painel' : 'Vagas', dashboardPage)}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onNavigate(dashboardPage)}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  {isCompany ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  <span className="font-medium max-w-[140px] truncate">{displayName}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
                >
                  Entrar
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4">
          <button
            onClick={() => { onNavigate('landing'); setMenuOpen(false); }}
            className="text-sm font-medium text-slate-700 text-left"
          >
            Início
          </button>
          <button
            onClick={() => { onNavigate(dashboardPage); setMenuOpen(false); }}
            className="text-sm font-medium text-slate-700 text-left"
          >
            {isCompany ? 'Painel' : 'Vagas'}
          </button>
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-slate-600 font-medium truncate">{displayName}</span>
                <button
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                  className="text-sm text-red-500 text-left"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { onNavigate('login'); setMenuOpen(false); }}
                  className="text-sm font-medium text-sky-600"
                >
                  Entrar
                </button>
                <button
                  onClick={() => { onNavigate('register'); setMenuOpen(false); }}
                  className="bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
