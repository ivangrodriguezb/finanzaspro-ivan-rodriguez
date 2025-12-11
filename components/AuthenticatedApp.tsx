import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { TransactionModule } from './TransactionModule';
import { DebtModule } from './DebtModule';
import { CalendarModule } from './CalendarModule';
import { AIAdvisor } from './AIAdvisor';
import { SavingsGoalsModule } from './SavingsGoalsModule';
import { UserManual } from './UserManual';
import { AdvancedReports } from './AdvancedReports';
import { Transaction, Debt, FinancialSummary, SavingsGoal, User } from '../types';
import { api } from '../services/api';
import { Loader } from 'lucide-react';

// Default Tags (Reduced list as requested)
const DEFAULT_INCOME_TAGS = ['Salario', 'Negocio', 'Extra'];
const DEFAULT_EXPENSE_TAGS = ['Comida', 'Arriendo', 'Servicios', 'Transporte', 'Deudas'];

interface AuthenticatedAppProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  
  const [incomeTags, setIncomeTags] = useState<string[]>(DEFAULT_INCOME_TAGS);
  const [expenseTags, setExpenseTags] = useState<string[]>(DEFAULT_EXPENSE_TAGS);

  // Load Data from Supabase on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [txData, debtData, goalData, incTags, expTags] = await Promise.all([
            api.getTransactions(user.id),
            api.getDebts(user.id),
            api.getGoals(user.id),
            api.getTags(user.id, 'ingreso'),
            api.getTags(user.id, 'gasto')
        ]);
        
        setTransactions(txData);
        setDebts(debtData);
        setGoals(goalData);
        
        if (incTags.length > 0) setIncomeTags([...DEFAULT_INCOME_TAGS, ...incTags]);
        if (expTags.length > 0) setExpenseTags([...DEFAULT_EXPENSE_TAGS, ...expTags]);

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  // Logic Handlers
  const addTransaction = async (t: Transaction) => {
    // Optimistic UI update
    const tempId = t.id; 
    setTransactions(prev => [t, ...prev]);

    // DB Call
    const created = await api.createTransaction(user.id, t);
    if (created) {
        // Update with real ID from DB
        setTransactions(prev => prev.map(item => item.id === tempId ? created : item));
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    await api.deleteTransaction(id);
  };
  
  const addDebt = async (d: Debt) => {
    const tempId = d.id;
    setDebts(prev => [...prev, d]);
    const created = await api.createDebt(user.id, d);
    if(created) {
        setDebts(prev => prev.map(item => item.id === tempId ? created : item));
    }
  };

  const deleteDebt = async (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
    await api.deleteDebt(id);
  };

  const payDebt = async (debtId: string, amount: number) => {
    // 1. Find the debt
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    // 2. Reduce Debt Balance Locally
    const newBalance = debt.balance - amount;
    const updatedDebts = debts.map(d => {
        if (d.id === debtId) {
            return { ...d, balance: newBalance };
        }
        return d;
    });
    setDebts(updatedDebts);
    
    // DB Updates
    await api.updateDebtBalance(debtId, newBalance);

    // 3. Create Expense Transaction
    const newTransaction: Transaction = {
        id: Math.random().toString(), // Temp ID
        date: new Date().toISOString().split('T')[0],
        type: 'gasto',
        category: debt.category || 'Deudas',
        description: `Pago a: ${debt.name}`,
        amount: amount
    };
    
    // Re-use logic
    await addTransaction(newTransaction);
  };

  const addGoal = async (g: SavingsGoal) => {
      const tempId = g.id;
      setGoals(prev => [...prev, g]);
      const created = await api.createGoal(user.id, g);
      if(created) {
          setGoals(prev => prev.map(item => item.id === tempId ? created : item));
      }
  };

  const updateGoal = async (updated: SavingsGoal) => {
      setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
      await api.updateGoal(updated.id, updated.currentAmount);
  };

  const deleteGoal = async (id: string) => {
      setGoals(prev => prev.filter(g => g.id !== id));
      await api.deleteGoal(id);
  };

  const handleAddTag = async (type: 'ingreso' | 'gasto', tag: string) => {
    if (type === 'ingreso') {
      if (!incomeTags.includes(tag)) {
          setIncomeTags([...incomeTags, tag]);
          await api.createTag(user.id, 'ingreso', tag);
      }
    } else {
      if (!expenseTags.includes(tag)) {
          setExpenseTags([...expenseTags, tag]);
          await api.createTag(user.id, 'gasto', tag);
      }
    }
  };

  // Calculate Summary
  const summary: FinancialSummary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'ingreso').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'gasto').reduce((acc, t) => acc + t.amount, 0);
    
    // Net Balance is just Income - Expense
    const netBalance = totalIncome - totalExpense;
    
    // Savings Capacity
    const operationalBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((operationalBalance / totalIncome) * 100) : 0;
    
    const totalDebt = debts.reduce((acc, d) => acc + d.balance, 0);
    
    // Upcoming Payments
    const today = new Date();
    const upcomingPayments = debts.filter(d => {
        if (!d.deadline) return false;
        const deadlineDate = new Date(d.deadline);
        return deadlineDate.getTime() >= today.getTime();
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate, 
      totalDebt,
      projectedSavings: netBalance > 0 ? netBalance : 0,
      upcomingPayments
    };
  }, [transactions, debts]);

  const renderContent = () => {
    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader className="animate-spin text-brand-500 w-12 h-12 mx-auto" />
                    <p className="text-gray-500 dark:text-slate-400">Sincronizando tus datos...</p>
                </div>
            </div>
        );
    }

    switch(activeTab) {
      case 'dashboard': 
        return <Dashboard 
            summary={summary} 
            transactions={transactions} 
            onUpdateInitialBalance={() => {}} 
        />;
      case 'ingresos': 
        return <TransactionModule 
          type="ingreso" 
          transactions={transactions} 
          onAdd={addTransaction} 
          onDelete={deleteTransaction} 
          availableTags={incomeTags}
          onAddTag={(tag) => handleAddTag('ingreso', tag)}
        />;
      case 'gastos':
        return <TransactionModule 
          type="gasto" 
          transactions={transactions} 
          onAdd={addTransaction} 
          onDelete={deleteTransaction}
          availableTags={expenseTags}
          onAddTag={(tag) => handleAddTag('gasto', tag)}
        />;
      case 'deudas':
        // Ahora pasamos las etiquetas de gasto al módulo de deudas para que puedan crear nuevas
        return <DebtModule 
            debts={debts} 
            onAdd={addDebt} 
            onDelete={deleteDebt} 
            onPay={payDebt}
            availableTags={expenseTags}
            onAddTag={(tag) => handleAddTag('gasto', tag)}
        />;
      case 'metas':
        return <SavingsGoalsModule goals={goals} onAdd={addGoal} onUpdate={updateGoal} onDelete={deleteGoal} />;
      case 'calendario':
        return <CalendarModule transactions={transactions} debts={debts} />;
      case 'advisor':
        return <AIAdvisor summary={summary} />;
      case 'manual':
        return <UserManual />;
      case 'reportes':
        return <AdvancedReports transactions={transactions} />;
      default: 
        return <Dashboard summary={summary} transactions={transactions} onUpdateInitialBalance={() => {}} />;
    }
  };

  return (
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        transactions={transactions}
        user={user}
        onLogout={onLogout}
      >
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white capitalize transition-colors">
              {activeTab === 'advisor' ? '' : activeTab === 'metas' ? 'Metas de Ahorro' : activeTab === 'deudas' ? 'Gestión de Compromisos' : activeTab}
            </h1>
            {activeTab === 'dashboard' && (
              <p className="text-gray-500 dark:text-slate-400 mt-2 transition-colors">
                Hola {user.username}, tus datos están actualizados.
              </p>
            )}
          </div>
        </header>
        {renderContent()}
      </Layout>
  );
};