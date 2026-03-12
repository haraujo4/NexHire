import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card } from '../../../shared/components/ui/Card'
import { Button } from '../../../shared/components/ui/Button'
import { candidatesService } from '../services/candidatesService'
import {
    Building2,
    Globe,
    MapPin,
    Linkedin,
    Twitter,
    Save,
    Loader2,
    CheckCircle2,
    ExternalLink,
    Info
} from 'lucide-react'

export function CompanyProfile() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [profile, setProfile] = useState<any>({
        description: '',
        website: '',
        industry: '',
        size: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        },
        socialLinks: {
            linkedin: '',
            twitter: '',
            instagram: ''
        }
    })

    const [activeSection, setActiveSection] = useState<'geral' | 'localizacao' | 'presenca'>('geral')

    const fetchProfile = async () => {
        try {
            const data = await candidatesService.getCompanyProfile()
            if (data) {
                setProfile((prev: any) => ({
                    ...prev,
                    ...data,
                    address: data.address || prev.address,
                    socialLinks: data.socialLinks || prev.socialLinks
                }))
            }
        } catch (error) {
            console.error('Erro ao buscar perfil:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setSuccess(false)
        try {
            await candidatesService.updateCompanyProfile(profile)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            console.error('Erro ao salvar perfil:', error)
            toast.error('Falha ao salvar perfil. Verifique os dados e tente novamente.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-gray-500 font-medium text-lg">Carregando perfil da empresa...</p>
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto pb-20">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
                        <Building2 className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Perfil Corporativo</h2>
                        <p className="text-slate-500 font-medium">Gerencie como sua empresa é vista pelos candidatos.</p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {profile.website && (
                        <a
                            href={profile.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" /> Ver Website
                        </a>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="gap-2 h-12 px-8 shadow-lg shadow-blue-200 shrink-0 min-w-[160px]"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {saving ? 'Salvando...' : success ? 'Salvo!' : 'Salvar Alterações'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Seções</h3>
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveSection('geral')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'geral'
                                        ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <Info className="w-4 h-4" /> Informações Gerais
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveSection('localizacao')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'localizacao'
                                        ? 'bg-orange-50 text-orange-700 shadow-sm shadow-orange-100/50'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <MapPin className="w-4 h-4" /> Localização
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveSection('presenca')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'presenca'
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <Globe className="w-4 h-4" /> Presença Digital
                                </button>
                            </div>
                        </div>
                    </div>

                    
                    <div className="lg:col-span-2">
                        
                        {activeSection === 'geral' && (
                            <Card className="p-8 border-none shadow-sm overflow-visible animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Info className="w-4 h-4" />
                                    </span>
                                    Informações Gerais
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Sobre a Empresa</label>
                                        <textarea
                                            className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-700 font-medium leading-relaxed resize-none"
                                            placeholder="Conte um pouco sobre a história, valores e cultura da sua empresa..."
                                            value={profile.description || ''}
                                            onChange={e => setProfile({ ...profile, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Setor / Indústria</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 h-12 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-700 font-bold"
                                                placeholder="Ex: Tecnologia, Varejo, Saúde..."
                                                value={profile.industry || ''}
                                                onChange={e => setProfile({ ...profile, industry: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tamanho da Empresa</label>
                                            <select
                                                className="w-full px-4 h-12 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-700 font-bold cursor-pointer"
                                                value={profile.size || ''}
                                                onChange={e => setProfile({ ...profile, size: e.target.value })}
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="1-10">1-10 Funcionários</option>
                                                <option value="11-50">11-50 Funcionários</option>
                                                <option value="51-200">51-200 Funcionários</option>
                                                <option value="201-500">201-500 Funcionários</option>
                                                <option value="500+">Mais de 500 Funcionários</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        
                        {activeSection === 'localizacao' && (
                            <Card className="p-8 border-none shadow-sm overflow-visible animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                        <MapPin className="w-4 h-4" />
                                    </span>
                                    Localização Sede
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Endereço Completo</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 h-12 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none text-slate-700 font-bold"
                                            placeholder="Rua, Número, Bairro..."
                                            value={profile.address?.street || ''}
                                            onChange={e => setProfile({
                                                ...profile,
                                                address: { ...profile.address, street: e.target.value }
                                            })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="col-span-1 md:col-span-1">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Cidade</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 h-12 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none text-slate-700 font-bold"
                                                placeholder="Ex: São Paulo"
                                                value={profile.address?.city || ''}
                                                onChange={e => setProfile({
                                                    ...profile,
                                                    address: { ...profile.address, city: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Estado (UF)</label>
                                            <input
                                                type="text"
                                                maxLength={2}
                                                className="w-full px-4 h-12 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none text-slate-700 font-bold uppercase"
                                                placeholder="SP"
                                                value={profile.address?.state || ''}
                                                onChange={e => setProfile({
                                                    ...profile,
                                                    address: { ...profile.address, state: e.target.value.toUpperCase() }
                                                })}
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">CEP</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 h-12 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none text-slate-700 font-bold"
                                                placeholder="00000-000"
                                                value={profile.address?.zipCode || ''}
                                                onChange={e => setProfile({
                                                    ...profile,
                                                    address: { ...profile.address, zipCode: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        
                        {activeSection === 'presenca' && (
                            <Card className="p-8 border-none shadow-sm overflow-visible animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <Globe className="w-4 h-4" />
                                    </span>
                                    Presença Digital
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Website Oficial</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="url"
                                                className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-700 font-bold"
                                                placeholder="https://suaempresa.com.br"
                                                value={profile.website || ''}
                                                onChange={e => setProfile({ ...profile, website: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">LinkedIn</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                                    <Linkedin className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="url"
                                                    className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none text-slate-700 font-bold"
                                                    placeholder="linkedin.com/company/..."
                                                    value={profile.socialLinks?.linkedin || ''}
                                                    onChange={e => setProfile({
                                                        ...profile,
                                                        socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Twitter (X)</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                                    <Twitter className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="url"
                                                    className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none text-slate-700 font-bold"
                                                    placeholder="twitter.com/..."
                                                    value={profile.socialLinks?.twitter || ''}
                                                    onChange={e => setProfile({
                                                        ...profile,
                                                        socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}
