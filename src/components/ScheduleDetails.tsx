import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Calendar as CalendarIcon, Save, Upload, X, Trash2 } from 'lucide-react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Machine {
  id: number;
  name: string;
  model: string;
  plate: string;
  status: 'ativa' | 'manutencao' | 'inativa';
}

interface Operator {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
  status: 'ativo' | 'ferias' | 'afastado';
}

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

interface ScheduleDetailsProps {
  schedule: ScheduleData;
  machines: Machine[];
  operators: Operator[];
  schedules: ScheduleData[];
  onBack: () => void;
  onSave: (id: number, data: Partial<ScheduleData>) => void;
  onDelete: (id: number) => void;
}

export function ScheduleDetails({ schedule, machines, operators, schedules, onBack, onSave, onDelete }: ScheduleDetailsProps) {
  const [date, setDate] = useState<Date>(() => {
    const [day, month, year] = schedule.date.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  });
  const [time, setTime] = useState(schedule.time || '');
  const [machine, setMachine] = useState(schedule.machine);
  const [operator, setOperator] = useState(schedule.operator);
  const [location, setLocation] = useState(schedule.location);
  const [plate, setPlate] = useState(schedule.plate);
  const [description, setDescription] = useState(schedule.description || '');
  const [attachments, setAttachments] = useState<string[]>(schedule.attachments || []);
  const [status, setStatus] = useState(schedule.status);

  // Handler para quando a máquina for selecionada
  const handleMachineChange = (value: string) => {
    setMachine(value);
    // Herdar a placa da máquina selecionada
    const selectedMachine = machines.find(m => m.name === value);
    if (selectedMachine) {
      setPlate(selectedMachine.plate);
    }
  };

  // Handler para upload de imagens (simulado)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = URL.createObjectURL(files[i]);
        newAttachments.push(url);
      }
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      alert('Por favor, selecione uma data');
      return;
    }

    if (!time) {
      alert('Por favor, selecione um horário');
      return;
    }

    const formattedDate = format(date, 'dd/MM/yyyy', { locale: ptBR });
    
    // Validar conflito de agenda (exceto com o próprio agendamento)
    const hasConflict = schedules.some(s => 
      s.id !== schedule.id &&
      s.operator === operator && 
      s.date === formattedDate && 
      s.time === time &&
      s.status !== 'concluido'
    );

    if (hasConflict) {
      alert('CONFLITO DE AGENDA: Este operador já possui uma programação para este horário!');
      return;
    }

    onSave(schedule.id, {
      date: formattedDate,
      time,
      machine,
      operator,
      location,
      plate,
      description,
      attachments,
      status
    });
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja deletar esta programação?')) {
      onDelete(schedule.id);
    }
  };

  // Filtrar operadores ativos
  const activeOperators = operators.filter(op => op.status === 'ativo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="size-6" />
          </Button>
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <CalendarIcon className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">Detalhes da Programação</h1>
              <p className="text-blue-100 text-sm">Edite ou visualize os dados da programação</p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 className="size-5 mr-2" />
            Deletar
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-8">
        <Card className="bg-white shadow-2xl rounded-xl border-0">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b-2 border-blue-600">
            <CardTitle className="text-2xl text-slate-800">Dados da Programação</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Picker */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-slate-700">Data *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-12 border-2 hover:border-blue-400 transition-colors"
                      >
                        <CalendarIcon className="mr-2 size-5 text-blue-600" />
                        {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Input */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-slate-700">Horário *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="h-12 border-2 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Machine Select */}
                <div className="space-y-2">
                  <Label htmlFor="machine" className="text-slate-700">Máquina *</Label>
                  <Select value={machine} onValueChange={handleMachineChange} required>
                    <SelectTrigger className="h-12 border-2 hover:border-blue-400 transition-colors">
                      <SelectValue placeholder="Selecione a máquina" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines
                        .filter(m => m.status === 'ativa')
                        .map(m => (
                          <SelectItem key={m.id} value={m.name}>
                            {m.name} - {m.model}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Plate Input (Auto-filled) */}
                <div className="space-y-2">
                  <Label htmlFor="plate" className="text-slate-700">Placa do Veículo *</Label>
                  <Input
                    id="plate"
                    type="text"
                    placeholder="ABC-1234"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    required
                    maxLength={8}
                    className="h-12 border-2 hover:border-blue-400 focus:border-blue-500 transition-colors font-mono bg-slate-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Operator Select */}
              <div className="space-y-2">
                <Label htmlFor="operator" className="text-slate-700">Operador *</Label>
                <Select value={operator} onValueChange={setOperator} required>
                  <SelectTrigger className="h-12 border-2 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="Selecione o operador" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeOperators.map(op => (
                      <SelectItem key={op.id} value={op.name}>
                        <div className="flex flex-col">
                          <span>{op.name}</span>
                          <span className="text-xs text-slate-500">
                            {op.email} | {op.phone}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-700">Local *</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Cidade - Estado (ex: Vitória - ES)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="h-12 border-2 hover:border-blue-400 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-700">Status *</Label>
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger className="h-12 border-2 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700">Descrição da Atividade</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva a atividade a ser realizada..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="border-2 hover:border-blue-400 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="attachments" className="text-slate-700">Anexar Imagens</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="attachments"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="attachments" 
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="size-8 text-slate-400 mb-2" />
                    <span className="text-slate-600 text-sm">Clique para selecionar imagens</span>
                    <span className="text-slate-400 text-xs mt-1">PNG, JPG até 10MB</span>
                  </label>
                </div>

                {/* Preview de anexos */}
                {attachments.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {attachments.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Anexo ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 h-12 border-2 hover:bg-slate-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                >
                  <Save className="size-5 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 pb-6 text-center">
        <p className="text-slate-500 text-sm">Desenvolvido por Allan Diniz</p>
      </div>
    </div>
  );
}
