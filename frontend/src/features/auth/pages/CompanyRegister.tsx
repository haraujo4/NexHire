import { useState } from 'react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { authService } from '../services/authService'
import { useAuthStore } from '../../../shared/store/authStore'
import logo from '../../../shared/assets/logo.png'

export function CompanyRegister() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { company, token } = await authService.companyRegister({ name, email, password });
            useAuthStore.getState().login(company, token);
            useAuthStore.getState().login(company, token);
            navigate('/company/dashboard')
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Erro ao criar conta.');
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <img src={logo} alt="NexHire Logo" className="w-48 h-auto object-contain" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Criar conta Empresa
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <Link to="/auth/company/login" className="font-medium text-[var(--color-primary)] hover:text-blue-500">
                        Faça login
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl border border-gray-100 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                            <Input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Sua Empresa"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full" isLoading={loading}>
                            Criar conta
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
