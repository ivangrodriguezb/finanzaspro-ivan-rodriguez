import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { BrainCircuit, CreditCard, LayoutDashboard, Target, Smartphone, Lock, User as UserIcon, ArrowRight, Twitter, Instagram, Github, X, PlayCircle, Shield, Zap, Loader, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onLogin: (user: User) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  
  // Form States
  const [formData, setFormData] = useState({ 
      username: '', 
      password: '', 
      confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Floating animation state
  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (view: 'login' | 'register') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
    setError('');
  };

  const closeModal = () => setIsAuthModalOpen(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        if (authView === 'register') {
            if (!formData.username || !formData.password) {
                throw new Error('Todos los campos son obligatorios.');
            }
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Las contraseñas no coinciden.');
            }

            const newUser = await api.register({
                username: formData.username,
                password: formData.password
            });

            if (newUser) {
                onLogin(newUser);
            }
        } else {
            // Login
            const user = await api.login(formData.username, formData.password);
            if (user) {
                onLogin(user);
            } else {
                throw new Error('Usuario o contraseña incorrectos.');
            }
        }
    } catch (err: any) {
        setError(err.message || "Ocurrió un error inesperado. Revisa tu conexión.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Navbar */}
      <nav className="fixed w-full z-40 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-gray-200 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 transform hover:rotate-12 transition-transform">
                <span className="text-gray-900 font-extrabold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Finanzas Pro</span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:text-brand-500 transition-colors hidden md:block">
                Beneficios
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium hover:text-brand-500 transition-colors hidden md:block">
                Cómo funciona
              </button>
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-800 hidden md:block"></div>
              
              <button 
                onClick={() => openModal('login')}
                className="bg-brand-500 hover:bg-brand-400 text-gray-900 px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-lg shadow-brand-500/25"
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up z-10">
            
            <div className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 px-4 py-1.5 rounded-full text-sm font-bold border border-brand-500/20">
              🚀 Datos Sincronizados en la Nube
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Tus finanzas, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-amber-600">donde vayas.</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Empieza en tu celular, continúa en tu PC. La plataforma inteligente que organiza tus ingresos y elimina el estrés financiero.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => openModal('register')}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                Comenzar Gratis <ArrowRight size={20} />
              </button>
              {/* Removed 'Ver Demo' button as requested */}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 pt-4">
               <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900"></div>
                   ))}
               </div>
               <p>Usado por +1,000 personas organizadas.</p>
            </div>
          </div>

          <div className="relative animate-fade-in z-10 hidden lg:block" style={{ transform: `translateY(${offsetY * 0.05}px)` }}>
             <div className="absolute inset-0 bg-brand-500 blur-[80px] opacity-20 rounded-full"></div>
             <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-2 transform rotate-[-2deg] hover:rotate-0 transition-all duration-500">
                 <div className="bg-gray-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 relative">
                    {/* Fixed Hero Image URL */}
                    <img 
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                        alt="Dashboard Preview" 
                        className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Balance Total</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">$ 2.450.000</p>
                        </div>
                        <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                            <Zap size={20} fill="currentColor" />
                        </div>
                    </div>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-slate-900 border-y border-gray-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Todo lo que necesitas.</h2>
                  <p className="text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">Dejamos atrás las hojas de cálculo complicadas. Finanzas Pro es simple, rápido y poderoso.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                      { icon: LayoutDashboard, title: "Dashboard Visual", desc: "Gráficos intuitivos para entender a dónde va tu dinero en segundos.", color: "text-blue-500" },
                      { icon: Target, title: "Metas de Ahorro", desc: "Define objetivos (un viaje, un auto) y sigue tu progreso visualmente.", color: "text-rose-500" },
                      { icon: BrainCircuit, title: "Asesor IA (Gemini)", desc: "Recibe consejos personalizados de inversión basados en tus datos reales.", color: "text-brand-500" },
                      { icon: CreditCard, title: "Control de Deudas", desc: "Nunca olvides un pago. Gestiona saldos pendientes y fechas límite.", color: "text-purple-500" },
                      { icon: Smartphone, title: "100% Responsive", desc: "Funciona perfecto en tu celular. Registra gastos en el momento que ocurren.", color: "text-emerald-500" },
                      { icon: Shield, title: "Datos Seguros", desc: "Tu información viaja encriptada y se almacena segura en la nube.", color: "text-amber-500" },
                  ].map((feat, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
                          <div className={`w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                              <feat.icon size={28} className={feat.color} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feat.title}</h3>
                          <p className="text-gray-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* How it Works Section (Restored Session 3) */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <div className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 px-4 py-1.5 rounded-full text-sm font-bold border border-brand-500/20 mb-4">
                  Paso a Paso
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">¿Cómo funciona?</h2>
                <p className="text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">Toma el control de tu futuro financiero en 3 pasos simples.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { step: 1, title: "Registra", desc: "Ingresa tus gastos e ingresos diarios. Toma menos de 10 segundos.", icon: CheckCircle2 },
                    { step: 2, title: "Analiza", desc: "Visualiza tus patrones de gasto en el dashboard y detecta fugas de dinero.", icon: DollarSign },
                    { step: 3, title: "Crece", desc: "Usa la IA para recibir consejos de inversión y cumplir tus metas.", icon: TrendingUp }
                ].map((item, idx) => (
                    <div key={idx} className="text-center relative group">
                        <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-gray-300 dark:border-slate-700 group-hover:border-brand-500 transition-colors">
                            <item.icon size={32} className="text-gray-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <div className="absolute top-0 right-1/3 bg-brand-500 text-gray-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                            {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-gray-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4 relative overflow-hidden bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-gray-900 font-extrabold text-lg">F</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">Finanzas Pro</span>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">
                      Tu compañero financiero inteligente. Simple, seguro y siempre contigo.
                  </p>
                  <div className="flex gap-4 text-gray-400">
                      <Twitter size={20} className="hover:text-brand-500 cursor-pointer transition-colors" />
                      <Instagram size={20} className="hover:text-brand-500 cursor-pointer transition-colors" />
                      <Github size={20} className="hover:text-brand-500 cursor-pointer transition-colors" />
                  </div>
              </div>
              
              <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">Producto</h4>
                  <ul className="space-y-2 text-sm text-gray-500 dark:text-slate-400">
                      <li className="hover:text-brand-500 cursor-pointer">Dashboard</li>
                      <li className="hover:text-brand-500 cursor-pointer">Metas</li>
                      <li className="hover:text-brand-500 cursor-pointer">Asesor IA</li>
                  </ul>
              </div>

               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">Compañía</h4>
                  <ul className="space-y-2 text-sm text-gray-500 dark:text-slate-400">
                      <li className="hover:text-brand-500 cursor-pointer">Sobre Nosotros</li>
                      <li className="hover:text-brand-500 cursor-pointer">Blog</li>
                      <li className="hover:text-brand-500 cursor-pointer">Carreras</li>
                  </ul>
              </div>

               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-gray-500 dark:text-slate-400">
                      <li className="hover:text-brand-500 cursor-pointer">Privacidad</li>
                      <li className="hover:text-brand-500 cursor-pointer">Términos</li>
                      <li className="hover:text-brand-500 cursor-pointer">Seguridad</li>
                  </ul>
              </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-800 pt-8 text-center">
               <p className="text-sm text-gray-400">© 2024 Finanzas Pro. Todos los derechos reservados.</p>
          </div>
      </section>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-gray-200 dark:border-slate-700">
            <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
                <X size={20} />
            </button>
            
            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {authView === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                    </h2>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                        {authView === 'login' ? 'Ingresa tus datos para continuar.' : 'Es rápido, fácil y seguro.'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Usuario</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text"
                                required
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                                placeholder="Tu nombre de usuario"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Phone Field Removed Here */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="password"
                                required
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    {authView === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Confirmar Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 text-sm rounded-lg text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-500 hover:bg-brand-400 text-gray-900 font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all transform active:scale-95 flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : (authView === 'login' ? 'Ingresar' : 'Registrarse')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        {authView === 'login' ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                        <button 
                            onClick={() => openModal(authView === 'login' ? 'register' : 'login')}
                            className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                        >
                            {authView === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                        </button>
                    </p>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};