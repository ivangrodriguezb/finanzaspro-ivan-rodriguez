import { supabase } from './supabase';
import { User, Transaction, Debt, SavingsGoal } from '../types';

export const api = {
  // --- AUTH ---
  async login(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password) // Nota: En producción usar auth real de Supabase
      .single();

    if (error || !data) return null;
    return data as User;
  },

  async register(user: Omit<User, 'id'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        username: user.username, 
        password: user.password
        // Phone removed
      }])
      .select()
      .single();

    if (error) {
        console.error("Error registro:", error);
        throw new Error(error.message);
    }
    return data as User;
  },

  // --- TRANSACTIONS ---
  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createTransaction(userId: string, transaction: Transaction): Promise<Transaction | null> {
    const { id, ...rest } = transaction; // Remove local ID if present, let DB gen it or use it
    // Map camelCase to snake_case manually or allow Supabase to handle if columns match
    // We used exact names in schema match types mostly, but let's be safe
    const payload = {
        user_id: userId,
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description
    };

    const { data, error } = await supabase.from('transactions').insert([payload]).select().single();
    if (error) { console.error(error); return null; }
    return data;
  },

  async deleteTransaction(id: string) {
    await supabase.from('transactions').delete().eq('id', id);
  },

  // --- DEBTS ---
  async getDebts(userId: string): Promise<Debt[]> {
    // We need to map DB columns (snake_case) to TS types (camelCase)
    const { data, error } = await supabase.from('debts').select('*').eq('user_id', userId);
    if (error) throw error;
    
    return (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        totalAmount: d.total_amount,
        balance: d.balance,
        deadline: d.deadline,
        category: d.category,
        interestRate: d.interest_rate,
        paymentDay: d.payment_day
    }));
  },

  async createDebt(userId: string, debt: Debt): Promise<Debt | null> {
    const payload = {
        user_id: userId,
        name: debt.name,
        total_amount: debt.totalAmount,
        balance: debt.balance,
        deadline: debt.deadline,
        category: debt.category,
        interest_rate: debt.interestRate
    };
    const { data, error } = await supabase.from('debts').insert([payload]).select().single();
    if (error) { console.error(error); return null; }
    
    // Return mapped
    return {
        id: data.id,
        name: data.name,
        totalAmount: data.total_amount,
        balance: data.balance,
        deadline: data.deadline,
        category: data.category,
        interestRate: data.interest_rate
    };
  },

  async updateDebtBalance(id: string, newBalance: number) {
    await supabase.from('debts').update({ balance: newBalance }).eq('id', id);
  },

  async deleteDebt(id: string) {
    await supabase.from('debts').delete().eq('id', id);
  },

  // --- GOALS ---
  async getGoals(userId: string): Promise<SavingsGoal[]> {
     const { data, error } = await supabase.from('savings_goals').select('*').eq('user_id', userId);
     if (error) throw error;
     return (data || []).map((g: any) => ({
         id: g.id,
         name: g.name,
         targetAmount: g.target_amount,
         currentAmount: g.current_amount,
         deadline: g.deadline,
         color: g.color
     }));
  },

  async createGoal(userId: string, goal: SavingsGoal) {
      const payload = {
          user_id: userId,
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          deadline: goal.deadline,
          color: goal.color
      };
      const { data, error } = await supabase.from('savings_goals').insert([payload]).select().single();
      if(error) return null;
      return {
          id: data.id,
          name: data.name,
          targetAmount: data.target_amount,
          currentAmount: data.current_amount,
          deadline: data.deadline,
          color: data.color
      };
  },

  async updateGoal(id: string, currentAmount: number) {
      await supabase.from('savings_goals').update({ current_amount: currentAmount }).eq('id', id);
  },

  async deleteGoal(id: string) {
      await supabase.from('savings_goals').delete().eq('id', id);
  },

  // --- TAGS ---
  async getTags(userId: string, type: 'ingreso' | 'gasto') {
      const { data } = await supabase.from('tags').select('name').eq('user_id', userId).eq('type', type);
      return (data || []).map((t: any) => t.name);
  },

  async createTag(userId: string, type: 'ingreso' | 'gasto', name: string) {
      await supabase.from('tags').insert([{ user_id: userId, type, name }]);
  }
};