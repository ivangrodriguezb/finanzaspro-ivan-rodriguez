export type TransactionType = 'ingreso' | 'gasto';

export interface User {
  id: string;
  username: string;
  phone?: string; // Made optional
  password?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number; // Original loan amount
  balance: number; // Remaining balance
  deadline: string; // Fecha limite de pago
  category: string; // Added Category/Tag
  interestRate?: number; // Optional
  paymentDay?: number; // Optional recurring day
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO string YYYY-MM-DD
  color: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  totalDebt: number;
  projectedSavings: number;
  upcomingPayments: Debt[];
}