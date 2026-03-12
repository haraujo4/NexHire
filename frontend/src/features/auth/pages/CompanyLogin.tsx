import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { useAuthStore } from '../../../shared/store/authStore'
import { authService } from '../services/authService'
import logo from '../../../shared/assets/logo.png'

export function CompanyLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { user, token } = await authService.companyLogin({ email, password });
            useAuthStore.getState().login(user, token);
            navigate('/company/dashboard')
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.');
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
                    Entrar como Empresa
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ou{' '}
                    <Link to="/auth/company/register" className="font-medium text-[var(--color-primary)] hover:text-blue-500">
                        crie sua conta gratuitamente
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl border border-gray-100 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                            Entrar
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
