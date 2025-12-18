import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Cog, User, Calendar as CalendarIcon, Car, Trash2, CheckCircle, Clock } from 'lucide-react';

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

interface ScheduleTableProps {
  data: ScheduleData[];
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  onSelect: (id: number) => void;
}

export function ScheduleTable({ data, onDelete, onComplete, onSelect }: ScheduleTableProps) {
  const [filters, setFilters] = useState({
    date: '',
    time: '',
    machine: '',
    operator: '',
    location: '',
    plate: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em-andamento':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Em Andamento</Badge>;
      case 'agendado':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Agendado</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Concluído</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-white">Desconhecido</Badge>;
    }
  };

  // Apply column filters
  const filteredData = data.filter(item => {
    return (
      item.date.toLowerCase().includes(filters.date.toLowerCase()) &&
      (item.time || '').toLowerCase().includes(filters.time.toLowerCase()) &&
      item.machine.toLowerCase().includes(filters.machine.toLowerCase()) &&
      item.operator.toLowerCase().includes(filters.operator.toLowerCase()) &&
      item.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      item.plate.toLowerCase().includes(filters.plate.toLowerCase())
    );
  });

  const handleFilterChange = (column: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  };

  return (
    <Card className="bg-white shadow-2xl rounded-xl overflow-hidden border-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
            <tr className="border-b-2 border-blue-600">
              <th className="px-8 py-5 text-left text-slate-700 uppercase text-xs tracking-wider">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-4 text-blue-600" />
                  Data
                </div>
              </th>
              <th className="px-8 py-5 text-left text-slate-700 uppercase text-xs tracking-wider">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-blue-600" />
                  Horário
                </div>
              </th>
              <th className="px-8 py-5 text-left text-slate-700 uppercase text-xs tracking-wider">
                <div className="flex items-center gap-2">
                  <Cog className="size-4 text-blue-600" />
                  Máquina
                </div>
              </th>
              <th className="px-8 py-5 text-left text-slate-700 uppercase text-xs tracking-wider">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-blue-600" />
                  Operador
                </div>
              </th>
              <th className="px-8 py-5 text-left text-slate-700 uppercase text-xs tracking-wider">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-blue-600" />
                  Local
                </div>
              </th>
              <th className="px-8 py-5 text-left text-slate-700 uppercase text-xs tracking-wider">
                <div className="flex items-center gap-2">
                  <Car className="size-4 text-blue-600" />
                  Placa
                </div>
              </th>
              <th className="px-8 py-5 text-left text-slate-700 uppercase text-xs tracking-wider">
                Status
              </th>
              <th className="px-8 py-5 text-center text-slate-700 uppercase text-xs tracking-wider">
                Ações
              </th>
            </tr>
            {/* Filter Row */}
            <tr className="bg-white border-b border-slate-200">
              <th className="px-8 py-3">
                <Input
                  type="text"
                  placeholder="Filtrar data..."
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="h-8 text-sm"
                />
              </th>
              <th className="px-8 py-3">
                <Input
                  type="text"
                  placeholder="Filtrar hora..."
                  value={filters.time}
                  onChange={(e) => handleFilterChange('time', e.target.value)}
                  className="h-8 text-sm"
                />
              </th>
              <th className="px-8 py-3">
                <Input
                  type="text"
                  placeholder="Filtrar máquina..."
                  value={filters.machine}
                  onChange={(e) => handleFilterChange('machine', e.target.value)}
                  className="h-8 text-sm"
                />
              </th>
              <th className="px-8 py-3">
                <Input
                  type="text"
                  placeholder="Filtrar operador..."
                  value={filters.operator}
                  onChange={(e) => handleFilterChange('operator', e.target.value)}
                  className="h-8 text-sm"
                />
              </th>
              <th className="px-8 py-3">
                <Input
                  type="text"
                  placeholder="Filtrar local..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="h-8 text-sm"
                />
              </th>
              <th className="px-8 py-3">
                <Input
                  type="text"
                  placeholder="Filtrar placa..."
                  value={filters.plate}
                  onChange={(e) => handleFilterChange('plate', e.target.value)}
                  className="h-8 text-sm"
                />
              </th>
              <th className="px-8 py-3"></th>
              <th className="px-8 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item, index) => (
              <tr 
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`hover:bg-blue-50 transition-all duration-150 cursor-pointer ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                <td className="px-8 py-5 text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    {item.date}
                  </span>
                </td>
                <td className="px-8 py-5 text-slate-600">
                  {item.time || '-'}
                </td>
                <td className="px-8 py-5">
                  <span className="text-slate-900 inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-lg">
                    <Cog className="size-4 text-blue-600" />
                    {item.machine}
                  </span>
                </td>
                <td className="px-8 py-5 text-slate-900">{item.operator}</td>
                <td className="px-8 py-5">
                  <span className="text-slate-700 inline-flex items-center gap-1">
                    <MapPin className="size-3 text-slate-500" />
                    {item.location}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-slate-600 font-mono bg-slate-100 px-3 py-1 rounded">
                    {item.plate}
                  </span>
                </td>
                <td className="px-8 py-5">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">
                    {item.status !== 'concluido' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
                        onClick={() => onComplete(item.id)}
                        title="Finalizar programação"
                      >
                        <CheckCircle className="size-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
                      onClick={() => onDelete(item.id)}
                      title="Deletar programação"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}