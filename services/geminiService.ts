import { FinancialSummary } from "../types";

// Accedemos directamente a la variable. Vite la inyecta gracias a la configuración en vite.config.ts
const API_KEY = process.env.API_KEY;

// Usamos el modelo gemini-2.5-flash según las últimas recomendaciones.
const MODEL_NAME = "gemini-2.5-flash";

const callGeminiAPI = async (prompt: string) => {
  if (!API_KEY) {
    throw new Error("API Key no configurada. Ve a Vercel > Settings > Environment Variables y agrega 'API_KEY'.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ 
            parts: [{ text: prompt }] 
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Error ${response.status}`;

      if (response.status === 404) {
          console.error(`Modelo ${MODEL_NAME} no encontrado.`);
          throw new Error(`El modelo de IA (${MODEL_NAME}) no está disponible. Verifica que tu API Key tenga acceso a este modelo.`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("La IA no devolvió respuesta válida.");
    }

    return JSON.parse(text);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Error de conexión con el Asesor Inteligente.");
  }
};

export const getFinancialAdvice = async (summary: FinancialSummary, userName: string = "Usuario") => {
    const prompt = `
      Actúa como un asesor financiero experto personal.
      Analiza estos datos financieros de ${userName}:
      
      - Ingresos Totales Históricos: ${summary.totalIncome}
      - Gastos Totales Históricos: ${summary.totalExpense}
      - Balance Disponible (Caja actual): ${summary.netBalance}
      - Tasa de Ahorro (Margen Libre): ${summary.savingsRate}%
      - Deuda Total Pendiente: ${summary.totalDebt}
      
      IMPORTANTE: Devuelve SOLAMENTE un objeto JSON válido con esta estructura exacta (sin markdown, sin bloques de código):
      {
        "analysis": "Un resumen de 2 frases sobre la salud financiera actual. Sé directo y empático.",
        "savingsTarget": "Un monto sugerido de ahorro mensual en formato moneda (ej. '$ 200.000 COP').",
        "recommendations": [
          { 
            "type": "Tipo (ej. CDT, ETF, Fondo, Deuda)", 
            "title": "Título corto de la recomendación", 
            "description": "Explicación breve de por qué conviene esto ahora.", 
            "riskLevel": "Bajo, Medio o Alto" 
          }
        ],
        "alert": "Si la deuda es > 40% de ingresos o el balance es negativo, pon una alerta aquí. Si no, déjalo vacío."
      }
    `;

    return await callGeminiAPI(prompt);
};

export const getPeriodReportAdvice = async (
    periodName: string,
    income: number,
    expense: number,
    topCategories: {name: string, value: number}[]
) => {
    const prompt = `
      Actúa como un analista financiero auditando el periodo: ${periodName}.
      
      Datos del periodo:
      - Ingresos: ${income}
      - Gastos: ${expense}
      - Flujo de Caja (Balance): ${income - expense}
      - Categorías donde más se gastó: ${topCategories.map(c => `${c.name} ($${c.value})`).join(', ')}

      IMPORTANTE: Devuelve SOLAMENTE un objeto JSON válido con esta estructura exacta:
      {
        "summary": "Opinión profesional sobre el desempeño en este periodo (¿fue bueno, malo, regular? ¿por qué?).",
        "expenseAnalysis": "Analiza las categorías top. ¿Son gastos necesarios o caprichos? Dame un consejo para reducir el más alto.",
        "investmentTip": "Si el flujo de caja es positivo, sugiere qué hacer con ese excedente específico. Si es negativo, sugiere cómo cubrir el déficit.",
        "actionItem": "Una sola acción concreta y realizable para aplicar en el siguiente periodo similar."
      }
    `;

    return await callGeminiAPI(prompt);
};