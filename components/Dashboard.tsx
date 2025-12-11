import React, { useState } from 'react';
import { FinancialSummary, Transaction } from '../types';
import { formatCurrency } from '../utils';
import { IncomeVsExpenseChart, ExpenseByCategoryChart, BalanceEvolutionChart } from './Charts';
import { Wallet, TrendingDown, PiggyBank, DollarSign, Edit2, Check, AlertCircle, CalendarClock, HelpCircle } from 'lucide-react';

interface DashboardProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  onUpdateInitialBalance: (amount: number) => void;
}

const StatCard = ({ label, value, icon: Icon, colorClass, subtext, tooltip }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all relative">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-20`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      {tooltip && (
          <div className="text-gray-400 cursor-help" title={tooltip}>
              <HelpCircle size={16} />
          </div>
      )}
    </div>
    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
    <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{label}</p>
    {subtext && <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">{subtext}</p>}
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ summary, transactions }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Alerts Section (Upcoming Payments) */}
      {summary.upcomingPayments.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-4">
             <CalendarClock className="text-amber-600 dark:text-amber-400 mt-1" />
             <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-200">Próximos Vencimientos (Compromisos)</h4>
                <ul className="mt-2 space-y-1">
                    {summary.upcomingPayments.map(d => {
                        const daysLeft = Math.ceil((new Date(d.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        return (
                          <li key={d.id} className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                              <span>• <strong>{d.name}</strong> ({d.category}) vence el <strong>{new Date(d.deadline).toLocaleDateString()}</strong></span>
                              <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded-full">
                                  {daysLeft > 0 ? `Restan ${daysLeft} días` : '¡Vence hoy!'}
                              </span>
                          </li>
                        );
                    })}
                </ul>
             </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Net Balance Card */}
        <StatCard 
          label="Saldo Actual Disponible" 
          value={formatCurrency(summary.netBalance)} 
          icon={DollarSign} 
          colorClass="bg-brand-500 text-brand-600 dark:text-brand-500"
          subtext="Total Ingresos - Total Gastos"
        />

        <StatCard 
          label="Ingresos Históricos" 
          value={formatCurrency(summary.totalIncome)} 
          icon={Wallet} 
          colorClass="bg-emerald-500 text-emerald-600 dark:text-emerald-400" 
        />
        <StatCard 
          label="Gastos Históricos" 
          value={formatCurrency(summary.totalExpense)} 
          icon={TrendingDown} 
          colorClass="bg-rose-500 text-rose-600 dark:text-rose-400" 
        />
        <StatCard 
          label="Margen Libre" 
          value={`${summary.savingsRate}%`} 
          icon={PiggyBank} 
          colorClass="bg-purple-500 text-purple-600 dark:text-purple-400" 
          tooltip="Es el porcentaje de tus ingresos que te queda libre después de gastos."
          subtext="De cada $100 que ganas, esto te queda."
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg shadow-gray-200/50 dark:shadow-none transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Ingresos vs Gastos</h3>
          <IncomeVsExpenseChart transactions={transactions} />
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg shadow-gray-200/50 dark:shadow-none transition-colors">
           <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Gastos por Categoría</h3>
           <ExpenseByCategoryChart transactions={transactions} />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg shadow-gray-200/50 dark:shadow-none transition-colors lg:col-span-2">
           <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Evolución de tu Capital</h3>
           <BalanceEvolutionChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
};