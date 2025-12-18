import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Map, Calendar, Clock, MapPin, Users, Filter } from 'lucide-react';

interface ScheduleData {
  id: number;
  date: string;
  time?: string;
  machine: string;
  operator: string;
  location: string;
  plate: string;
  status: string;
  description?: string;
  attachments?: string[];
}

interface Operator {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
  status: 'ativo' | 'ferias' | 'afastado';
}

interface MapViewProps {
  schedules: ScheduleData[];
  operators: Operator[];
  onBack: () => void;
}

export function MapView({ schedules, operators, onBack }: MapViewProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('pt-BR');
  });
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Agrupar programações por cidade
  const groupByCity = (scheduleList: ScheduleData[]) => {
    const groups: { [key: string]: ScheduleData[] } = {};
    
    scheduleList.forEach(schedule => {
      const city = schedule.location.split(' - ')[0]; // Extrair cidade do formato "Cidade - Estado"
      if (!groups[city]) {
        groups[city] = [];
      }
      groups[city].push(schedule);
    });
    
    return groups;
  };

  // Filtrar programações por data
  const filteredSchedules = dateFilter
    ? schedules.filter(s => s.date === dateFilter)
    : schedules.filter(s => s.date === selectedDate);

  const cityGroups = groupByCity(filteredSchedules);
  const cities = Object.keys(cityGroups).sort();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em-andamento':
        return 'text-blue-600 bg-blue-100';
      case 'agendado':
        return 'text-yellow-600 bg-yellow-100';
      case 'concluido':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em-andamento':
        return <Badge className="bg-blue-500 text-white text-xs">Em Andamento</Badge>;
      case 'agendado':
        return <Badge className="bg-yellow-500 text-white text-xs">Agendado</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500 text-white text-xs">Concluído</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white text-xs">Desconhecido</Badge>;
    }
  };

  // Estatísticas gerais
  const stats = {
    totalCities: cities.length,
    totalOperators: new Set(filteredSchedules.map(s => s.operator)).size,
    totalSchedules: filteredSchedules.length,
    byStatus: {
      agendado: filteredSchedules.filter(s => s.status === 'agendado').length,
      emAndamento: filteredSchedules.filter(s => s.status === 'em-andamento').length,
      concluido: filteredSchedules.filter(s => s.status === 'concluido').length,
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={onBack}
            >
              <ArrowLeft className="size-6" />
            </Button>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Map className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">Mapa de Alocação</h1>
              <p className="text-blue-100 text-sm">Visualize onde os operadores estão alocados</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/30 px-6 py-3 rounded-lg backdrop-blur-sm">
            <Clock className="size-5 text-blue-400" />
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wide">Horário</span>
              <p className="text-white">{currentTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Filter Section */}
        <Card className="bg-white shadow-2xl rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="size-5 text-blue-600" />
            <h3 className="text-slate-800 text-xl">Filtrar por Data</h3>
          </div>
          <div className="max-w-md">
            <Label htmlFor="dateFilter" className="text-slate-700">Data</Label>
            <Input
              id="dateFilter"
              type="text"
              placeholder="DD/MM/AAAA"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mt-2 h-12 border-2 hover:border-blue-400 focus:border-blue-500"
            />
            {dateFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateFilter('')}
                className="mt-2"
              >
                Limpar filtro
              </Button>
            )}
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <MapPin className="size-10" />
              <div>
                <p className="text-blue-100 text-sm">Cidades</p>
                <p className="text-3xl">{stats.totalCities}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Users className="size-10" />
              <div>
                <p className="text-green-100 text-sm">Operadores</p>
                <p className="text-3xl">{stats.totalOperators}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Calendar className="size-10" />
              <div>
                <p className="text-purple-100 text-sm">Total</p>
                <p className="text-3xl">{stats.totalSchedules}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 shadow-xl">
            <div className="flex flex-col gap-1">
              <p className="text-orange-100 text-sm">Status</p>
              <div className="flex gap-2 text-sm">
                <span>{stats.byStatus.agendado} Agendado</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span>{stats.byStatus.emAndamento} Ativo</span>
              </div>
            </div>
          </Card>
        </div>

        {/* City Map */}
        <div className="grid grid-cols-1 gap-6">
          {cities.length > 0 ? (
            cities.map(city => {
              const citySchedules = cityGroups[city];
              const cityOperators = new Set(citySchedules.map(s => s.operator));
              
              return (
                <Card key={city} className="bg-white shadow-2xl rounded-xl overflow-hidden">
                  {/* City Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b-2 border-blue-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="size-8 text-blue-600" />
                        <div>
                          <h3 className="text-2xl text-slate-800">{city}</h3>
                          <p className="text-slate-600 text-sm">
                            {cityOperators.size} operador{cityOperators.size !== 1 ? 'es' : ''} • {citySchedules.length} programaç{citySchedules.length !== 1 ? 'ões' : 'ão'}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-sm">
                        {citySchedules.filter(s => s.status !== 'concluido').length} ativa{citySchedules.filter(s => s.status !== 'concluido').length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>

                  {/* City Schedules */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {citySchedules
                        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                        .map(schedule => (
                          <div
                            key={schedule.id}
                            className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200 hover:border-blue-400 transition-all hover:shadow-md"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-slate-600">
                                {schedule.time || 'Sem horário'}
                              </span>
                              {getStatusBadge(schedule.status)}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Users className="size-4 text-blue-600" />
                                <span className="text-slate-900">{schedule.operator}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-600">Máquina:</span>
                                <span className="text-slate-900">{schedule.machine}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-600">Placa:</span>
                                <span className="text-slate-700 font-mono">{schedule.plate}</span>
                              </div>

                              {schedule.description && (
                                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                                  {schedule.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="bg-white shadow-2xl rounded-xl p-12">
              <div className="text-center text-slate-500">
                <MapPin className="size-16 mx-auto mb-4 text-slate-300" />
                <p className="text-xl">Nenhuma programação encontrada</p>
                <p className="text-sm mt-2">
                  {dateFilter 
                    ? `Não há programações para a data ${dateFilter}` 
                    : 'Não há programações para hoje'
                  }
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pb-6 text-center">
        <p className="text-slate-500 text-sm">Desenvolvido por Allan Diniz</p>
      </div>
    </div>
  );
}
