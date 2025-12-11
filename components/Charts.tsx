import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Transaction } from '../types';

// Updated palette matching new theme (Gold included)
const COLORS = ['#0ea5e9', '#ef4444', '#ffc123', '#10b981', '#8b5cf6', '#ec4899', '#6366f1'];

interface ChartsProps {
  transactions: Transaction[];
}

export const IncomeVsExpenseChart: React.FC<ChartsProps> = ({ transactions }) => {
  const data = React.useMemo(() => {
    const income = transactions.filter(t => t.type === 'ingreso').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'gasto').reduce((acc, t) => acc + t.amount, 0);
    return [
      { name: 'Ingresos', amount: income },
      { name: 'Gastos', amount: expense }
    ];
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#64748b" vertical={false} opacity={0.2} />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
          cursor={{fill: '#94a3b8', opacity: 0.1}}
        />
        <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.name === 'Ingresos' ? '#10b981' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ExpenseByCategoryChart: React.FC<ChartsProps> = ({ transactions }) => {
  const data = React.useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'gasto');
    const categories: Record<string, number> = {};
    
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) return <div className="text-gray-400 dark:text-slate-500 text-center py-10">No hay datos de gastos</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const BalanceEvolutionChart: React.FC<ChartsProps> = ({ transactions }) => {
  const data = React.useMemo(() => {
    // Sort by date
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulative = 0;
    
    const points: Record<string, number> = {};
    
    // Seed initial points if needed or accumulate
    sorted.forEach(t => {
      if (t.type === 'ingreso') cumulative += t.amount;
      else cumulative -= t.amount;
      points[t.date] = cumulative;
    });

    return Object.entries(points).map(([date, amount]) => ({ date, amount }));
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffc123" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ffc123" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#64748b" vertical={false} opacity={0.2} />
        <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={(val) => val.substring(5)} />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }} />
        <Area type="monotone" dataKey="amount" stroke="#ffc123" fillOpacity={1} fill="url(#colorAmount)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};