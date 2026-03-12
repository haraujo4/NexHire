import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { Card, CardContent } from '../../../shared/components/ui/Card'
import { jobsService } from '../services/jobsService'
import { Loader2, Plus, Trash2, HelpCircle, Wand2, Sparkles } from 'lucide-react'

interface CustomField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'boolean';
    expectedAnswer: string;
}

export function JobForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = !!id

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEdit)
    const [isImprovingDescription, setIsImprovingDescription] = useState(false);
    const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
    const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [isEliminatory, setIsEliminatory] = useState(false);

    
    const [customForm, setCustomForm] = useState<CustomField[]>([]);

    useEffect(() => {
        if (isEdit) {
            const fetchJob = async () => {
                try {
                    const job = await jobsService.getById(id)
                    setTitle(job.title)
                    setLocation(job.location || '')
                    setSalaryRange(job.salaryRange || '')
                    setDescription(job.description)
                    setRequirements(job.requirements.join(', '))
                    setIsEliminatory(job.isEliminatory)
                    setCustomForm(job.customForm || []);
                } catch (error) {
                    console.error('Erro ao buscar vaga:', error)
                    toast.error('Erro ao carregar dados da vaga.')
                    navigate('/company/jobs')
                } finally {
                    setFetching(false)
                }
            }
            fetchJob()
        }
    }, [id, isEdit, navigate])

    const addField = () => {
        const newField: CustomField = {
            id: crypto.randomUUID(),
            label: '',
            type: 'text',
            expectedAnswer: ''
        };
        setCustomForm([...customForm, newField]);
    };

    const removeField = (id: string) => {
        setCustomForm(customForm.filter(f => f.id !== id));
    };

    const updateField = (id: string, updates: Partial<CustomField>) => {
        setCustomForm(customForm.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleImproveDescription = async () => {
        if (!description || description.trim().length < 10) {
            toast.error('Por favor, digite uma descrição mínima antes de solicitar a melhoria.');
            return;
        }
        setIsImprovingDescription(true);
        try {
            const data = await jobsService.improveDescription(description);
            setDescription(data.description);
        } catch (error) {
            console.error('Erro ao melhorar descrição:', error);
            toast.error('Falha ao melhorar a descrição com IA.');
        } finally {
            setIsImprovingDescription(false);
        }
    };

    const handleSuggestSkills = async () => {
        if (!description || description.trim().length < 10) {
            toast.error('Por favor, preencha a descrição da vaga primeiro para que a IA possa sugerir competências.');
            return;
        }
        setIsGeneratingSkills(true);
        try {
            const data = await jobsService.suggestSkills(description);
            const suggested = data.skills.join(', ');
            setRequirements(prev => prev ? `${prev}, ${suggested}` : suggested);
        } catch (error) {
            console.error('Erro ao sugerir skills:', error);
            toast.error('Falha ao sugerir competências com IA.');
        } finally {
            setIsGeneratingSkills(false);
        }
    };

    const handleGenerateQuestions = async () => {
        if (!description || description.trim().length < 10) {
            toast.error('Por favor, preencha a descrição da vaga primeiro.');
            return;
        }
        setIsGeneratingQuestions(true);
        try {
            const reqs = requirements.split(',').map(s => s.trim()).filter(s => s !== '');
            const data = await jobsService.generateQuestions(description, reqs);
            setCustomForm(prev => [...prev, ...data.questions]);
        } catch (error) {
            console.error('Erro ao gerar perguntas:', error);
            toast.error('Falha ao gerar perguntas com IA.');
        } finally {
            setIsGeneratingQuestions(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = {
                title,
                location,
                salaryRange,
                description,
                requirements: requirements.split(',').map(s => s.trim()).filter(s => s !== ''),
                isEliminatory,
                customForm
            }

            if (isEdit) {
                await jobsService.update(id, data)
            } else {
                await jobsService.create({ ...data, manual: true })
            }

            navigate('/company/jobs')
        } catch (error) {
            console.error('Erro ao salvar vaga:', error);
            toast.error('Falha ao salvar vaga. Tente novamente.');
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-6 pb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 px-2">
                {isEdit ? 'Editar Vaga Profissional' : 'Criar Nova Oportunidade'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                <Card className="overflow-hidden border-none shadow-lg">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                    <CardContent className="p-8 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">1</span>
                            Detalhes Principais
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Título da Posição</label>
                                <Input
                                    placeholder="Ex: Arquiteto de Software Cloud"
                                    required
                                    className="h-12 text-lg"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Local/Modelo de Trabalho</label>
                                    <Input
                                        placeholder="Híbrido - SP, Remoto, etc."
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Compensação (Opcional)</label>
                                    <Input
                                        placeholder="R$ 10.000 - R$ 15.000"
                                        value={salaryRange}
                                        onChange={(e) => setSalaryRange(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">Descrição da Vaga</label>
                                    <button
                                        type="button"
                                        onClick={handleImproveDescription}
                                        disabled={isImprovingDescription}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 transition-all disabled:opacity-50"
                                    >
                                        {isImprovingDescription ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        Melhorar com IA
                                    </button>
                                </div>
                                <textarea
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    rows={5}
                                    required
                                    placeholder="Detalhe as responsabilidades e o dia a dia..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">Competências Necessárias (Tags separadas por vírgula)</label>
                                    <button
                                        type="button"
                                        onClick={handleSuggestSkills}
                                        disabled={isGeneratingSkills}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 transition-all disabled:opacity-50"
                                    >
                                        {isGeneratingSkills ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                        Sugerir com IA
                                    </button>
                                </div>
                                <Input
                                    placeholder="Docker, Kubernetes, GCP, Java, Spring..."
                                    required
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                
                <Card className="overflow-hidden border-none shadow-lg">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">2</span>
                                Perguntas Customizadas
                            </h3>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={handleGenerateQuestions}
                                    disabled={isGeneratingQuestions}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    {isGeneratingQuestions ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-blue-500" />}
                                    Auto-Gerar com IA
                                </Button>
                                <Button type="button" onClick={addField} variant="outline" size="sm" className="flex items-center">
                                    <Plus className="w-4 h-4 mr-2" /> Adicionar Pergunta
                                </Button>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-6 bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            Use estas perguntas para coletar informações específicas. A IA usará a "Resposta Esperada" como parâmetro para julgar a compatibilidade e o critério eliminatório.
                        </p>

                        <div className="space-y-4">
                            {customForm.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                                    <p className="text-gray-400">Nenhuma pergunta customizada definida.</p>
                                </div>
                            ) : (
                                customForm.map((field, idx) => (
                                    <div key={field.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 relative group">
                                        <button
                                            type="button"
                                            onClick={() => removeField(field.id)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Pergunta {idx + 1}</label>
                                                <Input
                                                    placeholder="Digite o enunciado da pergunta..."
                                                    value={field.label}
                                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Tipo de Resposta</label>
                                                <select
                                                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={field.type}
                                                    onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                                >
                                                    <option value="text">Texto Livre</option>
                                                    <option value="number">Número</option>
                                                    <option value="boolean">Sim/Não</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Critério/Resposta Esperada (Para a IA)</label>
                                                <Input
                                                    placeholder="O que você espera ouvir?"
                                                    value={field.expectedAnswer}
                                                    onChange={(e) => updateField(field.id, { expectedAnswer: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                
                <Card className="overflow-hidden border-none shadow-lg">
                    <CardContent className="p-8">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                            <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-sm">3</span>
                            Filtro Inteligente
                        </h3>
                        <div className="flex items-start gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                            <div className="pt-1">
                                <input
                                    type="checkbox"
                                    id="isEliminatory"
                                    className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                                    checked={isEliminatory}
                                    onChange={(e) => setIsEliminatory(e.target.checked)}
                                />
                            </div>
                            <label htmlFor="isEliminatory" className="cursor-pointer">
                                <span className="block font-bold text-orange-900 mb-1">Habilitar Critério Eliminatório Automático</span>
                                <span className="block text-sm text-orange-800 leading-relaxed">
                                    Se ativado, nossa Inteligência Artificial fará uma análise imediata no momento da aplicação. Candidatos com compatibilidade
                                    <strong> abaixo de 50%</strong> ou que não atendam critérios fundamentais nas perguntas customizadas serão
                                    <strong> impedidos de concluir a candidatura</strong>.
                                </span>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                
                <div className="flex justify-end gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-xl sticky bottom-4 z-40">
                    <Button type="button" variant="ghost" className="px-8" onClick={() => navigate('/company/jobs')}>
                        Descartar
                    </Button>
                    <Button type="submit" isLoading={loading} className="px-12 py-6 h-auto text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                        {isEdit ? 'Salvar Alterações' : 'Publicar Vaga'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
