import React, { useState } from 'react';
import { Debt } from '../types';
import { formatCurrency, generateId } from '../utils';
import { Trash2, AlertTriangle, CheckCircle, Info, HelpCircle, CalendarClock, DollarSign, X, Tag } from 'lucide-react';

interface DebtModuleProps {
  debts: Debt[];
  onAdd: (d: Debt) => void;
  onDelete: (id: string) => void;
  onPay: (debtId: string, amount: number) => void;
  availableTags: string[];
  onAddTag: (tag: string) => void;
}

export const DebtModule: React.FC<DebtModuleProps> = ({ debts, onAdd, onDelete, onPay, availableTags, onAddTag }) => {
  const [form, setForm] = useState<Partial<Debt>>({
    name: '',
    totalAmount: 0,
    balance: 0,
    deadline: '',
    interestRate: 0,
    category: ''
  });

  // Tag Management
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Payment Modal State
  const [paymentMode, setPaymentMode] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.totalAmount || !form.name) return;

    let finalCategory = form.category;
    
    // Handle new tag creation on submit if selected
    if (showTagInput && newTagInput) {
        finalCategory = newTagInput;
        onAddTag(newTagInput);
    }

    onAdd({
      id: generateId(),
      name: form.name,
      totalAmount: Number(form.totalAmount),
      balance: form.balance !== undefined ? Number(form.balance) : Number(form.totalAmount),
      deadline: form.deadline || new Date().toISOString().split('T')[0],
      category: finalCategory || 'Otro',
      interestRate: Number(form.interestRate) || 0,
    });

    setForm({
        name: '',
        totalAmount: 0,
        balance: 0,
        deadline: '',
        interestRate: 0,
        category: ''
    });
    setNewTagInput('');
    setShowTagInput(false);
  };

  const handlePay = (debtId: string) => {
    if(paymentAmount <= 0) return;
    onPay(debtId, paymentAmount);
    setPaymentMode(null);
    setPaymentAmount(0);
  };

  const totalDebt = debts.reduce((acc, d) => acc + d.balance, 0);

  return (
    <div className="space-y-6">
        {/* Help Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 flex items-start gap-3">
            <Info className="text-blue-500 shrink-0 mt-1" />
            <div>
                <h4 className="font-bold text-blue-800 dark:text-blue-200">Gestión de Compromisos</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                   Registra servicios públicos, pagos de guardería, gasolina y deudas.
                   <br/>
                   Usa el botón <strong>"Abonar"</strong> para registrar el pago y descontarlo de tu capital.
                </p>
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg shadow-gray-200/50 dark:shadow-none transition-colors">
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">Total por Pagar</p>
                <h3 className="text-2xl font-bold text-rose-500 mt-1">{formatCurrency(totalDebt)}</h3>
             </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg shadow-gray-200/50 dark:shadow-none transition-colors">
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">Compromisos Activos</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{debts.filter(d => d.balance > 0).length}</h3>
             </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg shadow-gray-200/50 dark:shadow-none transition-colors">
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">Estado General</p>
                <div className="flex items-center gap-2 mt-1">
                    {totalDebt > 0 ? (
                        <>
                            <AlertTriangle className="text-amber-500" />
                            <span className="text-amber-500 font-bold">Pendientes</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="text-emerald-500" />
                            <span className="text-emerald-500 font-bold">¡Todo al día!</span>
                        </>
                    )}
                </div>
             </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none sticky top-4 transition-colors">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Nuevo Compromiso / Servicio</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-500 dark:text-slate-400">Nombre</label>
                        <input 
                            type="text" required
                            placeholder="Ej. Recibo de la Luz, Gasolina mes..."
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white mt-1 outline-none focus:border-brand-500"
                            value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500 dark:text-slate-400">Categoría</label>
                         {!showTagInput ? (
                            <div className="flex gap-2">
                                <select 
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white mt-1 outline-none focus:border-brand-500"
                                    value={form.category} 
                                    onChange={e => {
                                        if(e.target.value === 'NEW') {
                                            setShowTagInput(true);
                                            setForm({...form, category: ''});
                                        } else {
                                            setForm({...form, category: e.target.value});
                                        }
                                    }}
                                >
                                    <option value="" disabled>Selecciona tipo...</option>
                                    {availableTags.map(c => <option key={c} value={c}>{c}</option>)}
                                    <option value="NEW" className="font-bold text-brand-600">+ Crear Nueva Etiqueta</option>
                                </select>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input 
                                     type="text"
                                     autoFocus
                                     placeholder="Nombre de nueva etiqueta..."
                                     className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white mt-1 focus:ring-2 focus:ring-brand-500 outline-none"
                                     value={newTagInput}
                                     onChange={e => setNewTagInput(e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => { setShowTagInput(false); setNewTagInput(''); }}
                                    className="p-2 mt-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="text-sm text-gray-500 dark:text-slate-400 flex items-center justify-between">
                            Monto Total
                            <span title="Total a pagar">
                                <HelpCircle size={14} className="text-gray-400" />
                            </span>
                        </label>
                        <input 
                            type="number" required min="0"
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white mt-1 outline-none focus:border-brand-500"
                            value={form.totalAmount || ''} onChange={e => setForm({...form, totalAmount: parseFloat(e.target.value)})}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500 dark:text-slate-400 flex items-center justify-between">
                            Saldo Actual (Lo que debes hoy)
                        </label>
                        <input 
                            type="number" required min="0"
                            placeholder="Si es nuevo, igual al monto total"
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white mt-1 outline-none focus:border-brand-500"
                            value={form.balance === 0 ? '' : form.balance} 
                            onChange={e => setForm({...form, balance: parseFloat(e.target.value)})}
                        />
                    </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-500 dark:text-slate-400">Fecha Límite</label>
                            <input 
                                type="date" required
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white mt-1 outline-none focus:border-brand-500"
                                value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="text-sm text-gray-500 dark:text-slate-400">Interés % (Opc.)</label>
                            <input 
                                type="number" min="0" step="0.1"
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white mt-1 outline-none focus:border-brand-500"
                                value={form.interestRate || ''} onChange={e => setForm({...form, interestRate: parseFloat(e.target.value)})}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-rose-900/50 transition-all">
                        Guardar Compromiso
                    </button>
                </form>
             </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {debts.map(debt => {
                const daysLeft = Math.ceil((new Date(debt.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                const isPaid = debt.balance <= 0;

                return (
                <div key={debt.id} className={`bg-white dark:bg-slate-800 rounded-2xl border ${isPaid ? 'border-emerald-200 dark:border-emerald-800' : 'border-gray-100 dark:border-slate-700'} p-6 relative group overflow-hidden shadow-sm hover:shadow-lg transition-all`}>
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => onDelete(debt.id)} className="text-gray-400 hover:text-rose-500 bg-white dark:bg-slate-800 rounded-full p-1 shadow">
                            <Trash2 size={18} />
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
                                    {debt.category || 'Varios'}
                                </span>
                                {(debt.interestRate || 0) > 0 && <span className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 px-2 py-0.5 rounded-full">{debt.interestRate}% EA</span>}
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                {debt.name}
                            </h4>
                            {!isPaid && (
                                <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 mt-1">
                                    <CalendarClock size={14} />
                                    <span>Vence: {new Date(debt.deadline).toLocaleDateString()}</span>
                                    <span className="text-xs font-bold">({daysLeft} días)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-gray-500 dark:text-slate-400 text-sm">Saldo Pendiente</span>
                            <span className={`font-bold text-2xl ${isPaid ? 'text-emerald-500' : 'text-rose-600 dark:text-rose-400'}`}>
                                {isPaid ? '¡PAGADO!' : formatCurrency(debt.balance)}
                            </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5">
                            <div 
                                className={`h-2.5 rounded-full transition-all duration-1000 ${isPaid ? 'bg-emerald-500' : 'bg-brand-500'}`}
                                style={{ width: `${debt.totalAmount > 0 ? ((debt.totalAmount - debt.balance) / debt.totalAmount) * 100 : 0}%` }}
                            ></div>
                        </div>
                        
                        {/* Action Buttons */}
                        {!isPaid && (
                            <div className="pt-2">
                                {paymentMode === debt.id ? (
                                    <div className="flex items-center gap-2 animate-fade-in">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                                            <input 
                                                type="number" 
                                                autoFocus
                                                placeholder="Monto a abonar"
                                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg pl-6 pr-3 py-2 text-gray-900 dark:text-white text-sm outline-none focus:border-brand-500"
                                                value={paymentAmount || ''}
                                                onChange={e => setPaymentAmount(parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <button 
                                            onClick={() => handlePay(debt.id)}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg"
                                            title="Confirmar Abono"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMode(null)}
                                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setPaymentMode(debt.id)}
                                        className="w-full py-2 bg-brand-500 hover:bg-brand-400 text-gray-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <DollarSign size={18} />
                                        Abonar / Pagar
                                    </button>
                                )}
                                <p className="text-[10px] text-center text-gray-400 mt-2">
                                    Al abonar, el dinero se descontará de tu capital general.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                );
            })}
            {debts.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400 dark:text-slate-500 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
                    No tienes compromisos registrados.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};