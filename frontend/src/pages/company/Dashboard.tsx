import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    PieChart, 
    Pie, 
    Cell, 
    BarChart, 
    Bar,
    Legend
} from 'recharts'
import { Card } from '../../components/ui/Card'
import { Briefcase, Users, Target, TrendingUp, Filter, Brain } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1'];

export function Dashboard() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/company/stats')
                setStats(response.data)
            } catch (error) {
                console.error('Erro ao buscar estatísticas:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Preparando seu painel de análises...</p>
        </div>
    )

    const statusData = Object.entries(stats?.statusBreakdown || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    })).filter(d => d.value > 0);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-sm font-bold text-blue-600">{payload[0].value} Candidaturas</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Analytics Dashboard</h2>
                <p className="text-gray-500 font-medium mt-1">Visão completa do seu funil de recrutamento e talentos.</p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vagas Abertas</p>
                            <h3 className="text-3xl font-black text-gray-900">{stats?.activeJobs || 0}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Briefcase className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" /> +12% este mês
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Candidatos</p>
                            <h3 className="text-3xl font-black text-gray-900">{stats?.totalCandidates || 0}</h3>
                        </div>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                        Crescimento orgânico
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Média de Match</p>
                            <h3 className="text-3xl font-black text-blue-600">{stats?.avgCompatibility}%</h3>
                        </div>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Target className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 w-fit px-2 py-0.5 rounded-full">
                        <Brain className="w-3 h-3" /> IA-Driven Insights
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Taxa de Conversão</p>
                            <h3 className="text-3xl font-black text-gray-900">
                                {stats?.totalCandidates ? Math.round((stats.statusBreakdown?.hired / stats.totalCandidates) * 100) : 0}%
                            </h3>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Filter className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                        Funil otimizado
                    </div>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Applications Trend */}
                <Card className="p-8 border-none shadow-sm hover:shadow-lg transition-shadow bg-white overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Trend de Candidaturas</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Últimos 15 dias</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.trends}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}}
                                    tickFormatter={(val) => val.split('-').slice(1).reverse().join('/')}
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#3B82F6" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Status Distribution */}
                <Card className="p-8 border-none shadow-sm hover:shadow-lg transition-shadow bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Distribuição por Status</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Pipeline atual</p>
                        </div>
                    </div>
                    <div className="h-[300px] flex items-center">
                        <div className="w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-4 pr-4">
                            {statusData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-sm font-bold text-gray-600">{entry.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-gray-900">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Skills */}
                <Card className="p-8 border-none shadow-sm hover:shadow-lg transition-shadow bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Skill Cloud Trends</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Habilidades mais comuns</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.skills} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false}
                                    tick={{fill: '#475569', fontSize: 11, fontWeight: 800}}
                                    width={100}
                                />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar 
                                    dataKey="count" 
                                    fill="#3B82F6" 
                                    radius={[0, 10, 10, 0]} 
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Score Distribution */}
                <Card className="p-8 border-none shadow-sm hover:shadow-lg transition-shadow bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Qualidade da Base</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Distribuição por Match score</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full text-center">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.scoreDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="range" 
                                    axisLine={false} 
                                    tickLine={false}
                                    tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                                <Tooltip cursor={{fill: '#F8FAFC'}} />
                                <Bar 
                                    dataKey="count" 
                                    fill="#8B5CF6" 
                                    radius={[10, 10, 0, 0]} 
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    )
}
