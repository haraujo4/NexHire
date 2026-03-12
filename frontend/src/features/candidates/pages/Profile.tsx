import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card'
import { candidatesService } from '../services/candidatesService'
import { Plus, Trash2, Globe, Linkedin, Github, FileText, Brain, Upload, X, User, Calendar, MapPin, Hash, Phone } from 'lucide-react'
import { maskCPF, formatPhone, maskDate, maskCEP } from '../../../shared/utils/masks'

export function Profile() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [success, setSuccess] = useState(false)

    
    const [fullName, setFullName] = useState('')
    const [skills, setSkills] = useState('')
    const [experienceSummary, setExperienceSummary] = useState('')
    const [educationSummary, setEducationSummary] = useState('')

    
    const [academicInfo, setAcademicInfo] = useState<any[]>([])
    const [professionalInfo, setProfessionalInfo] = useState<any[]>([])
    const [socialLinks, setSocialLinks] = useState({ linkedin: '', github: '' })
    const [portfolioUrl, setPortfolioUrl] = useState('')

    
    const [birthDate, setBirthDate] = useState('')
    const [cpf, setCpf] = useState('')
    const [phone2, setPhone2] = useState('')
    const [gender, setGender] = useState('')
    const [address, setAddress] = useState({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
    })

    
    const [isExtracting, setIsExtracting] = useState(false)
    const [extractedData, setExtractedData] = useState<any>(null)
    const [showReviewModal, setShowReviewModal] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await candidatesService.getCandidateSelfProfile()
                const profile = data.profile || {}
                const candidate = data.candidate || {}
                setFullName(candidate.name || '')
                setSkills(profile.skills?.join(', ') || '')
                setExperienceSummary(profile.experience || '')
                setEducationSummary(profile.education || '')
                setAcademicInfo(profile.academicInfo || [])
                setProfessionalInfo(profile.professionalInfo || [])
                setSocialLinks(profile.socialLinks || { linkedin: '', github: '' })
                setPortfolioUrl(profile.portfolioUrl || '')

                
                setBirthDate(profile.birthDate || '')
                setCpf(profile.cpf || '')
                setPhone2(profile.phone2 || '')
                setGender(profile.gender || '')
                setAddress(profile.address || {
                    street: '',
                    number: '',
                    complement: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    zipCode: ''
                })
            } catch (error) {
                console.error('Erro ao buscar perfil:', error)
            } finally {
                setFetching(false)
            }
        }
        fetchProfile()
    }, [])

    const addAcademicField = () => {
        setAcademicInfo([...academicInfo, { institution: '', degree: '', year: '' }])
    }

    const removeAcademicField = (index: number) => {
        setAcademicInfo(academicInfo.filter((_, i) => i !== index))
    }

    const addProfessionalField = () => {
        setProfessionalInfo([...professionalInfo, { company: '', role: '', period: '', description: '' }])
    }

    const removeProfessionalField = (index: number) => {
        setProfessionalInfo(professionalInfo.filter((_, i) => i !== index))
    }

    const handleImportCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsExtracting(true)
        const formData = new FormData()
        formData.append('cv', file)

        try {
            const data = await candidatesService.extractCV(formData)
            setExtractedData(data)
            setShowReviewModal(true)
        } catch (error) {
            console.error('Erro ao processar currículo:', error)
            alert('Falha ao extrair dados do currículo. Tente novamente.')
        } finally {
            setIsExtracting(false)
            e.target.value = '' 
        }
    }

    const confirmExtractedData = () => {
        if (!extractedData) return

        if (extractedData.name) setFullName(extractedData.name)
        setSkills(extractedData.skills?.join(', ') || '')
        setExperienceSummary(extractedData.experience || '')
        setEducationSummary(extractedData.education || '')
        setAcademicInfo(extractedData.academicInfo || [])
        setProfessionalInfo(extractedData.professionalInfo || [])
        setSocialLinks(extractedData.socialLinks || { linkedin: '', github: '' })
        setPortfolioUrl(extractedData.portfolioUrl || '')

        
        setBirthDate(extractedData.birthDate ? maskDate(extractedData.birthDate) : '')
        setCpf(extractedData.cpf ? maskCPF(extractedData.cpf) : '')
        setPhone2(extractedData.phone2 ? formatPhone(extractedData.phone2) : '')
        setGender(extractedData.gender || '')
        setAddress({
            ...(extractedData.address || {
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                zipCode: ''
            }),
            zipCode: extractedData.address?.zipCode ? maskCEP(extractedData.address.zipCode) : ''
        })

        setShowReviewModal(false)
        setExtractedData(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await candidatesService.updateSelfProfile({
                name: fullName,
                skills: skills.split(',').map(s => s.trim()).filter(s => s),
                experience: experienceSummary,
                education: educationSummary,
                academicInfo,
                professionalInfo,
                socialLinks,
                portfolioUrl,
                birthDate,
                cpf,
                phone2,
                gender,
                address
            })
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error) {
            console.error('Erro ao salvar perfil:', error)
            toast.error('Falha ao salvar perfil.')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Carregando seu perfil...</span>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Meu Perfil Profissional</h2>
                    <p className="mt-2 text-gray-600">Complete suas informações para que nossa IA encontre as melhores oportunidades para você.</p>
                </div>
                {success && (
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium animate-bounce border border-green-100">
                        ✓ Salvo com sucesso!
                    </div>
                )}
            </div>

            
            <Card className="mb-8 border-2 border-blue-100 bg-blue-50/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain className="w-24 h-24 text-blue-600" />
                </div>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Preenchimento Automático com IA</h3>
                                <p className="text-sm text-gray-600">Importe seu currículo em PDF ou DOCX e nossa IA preencherá seu perfil automaticamente.</p>
                            </div>
                        </div>
                        <div className="shrink-0 text-center">
                            <input
                                type="file"
                                id="cv-upload"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={handleImportCV}
                                disabled={isExtracting}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 font-bold h-12 px-8 flex items-center gap-2"
                                onClick={() => document.getElementById('cv-upload')?.click()}
                                disabled={isExtracting}
                            >
                                {isExtracting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        Analisando...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Selecionar Currículo
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" /> Dados Pessoais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <User className="w-4 h-4" /> Nome Completo
                            </label>
                            <Input
                                placeholder="Seu nome completo"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Data de Nascimento
                            </label>
                            <Input
                                type="text"
                                placeholder="DD/MM/AAAA"
                                value={birthDate}
                                onChange={(e) => setBirthDate(maskDate(e.target.value))}
                                maxLength={10}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <Hash className="w-4 h-4" /> CPF
                            </label>
                            <Input
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={(e) => setCpf(maskCPF(e.target.value))}
                                maxLength={14}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Telefone Secundário
                            </label>
                            <Input
                                placeholder="(00) 00000-0000"
                                value={phone2}
                                onChange={(e) => setPhone2(formatPhone(e.target.value))}
                                maxLength={15}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <User className="w-4 h-4" /> Gênero
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Não informado">Não informado / Outro</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" /> Endereço Residencial
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Logradouro / Rua</label>
                            <Input
                                placeholder="Rua, Avenida, etc."
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Número</label>
                            <Input
                                placeholder="123"
                                value={address.number}
                                onChange={(e) => setAddress({ ...address, number: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Complemento</label>
                            <Input
                                placeholder="Apto, Bloco, etc."
                                value={address.complement}
                                onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bairro</label>
                            <Input
                                placeholder="Centro"
                                value={address.neighborhood}
                                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">CEP</label>
                            <Input
                                placeholder="00000-000"
                                value={address.zipCode}
                                onChange={(e) => setAddress({ ...address, zipCode: maskCEP(e.target.value) })}
                                maxLength={9}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cidade</label>
                            <Input
                                placeholder="Sua Cidade"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado (UF)</label>
                            <Input
                                placeholder="Ex: SP"
                                maxLength={2}
                                value={address.state}
                                onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl">Resumo e Competências</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Habilidades (Tags separadas por vírgula)</label>
                            <Input
                                placeholder="Ex: React, Node.js, Inglês, Gestão de Equipes..."
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resumo Profissional (IA usará isso como base)</label>
                            <textarea
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                rows={4}
                                value={experienceSummary}
                                onChange={(e) => setExperienceSummary(e.target.value)}
                                placeholder="Uma breve descrição sobre sua trajetória e momento atual..."
                            ></textarea>
                        </div>
                    </CardContent>
                </Card>

                
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xl text-gray-800">Trajetória Profissional</CardTitle>
                        <Button type="button" onClick={addProfessionalField} variant="outline" size="sm" className="flex items-center">
                            <Plus className="w-4 h-4 mr-1" /> Adicionar
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {professionalInfo.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <p className="text-gray-500 text-sm">Nenhuma experiência adicionada. Clique em Adicionar.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {professionalInfo.map((item, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-xl relative group border border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => removeProfessionalField(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Input
                                                placeholder="Empresa"
                                                value={item.company}
                                                onChange={(e) => {
                                                    const newInfo = [...professionalInfo];
                                                    newInfo[index].company = e.target.value;
                                                    setProfessionalInfo(newInfo);
                                                }}
                                            />
                                            <Input
                                                placeholder="Cargo"
                                                value={item.role}
                                                onChange={(e) => {
                                                    const newInfo = [...professionalInfo];
                                                    newInfo[index].role = e.target.value;
                                                    setProfessionalInfo(newInfo);
                                                }}
                                            />
                                        </div>
                                        <Input
                                            placeholder="Período (Ex: 2020 - Atual)"
                                            value={item.period}
                                            className="mb-4"
                                            onChange={(e) => {
                                                const newInfo = [...professionalInfo];
                                                newInfo[index].period = e.target.value;
                                                setProfessionalInfo(newInfo);
                                            }}
                                        />
                                        <textarea
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            rows={2}
                                            placeholder="Breve descrição das atividades..."
                                            value={item.description}
                                            onChange={(e) => {
                                                const newInfo = [...professionalInfo];
                                                newInfo[index].description = e.target.value;
                                                setProfessionalInfo(newInfo);
                                            }}
                                        ></textarea>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xl text-gray-800">Formação Acadêmica</CardTitle>
                        <Button type="button" onClick={addAcademicField} variant="outline" size="sm" className="flex items-center">
                            <Plus className="w-4 h-4 mr-1" /> Adicionar
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {academicInfo.map((item, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <Input
                                            placeholder="Instituição"
                                            value={item.institution}
                                            onChange={(e) => {
                                                const newInfo = [...academicInfo];
                                                newInfo[index].institution = e.target.value;
                                                setAcademicInfo(newInfo);
                                            }}
                                        />
                                        <Input
                                            placeholder="Curso / Grau"
                                            value={item.degree}
                                            onChange={(e) => {
                                                const newInfo = [...academicInfo];
                                                newInfo[index].degree = e.target.value;
                                                setAcademicInfo(newInfo);
                                            }}
                                        />
                                        <Input
                                            placeholder="Ano de Conclusão"
                                            value={item.year}
                                            onChange={(e) => {
                                                const newInfo = [...academicInfo];
                                                newInfo[index].year = e.target.value;
                                                setAcademicInfo(newInfo);
                                            }}
                                        />
                                    </div>
                                    <Button type="button" onClick={() => removeAcademicField(index)} variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 px-2 h-10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl">Presença Digital</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-1.5 italic">
                                <Linkedin className="w-4 h-4 mr-2 text-blue-600" /> LinkedIn (URL completa)
                            </label>
                            <Input
                                placeholder="https://linkedin.com/in/perfil"
                                value={socialLinks.linkedin}
                                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-1.5 italic">
                                <Github className="w-4 h-4 mr-2 text-gray-900" /> GitHub (URL completa)
                            </label>
                            <Input
                                placeholder="https://github.com/usuario"
                                value={socialLinks.github}
                                onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-1.5 italic">
                                <Globe className="w-4 h-4 mr-2 text-indigo-600" /> Portfolio ou Website de Trabalho
                            </label>
                            <Input
                                placeholder="https://meuportfolio.com"
                                value={portfolioUrl}
                                onChange={(e) => setPortfolioUrl(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky bottom-4 z-10">
                    <p className="text-sm text-gray-500 hidden sm:block">Certifique-se de que seus dados estão corretos antes de salvar.</p>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <Button type="submit" isLoading={loading} className="w-full sm:w-48 py-6 rounded-xl text-lg font-bold shadow-lg shadow-blue-100">
                            Salvar Perfil
                        </Button>
                    </div>
                </div>
            </form>

            
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-none">
                        <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <Brain className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Resumo da Extração IA</h3>
                            </div>
                            <button onClick={() => setShowReviewModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-gray-50">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                                    <Plus className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="text-sm text-blue-700 leading-relaxed font-medium">
                                    Nossa IA extraiu os dados abaixo do seu arquivo. Revise-os e clique em <b>"Confirmar e Aplicar"</b> para preencher seu perfil.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Competências
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {extractedData.skills?.map((s: string) => (
                                            <span key={s} className="bg-white text-gray-700 text-xs font-bold px-2 py-1 rounded-lg border border-gray-200">
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 pt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Experiência
                                    </h4>
                                    <div className="space-y-2">
                                        {extractedData.professionalInfo?.slice(0, 3).map((job: any, idx: number) => (
                                            <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 text-xs">
                                                <p className="font-bold text-gray-900">{job.role}</p>
                                                <p className="text-gray-500">{job.company} • {job.period}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Formação
                                    </h4>
                                    <div className="space-y-2">
                                        {extractedData.academicInfo?.slice(0, 2).map((edu: any, idx: number) => (
                                            <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 text-xs">
                                                <p className="font-bold text-gray-900">{edu.degree}</p>
                                                <p className="text-gray-500">{edu.institution}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 pt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Links
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {extractedData.socialLinks?.linkedin && (
                                            <div className="flex items-center gap-2 text-[10px] font-medium text-blue-600 truncate">
                                                <Linkedin className="w-3 h-3" /> {extractedData.socialLinks.linkedin}
                                            </div>
                                        )}
                                        {extractedData.socialLinks?.github && (
                                            <div className="flex items-center gap-2 text-[10px] font-medium text-gray-700 truncate">
                                                <Github className="w-3 h-3" /> {extractedData.socialLinks.github}
                                            </div>
                                        )}
                                    </div>

                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 pt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Pessoal & Endereço
                                    </h4>
                                    <div className="bg-white p-3 rounded-xl border border-gray-200 text-[10px] space-y-1">
                                        {extractedData.name && <p className="text-blue-600 font-bold mb-1"><b>Nome:</b> {extractedData.name}</p>}
                                        {extractedData.birthDate && <p><b>Nascimento:</b> {extractedData.birthDate}</p>}
                                        {extractedData.cpf && <p><b>CPF:</b> {extractedData.cpf}</p>}
                                        {extractedData.gender && <p><b>Gênero:</b> {extractedData.gender}</p>}
                                        {extractedData.address?.city && (
                                            <p className="flex items-center gap-1">
                                                <MapPin className="w-2.5 h-2.5" /> {extractedData.address.city} - {extractedData.address.state}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t border-gray-100 flex gap-4">
                            <Button variant="ghost" className="flex-1 font-bold text-gray-500" onClick={() => setShowReviewModal(false)}>
                                Cancelar
                            </Button>
                            <Button className="flex-1 font-extrabold shadow-lg shadow-blue-100" onClick={confirmExtractedData}>
                                Confirmar e Aplicar
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
