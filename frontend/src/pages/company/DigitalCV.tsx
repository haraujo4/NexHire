import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { Button } from '../../components/ui/Button'
import { ArrowLeft, Mail, Phone, MapPin, Linkedin, Github, Globe, Brain, Briefcase, GraduationCap, Calendar, User, IdCard, PhoneCall } from 'lucide-react'
// @ts-ignore

export default function DigitalCV() {
    const { id: candidateId } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState<any>(null)
    const [candidate, setCandidate] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/company/candidates/${candidateId}/profile`)
                setProfile(response.data.profile)
                setCandidate(response.data.candidate)
            } catch (error) {
                console.error('Erro ao buscar currículo:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [candidateId])

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Carregando currículo...</div>
    if (!candidate) return <div className="p-8 text-center text-red-500 font-medium">Candidato não encontrado.</div>

    const social = profile?.socialLinks || {}

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Controls - Hidden on Print */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Button>
            </div>

            {/* CV Paper */}
            <div id="cv-content" className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:rounded-none min-h-[29.7cm]">
                {/* Header / Sidebar Color Block */}
                <div style={{ backgroundColor: '#0f172a', color: '#ffffff' }} className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase">{candidate.name}</h1>
                        <p style={{ color: '#60a5fa' }} className="text-lg font-bold tracking-widest uppercase">
                            {profile?.professionalInfo?.[0]?.role || 'Profissional em Transição'}
                        </p>
                    </div>

                    <div className="space-y-2 text-sm text-slate-300 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <Mail color="#3b82f6" className="w-4 h-4" /> {candidate.email}
                        </div>
                        {candidate.phone && (
                            <div className="flex items-center gap-2">
                                <Phone color="#3b82f6" className="w-4 h-4" /> {candidate.phone}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <MapPin color="#3b82f6" className="w-4 h-4" /> {candidate.location || 'Brasil'}
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Professional Summary */}
                        <section>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Brain className="w-4 h-4 text-purple-600" /> Perfil Profissional
                            </h2>
                            <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-purple-500 italic text-slate-700 leading-relaxed">
                                "{profile?.aiSummary || profile?.experience || 'Perfil profissional em elaboração.'}"
                            </div>
                        </section>

                        {/* Experience */}
                        <section>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b pb-2">
                                <Briefcase color="#2563eb" className="w-4 h-4" /> Experiência Profissional
                            </h2>
                            <div className="space-y-8">
                                {profile?.professionalInfo?.length > 0 ? (
                                    profile.professionalInfo.map((exp: any, idx: number) => (
                                        <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-blue-600 before:rounded-full after:absolute after:left-[3px] after:top-4 after:w-[2px] after:h-[calc(100%+20px)] after:bg-slate-100 last:after:hidden">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 style={{ color: '#0f172a' }} className="font-bold text-lg">{exp.role}</h3>
                                                <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">{exp.period}</span>
                                            </div>
                                            <p style={{ color: '#2563eb' }} className="font-bold text-sm mb-2">{exp.company}</p>
                                            <p style={{ color: '#475569' }} className="text-sm leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 italic text-sm">Nenhuma experiência detalhada registrada.</p>
                                )}
                            </div>
                        </section>

                        {/* Academic */}
                        <section>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b pb-2">
                                <GraduationCap color="#4f46e5" className="w-4 h-4" /> Formação Acadêmica
                            </h2>
                            <div className="space-y-6">
                                {profile?.academicInfo?.length > 0 ? (
                                    profile.academicInfo.map((edu: any, idx: number) => (
                                        <div key={idx} className="flex justify-between gap-4">
                                            <div>
                                                <h3 style={{ color: '#0f172a' }} className="font-bold">{edu.degree}</h3>
                                                <p style={{ color: '#64748b' }} className="text-sm">{edu.institution}</p>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase">{edu.year}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 italic text-sm">Nenhuma formação detalhada registrada.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-10">
                        {/* Personal Data & Documents */}
                        <section>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <User color="#2563eb" className="w-4 h-4" /> Dados Pessoais
                            </h2>
                            <div style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }} className="p-4 rounded-xl space-y-3 border">
                                {profile?.birthDate && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">Nascimento</p>
                                            <p style={{ color: '#334155' }} className="font-bold">{profile.birthDate}</p>
                                        </div>
                                    </div>
                                )}
                                {profile?.gender && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">Gênero</p>
                                            <p style={{ color: '#334155' }} className="font-bold uppercase">{profile.gender}</p>
                                        </div>
                                    </div>
                                )}
                                {profile?.cpf && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <IdCard className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">CPF</p>
                                            <p style={{ color: '#334155' }} className="font-bold">{profile.cpf}</p>
                                        </div>
                                    </div>
                                )}
                                {profile?.phone2 && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <PhoneCall className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">Tel. Alternativo</p>
                                            <p style={{ color: '#334155' }} className="font-bold">{profile.phone2}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Address */}
                        {profile?.address && (
                            <section>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin color="#2563eb" className="w-4 h-4" /> Residência
                                </h2>
                                <div className="text-sm text-slate-600 space-y-1">
                                    <p style={{ color: '#1e293b' }} className="font-bold">
                                        {profile.address.street}{profile.address.number ? `, ${profile.address.number}` : ''}
                                    </p>
                                    {profile.address.complement && <p>{profile.address.complement}</p>}
                                    <p>{profile.address.neighborhood}</p>
                                    <p>{profile.address.city} - {profile.address.state}</p>
                                    <p className="text-xs font-bold text-slate-400">{profile.address.zipCode}</p>
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        <section>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Competências</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile?.skills?.map((skill: string) => (
                                    <span key={skill} style={{ backgroundColor: '#f1f5f9', color: '#334155', borderColor: '#e2e8f0' }} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Links */}
                        {(social.linkedin || social.github || profile?.portfolioUrl) && (
                            <section>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Links & Contato</h2>
                                <div className="space-y-3">
                                    {social.linkedin && (
                                        <a href={social.linkedin} target="_blank" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                                            <Linkedin color="#2563eb" className="w-4 h-4" /> LinkedIn
                                        </a>
                                    )}
                                    {social.github && (
                                        <a href={social.github} target="_blank" className="flex items-center gap-2 text-sm text-slate-600 hover:text-gray-900 transition-colors">
                                            <Github color="#0f172a" className="w-4 h-4" /> GitHub
                                        </a>
                                    )}
                                    {profile.portfolioUrl && (
                                        <a href={profile.portfolioUrl} target="_blank" className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                                            <Globe color="#4f46e5" className="w-4 h-4" /> Portfolio
                                        </a>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* AI Insights Extra */}
                        {profile?.aiExperienceSummary && (
                            <section style={{ backgroundColor: '#eff6ff', borderColor: '#dbeafe' }} className="p-4 rounded-xl border">
                                <h2 style={{ color: '#2563eb' }} className="text-[10px] font-black uppercase tracking-widest mb-2">Insight Profissional (IA)</h2>
                                <p style={{ color: '#475569' }} className="text-xs italic leading-relaxed">"{profile.aiExperienceSummary}"</p>
                            </section>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }} className="border-t p-8 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Gerado via RhLegal • Sistema Inteligente de Recrutamento
                    </p>
                </div>
            </div>

            <style>{`
        #cv-content {
          color: #0f172a;
          background-color: #ffffff;
        }
        @media print {
          body { background: white !important; }
          .print\\\\:hidden { display: none !important; }
          .print\\\\:shadow-none { shadow: none !important; box-shadow: none !important; }
          .print\\\\:rounded-none { border-radius: 0 !important; }
          .print\\\\:p-0 { padding: 0 !important; }
          @page { margin: 1cm; size: A4; }
        }
      `}</style>
        </div>
    )
}
