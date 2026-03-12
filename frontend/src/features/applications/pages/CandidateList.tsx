import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card } from '../../../shared/components/ui/Card'
import { Button } from '../../../shared/components/ui/Button'
import { MapPin, Briefcase, RefreshCw, Linkedin, Github, Globe, ChevronDown, ChevronUp, FileText, Brain } from 'lucide-react'
import { applicationsService } from '../services/applicationsService'
import { jobsService } from '../../jobs/services/jobsService'
import { candidatesService } from '../../candidates/services/candidatesService'

export function CandidateList() {
    const { id: jobId } = useParams()
    const navigate = useNavigate()
    const [applications, setApplications] = useState<any[]>([])
    const [job, setJob] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [expandedApp, setExpandedApp] = useState<string | null>(null)
    const [summarizing, setSummarizing] = useState<string | null>(null)

    const fetchApplications = async () => {
        try {
            const [appsData, jobData] = await Promise.all([
                applicationsService.listForJob(jobId!),
                jobsService.getById(jobId!)
            ])
            setApplications(appsData)
            setJob(jobData)
        } catch (error) {
            console.error('Erro ao buscar candidatos:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [jobId])

    const handleSummarize = async (candidateId: string) => {
        setSummarizing(candidateId);
        try {
            await candidatesService.summarize(candidateId);
            toast.success('Resumo gerado com sucesso!');
            fetchApplications(); 
        } catch (error: any) {
            console.error('Erro ao gerar resumo:', error);
            toast.error('Falha ao gerar resumo profissional.');
        } finally {
            setSummarizing(null);
        }
    }

    const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
        try {
            await applicationsService.updateStatus(applicationId, newStatus);
            setApplications(apps => apps.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
            toast.success('Status atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast.error('Falha ao atualizar status.');
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-gray-500 font-medium">Carregando candidatos e análises...</p>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{job?.title || 'Vaga'}</h2>
                    <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Pipeline de Talentos • {applications.length} Inscritos
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/company/jobs')}>Voltar para Vagas</Button>
            </div>

            <div className="space-y-6">
                {applications.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">Nenhum talento se candidatou a esta posição ainda.</p>
                    </div>
                ) : (
                    applications.map(app => {
                        const isExpanded = expandedApp === app.id;
                        const profile = app.candidate.profile || {};
                        const social = profile.socialLinks || {};

                        return (
                            <Card key={app.id} className={`group relative overflow-hidden transition-all duration-300 border-none shadow-sm hover:shadow-xl ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}>
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${app.compatibilityScore >= 70 ? 'bg-green-500' : app.compatibilityScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} />

                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{app.candidate.name}</h3>
                                                <span className="px-2.5 py-1 text-[10px] font-black rounded-full bg-gray-100 text-gray-500 uppercase">
                                                    ID: #{app.id.slice(0, 8)}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-gray-400" /> {app.candidate.location || 'Brasil'}
                                                </div>
                                                {social.linkedin && (
                                                    <a href={social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                                                        <Linkedin className="w-4 h-4" /> LinkedIn
                                                    </a>
                                                )}
                                                {social.github && (
                                                    <a href={social.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-gray-900 hover:underline">
                                                        <Github className="w-4 h-4" /> GitHub
                                                    </a>
                                                )}
                                                {profile.portfolioUrl && (
                                                    <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-indigo-600 hover:underline">
                                                        <Globe className="w-4 h-4" /> Portfolio
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills?.slice(0, 5).map((s: string) => (
                                                    <span key={s} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-100">
                                                        {s}
                                                    </span>
                                                ))}
                                                {profile.skills?.length > 5 && (
                                                    <span className="text-[10px] font-medium text-gray-400 self-center">+{profile.skills.length - 5}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end gap-6 w-full md:w-auto shrink-0 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                                            <div className="flex flex-col items-center md:items-end">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Brain className="w-3 h-3" /> IA Match
                                                </span>
                                                <div className={`text-4xl font-black ${app.compatibilityScore >= 70 ? 'text-green-600' : app.compatibilityScore >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                                                    {app.compatibilityScore ? `${Math.round(app.compatibilityScore)}%` : '--'}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center md:items-end flex-1 md:flex-initial">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100 uppercase'}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                                        <button
                                            onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                                            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            {isExpanded ? 'Ocultar Detalhes' : 'Ver Respostas e Perfil'}
                                        </button>

                                        <div className="flex gap-3">
                                            <Link
                                                to={`/company/cv/${app.candidateId}`}
                                                className="flex items-center gap-2 h-10 px-4 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                                            >
                                                <FileText className="w-4 h-4" /> Currículo Digital
                                            </Link>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-2 h-10 px-4 shadow-sm hover:shadow-md transition-all"
                                                onClick={() => handleSummarize(app.candidateId)}
                                                isLoading={summarizing === app.candidateId}
                                                disabled={!!summarizing}
                                            >
                                                <Brain className={`w-4 h-4 ${summarizing === app.candidateId ? 'animate-pulse text-blue-600' : 'text-blue-500'}`} />
                                                {summarizing === app.candidateId ? 'Resumindo...' : 'Resumir Perfil'}
                                            </Button>

                                            <select
                                                className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                                value={app.status}
                                                onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                            >
                                                <option value="applied">Applied</option>
                                                <option value="screening">Screening</option>
                                                <option value="interview">Interview</option>
                                                <option value="offer">Offer</option>
                                                <option value="hired">Hired</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>

                                    
                                    {isExpanded && (
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500 bg-gray-50 -mx-6 -mb-6 p-8 border-t border-gray-200">
                                            
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-blue-600" /> Respostas do Candidato
                                                </h4>
                                                <div className="space-y-4">
                                                    {app.formResponses && Object.keys(app.formResponses).length > 0 ? (
                                                        Object.entries(app.formResponses).map(([q, a]: [string, any]) => (
                                                            <div key={q} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                                                <p className="text-xs font-bold text-gray-400 mb-1">{q}</p>
                                                                <p className="text-sm text-gray-700 font-medium">{String(a)}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-xs text-gray-500 italic">Nenhuma resposta disponível.</p>
                                                    )}
                                                </div>
                                            </div>

                                            
                                            <div className="space-y-6">
                                                
                                                <div className="grid gap-4">
                                                    {profile.aiSummary && (
                                                        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 shadow-sm">
                                                            <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                                <Brain className="w-3 h-3" /> Resumo Geral (IA)
                                                            </h4>
                                                            <p className="text-sm text-gray-700 italic leading-relaxed">"{profile.aiSummary}"</p>
                                                        </div>
                                                    )}

                                                    {profile.aiExperienceSummary && (
                                                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm">
                                                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                                <Briefcase className="w-3 h-3" /> Foco Profissional (IA)
                                                            </h4>
                                                            <p className="text-sm text-gray-700 italic leading-relaxed">"{profile.aiExperienceSummary}"</p>
                                                        </div>
                                                    )}

                                                    {profile.aiAcademicSummary && (
                                                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                                                            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                                <FileText className="w-3 h-3" /> Foco Acadêmico (IA)
                                                            </h4>
                                                            <p className="text-sm text-gray-700 italic leading-relaxed">"{profile.aiAcademicSummary}"</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="w-full h-px bg-gray-200" />

                                                
                                                <div>
                                                    <h4 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4 text-blue-600" /> Experiência Declarada
                                                    </h4>
                                                    <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                        {profile.experience || 'Sem resumo cadastrado.'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-gray-500" /> Histórico Acadêmico
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {profile.academicInfo?.length > 0 ? profile.academicInfo.map((edu: any, idx: number) => (
                                                            <div key={idx} className="flex justify-between text-xs font-medium text-gray-600 bg-white p-2 px-3 rounded-lg border border-gray-100 shadow-sm">
                                                                <span>{edu.degree} @ {edu.institution}</span>
                                                                <span className="text-gray-400">{edu.year}</span>
                                                            </div>
                                                        )) : (
                                                            <p className="text-xs text-gray-400 italic">Nenhum histórico acadêmico detalhado.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
