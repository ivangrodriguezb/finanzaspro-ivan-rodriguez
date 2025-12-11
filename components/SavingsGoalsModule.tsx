import React, { useState, useEffect } from 'react';
import { SavingsGoal } from '../types';
import { formatCurrency, generateId } from '../utils';
import { Target, Plus, Trash2, Calendar, TrendingUp, DollarSign, PartyPopper } from 'lucide-react';

// Simple CSS-based Confetti Component
const Confetti = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex justify-center">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute animate-[fall_3s_ease-in-out_infinite]" style={{
                    left: `${Math.random() * 100}vw`,
                    top: '-10px',
                    animationDelay: `${Math.random() * 2}s`,
                    backgroundColor: ['#ffc123', '#ef4444', '#10b981', '#3b82f6'][Math.floor(Math.random() * 4)],
                    width: '10px', height: '10px',
                    borderRadius: Math.random() > 0.5 ? '50%' : '0'
                }}></div>
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

interface SavingsGoalsModuleProps {
  goals: SavingsGoal[];
  onAdd: (g: SavingsGoal) => void;
  onUpdate: (g: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

export const SavingsGoalsModule: React.FC<SavingsGoalsModuleProps> = ({ goals, onAdd, onUpdate, onDelete }) => {
  const [form, setForm] = useState<Partial<SavingsGoal>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    color: '#0ea5e9'
  });

  const [addFundsMode, setAddFundsMode] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if(showCelebration) {
        const timer = setTimeout(() => setShowCelebration(false), 5000);
        return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount || !form.deadline) return;

    onAdd({
      id: generateId(),
      name: form.name,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount) || 0,
      deadline: form.deadline,
      color: form.color || '#0ea5e9'
    });

    setForm({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: '',
      color: '#0ea5e9'
    });
  };

  const handleAddFunds = (goal: SavingsGoal) => {
    if (fundAmount <= 0) return;
    const newAmount = goal.currentAmount + fundAmount;
    
    // Check for celebration
    if (newAmount >= goal.targetAmount && goal.currentAmount < goal.targetAmount) {
        setShowCelebration(true);
    }

    onUpdate({
      ...goal,
      currentAmount: newAmount
    });
    setAddFundsMode(null);
    setFundAmount(0);
  };

  const calculateRequiredSavings = (current: number, target: number, deadlineStr: string) => {
    const remaining = target - current;
    if (remaining <= 0) return { amount: 0, label: '¡Meta completada!' };

    const today = new Date();
    const deadline = new Date(deadlineStr);
    
    // Calculate difference in months
    const months = (deadline.getFullYear() - today.getFullYear()) * 12 + (deadline.getMonth() - today.getMonth());
    
    if (months <= 0) {
        const days = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
        if (days <= 0) return { amount: remaining, label: '¡Vencida! Necesitas:' };
        return { amount: remaining / (days/7), label: 'Semanalmente:' }; 
    }

    return { amount: remaining / months, label: 'Mensualmente:' };
  };

  return (
    <div className="space-y-6 relative">
      {showCelebration && <Confetti />}
      
      {showCelebration && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center max-w-sm mx-4 shadow-2xl transform scale-100 animate-bounce-short">
                 <PartyPopper size={64} className="mx-auto text-brand-500 mb-4" />
                 <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">¡Felicidades!</h2>
                 <p className="text-gray-600 dark:text-slate-300">Has alcanzado tu meta de ahorro. ¡Tu esfuerzo ha valido la pena!</p>
                 <button 
                    onClick={() => setShowCelebration(false)}
                    className="mt-6 bg-brand-500 text-gray-900 font-bold px-6 py-2 rounded-full hover:bg-brand-400"
                 >
                     ¡Genial!
                 </button>
             </div>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none sticky top-4 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Target className="text-brand-500" />
              Nueva Meta
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Nombre de la Meta</label>
                <input 
                  type="text" required
                  placeholder="Ej. Vacaciones, Auto nuevo..."
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Monto Objetivo</label>
                <input 
                  type="number" required min="1"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                  value={form.targetAmount || ''}
                  onChange={e => setForm({...form, targetAmount: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Ahorro Inicial (Opcional)</label>
                <input 
                  type="number" min="0"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                  value={form.currentAmount || ''}
                  onChange={e => setForm({...form, currentAmount: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Fecha Límite</label>
                <input 
                  type="date" required
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                  value={form.deadline}
                  onChange={e => setForm({...form, deadline: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-bold text-gray-900 bg-brand-500 shadow-lg shadow-brand-500/30 hover:bg-brand-400 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Crear Meta
              </button>
            </form>
          </div>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          {goals.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center text-gray-400 dark:text-slate-500 transition-colors">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No tienes metas activas.</p>
              <p className="text-sm">¡Empieza definiendo un objetivo financiero hoy!</p>
            </div>
          ) : (
            goals.map(goal => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const calculation = calculateRequiredSavings(goal.currentAmount, goal.targetAmount, goal.deadline);
              
              return (
                <div key={goal.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-lg shadow-gray-200/50 dark:shadow-none hover:border-gray-300 dark:hover:border-slate-600 transition-all relative overflow-hidden">
                  {progress >= 100 && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold">
                          ¡Completada!
                      </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white">
                        <Target size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{goal.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                          <Calendar size={12} />
                          <span>Meta: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDelete(goal.id)}
                      className="text-gray-400 hover:text-rose-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-slate-400">Progreso ({progress}%)</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${progress >= 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
                      <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700/50 flex-1 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={16} className="text-emerald-500" />
                          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Esfuerzo Sugerido</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(calculation.amount)}</span>
                           <span className="text-xs text-gray-400 dark:text-slate-500">{calculation.label}</span>
                        </div>
                      </div>

                      {addFundsMode === goal.id ? (
                        <div className="flex items-center gap-2 flex-1 animate-fade-in">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                            <input 
                              type="number" 
                              autoFocus
                              placeholder="Monto"
                              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg pl-6 pr-3 py-2 text-gray-900 dark:text-white text-sm outline-none focus:border-brand-500"
                              value={fundAmount || ''}
                              onChange={e => setFundAmount(parseFloat(e.target.value))}
                            />
                          </div>
                          <button 
                            onClick={() => handleAddFunds(goal)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg"
                          >
                            <Plus size={18} />
                          </button>
                          <button 
                            onClick={() => setAddFundsMode(null)}
                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                         <button 
                            onClick={() => setAddFundsMode(goal.id)}
                            disabled={progress >= 100}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                progress >= 100 
                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 cursor-default'
                                : 'bg-brand-500 text-gray-900 hover:bg-brand-400'
                            }`}
                          >
                            {progress >= 100 ? (
                                <>¡Completada!</>
                            ) : (
                                <>
                                    <DollarSign size={16} />
                                    Abonar
                                </>
                            )}
                          </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Helper icon component for inline
const X = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);