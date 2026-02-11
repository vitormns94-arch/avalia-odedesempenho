
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationData, AIReport } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePerformanceReport = async (data: EvaluationData): Promise<AIReport> => {
  const averageScore = (data.block1Score + data.block2Score + data.block3Score + data.block4Score) / 4;
  
  let classification: 'A' | 'B' | 'C' | 'D' = 'D';
  if (averageScore >= 4.5) classification = 'A';
  else if (averageScore >= 3.5) classification = 'B';
  else if (averageScore >= 2.5) classification = 'C';

  const prompt = `
    Aja como um assistente especialista em gestão de pessoas e RH.
    Gere um feedback estruturado no formato R.C.D (Reconhecer, Corrigir, Direcionar) e um plano de ação detalhado de 30 dias focado em desenvolvimento profissional.
    
    Dados do Colaborador:
    Nome: ${data.employeeName}
    Cargo: ${data.role}
    Média Qualitativa: ${averageScore.toFixed(1)} (Classificação ${classification})
    
    Detalhes da Performance Profissional:
    - Entregas e Qualidade técnica: ${data.block1Quantity} (Nota: ${data.block1Score}/5)
    - Responsabilidade e Atitude: ${data.block2Commitment} (Nota: ${data.block2Score}/5)
    - Relacionamento e Colaboração: ${data.block3Teamwork} (Nota: ${data.block3Score}/5)
    - Evolução e Aprendizado: ${data.block4Evolution} (Nota: ${data.block4Score}/5)
    
    Compromisso declarado pelo colaborador:
    "${data.commitmentText}"
    
    REQUISITOS:
    1. O feedback RCD deve ser humanizado, focado em competências comportamentais e técnicas.
    2. O plano de ação deve ter pelo menos 3 itens que ajudem o colaborador a subir seu nível profissional.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recognition: { type: Type.STRING, description: "Pontos fortes e elogios (Reconhecer)" },
          correction: { type: Type.STRING, description: "Gaps e pontos de melhoria (Corrigir)" },
          direction: { type: Type.STRING, description: "Direcionamento de carreira (Direcionar)" },
          actionPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING },
                how: { type: Type.STRING },
                responsible: { type: Type.STRING },
                deadline: { type: Type.STRING },
                successIndicator: { type: Type.STRING }
              },
              required: ["action", "how", "responsible", "deadline", "successIndicator"]
            }
          }
        },
        required: ["recognition", "correction", "direction", "actionPlan"]
      }
    }
  });

  const aiResult = JSON.parse(response.text || '{}');

  return {
    ...aiResult,
    averageScore,
    classification
  };
};
