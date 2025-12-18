import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Calendar, Clock, Fuel, Plus, Trash2, Upload, X, CheckCircle, XCircle } from 'lucide-react';
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

interface FuelRecord {
  id: number;
  machineId: number;
  machineName: string;
  date: string;
  liters: number;
  totalValue: number;
  odometer?: number;
  paymentStatus: 'pago' | 'ressarcido';
  description?: string;
  attachments: string[];
}

interface FuelRegisterProps {
  machine: Machine;
  fuelRecords: FuelRecord[];
  onBack: () => void;
  onAddFuelRecord: (record: Omit<FuelRecord, 'id'>) => void;
  onDeleteFuelRecord: (id: number) => void;
}

export function FuelRegister({ 
  machine, 
  fuelRecords, 
  onBack, 
  onAddFuelRecord, 
  onDeleteFuelRecord 
}: FuelRegisterProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [date, setDate] = useState('');
  const [liters, setLiters] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [odometer, setOdometer] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pago' | 'ressarcido'>('pago');
  const [description, setDescription] = useState('');
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
    
    if (!date || !liters || !totalValue) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onAddFuelRecord({
      machineId: machine.id,
      machineName: machine.name,
      date,
      liters: parseFloat(liters),
      totalValue: parseFloat(totalValue),
      odometer: odometer ? parseFloat(odometer) : undefined,
      paymentStatus,
      description,
      attachments
    });

    // Limpar formulário
    setDate('');
    setLiters('');
    setTotalValue('');
    setOdometer('');
    setPaymentStatus('pago');
    setDescription('');
    setAttachments([]);
  };

  const machineFuelRecords = fuelRecords.filter(r => r.machineId === machine.id);

  // Calcular totais
  const totalLiters = machineFuelRecords.reduce((sum, record) => sum + record.liters, 0);
  const totalSpent = machineFuelRecords.reduce((sum, record) => sum + record.totalValue, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6 shadow-2xl">
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
              <Fuel className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">Abastecimentos - {machine.name}</h1>
              <p className="text-emerald-100 text-sm">Placa: {machine.plate} | Modelo: {machine.model}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Date and Time Display */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-5 border-b border-slate-600 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
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
          <div className="flex gap-4">
            <div className="bg-emerald-500/20 px-6 py-3 rounded-lg backdrop-blur-sm border border-emerald-400/30">
              <p className="text-emerald-300 text-xs uppercase tracking-wide">Total Litros</p>
              <p className="text-white">{totalLiters.toFixed(2)} L</p>
            </div>
            <div className="bg-emerald-500/20 px-6 py-3 rounded-lg backdrop-blur-sm border border-emerald-400/30">
              <p className="text-emerald-300 text-xs uppercase tracking-wide">Total Gasto</p>
              <p className="text-white">R$ {totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Registration Form */}
        <Card className="bg-white shadow-2xl rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Plus className="size-6 text-emerald-600" />
            <h2 className="text-slate-800 text-2xl">Registrar Abastecimento</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-700">
                  Data *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-slate-300 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liters" className="text-slate-700">
                  Litros *
                </Label>
                <Input
                  id="liters"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 100.50"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  className="border-slate-300 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalValue" className="text-slate-700">
                  Valor Total (R$) *
                </Label>
                <Input
                  id="totalValue"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 550.00"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  className="border-slate-300 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="odometer" className="text-slate-700">
                  Hodômetro (km)
                </Label>
                <Input
                  id="odometer"
                  type="number"
                  placeholder="Ex: 12500"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="border-slate-300 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentStatus" className="text-slate-700">
                  Status de Pagamento *
                </Label>
                <select
                  id="paymentStatus"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as 'pago' | 'ressarcido')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="pago">Pago</option>
                  <option value="ressarcido">Ressarcido</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="description" className="text-slate-700">
                  Observações
                </Label>
                <Textarea
                  id="description"
                  placeholder="Informações adicionais sobre o abastecimento..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-slate-300 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label className="text-slate-700">
                  Anexar Comprovantes/Imagens
                </Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
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
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8"
              >
                <Plus className="size-5 mr-2" />
                Registrar Abastecimento
              </Button>
            </div>
          </form>
        </Card>

        {/* Fuel Records List */}
        <Card className="bg-white shadow-2xl rounded-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-b">
            <h2 className="text-slate-800 text-xl">Histórico de Abastecimentos</h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-slate-700">Data</TableHead>
                  <TableHead className="text-slate-700">Litros</TableHead>
                  <TableHead className="text-slate-700">Valor Total</TableHead>
                  <TableHead className="text-slate-700">Hodômetro</TableHead>
                  <TableHead className="text-slate-700">Status Pagamento</TableHead>
                  <TableHead className="text-center text-slate-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineFuelRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Nenhum abastecimento registrado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  machineFuelRecords.map((record, index) => (
                    <TableRow 
                      key={record.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      <TableCell className="text-slate-900">
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {record.liters.toFixed(2)} L
                      </TableCell>
                      <TableCell className="text-slate-700">
                        R$ {record.totalValue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {record.odometer ? `${record.odometer} km` : '-'}
                      </TableCell>
                      <TableCell>
                        {record.paymentStatus === 'pago' ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                            <CheckCircle className="size-3" />
                            Pago
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                            <XCircle className="size-3" />
                            Ressarcido
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja deletar este registro?')) {
                                onDeleteFuelRecord(record.id);
                              }
                            }}
                            title="Deletar registro"
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
