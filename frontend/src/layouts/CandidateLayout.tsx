import { useState, useRef, useEffect } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { Building2, Search, FileText, LogOut, Menu, X, ChevronDown, User } from "lucide-react"
import { useAuthStore } from "../store/authStore"

export function CandidateLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname.includes(path);

    const navItems = [
        { path: '/candidate/jobs', icon: Search, label: 'Explorar Vagas' },
        { path: '/candidate/applications', icon: FileText, label: 'Minhas Candidaturas' },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Top Navbar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm shadow-black/[0.02]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="sm:hidden p-2 text-gray-500 hover:text-gray-900 mr-2"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div className="flex items-center cursor-pointer" onClick={() => navigate('/candidate/jobs')}>
                                <Building2 className="w-8 h-8 text-[var(--color-primary)] mr-2" />
                                <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                    RhLegal
                                </span>
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden sm:flex sm:space-x-8 items-center">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors h-16 ${isActive(item.path)
                                        ? 'border-[var(--color-primary)] text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4 mr-2" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4">
                            {/* Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md shadow-blue-100 shrink-0">
                                        {user?.name?.[0].toUpperCase() || 'C'}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">{user?.name}</p>
                                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Candidato</p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Minha Conta</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                                        </div>

                                        <Link
                                            to="/candidate/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            <User className="w-4 h-4" /> Meu Perfil
                                        </Link>

                                        <div className="h-px bg-gray-100 my-1 mx-2" />

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Sair da Conta
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav Menu */}
                {isMenuOpen && (
                    <div className="sm:hidden bg-white border-b border-gray-200 py-2 px-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center px-3 py-3 rounded-xl text-base font-bold ${isActive(item.path)
                                    ? 'bg-blue-50 text-[var(--color-primary)]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <Outlet />
            </main>
        </div>
    )
}

