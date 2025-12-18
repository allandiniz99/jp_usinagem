import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Calendar, Clock, Wrench, Plus, Trash2, Upload, X, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Machine {
  id: number;
  name: string;
  model: string;
  plate: string;
  status: 'ativa' | 'manutencao' | 'inativa';
}

interface Maintenance {
  id: number;
  machineId: number;
  machineName: string;
  type: string;
  description: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'programada' | 'concluida';
  attachments: string[];
}

interface MaintenanceRegisterProps {
  machine: Machine;
  maintenances: Maintenance[];
  onBack: () => void;
  onAddMaintenance: (maintenance: Omit<Maintenance, 'id'>) => void;
  onDeleteMaintenance: (id: number) => void;
  onCompleteMaintenance: (id: number) => void;
}

export function MaintenanceRegister({ 
  machine, 
  maintenances, 
  onBack, 
  onAddMaintenance, 
  onDeleteMaintenance,
  onCompleteMaintenance 
}: MaintenanceRegisterProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setAttachments([...attachments, ...fileUrls]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type.trim() || !description.trim() || !scheduledDate) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onAddMaintenance({
      machineId: machine.id,
      machineName: machine.name,
      type,
      description,
      scheduledDate,
      status: 'programada',
      attachments
    });

    // Limpar formulário
    setType('');
    setDescription('');
    setScheduledDate('');
    setAttachments([]);
  };

  const machineMaintenance = maintenances.filter(m => m.machineId === machine.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-6 shadow-2xl">
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
              <Wrench className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">Manutenções - {machine.name}</h1>
              <p className="text-orange-100 text-sm">Placa: {machine.plate} | Modelo: {machine.model}</p>
            </div>
          </div>
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
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Registration Form */}
        <Card className="bg-white shadow-2xl rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Plus className="size-6 text-orange-600" />
            <h2 className="text-slate-800 text-2xl">Programar Manutenção</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-700">
                  Tipo de Manutenção *
                </Label>
                <Input
                  id="type"
                  type="text"
                  placeholder="Ex: Troca de óleo, Revisão geral, Troca de filtros"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="border-slate-300 focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledDate" className="text-slate-700">
                  Data Programada *
                </Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="border-slate-300 focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-slate-700">
                  Descrição *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva os detalhes da manutenção..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-slate-300 focus:border-orange-500 min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-700">
                  Anexar Imagens
                </Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    id="fileUpload"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <Upload className="size-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 text-sm">Clique para selecionar imagens</p>
                  </label>
                </div>
                
                {attachments.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {attachments.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Anexo ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="px-8"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8"
              >
                <Plus className="size-5 mr-2" />
                Programar Manutenção
              </Button>
            </div>
          </form>
        </Card>

        {/* Maintenances List */}
        <Card className="bg-white shadow-2xl rounded-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-b">
            <h2 className="text-slate-800 text-xl">Manutenções Programadas</h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-slate-700">Tipo</TableHead>
                  <TableHead className="text-slate-700">Descrição</TableHead>
                  <TableHead className="text-slate-700">Data Programada</TableHead>
                  <TableHead className="text-slate-700">Status</TableHead>
                  <TableHead className="text-center text-slate-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineMaintenance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhuma manutenção programada ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  machineMaintenance.map((maintenance, index) => (
                    <TableRow 
                      key={maintenance.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      <TableCell className="text-slate-900">
                        <div className="flex items-center gap-2">
                          <Wrench className="size-4 text-orange-600" />
                          {maintenance.type}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700 max-w-xs truncate">
                        {maintenance.description}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {new Date(maintenance.scheduledDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {maintenance.status === 'programada' ? (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                            <AlertCircle className="size-3" />
                            Programada
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                            Concluída
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {maintenance.status === 'programada' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => onCompleteMaintenance(maintenance.id)}
                              title="Marcar como concluída"
                            >
                              Concluir
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja deletar esta manutenção?')) {
                                onDeleteMaintenance(maintenance.id);
                              }
                            }}
                            title="Deletar manutenção"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 pb-6 text-center">
        <p className="text-slate-500 text-sm">Desenvolvido por Allan Diniz</p>
      </div>
    </div>
  );
}
