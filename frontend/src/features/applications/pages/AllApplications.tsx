import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { Card } from '../../../shared/components/ui/Card'
import { Briefcase, MapPin, Search } from 'lucide-react'
import { jobsService } from '../../jobs/services/jobsService'
import { applicationsService } from '../services/applicationsService'

export function AllApplications() {
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                
                const jobsData = await jobsService.list()
                const jobIds = jobsData.map((j: any) => j.id)

                
                const allAppsData = await Promise.all(
                    jobIds.map((id: string) => applicationsService.listForJob(id))
                )

                const flattened = allAppsData.flat()
                setApplications(flattened.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
            } catch (error) {
                console.error('Erro ao buscar todos os candidatos:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
        try {
            await applicationsService.updateStatus(applicationId, newStatus);
            setApplications(apps => apps.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast.error('Falha ao atualizar status.');
        }
    }

    if (loading) return <div>Carregando todos os candidatos...</div>

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Todos os Candidatos</h2>
                <p className="text-gray-600">Visualização geral de todos os inscritos em suas vagas</p>
            </div>

            <div className="space-y-4">
                {applications.length === 0 ? (
                    <Card className="p-12 text-center text-gray-500">
                        Nenhum candidato encontrado em nenhuma vaga.
                    </Card>
                ) : (
                    applications.map(app => (
                        <Card key={app.id} className="hover:shadow-md transition-shadow">
                            <div className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                                        {app.candidate.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{app.candidate.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {app.job?.title || 'Vaga'}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {app.candidate.location || 'Brasil'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right flex flex-col items-end">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                                        <select
                                            className="px-2 py-1 rounded-lg text-xs font-bold border border-gray-200 bg-white text-blue-800 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                                    <Link to={`/company/jobs/${app.job?.id}/candidates`}>
                                        <Search className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
