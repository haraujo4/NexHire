import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { PlusCircle, Users, Activity, Pencil, Trash2, Power, PowerOff } from 'lucide-react'
import { api } from '../../services/api'

export function JobList() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    try {
      const response = await api.get('/company/jobs')
      setJobs(response.data)
    } catch (error) {
      console.error('Erro ao buscar vagas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleToggleStatus = async (job: any) => {
    try {
      await api.put(`/company/jobs/${job.id}`, { isActive: !job.isActive })
      fetchJobs()
    } catch (error) {
      console.error('Erro ao alternar status da vaga:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta vaga permanentemente?')) {
      try {
        await api.delete(`/company/jobs/${id}`)
        fetchJobs()
      } catch (error) {
        console.error('Erro ao excluir vaga:', error)
        toast.error('Não foi possível excluir a vaga.')
      }
    }
  }

  if (loading) return <div>Carregando vagas...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Suas Vagas</h2>
        <Link to="/company/jobs/new">
          <Button className="gap-2">
            <PlusCircle className="w-5 h-5" />
            Nova Vaga
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">Você ainda não postou nenhuma vaga.</p>
            <Link to="/company/jobs/new" className="mt-4 inline-block">
              <Button variant="outline">Começar agora</Button>
            </Link>
          </Card>
        ) : (
          jobs.map(job => (
            <Card key={job.id} className="hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center p-2">
                <div className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                        {job.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {job._count?.applications || 0} candidatos</span>
                      <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Criada em {new Date(job.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </CardContent>
                </div>

                <div className="flex items-center gap-2 pr-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    title={job.isActive ? 'Desativar Vaga' : 'Ativar Vaga'}
                    onClick={() => handleToggleStatus(job)}
                  >
                    {job.isActive ? <PowerOff className="w-4 h-4 text-slate-500" /> : <Power className="w-4 h-4 text-green-600" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    title="Editar Vaga"
                    onClick={() => navigate(`/company/jobs/${job.id}/edit`)}
                  >
                    <Pencil className="w-4 h-4 text-slate-600" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 hover:bg-red-50 hover:border-red-200"
                    title="Excluir Vaga"
                    onClick={() => handleDelete(job.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>

                  <div className="w-px h-6 bg-slate-200 mx-1"></div>

                  <Link to={`/company/jobs/${job.id}/candidates`}>
                    <Button size="sm">Ver Candidatos</Button>
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
