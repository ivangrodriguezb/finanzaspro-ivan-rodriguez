import React, { useState } from 'react';
import { Transaction, Debt } from '../types';
import { getDaysInMonth, getFirstDayOfMonth, formatCurrency } from '../utils';
import { ChevronLeft, ChevronRight, X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface CalendarProps {
  transactions: Transaction[];
  debts: Debt[];
}

export const CalendarModule: React.FC<CalendarProps> = ({ transactions, debts }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Group transactions by day
  const dailyData = React.useMemo(() => {
    const map: Record<number, { income: number; expense: number; events: string[]; transactions: Transaction[] }> = {};
    
    transactions.forEach(t => {
      const tDate = new Date(t.date + 'T12:00:00'); // Fix Timezone offset issue
      if (tDate.getFullYear() === year && tDate.getMonth() === month) {
        const day = tDate.getDate();
        if (!map[day]) map[day] = { income: 0, expense: 0, events: [], transactions: [] };
        if (t.type === 'ingreso') map[day].income += t.amount;
        else map[day].expense += t.amount;
        map[day].transactions.push(t);
      }
    });

    debts.forEach(d => {
       // Check if this month has this payment day
       if(d.paymentDay) {
           // Basic check: if day exists in this month
           if(d.paymentDay <= daysInMonth) {
               const day = d.paymentDay;
               if (!map[day]) map[day] = { income: 0, expense: 0, events: [], transactions: [] };
               map[day].events.push(`Vencimiento: ${d.name}`);
           }
       }
    });

    return map;
  }, [transactions, debts, year, month, daysInMonth]);

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
    setSelectedDay(null);
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const renderDays = () => {
    const days = [];
    // Empty cells for offset
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/50"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const data = dailyData[d];
      days.push(
        <div 
            key={d} 
            onClick={() => setSelectedDay(d)}
            className="h-24 md:h-32 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-2 relative hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors group cursor-pointer"
        >
          <span className="absolute top-2 right-2 text-gray-400 dark:text-slate-500 font-bold">{d}</span>
          
          <div className="mt-6 space-y-1 text-xs">
            {data?.income > 0 && (
              <div className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/30 px-1 rounded truncate">
                +{formatCurrency(data.income)}
              </div>
            )}
            {data?.expense > 0 && (
              <div className="text-rose-600 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-900/30 px-1 rounded truncate">
                -{formatCurrency(data.expense)}
              </div>
            )}
            {data?.events.map((ev, idx) => (
                <div key={idx} className="text-amber-600 dark:text-amber-400 font-medium bg-amber-100 dark:bg-amber-900/30 px-1 rounded truncate border-l-2 border-amber-500">
                    {ev}
                </div>
            ))}
          </div>
          
          {(data?.income > 0 || data?.expense > 0) && (
              <div className="absolute bottom-2 left-2 right-2 border-t border-gray-100 dark:border-slate-700 pt-1 text-center text-xs text-gray-400 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                 {formatCurrency(data.income - data.expense)}
              </div>
          )}
        </div>
      );
    }
    return days;
  };

  const selectedData = selectedDay ? dailyData[selectedDay] : null;

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-500 dark:text-slate-300">
          <ChevronLeft />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          {monthNames[month]} {year}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-500 dark:text-slate-300">
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-slate-700 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-700">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="bg-gray-100 dark:bg-slate-900 py-3 text-center text-xs md:text-sm font-semibold text-gray-500 dark:text-slate-400">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedDay(null)}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {selectedDay} de {monthNames[month]}
                      </h3>
                      <button onClick={() => setSelectedDay(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                      {!selectedData || (selectedData.transactions.length === 0 && selectedData.events.length === 0) ? (
                          <p className="text-center text-gray-400 dark:text-slate-500 py-4">No hubo actividad este día.</p>
                      ) : (
                          <div className="space-y-4">
                              {/* Net Balance of Day */}
                              {selectedData && (selectedData.income > 0 || selectedData.expense > 0) && (
                                  <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl flex justify-between items-center mb-4">
                                      <span className="text-sm text-gray-500 dark:text-slate-400">Balance del Día</span>
                                      <span className={`font-bold ${
                                          (selectedData.income - selectedData.expense) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                      }`}>
                                          {formatCurrency(selectedData.income - selectedData.expense)}
                                      </span>
                                  </div>
                              )}

                              {/* Events / Reminders */}
                              {selectedData?.events.map((ev, i) => (
                                  <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                                      <div className="p-2 bg-amber-200 dark:bg-amber-800 rounded-full text-amber-800 dark:text-amber-200">
                                          <X size={16} className="rotate-45" /> {/* Makes a plus like icon or generic indicator */}
                                      </div>
                                      <span className="text-sm font-medium text-amber-800 dark:text-amber-200">{ev}</span>
                                  </div>
                              ))}

                              {/* Transactions List */}
                              <div className="space-y-2">
                                  {selectedData?.transactions.map(t => (
                                      <div key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-slate-700 transition-colors">
                                          <div className="flex items-center gap-3">
                                              {t.type === 'ingreso' 
                                                ? <ArrowUpCircle className="text-emerald-500" size={20} /> 
                                                : <ArrowDownCircle className="text-rose-500" size={20} />
                                              }
                                              <div>
                                                  <p className="text-sm font-bold text-gray-900 dark:text-white">{t.description || t.category}</p>
                                                  <p className="text-xs text-gray-400 dark:text-slate-500">{t.category}</p>
                                              </div>
                                          </div>
                                          <span className={`font-bold text-sm ${t.type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                              {formatCurrency(t.amount)}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};