import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export function ErrorPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">Ops! Página não encontrada</h1>
                <p className="text-slate-600 mb-8">
                    Não conseguimos encontrar a página que você está procurando.
                    Pode ter sido movida ou nunca existiu.
                </p>
                <Link to="/">
                    <Button size="lg" className="w-full">
                        Voltar para o Início
                    </Button>
                </Link>
            </div>
        </div>
    )
}
