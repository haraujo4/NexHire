import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '../../components/ui/Button'
import { Filter } from 'lucide-react'
import { api } from '../../services/api'
import { ApplicationModal } from '../../components/ApplicationModal'

export function Jobs() {
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedJob, setSelectedJob] = useState<any>(null)

    const fetchJobs = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/public/jobs'),
                api.get('/candidate/applications')
            ])

            const appliedJobIds = new Set(appsRes.data.map((app: any) => app.jobId))

            setJobs(jobsRes.data.map((job: any) => ({
                ...job,
                hasApplied: appliedJobIds.has(job.id)
            })))
        } catch (error) {
            console.error('Erro ao buscar dados:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleApplyClick = (job: any) => {
        setSelectedJob(job)
    }

    const handleApplicationSuccess = () => {
        setSelectedJob(null)
        fetchJobs()
        toast.success('Candidatura realizada com sucesso!')
    }

    if (loading) return <div>Carregando vagas...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Vagas Disponíveis</h2>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" /> Filtros
                </Button>
            </div>

            <div className="grid gap-6">
                {jobs.length === 0 ? (
                    <p className="text-gray-500">Nenhuma vaga aberta no momento.</p>
                ) : (
                    jobs.map(job => (
                        <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                    <p className="text-gray-600 mt-1">{job.company?.name || 'RhLegal'} • {job.location || 'Brasil'}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {job.isActive ? 'Ativa' : 'Encerrada'}
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={() => handleApplyClick(job)}
                                        disabled={job.hasApplied}
                                    >
                                        {job.hasApplied ? 'Inscrito' : 'Candidatar-se'}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-4 line-clamp-2">
                                {job.description}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {job.requirements?.map((req: string) => (
                                    <span key={req} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedJob && (
                <ApplicationModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onSuccess={handleApplicationSuccess}
                />
            )}
        </div>
    )
}
