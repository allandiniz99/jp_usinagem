import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight, User, MapPin, FileText, Wrench, AlertCircle } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface Maintenance {
  id: number;
  machineId: number;
  machineName: string;
  type: string;
  description: string;
  scheduledDate: string;
  status: 'programada' | 'concluida';
}

interface CalendarViewProps {
  schedules: ScheduleData[];
  maintenances?: Maintenance[];
  onBack: () => void;
  onSelectSchedule: (id: number) => void;
}

export function CalendarView({ schedules, maintenances, onBack, onSelectSchedule }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getSchedulesForDate = (date: Date) => {
    const formattedDate = format(date, 'dd/MM/yyyy');
    return schedules.filter(s => s.date === formattedDate);
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

  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  // Começar semana no domingo
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Preencher dias vazios no início
  const startDay = monthStart.getDay();
  const emptyDays = Array(startDay).fill(null);

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
              <Calendar className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">Calendário Detalhado</h1>
              <p className="text-blue-100 text-sm">Visualize as programações do mês</p>
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
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-2xl rounded-xl overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-6 border-b-2 border-blue-600">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="hover:bg-slate-200"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <h2 className="text-xl text-slate-800">
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className="hover:bg-slate-200"
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Week days header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-slate-600 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-2">
                  {emptyDays.map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}
                  {daysInMonth.map(day => {
                    const daySchedules = getSchedulesForDate(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square p-2 rounded-lg border-2 transition-all hover:shadow-md ${
                          isSelected 
                            ? 'bg-blue-100 border-blue-500' 
                            : isToday 
                            ? 'bg-green-50 border-green-500' 
                            : daySchedules.length > 0 
                            ? 'bg-slate-50 border-slate-300 hover:border-slate-400' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col h-full">
                          <span className={`text-sm ${
                            isSelected ? 'text-blue-700' : isToday ? 'text-green-700' : 'text-slate-700'
                          }`}>
                            {format(day, 'd')}
                          </span>
                          {daySchedules.length > 0 && (
                            <div className="mt-1 flex-1 flex items-center justify-center">
                              <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-0.5">
                                {daySchedules.length}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Schedule Details for Selected Date */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-2xl rounded-xl overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-6 border-b-2 border-blue-600">
                <h3 className="text-xl text-slate-800">
                  {selectedDate 
                    ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
                    : 'Selecione uma data'
                  }
                </h3>
              </div>
              
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {selectedDate ? (
                  selectedDateSchedules.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateSchedules
                        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                        .map(schedule => (
                          <div
                            key={schedule.id}
                            onClick={() => onSelectSchedule(schedule.id)}
                            className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200 hover:border-blue-400 transition-all cursor-pointer hover:shadow-md"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-600">
                                {schedule.time || 'Sem horário'}
                              </span>
                              {getStatusBadge(schedule.status)}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="size-4 text-blue-600" />
                                <span className="text-slate-900">{schedule.operator}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="size-4 text-slate-500" />
                                <span className="text-slate-700">{schedule.location}</span>
                              </div>
                              
                              {schedule.description && (
                                <div className="flex items-start gap-2 text-sm">
                                  <FileText className="size-4 text-slate-500 mt-0.5" />
                                  <span className="text-slate-600 line-clamp-2">
                                    {schedule.description}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Calendar className="size-12 mx-auto mb-4 text-slate-300" />
                      <p>Nenhuma programação para este dia</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Calendar className="size-12 mx-auto mb-4 text-slate-300" />
                    <p>Selecione uma data no calendário</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pb-6 text-center">
        <p className="text-slate-500 text-sm">Desenvolvido por Allan Diniz</p>
      </div>
    </div>
  );
}