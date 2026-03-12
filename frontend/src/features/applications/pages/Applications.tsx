import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card'
import { Building2, Activity, ChevronDown, ChevronUp, Clock, CheckCircle2, Circle, AlertCircle, FileText, Info } from 'lucide-react'
import { applicationsService } from '../services/applicationsService'

const statusStages = [
    { key: 'applied', label: 'Candidatura' },
    { key: 'screening', label: 'Triagem' },
    { key: 'interview', label: 'Entrevista' },
    { key: 'offer', label: 'Proposta' },
    { key: 'hired', label: 'Contratação' }
];

function StatusTimeline({ currentStatus }: { currentStatus: string }) {
    if (currentStatus === 'rejected') {
        return (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                Infelizmente o processo não seguirá para as próximas fases no momento.
            </div>
        );
    }

    const currentIndex = statusStages.findIndex(s => s.key === currentStatus);

    return (
        <div className="relative flex justify-between items-start w-full py-4">
            
            <div className="absolute top-[34px] left-[10%] right-[10%] h-0.5 bg-gray-200 -z-0" />

            {statusStages.map((stage, index) => {
                const isCompleted = index < currentIndex || currentStatus === 'hired';
                const isCurrent = index === currentIndex && currentStatus !== 'hired';

                return (
                    <div key={stage.key} className="flex flex-col items-center gap-2 z-10 w-1/5 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                isCurrent ? 'bg-white border-blue-600 text-blue-600 shadow-lg shadow-blue-100' :
                                    'bg-white border-gray-300 text-gray-400'
                            }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                                isCurrent ? <Clock className="w-5 h-5 animate-pulse" /> :
                                    <Circle className="w-4 h-4 fill-current opacity-20" />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${isCompleted ? 'text-green-600' :
                                isCurrent ? 'text-blue-600' :
                                    'text-gray-400'
                            }`}>
                            {stage.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export function Applications() {
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedApp, setExpandedApp] = useState<string | null>(null)

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await applicationsService.listCandidateApplications()
                setApplications(data)
            } catch (error) {
                console.error('Erro ao buscar candidaturas:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchApplications()
    }, [])

    const statusMap: Record<string, string> = {
        'applied': 'Candidatou-se',
        'screening': 'Em análise',
        'interview': 'Entrevista',
        'offer': 'Proposta',
        'hired': 'Contratado',
        'rejected': 'Não continuou'
    }

    if (loading) return <div>Carregando candidaturas...</div>

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Minhas Candidaturas</h2>

            <div className="space-y-4">
                {applications.map(app => {
                    const isExpanded = expandedApp === app.id;

                    return (
                        <Card key={app.id} className={`transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}>
                            <div className="sm:flex sm:items-stretch">
                                <div className="flex-1 p-2">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl">{app.job?.title || 'Vaga não encontrada'}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {app.job?.company?.name || 'NexHire'}</span>
                                            <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> Atualizado: {new Date(app.updatedAt).toLocaleDateString('pt-BR')}</span>
                                        </div>

                                        <button
                                            onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                                            className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            {isExpanded ? (
                                                <><ChevronUp className="w-4 h-4" /> Ocultar Detalhes</>
                                            ) : (
                                                <><ChevronDown className="w-4 h-4" /> Ver Detalhes e Status</>
                                            )}
                                        </button>
                                    </CardContent>
                                </div>

                                <div className={`px-6 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-2 sm:w-48 rounded-r-xl transition-colors ${app.status === 'rejected' ? 'bg-red-50/50' :
                                        app.status === 'hired' ? 'bg-green-50/50' :
                                            'bg-gray-50/50'
                                    }`}>
                                    <div className="text-center">
                                        <span className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Status</span>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                app.status === 'hired' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {statusMap[app.status] || app.status}
                                        </span>
                                    </div>

                                    {app.compatibilityScore !== null && (
                                        <div className="text-center">
                                            <span className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Match IA</span>
                                            <span className={`text-2xl font-black ${app.compatibilityScore >= 70 ? 'text-green-600' :
                                                    app.compatibilityScore >= 40 ? 'text-yellow-600' :
                                                        'text-red-500'
                                                }`}>
                                                {Math.round(app.compatibilityScore)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-300">
                                    <div className="p-6 space-y-8">
                                        
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-600" /> Progresso do Processo
                                            </h4>
                                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <StatusTimeline currentStatus={app.status} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                                                    <Info className="w-4 h-4 text-indigo-600" /> Sobre a Vaga
                                                </h4>
                                                <div className="prose prose-sm max-w-none text-gray-600 bg-indigo-50/30 p-4 rounded-xl border border-indigo-100 line-clamp-6 overflow-y-auto max-h-48">
                                                    {app.job?.description || 'Nenhuma descrição disponível.'}
                                                </div>
                                            </div>

                                            
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-orange-600" /> Minhas Respostas
                                                </h4>
                                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                                    {app.formResponses && Object.keys(app.formResponses).length > 0 ? (
                                                        Object.entries(app.formResponses).map(([q, a]: [string, any]) => (
                                                            <div key={q} className="bg-orange-50/30 p-3 rounded-xl border border-orange-100">
                                                                <p className="text-[10px] font-bold text-orange-700/60 uppercase mb-1">{q}</p>
                                                                <p className="text-sm text-gray-700 font-medium">{String(a)}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center">Nenhuma resposta gravada.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}

                {applications.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">Você ainda não se candidatou a nenhuma vaga.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
