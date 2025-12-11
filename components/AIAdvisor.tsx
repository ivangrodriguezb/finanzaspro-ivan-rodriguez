import React, { useState } from 'react';
import { FinancialSummary } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { BrainCircuit, Sparkles, AlertTriangle, ShieldCheck, TrendingUp, Loader } from 'lucide-react';

interface AIAdvisorProps {
  summary: FinancialSummary;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ summary }) => {
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConsult = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFinancialAdvice(summary);
      setAdvice(data);
    } catch (err) {
      setError("No se pudo conectar con el asesor inteligente. Verifica tu API Key.");
    } finally {
      setLoading(false);
    }
  };

  if (!process.env.API_KEY) {
      return (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700 text-center shadow-lg transition-colors">
              <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Asesor AI Desactivado</h3>
              <p className="text-gray-500 dark:text-slate-400">
                  Para usar las recomendaciones de inteligencia artificial, necesitas configurar una API Key de Gemini en el entorno.
              </p>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-brand-500/20 rounded-full mb-4">
           <BrainCircuit className="text-brand-600 dark:text-brand-400 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Asesor Financiero Inteligente</h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">
          Utiliza inteligencia artificial para analizar tus finanzas actuales y recibir recomendaciones personalizadas sobre ahorro e inversión.
        </p>
        
        {!advice && !loading && (
          <button 
            onClick={handleConsult}
            className="mt-6 bg-brand-500 hover:bg-brand-400 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-brand-500/30 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Sparkles size={20} />
            Generar Análisis
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-slate-400">
          <Loader className="animate-spin mb-4 text-brand-500" size={40} />
          <p>Analizando tus patrones de gasto...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-xl text-rose-600 dark:text-rose-300 text-center">
          {error}
        </div>
      )}

      {advice && (
        <div className="space-y-6 animate-fade-in">
          {/* Analysis Card */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden transition-colors">
             <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                 <ShieldCheck className="text-emerald-500" /> Diagnóstico
             </h3>
             <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-lg">{advice.analysis}</p>
             
             {advice.alert && (
                 <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg flex gap-3">
                     <AlertTriangle className="text-amber-500 flex-shrink-0" />
                     <p className="text-amber-700 dark:text-amber-200 text-sm">{advice.alert}</p>
                 </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-none md:col-span-1 transition-colors">
                  <h4 className="text-gray-400 dark:text-slate-400 text-sm font-bold uppercase tracking-wide mb-2">Meta de Ahorro Sugerida</h4>
                  <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">{advice.savingsTarget}</div>
                  <p className="text-gray-500 dark:text-slate-500 text-xs mt-2">Basado en tu flujo de caja mensual</p>
              </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
              <TrendingUp className="text-purple-500" /> Recomendaciones de Inversión
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advice.recommendations.map((rec: any, idx: number) => (
                <div key={idx} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-none hover:border-brand-500 transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs px-2 py-1 rounded uppercase font-bold">{rec.type}</span>
                        <span className={`text-xs px-2 py-1 rounded font-bold ${
                            rec.riskLevel === 'Alto' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 
                            rec.riskLevel === 'Medio' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 
                            'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        }`}>
                            Riesgo: {rec.riskLevel}
                        </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{rec.title}</h4>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">{rec.description}</p>
                </div>
            ))}
          </div>
          
          <div className="text-center pt-8">
              <button 
                onClick={handleConsult}
                className="text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 underline text-sm transition-colors"
              >
                  Actualizar Análisis
              </button>
          </div>
        </div>
      )}
    </div>
  );
};