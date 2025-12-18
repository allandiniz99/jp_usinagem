import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Plus, Calendar, Clock, Cog, Users, Filter, CheckCircle2, PlayCircle, ClockIcon, ListTodo, CalendarDays, Map } from 'lucide-react';
import { ScheduleTable } from './ScheduleTable';

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

interface DailyScheduleProps {
  schedules: ScheduleData[];
  onNewSchedule: () => void;
  onDeleteSchedule: (id: number) => void;
  onCompleteSchedule: (id: number) => void;
  onSelectSchedule: (id: number) => void;
  onMachineRegister: () => void;
  onOperatorRegister: () => void;
  onViewCalendar: () => void;
  onViewMap: () => void;
}

export function DailySchedule({ schedules, onNewSchedule, onDeleteSchedule, onCompleteSchedule, onSelectSchedule, onMachineRegister, onOperatorRegister, onViewCalendar, onViewMap }: DailyScheduleProps) {
  const [activeFilter, setActiveFilter] = useState<'machines' | 'operators'>('machines');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'agendado' | 'em-andamento' | 'concluido'>('todos');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('pt-BR'));
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter schedules by status
  const filteredSchedules = statusFilter === 'todos' 
    ? schedules 
    : schedules.filter(schedule => schedule.status === statusFilter);

  // Count schedules by status
  const counts = {
    todos: schedules.length,
    agendado: schedules.filter(s => s.status === 'agendado').length,
    emAndamento: schedules.filter(s => s.status === 'em-andamento').length,
    concluido: schedules.filter(s => s.status === 'concluido').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Calendar className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">Programação Diária</h1>
              <p className="text-blue-100 text-sm">Gestão de máquinas e operadores</p>
            </div>
          </div>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
            onClick={onNewSchedule}
          >
            <Plus className="size-5 mr-2" />
            Nova Programação
          </Button>
        </div>
      </div>

      {/* Date and Time Display */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-5 border-b border-slate-600 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-900/30 px-6 py-3 rounded-lg backdrop-blur-sm">
            <Calendar className="size-5 text-blue-400" />
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wide">Data</span>
              <p className="text-white">{currentDate}</p>
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
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Status Filter Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="size-5 text-blue-600" />
            <h3 className="text-slate-800">Filtrar por Status</h3>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant={statusFilter === 'todos' ? 'default' : 'outline'}
              className={`px-6 py-5 rounded-lg transition-all duration-200 ${
                statusFilter === 'todos' 
                  ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
              }`}
              onClick={() => setStatusFilter('todos')}
            >
              <ListTodo className={`size-5 mr-2 ${statusFilter === 'todos' ? 'text-white' : 'text-slate-600'}`} />
              Todos ({counts.todos})
            </Button>
            <Button
              variant={statusFilter === 'agendado' ? 'default' : 'outline'}
              className={`px-6 py-5 rounded-lg transition-all duration-200 ${
                statusFilter === 'agendado' 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
              }`}
              onClick={() => setStatusFilter('agendado')}
            >
              <ClockIcon className={`size-5 mr-2 ${statusFilter === 'agendado' ? 'text-white' : 'text-amber-600'}`} />
              Agendado ({counts.agendado})
            </Button>
            <Button
              variant={statusFilter === 'em-andamento' ? 'default' : 'outline'}
              className={`px-6 py-5 rounded-lg transition-all duration-200 ${
                statusFilter === 'em-andamento' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
              }`}
              onClick={() => setStatusFilter('em-andamento')}
            >
              <PlayCircle className={`size-5 mr-2 ${statusFilter === 'em-andamento' ? 'text-white' : 'text-blue-600'}`} />
              Em Andamento ({counts.emAndamento})
            </Button>
            <Button
              variant={statusFilter === 'concluido' ? 'default' : 'outline'}
              className={`px-6 py-5 rounded-lg transition-all duration-200 ${
                statusFilter === 'concluido' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
              }`}
              onClick={() => setStatusFilter('concluido')}
            >
              <CheckCircle2 className={`size-5 mr-2 ${statusFilter === 'concluido' ? 'text-white' : 'text-green-600'}`} />
              Concluído ({counts.concluido})
            </Button>
          </div>
        </div>

     
{/* Filter Buttons */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  <Button
    // estado visual quando ativo/inativo (sem mudar tamanho)
    variant={activeFilter === 'machines' ? 'default' : 'outline'}
    className={`w-full h-16 px-6 text-lg rounded-xl shadow-lg transition-colors duration-200
      ${activeFilter === 'machines'
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-transparent'
        : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
      }`}
    onClick={onMachineRegister}
  >
    <Cog className={`size-6 mr-3 ${activeFilter === 'machines' ? 'text-white' : 'text-blue-600'}`} />
    MÁQUINAS
  </Button>

  <Button
    variant={activeFilter === 'operators' ? 'default' : 'outline'}
    className={`w-full h-16 px-6 text-lg rounded-xl shadow-lg transition-colors duration-200
      ${activeFilter === 'operators'
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-transparent'
        : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
      }`}
    onClick={onOperatorRegister}
  >
    <Users className={`size-6 mr-3 ${activeFilter === 'operators' ? 'text-white' : 'text-blue-600'}`} />
    OPERADORES
  </Button>

  <Button
    variant="outline"
    className="w-full h-16 px-6 text-lg rounded-xl shadow-lg transition-colors duration-200 bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200"
    onClick={onViewCalendar}
  >
    <CalendarDays className="size-6 mr-3 text-purple-600" />
    CALENDÁRIO
  </Button>

  <Button
    variant="outline"
    className="w-full h-16 px-6 text-lg rounded-xl shadow-lg transition-colors duration-200 bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200"
    onClick={onViewMap}
  >
    <Map className="size-6 mr-3 text-green-600" />
    MAPA
  </Button>
</div>


        {/* Schedule Table */}
        <ScheduleTable 
          data={filteredSchedules} 
          onDelete={onDeleteSchedule}
          onComplete={onCompleteSchedule}
          onSelect={onSelectSchedule}
        />
      </div>

      {/* Footer */}
      <div className="mt-12 pb-6 text-center">
        <p className="text-slate-500 text-sm">Desenvolvido por Allan Diniz</p>
      </div>
    </div>
  );
}