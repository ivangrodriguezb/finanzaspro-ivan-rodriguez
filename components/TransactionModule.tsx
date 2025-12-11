import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, generateId } from '../utils';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle, Wallet, TrendingDown, Tag } from 'lucide-react';

interface TransactionModuleProps {
  type: TransactionType;
  transactions: Transaction[];
  onAdd: (t: Transaction) => void;
  onDelete: (id: string) => void;
  availableTags: string[];
  onAddTag: (tag: string) => void;
}

export const TransactionModule: React.FC<TransactionModuleProps> = ({ 
  type, transactions, onAdd, onDelete, availableTags, onAddTag 
}) => {
  const isIncome = type === 'ingreso';
  const filteredTransactions = transactions.filter(t => t.type === type).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [form, setForm] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: 0,
    description: ''
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || form.amount <= 0) return;
    if (!form.category && !newTagInput) return;

    let finalCategory = form.category;
    
    // Handle new tag creation on submit if selected
    if (showTagInput && newTagInput) {
        finalCategory = newTagInput;
        onAddTag(newTagInput);
    }

    onAdd({
      id: generateId(),
      type: type,
      date: form.date || new Date().toISOString().split('T')[0],
      category: finalCategory || 'General',
      amount: Number(form.amount),
      description: form.description || ''
    });

    setForm({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      description: ''
    });
    setNewTagInput('');
    setShowTagInput(false);
  };

  const total = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Form Section */}
        <div className="w-full md:w-1/3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none transition-colors sticky top-4">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              {isIncome ? <ArrowUpCircle className="text-emerald-500" /> : <ArrowDownCircle className="text-rose-500" />}
              Nuevo {isIncome ? 'Ingreso' : 'Gasto'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Fecha</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors"
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Monto (COP)</label>
                <input 
                  type="number" 
                  min="0"
                  step="1"
                  required
                  placeholder="$ 0"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors font-mono"
                  value={form.amount || ''}
                  onChange={e => setForm({...form, amount: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Etiqueta / Categoría</label>
                
                {!showTagInput ? (
                    <div className="flex gap-2">
                        <select 
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors"
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
                            <option value="" disabled>Selecciona una etiqueta...</option>
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
                             className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                             value={newTagInput}
                             onChange={e => setNewTagInput(e.target.value)}
                        />
                        <button 
                            type="button" 
                            onClick={() => { setShowTagInput(false); setNewTagInput(''); }}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Descripción</label>
                <input 
                  type="text" 
                  placeholder="Detalles (ej. Almuerzo familiar)"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all shadow-lg hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 ${
                  isIncome 
                    ? 'bg-brand-500 text-gray-900 shadow-brand-500/30' 
                    : 'bg-rose-600 text-white shadow-rose-900/30'
                }`}
              >
                <Plus size={18} />
                Agregar {isIncome ? 'Ingreso' : 'Gasto'}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none flex justify-between items-center transition-colors">
             <div>
               <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">Total Registrado</p>
               <h2 className={`text-3xl font-bold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                 {formatCurrency(total)}
               </h2>
             </div>
             <div className={`p-3 rounded-full ${isIncome ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500'}`}>
               {isIncome ? <Wallet size={32} /> : <TrendingDown size={32} />}
             </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Fecha</th>
                    <th className="px-6 py-4 font-semibold">Etiqueta</th>
                    <th className="px-6 py-4 font-semibold">Descripción</th>
                    <th className="px-6 py-4 text-right font-semibold">Monto</th>
                    <th className="px-6 py-4 text-center font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-slate-500">
                        No hay transacciones registradas.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 text-gray-700 dark:text-slate-300">{t.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold uppercase ${
                            isIncome 
                              ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                          }`}>
                            <Tag size={10} />
                            {t.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-slate-400">{t.description}</td>
                        <td className={`px-6 py-4 text-right font-bold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {formatCurrency(t.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => onDelete(t.id)}
                            className="text-gray-400 hover:text-rose-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};