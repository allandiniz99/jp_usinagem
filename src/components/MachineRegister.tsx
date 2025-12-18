import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { ArrowLeft, Calendar, Clock, Cog, Plus, Trash2, Edit2, Wrench, Fuel } from 'lucide-react';
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

interface MachineRegisterProps {
  machines: Machine[];
  onBack: () => void;
  onAddMachine: (machine: Omit<Machine, 'id'>) => void;
  onDeleteMachine: (id: number) => void;
  onUpdateMachine: (id: number, data: Partial<Machine>) => void;
  onViewMaintenance?: (machineId: number) => void;
  onViewFuel?: (machineId: number) => void;
}

export function MachineRegister({ machines, onBack, onAddMachine, onDeleteMachine, onUpdateMachine, onViewMaintenance, onViewFuel }: MachineRegisterProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [machineName, setMachineName] = useState('');
  const [machineModel, setMachineModel] = useState('');
  const [machinePlate, setMachinePlate] = useState('');
  const [machineStatus, setMachineStatus] = useState<'ativa' | 'manutencao' | 'inativa'>('ativa');
  const [editingId, setEditingId] = useState<number | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!machineName.trim() || !machineModel.trim() || !machinePlate.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (editingId !== null) {
      onUpdateMachine(editingId, {
        name: machineName,
        model: machineModel,
        plate: machinePlate,
        status: machineStatus
      });
      setEditingId(null);
    } else {
      onAddMachine({
        name: machineName,
        model: machineModel,
        plate: machinePlate,
        status: machineStatus
      });
    }

    // Limpar formulário
    setMachineName('');
    setMachineModel('');
    setMachinePlate('');
    setMachineStatus('ativa');
  };

  const handleEdit = (machine: Machine) => {
    setEditingId(machine.id);
    setMachineName(machine.name);
    setMachineModel(machine.model);
    setMachinePlate(machine.plate);
    setMachineStatus(machine.status);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMachineName('');
    setMachineModel('');
    setMachinePlate('');
    setMachineStatus('ativa');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Ativa</span>;
      case 'manutencao':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Manutenção</span>;
      case 'inativa':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">Inativa</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">Desconhecido</span>;
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
              <Cog className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">Cadastro de Máquinas</h1>
              <p className="text-blue-100 text-sm">Gerencie suas máquinas</p>
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
            {editingId ? (
              <>
                <Edit2 className="size-6 text-blue-600" />
                <h2 className="text-slate-800 text-2xl">Editar Máquina</h2>
              </>
            ) : (
              <>
                <Plus className="size-6 text-blue-600" />
                <h2 className="text-slate-800 text-2xl">Nova Máquina</h2>
              </>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="machineName" className="text-slate-700">
                  Nome da Máquina *
                </Label>
                <Input
                  id="machineName"
                  type="text"
                  placeholder="Ex: Prassi, BG, Guzzo"
                  value={machineName}
                  onChange={(e) => setMachineName(e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="machineModel" className="text-slate-700">
                  Modelo *
                </Label>
                <Input
                  id="machineModel"
                  type="text"
                  placeholder="Ex: 2024, Premium, Standard"
                  value={machineModel}
                  onChange={(e) => setMachineModel(e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="machinePlate" className="text-slate-700">
                  Placa *
                </Label>
                <Input
                  id="machinePlate"
                  type="text"
                  placeholder="Ex: ABC-1234"
                  value={machinePlate}
                  onChange={(e) => setMachinePlate(e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="machineStatus" className="text-slate-700">
                  Status
                </Label>
                <select
                  id="machineStatus"
                  value={machineStatus}
                  onChange={(e) => setMachineStatus(e.target.value as 'ativa' | 'manutencao' | 'inativa')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ativa">Ativa</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="inativa">Inativa</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="px-8"
                >
                  Limpar
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="px-8"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8"
              >
                {editingId ? (
                  <>
                    <Edit2 className="size-5 mr-2" />
                    Atualizar Máquina
                  </>
                ) : (
                  <>
                    <Plus className="size-5 mr-2" />
                    Adicionar Máquina
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Machines List */}
        <Card className="bg-white shadow-2xl rounded-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-b">
            <h2 className="text-slate-800 text-xl">Máquinas Cadastradas</h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-slate-700">Nome</TableHead>
                  <TableHead className="text-slate-700">Modelo</TableHead>
                  <TableHead className="text-slate-700">Placa</TableHead>
                  <TableHead className="text-slate-700">Status</TableHead>
                  <TableHead className="text-center text-slate-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhuma máquina cadastrada ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  machines.map((machine, index) => (
                    <TableRow 
                      key={machine.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      <TableCell className="text-slate-900">
                        <div className="flex items-center gap-2">
                          <Cog className="size-4 text-blue-600" />
                          {machine.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">{machine.model}</TableCell>
                      <TableCell className="text-slate-700">{machine.plate}</TableCell>
                      <TableCell>{getStatusBadge(machine.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja deletar esta máquina?')) {
                                onDeleteMachine(machine.id);
                              }
                            }}
                            title="Deletar máquina"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                            onClick={() => handleEdit(machine)}
                            title="Editar máquina"
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          {onViewMaintenance && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-400"
                              onClick={() => onViewMaintenance(machine.id)}
                              title="Manutenção"
                            >
                              <Wrench className="size-4" />
                            </Button>
                          )}
                          {onViewFuel && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
                              onClick={() => onViewFuel(machine.id)}
                              title="Combustível"
                            >
                              <Fuel className="size-4" />
                            </Button>
                          )}
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