import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getPeriodReportAdvice } from '../services/geminiService';
import { Sparkles, Calendar, TrendingUp, TrendingDown, AlertCircle, Loader, ArrowRight } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
}

type TimeFrame = '1M' | '3M' | '6M' | '1Y';

export const AdvancedReports: React.FC<ReportsProps> = ({ transactions }) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1M');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterDate = useMemo(() => {
    const date = new Date();
    if (timeframe === '1M') date.setMonth(date.getMonth() - 1);
    if (timeframe === '3M') date.setMonth(date.getMonth() - 3);
    if (timeframe === '6M') date.setMonth(date.getMonth() - 6);
    if (timeframe === '1Y') date.setFullYear(date.getFullYear() - 1);
    return date;
  }, [timeframe]);

  const filteredData = useMemo(() => {
    return transactions.filter(t => new Date(t.date) >= filterDate);
  }, [transactions, filterDate]);

  const stats = useMemo(() => {
    const income = filteredData.filter(t => t.type === 'ingreso').reduce((acc, t) => acc + t.amount, 0);
    const expense = filteredData.filter(t => t.type === 'gasto').reduce((acc, t) => acc + t.amount, 0);
    
    // Top Categories
    const categories: Record<string, number> = {};
    filteredData.filter(t => t.type === 'gasto').forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    const topCats = Object.entries(categories)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);

    return { income, expense, balance: income - expense, topCats };
  }, [filteredData]);

  const handleAnalyze = async () => {
    setLoading(true);
    setAiAnalysis(null);
    setError(null);
    try {
        const periodName = timeframe === '1M' ? 'Mensual' : timeframe === '3M' ? 'Trimestral' : timeframe === '6M' ? 'Semestral' : 'Anual';
        const result = await getPeriodReportAdvice(periodName, stats.income, stats.expense, stats.topCats);
        setAiAnalysis(result);
    } catch (e: any) {
        console.error(e);
        setError(e.message || "No se pudo generar el análisis.");
    } finally {
        setLoading(false);
    }
  };

  const chartData = [
      { name: 'Ingresos', value: stats.income },
      { name: 'Gastos', value: stats.expense }
  ];

  return (
    <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reportes Avanzados</h2>
                <p className="text-gray-500 dark:text-slate-400">Analiza tu comportamiento en diferentes periodos.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700 flex">
                {(['1M', '3M', '6M', '1Y'] as TimeFrame[]).map((tf) => (
                    <button
                        key={tf}
                        onClick={() => { setTimeframe(tf); setAiAnalysis(null); setError(null); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            timeframe === tf 
                            ? 'bg-brand-500 text-gray-900 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {tf === '1M' ? 'Mensual' : tf === '3M' ? 'Trimestral' : tf === '6M' ? 'Semestral' : 'Anual'}
                    </button>
                ))}
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mb-1">Ingresos del Periodo</p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.income)}</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mb-1">Gastos del Periodo</p>
                <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">{formatCurrency(stats.expense)}</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mb-1">Balance Neto</p>
                <h3 className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-brand-600 dark:text-brand-500' : 'text-rose-600'}`}>
                    {formatCurrency(stats.balance)}
                </h3>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg shadow-gray-200/50 dark:shadow-none h-80">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Comparativa Visual</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#64748b" vertical={false} opacity={0.2} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }} 
                           cursor={{fill: '#94a3b8', opacity: 0.1}}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            <Cell fill="#10b981" />
                            <Cell fill="#ef4444" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* AI Analysis Section */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 rounded-2xl border border-brand-500/20 shadow-lg shadow-brand-500/5 relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={120} />
                </div>
                
                {!aiAnalysis && !loading && !error && (
                    <div className="text-center z-10">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Análisis Inteligente</h3>
                        <p className="text-gray-500 dark:text-slate-400 mb-6">
                            Pide a la IA que revise este periodo ({timeframe === '1M' ? 'Último Mes' : timeframe === '1Y' ? 'Último Año' : 'Periodo seleccionado'}) y te diga qué mejorar.
                        </p>
                        <button 
                            onClick={handleAnalyze}
                            className="bg-brand-500 hover:bg-brand-400 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-lg shadow-brand-500/30 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                            <Sparkles size={20} />
                            Analizar este Periodo
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="text-center z-10 animate-fade-in">
                        <Loader className="animate-spin text-brand-500 mx-auto mb-4" size={32} />
                        <p className="text-gray-600 dark:text-slate-300 font-medium">Analizando tus finanzas...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center z-10 animate-fade-in">
                        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 p-4 rounded-xl mb-4">
                            <AlertCircle className="mx-auto mb-2" />
                            {error}
                        </div>
                        <button 
                            onClick={handleAnalyze}
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                )}

                {aiAnalysis && (
                    <div className="z-10 space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="text-brand-500" size={18} /> Resultados
                             </h3>
                             <button onClick={() => setAiAnalysis(null)} className="text-xs text-gray-400 hover:text-brand-500">Reset</button>
                        </div>
                        
                        <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-brand-100 dark:border-brand-900/30">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{aiAnalysis.summary}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-3 items-start">
                                <TrendingDown className="text-rose-500 mt-1 shrink-0" size={16} />
                                <div>
                                    <span className="text-xs font-bold uppercase text-gray-400">Análisis de Gastos</span>
                                    <p className="text-sm text-gray-600 dark:text-slate-300">{aiAnalysis.expenseAnalysis}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <TrendingUp className="text-emerald-500 mt-1 shrink-0" size={16} />
                                <div>
                                    <span className="text-xs font-bold uppercase text-gray-400">Oportunidad de Inversión</span>
                                    <p className="text-sm text-gray-600 dark:text-slate-300">{aiAnalysis.investmentTip}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <AlertCircle className="text-brand-500 mt-1 shrink-0" size={16} />
                                <div>
                                    <span className="text-xs font-bold uppercase text-gray-400">Acción Recomendada</span>
                                    <p className="text-sm text-gray-600 dark:text-slate-300">{aiAnalysis.actionItem}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};