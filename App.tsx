
import React, { useState } from 'react';
import { Step, EvaluationData, AIReport } from './types';
import StepLayout from './components/StepLayout';
import { ScoreInput } from './components/ScoreInput';
import { generatePerformanceReport } from './geminiService';

const initialData: EvaluationData = {
  employeeName: '',
  role: '',
  date: new Date().toISOString().split('T')[0],
  period: 'Últimos 30 dias',
  block1Quantity: '',
  block1Score: 0,
  block2Commitment: '',
  block2Score: 0,
  block3Teamwork: '',
  block3Score: 0,
  block4Evolution: '',
  block4Score: 0,
  commitmentText: '',
};

// Ícone de dente estilizado para representar a Odonto Prime
const ToothIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.6 3.4C17.5 2.3 16 2 14.5 2.4C13.5 2.7 12.6 3.4 12 4.3C11.4 3.4 10.5 2.7 9.5 2.4C8 2 6.5 2.3 5.4 3.4C3.8 5 3.5 7.4 4.5 9.5C5.1 10.8 6.1 12 7.5 13.5C8.9 15 10.5 16.5 11.2 21.2C11.3 21.7 11.6 22 12 22C12.4 22 12.7 21.7 12.8 21.2C13.5 16.5 15.1 15 16.5 13.5C17.9 12 18.9 10.8 19.5 9.5C20.5 7.4 20.2 5 18.6 3.4Z" fill="currentColor"/>
  </svg>
);

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.IDENTIFICATION);
  const [data, setData] = useState<EvaluationData>(initialData);
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(false);

  const updateData = (fields: Partial<EvaluationData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const next = () => {
    if (currentStep === Step.COMMITMENT) {
      processReport();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prev = () => setCurrentStep(prev => prev - 1);

  const processReport = async () => {
    setLoading(true);
    setCurrentStep(Step.REPORT);
    try {
      const result = await generatePerformanceReport(data);
      setReport(result);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Houve um erro ao gerar o feedback com IA. Tente novamente.");
      setCurrentStep(Step.COMMITMENT);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(initialData);
    setReport(null);
    setCurrentStep(Step.IDENTIFICATION);
  };

  const renderStep = () => {
    switch (currentStep) {
      case Step.IDENTIFICATION:
        return (
          <StepLayout 
            title="Identificação do Profissional" 
            description="Inicie a avaliação identificando o colaborador e o período clínico."
            onNext={next}
            isNextDisabled={!data.employeeName || !data.role}
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Colaborador</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: Dr. Roberto Mendes"
                value={data.employeeName}
                onChange={e => updateData({ employeeName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Função / Cargo na Clínica</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: Cirurgião Dentista"
                value={data.role}
                onChange={e => updateData({ role: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                <input 
                  type="date"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                  value={data.date}
                  onChange={e => updateData({ date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Período Avaliado</label>
                <input 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                  value={data.period}
                  onChange={e => updateData({ period: e.target.value })}
                />
              </div>
            </div>
          </StepLayout>
        );

      case Step.DELIVERIES:
        return (
          <StepLayout 
            title="Bloco 1 — Qualidade Clínica e Entregas" 
            description="Avaliação técnica e qualidade dos procedimentos realizados."
            onNext={next}
            onPrev={prev}
          >
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Comente sobre a excelência técnica nos procedimentos e organização do consultório..."
              value={data.block1Quantity}
              onChange={e => updateData({ block1Quantity: e.target.value })}
            />
            <ScoreInput label="Nota de Excelência Técnica" value={data.block1Score} onChange={val => updateData({ block1Score: val })} />
          </StepLayout>
        );

      case Step.ATTITUDE:
        return (
          <StepLayout 
            title="Bloco 2 — Postura e Atitude Profissional" 
            description="Comprometimento com a clínica, pontualidade e ética."
            onNext={next}
            onPrev={prev}
          >
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Fale sobre a pontualidade, cumprimento de normas e postura com pacientes..."
              value={data.block2Commitment}
              onChange={e => updateData({ block2Commitment: e.target.value })}
            />
            <ScoreInput label="Nota de Postura e Ética" value={data.block2Score} onChange={val => updateData({ block2Score: val })} />
          </StepLayout>
        );

      case Step.RELATIONSHIP:
        return (
          <StepLayout 
            title="Bloco 3 — Relacionamento Interpessoal" 
            description="Trabalho em equipe e integração com o time Odonto Prime."
            onNext={next}
            onPrev={prev}
          >
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Como é a interação com auxiliares, recepção e outros dentistas?"
              value={data.block3Teamwork}
              onChange={e => updateData({ block3Teamwork: e.target.value })}
            />
            <ScoreInput label="Nota de Trabalho em Equipe" value={data.block3Score} onChange={val => updateData({ block3Score: val })} />
          </StepLayout>
        );

      case Step.DEVELOPMENT:
        return (
          <StepLayout 
            title="Bloco 4 — Evolução Profissional" 
            description="Busca por especialização e melhoria contínua na Odonto Prime."
            onNext={next}
            onPrev={prev}
          >
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Houve evolução em novos protocolos ou técnicas cirúrgicas?"
              value={data.block4Evolution}
              onChange={e => updateData({ block4Evolution: e.target.value })}
            />
            <ScoreInput label="Nota de Crescimento Profissional" value={data.block4Score} onChange={val => updateData({ block4Score: val })} />
          </StepLayout>
        );

      case Step.COMMITMENT:
        return (
          <StepLayout 
            title="Compromisso do Profissional" 
            description="O que será aprimorado no próximo ciclo clínico?"
            onNext={next}
            onPrev={prev}
            isNextDisabled={!data.commitmentText}
          >
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: 'Me comprometo a otimizar o tempo de atendimento e iniciar a especialização em Implantes...'"
              value={data.commitmentText}
              onChange={e => updateData({ commitmentText: e.target.value })}
            />
            <p className="text-xs text-slate-400 italic">Ao prosseguir, a IA Odonto Prime consolidará o perfil profissional.</p>
          </StepLayout>
        );

      case Step.REPORT:
        if (loading) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <ToothIcon className="w-10 h-10 text-blue-600 animate-pulse absolute mb-6" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Processando Perfil Odonto Prime...</h2>
              <p className="text-slate-500">Aguarde enquanto a IA estrutura o feedback clínico.</p>
            </div>
          );
        }

        if (!report) return null;

        return (
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full">
                      <ToothIcon className="w-10 h-10 text-blue-800" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-0">Odonto Prime</h1>
                      <p className="text-xs uppercase tracking-widest opacity-80">Avaliação de Desempenho Profissional</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm uppercase tracking-widest opacity-80 mb-1">Score Clínico</div>
                    <div className="text-5xl font-black">{report.averageScore.toFixed(1)}</div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <h2 className="text-2xl font-light">{data.employeeName}</h2>
                  <p className="text-blue-100">{data.role} — {data.period}</p>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-3 gap-8 border-b border-slate-100">
                <div className="col-span-1">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Classificação</div>
                    <div className={`text-4xl font-black ${
                      report.classification === 'A' ? 'text-emerald-600' :
                      report.classification === 'B' ? 'text-blue-600' :
                      report.classification === 'C' ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      Nível {report.classification}
                    </div>
                    <div className="mt-2 text-xs font-medium text-slate-500">
                      {report.classification === 'A' ? 'Excelência Clínica' :
                       report.classification === 'B' ? 'Padrão Odonto Prime' :
                       report.classification === 'C' ? 'Em Aprimoramento' : 'Necessita Reciclagem'}
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4">Competências Chave</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                      <span className="text-slate-600 text-sm">Qualidade Clínica</span>
                      <span className="font-bold text-blue-700">{data.block1Score}/5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                      <span className="text-slate-600 text-sm">Postura Profissional</span>
                      <span className="font-bold text-blue-700">{data.block2Score}/5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                      <span className="text-slate-600 text-sm">Integração/Time</span>
                      <span className="font-bold text-blue-700">{data.block3Score}/5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                      <span className="text-slate-600 text-sm">Evolução Técnica</span>
                      <span className="font-bold text-blue-700">{data.block4Score}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 bg-slate-50/50">
                <section>
                   <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                     <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">R</span>
                     Reconhecer (Pontos de Excelência)
                   </h2>
                   <p className="text-slate-600 leading-relaxed bg-white p-5 rounded-xl border border-slate-200 shadow-sm">{report.recognition}</p>
                </section>
                <section>
                   <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                     <span className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">C</span>
                     Corrigir (Ajustes Clínicos)
                   </h2>
                   <p className="text-slate-600 leading-relaxed bg-white p-5 rounded-xl border border-slate-200 shadow-sm">{report.correction}</p>
                </section>
                <section>
                   <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                     <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">D</span>
                     Direcionar (Metas Profissionais)
                   </h2>
                   <p className="text-slate-600 leading-relaxed bg-white p-5 rounded-xl border border-slate-200 shadow-sm">{report.direction}</p>
                </section>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  Plano de Desenvolvimento Clínico
                </h2>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Ação Clínica</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Como Implementar</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Prazo</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Indicador Sucesso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.actionPlan.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 text-sm font-semibold text-slate-800">{item.action}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{item.how}</td>
                          <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">{item.deadline}</td>
                          <td className="px-4 py-4 text-sm text-blue-700 font-medium">{item.successIndicator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-50 p-8 border-t border-slate-200 flex flex-wrap gap-4 justify-between items-center print:hidden">
                <div className="text-sm text-slate-400 italic">"Padrão Odonto Prime de Excelência Profissional."</div>
                <div className="flex gap-4">
                   <button 
                    onClick={() => window.print()}
                    className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center shadow-sm"
                   >
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                     Gerar PDF
                   </button>
                   <button 
                    onClick={reset}
                    className="px-6 py-2.5 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all shadow-md active:scale-95"
                   >
                     Nova Avaliação
                   </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <header className="max-w-2xl mx-auto px-4 mb-8 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-3">
           <div className="bg-blue-700 p-2 rounded-lg shadow-blue-200 shadow-lg">
              <ToothIcon className="w-8 h-8 text-white" />
           </div>
           <div>
              <div className="text-blue-900 font-black text-xl tracking-tighter leading-none">ODONTO <span className="text-blue-500">PRIME</span></div>
              <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-400 mt-1">Avaliação de Desempenho</div>
           </div>
        </div>
        {currentStep !== Step.REPORT && (
          <div className="text-xs font-bold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            Passo {currentStep + 1} de 6
          </div>
        )}
      </header>
      
      <main>
        {renderStep()}
      </main>
      
      <footer className="max-w-2xl mx-auto px-4 mt-8 text-center text-slate-400 text-[10px] uppercase tracking-widest print:hidden">
        Avaliação de Desempenho Interna — Grupo Odonto Prime
      </footer>
    </div>
  );
};

export default App;
