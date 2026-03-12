import { Link } from 'react-router-dom'
import { Building2, UserCircle, ArrowRight } from 'lucide-react'
import { Button } from '../shared/components/ui/Button'
import logo from '../shared/assets/logo.png'

export function Home() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col justify-center items-center p-4">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <img src={logo} alt="NexHire Logo" className="w-80 h-auto object-contain hover:scale-105 transition-transform duration-300" />
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-6xl mt-[-2rem]">
                        Bem-vindo ao <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">NexHire</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        A plataforma inteligente que conecta talentos às melhores oportunidades usando o poder da IA.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-8">
                    
                    <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col items-center text-center space-y-6">
                        <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <Building2 className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Sou uma Empresa</h2>
                            <p className="text-gray-500 mt-2">Publique vagas, gerencie candidatos e encontre o match perfeito com IA.</p>
                        </div>
                        <Link to="/auth/company/login" className="w-full">
                            <Button className="w-full h-12 text-lg rounded-xl flex justify-center items-center gap-2">
                                Entrar como Empresa
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    
                    <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 flex flex-col items-center text-center space-y-6">
                        <div className="bg-indigo-50 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <UserCircle className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Sou um Candidato</h2>
                            <p className="text-gray-500 mt-2">Encontre as melhores vagas e destaque seu perfil profissional.</p>
                        </div>
                        <Link to="/auth/candidate/login" className="w-full">
                            <Button variant="secondary" className="w-full h-12 text-lg rounded-xl flex justify-center items-center gap-2">
                                Entrar como Candidato
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="pt-12 text-gray-400 text-sm">
                    © 2026 NexHire - Recrutamento inteligente para a era Digital
                </div>
            </div>
        </div>
    )
}
