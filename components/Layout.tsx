import React, { useState } from 'react';
import { LayoutDashboard, Wallet, TrendingDown, Calendar, CreditCard, BrainCircuit, Menu, X, Target, Moon, Sun, Search, ArrowUpCircle, ArrowDownCircle, LogOut, User, BookOpen, BarChart3 } from 'lucide-react';
import { Transaction, User as UserType } from '../types';
import { formatCurrency } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  transactions: Transaction[];
  user: UserType;
  onLogout: () => void;
}

const NavItem = ({ id, label, icon: Icon, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      active 
        ? 'bg-brand-500 text-gray-900 shadow-lg shadow-brand-500/20' 
        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    <Icon size={20} className={active ? "text-gray-900" : ""} />
    <span>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, isDarkMode, toggleTheme, 
  searchTerm, setSearchTerm, transactions, user, onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ingresos', label: 'Ingresos', icon: Wallet },
    { id: 'gastos', label: 'Gastos', icon: TrendingDown },
    { id: 'deudas', label: 'Compromisos', icon: CreditCard },
    { id: 'metas', label: 'Metas Ahorro', icon: Target },
    { id: 'reportes', label: 'Reportes & AI', icon: BarChart3 },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'manual', label: 'Manual de Uso', icon: BookOpen },
    { id: 'advisor', label: 'Asesor General', icon: BrainCircuit },
  ];

  const filteredResults = searchTerm.length > 1 
    ? transactions.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5) // Limit to 5 results
    : [];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-200 overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-4 transition-colors duration-300 z-20">
        <div className="flex items-center space-x-2 px-4 py-4 mb-6">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
            <span className="text-gray-900 font-extrabold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Finanzas Pro</span>
        </div>
        
        <div className="px-4 mb-6">
            <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center gap-3 border border-gray-100 dark:border-slate-700">
                <div className="bg-gray-200 dark:bg-slate-700 p-2 rounded-full">
                    <User size={16} />
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate text-gray-900 dark:text-white">{user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">Plan Gratuito</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
          {menuItems.map((item) => (
            <NavItem 
              key={item.id} 
              {...item} 
              active={activeTab === item.id} 
              onClick={setActiveTab} 
            />
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between px-2 gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-sm font-bold"
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navigation Bar (Mobile & Search) */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 transition-colors duration-300 relative z-30">
           
           {/* Mobile Menu Toggle */}
           <div className="md:hidden flex items-center space-x-2">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-900 dark:text-white p-2">
                {isMobileMenuOpen ? <X /> : <Menu />}
             </button>
             <span className="text-lg font-bold text-gray-900 dark:text-white">Finanzas Pro</span>
           </div>

           {/* Search Bar */}
           <div className="hidden md:block flex-1 max-w-xl mx-auto relative">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar transacciones..."
                  className="w-full bg-gray-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             {/* Search Results Dropdown */}
             {searchTerm.length > 1 && (
               <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
                 {filteredResults.length > 0 ? (
                   <ul>
                     {filteredResults.map(t => (
                       <li key={t.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 flex justify-between items-center border-b border-gray-50 dark:border-slate-700/50 last:border-0 cursor-default">
                         <div className="flex items-center gap-3">
                           {t.type === 'ingreso' ? <ArrowUpCircle size={16} className="text-emerald-500" /> : <ArrowDownCircle size={16} className="text-rose-500" />}
                           <div>
                             <p className="text-sm font-bold text-gray-900 dark:text-white">{t.description}</p>
                             <p className="text-xs text-gray-500 dark:text-slate-400">{t.date} • {t.category}</p>
                           </div>
                         </div>
                         <span className={`text-sm font-bold ${t.type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {formatCurrency(t.amount)}
                         </span>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <div className="p-4 text-center text-sm text-gray-500 dark:text-slate-400">
                     No se encontraron resultados
                   </div>
                 )}
               </div>
             )}
           </div>

           {/* Mobile Controls */}
           <div className="md:hidden flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-slate-300">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={onLogout} className="p-2 text-rose-500">
                  <LogOut size={20} />
              </button>
           </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-gray-50 dark:bg-slate-950 pt-20 px-4 transition-colors flex flex-col">
            <div className="mb-6 p-4 bg-gray-100 dark:bg-slate-900 rounded-xl flex items-center gap-3">
                 <div className="bg-brand-500 text-gray-900 p-2 rounded-full">
                    <User size={20} />
                </div>
                <div>
                    <p className="font-bold text-gray-900 dark:text-white">{user.username}</p>
                    {/* Phone Display Removed */}
                </div>
            </div>
            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => (
                <NavItem 
                  key={item.id} 
                  {...item} 
                  active={activeTab === item.id} 
                  onClick={(id: string) => {
                    setActiveTab(id);
                    setIsMobileMenuOpen(false);
                  }} 
                />
              ))}
            </nav>
            <button 
                onClick={onLogout}
                className="w-full py-4 mt-4 text-rose-500 font-bold border-t border-gray-200 dark:border-slate-800 flex items-center justify-center gap-2"
            >
                <LogOut size={20} /> Cerrar Sesión
            </button>
          </div>
        )}

        {/* Main Content Scrollable */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};