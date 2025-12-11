import React, { useState } from 'react';
import { BookOpen, Wallet, TrendingDown, CreditCard, Target, BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react';

const ManualSection = ({ title, icon: Icon, children }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-300">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl">
                        <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white text-left">{title}</h3>
                </div>
                {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>
            
            {isOpen && (
                <div className="px-6 pb-6 pt-0 animate-fade-in text-gray-600 dark:text-slate-300 space-y-4">
                    <hr className="border-gray-100 dark:border-slate-700 mb-4" />
                    {children}
                </div>
            )}
        </div>
    );
};

export const UserManual: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-brand-500/20 rounded-full mb-4">
                    <BookOpen className="text-brand-600 dark:text-brand-400 w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manual de Usuario</h2>
                <p className="text-gray-500 dark:text-slate-400">Aprende a sacar el máximo provecho a Finanzas Pro.</p>
            </div>

            <div className="space-y-4">
                <ManualSection title="¿Cómo empiezo? (Capital Inicial)" icon={Wallet}>
                    <p>
                        En Finanzas Pro, tu saldo empieza en $0. Para registrar tu dinero actual (lo que tienes en bancos o efectivo), 
                        debes ir al módulo de <strong>Ingresos</strong> y crear un nuevo registro.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Usa la etiqueta <strong>"Capital Inicial"</strong> o "Ahorros".</li>
                        <li>Pon la fecha de hoy.</li>
                        <li>Ingresa el monto total con el que quieres arrancar.</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-500 italic">Esto establecerá tu base para empezar a descontar gastos.</p>
                </ManualSection>

                <ManualSection title="Registrando Ingresos y Gastos" icon={TrendingDown}>
                    <p>El corazón de la app. Registra cada movimiento para mantener las cuentas claras.</p>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl">
                            <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">Ingresos</h4>
                            <p className="text-sm">Salarios, ventas, regalos. Suma a tu saldo disponible.</p>
                        </div>
                        <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl">
                            <h4 className="font-bold text-rose-700 dark:text-rose-400 mb-2">Gastos</h4>
                            <p className="text-sm">Comida, transporte, arriendo. Resta de tu saldo disponible.</p>
                        </div>
                    </div>
                    <p className="mt-2">
                        <strong>Tip:</strong> Puedes crear tus propias etiquetas escribiendo el nombre y seleccionando "+ Crear Nueva Etiqueta".
                    </p>
                </ManualSection>

                <ManualSection title="Gestión de Compromisos (Deudas)" icon={CreditCard}>
                    <p>Este módulo te ayuda a no olvidar pagos y a reducir deudas.</p>
                    <ol className="list-decimal pl-5 space-y-2 mt-2">
                        <li>Registra un compromiso (ej. Tarjeta Crédito) con el monto total que debes y la fecha límite.</li>
                        <li>Cuando tengas dinero para pagar, usa el botón <strong>"Abonar / Pagar"</strong> en la tarjeta de la deuda.</li>
                        <li>El sistema <strong>automáticamente creará un Gasto</strong> por ese valor y reducirá la deuda.</li>
                    </ol>
                </ManualSection>

                <ManualSection title="Metas de Ahorro" icon={Target}>
                    <p>Define objetivos visuales para motivarte (ej. "Moto Nueva").</p>
                    <p>
                        Cuando tengas dinero extra, entra a la meta y dale a <strong>"Abonar"</strong>. 
                        Esto es un movimiento virtual para separar ese dinero mentalmente, pero sigue estando en tu saldo general hasta que lo gastes comprando la meta.
                    </p>
                </ManualSection>

                <ManualSection title="Reportes y Asesoría AI" icon={BrainCircuit}>
                    <p>
                        Usa la sección de <strong>Reportes</strong> para ver cómo te fue en el Mes, Trimestre o Año.
                        Ahí encontrarás un botón mágico para pedirle a la Inteligencia Artificial que analice SOLO ese periodo.
                    </p>
                    <p>
                        Te dirá si gastaste mucho en comida, si ahorraste lo suficiente y en qué podrías invertir ese dinero sobrante (CDT, Acciones, etc.) según el mercado actual.
                    </p>
                </ManualSection>
            </div>

            <div className="text-center pt-8 text-gray-400 text-sm">
                Hecho con corazón por Ivan Rodriguez para Barrancabermeja.
            </div>
        </div>
    );
};