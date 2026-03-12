import { useState, useRef, useEffect } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { Briefcase, Users, LayoutDashboard, LogOut, Menu, X, ChevronDown, User } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import logo from "../assets/logo.png"

export function CompanyLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        { path: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/company/jobs', icon: Briefcase, label: 'Vagas' },
        { path: '/company/candidates', icon: Users, label: 'Candidatos' },
    ];

    return (
        <div className="flex h-screen bg-[var(--color-background)] overflow-hidden">
            
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="NexHire Logo" className="w-24 h-auto object-contain" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            NexHire
                        </span>
                    </div>
                    <button
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-900"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${isActive(item.path)
                                ? 'text-[var(--color-primary)] bg-blue-50'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                        NexHire Management
                    </p>
                </div>
            </aside>

            
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-background)]">
                
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shrink-0 shadow-sm shadow-black/[0.02]">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 mr-4 text-gray-500 hover:text-gray-900 lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                            {navItems.find(item => isActive(item.path))?.label || 'Workspace'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md shadow-blue-100 shrink-0">
                                    {user?.name?.[0].toUpperCase() || 'E'}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">{user?.name}</p>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Recrutador</p>
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
                                        to="/company/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <User className="w-4 h-4" /> Perfil da Empresa
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
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

