import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '../../../shared/components/ui/Card'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { X, CheckCircle, AlertTriangle, Loader2, Sparkles, Brain, Target, ArrowRight, ChevronLeft } from 'lucide-react'
import { applicationsService } from '../services/applicationsService'

interface ApplicationModalProps {
    job: any
    onClose: () => void
    onSuccess: () => void
}

type Step = 'details' | 'form' | 'simulation' | 'success'

export function ApplicationModal({ job, onClose, onSuccess }: ApplicationModalProps) {
    const [step, setStep] = useState<Step>('details')
    const [loading, setLoading] = useState(false)
    const [evaluating, setEvaluating] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    
    const [formResponses, setFormResponses] = useState<Record<string, any>>()

    const hasCustomForm = job.customForm && job.customForm.length > 0

    const handleNextToForm = () => {
        if (hasCustomForm) {
            setStep('form')
        } else {
            startSimulation()
        }
    }

    const startSimulation = async () => {
        setStep('simulation')
        setEvaluating(true)
        setError(null)
        try {
            const data = await applicationsService.simulate({
                jobId: job.id,
                formResponses
            })
            setAnalysis(data)
        } catch (err) {
            console.error('Erro na simulação IA:', err)
            setError('Não foi possível realizar a análise automática agora.')
        } finally {
            setEvaluating(false)
        }
    }

    const handleConfirmSubmission = async () => {
        setLoading(true)
        try {
            await applicationsService.apply({
                jobId: job.id,
                formResponses
            })
            setStep('success')
            setTimeout(() => {
                onSuccess()
            }, 2000)
        } catch (err) {
            console.error('Erro ao candidatar:', err)
            toast.error('Falha ao realizar candidatura.')
        } finally {
            setLoading(false)
        }
    }

    const canProceed = analysis?.can_proceed ?? (!job.isEliminatory)

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-white overflow-hidden animate-in fade-in zoom-in duration-300 border-none shadow-2xl flex flex-col max-h-[90vh]">
                <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                <div className="p-6 sm:p-8 flex flex-col flex-1 overflow-hidden">
                    
                    <div className="flex justify-between items-start mb-6 shrink-0">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                                {job.title}
                            </h2>
                            <p className="text-gray-500 font-medium text-sm mt-1">{job.company?.name || 'NexHire'} • {job.location}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        {step === 'details' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Descrição da Vaga</h3>
                                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                                        {job.description}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Requisitos</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requirements?.map((req: string) => (
                                            <span key={req} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {job.isEliminatory && (
                                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100 text-orange-800 text-sm">
                                        <AlertTriangle className="w-5 h-5 shrink-0" />
                                        <span>Esta vaga possui <strong>critérios eliminatórios de IA</strong>.</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 'form' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-indigo-900 text-sm">Formulário da Vaga</h4>
                                        <p className="text-indigo-800 text-xs mt-1">Sua compatibilidade será analisada com base nessas respostas.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {job.customForm.map((field: any) => (
                                        <div key={field.id}>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                                            {field.type === 'boolean' ? (
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormResponses({ ...formResponses, [field.label]: "Sim" })}
                                                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border-2 ${formResponses?.[field.label] === "Sim" ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200'}`}
                                                    >
                                                        Sim
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormResponses({ ...formResponses, [field.label]: "Não" })}
                                                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border-2 ${formResponses?.[field.label] === "Não" ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200'}`}
                                                    >
                                                        Não
                                                    </button>
                                                </div>
                                            ) : (
                                                <Input
                                                    type={field.type}
                                                    placeholder="Sua resposta..."
                                                    className="h-12 rounded-xl"
                                                    value={formResponses?.[field.label] || ''}
                                                    onChange={(e) => setFormResponses({ ...formResponses, [field.label]: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 'simulation' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Brain className="w-24 h-24 text-blue-600" />
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                                        <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                                        Análise Preditiva de Perfil
                                    </h3>

                                    {evaluating ? (
                                        <div className="flex flex-col items-center py-10 text-center">
                                            <div className="relative mb-6">
                                                <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full animate-pulse" />
                                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative" />
                                            </div>
                                            <p className="text-gray-600 font-bold">Nossa IA está analisando sua compatibilidade...</p>
                                            <p className="text-xs text-gray-400 mt-2">Comparando seu perfil e respostas com a vaga via Google Gemini</p>
                                        </div>
                                    ) : analysis ? (
                                        <div className="space-y-6">
                                            
                                            <div>
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-sm font-bold text-gray-600">Índice de Aderência</span>
                                                    <span className={`text-3xl font-black ${analysis.compatibility_score >= 70 ? 'text-green-600' : analysis.compatibility_score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {analysis.compatibility_score}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner border border-gray-200">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ease-out rounded-full shadow-lg ${analysis.compatibility_score >= 70 ? 'bg-gradient-to-r from-green-400 to-green-600' : analysis.compatibility_score >= 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
                                                        style={{ width: `${analysis.compatibility_score}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                    <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                        <CheckCircle className="w-3 h-3" /> Pontos Fortes
                                                    </h4>
                                                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                                                        {analysis.strengths.slice(0, 3).map((s: string) => <li key={s}>{s}</li>)}
                                                    </ul>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                    <h4 className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                        <Target className="w-3 h-3" /> Gaps Identificados
                                                    </h4>
                                                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                                                        {analysis.weaknesses.slice(0, 3).map((w: string) => <li key={w}>{w}</li>)}
                                                    </ul>
                                                </div>
                                            </div>

                                            {!canProceed && (
                                                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-900 text-sm animate-in shake duration-500">
                                                    <X className="w-6 h-6 flex-shrink-0 text-red-600 bg-white rounded-full p-1 border border-red-200" />
                                                    <div>
                                                        <p className="font-black">Incompatibilidade Crítica</p>
                                                        <p className="opacity-80 mt-1">Nossa IA identificou que seu perfil atual não atende os requisitos mínimos eliminatórios para esta candidatura.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-amber-50 rounded-xl text-amber-800 text-sm">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Inscrição Confirmada!</h3>
                                <p className="text-gray-500 mt-2">Seus dados foram enviados com sucesso para {job.company?.name}. Boa sorte!</p>
                            </div>
                        )}
                    </div>

                    
                    <div className="pt-6 mt-6 border-t border-gray-100 flex gap-4 shrink-0">
                        {step === 'details' && (
                            <Button className="flex-1 py-6 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100" onClick={handleNextToForm}>
                                Candidatar-se <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        )}

                        {step === 'form' && (
                            <>
                                <Button variant="ghost" className="px-4" onClick={() => setStep('details')}>
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <Button className="flex-1 py-6 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100" onClick={startSimulation}>
                                    Avaliar Compatibilidade <Brain className="w-5 h-5 ml-2" />
                                </Button>
                            </>
                        )}

                        {step === 'simulation' && (
                            <>
                                <Button variant="ghost" className="px-4" onClick={() => setStep(hasCustomForm ? 'form' : 'details')} disabled={loading}>
                                    <ChevronLeft className="w-5 h-5" /> Voltar
                                </Button>
                                <Button
                                    className="flex-1 py-6 rounded-xl text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100"
                                    disabled={!canProceed || loading || evaluating}
                                    onClick={handleConfirmSubmission}
                                    isLoading={loading}
                                >
                                    Enviar Candidatura <CheckCircle className="w-5 h-5 ml-2" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}
