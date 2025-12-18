import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { ArrowLeft, Calendar, Clock, Users, Plus, Trash2, Phone, Mail, Edit2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Operator {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
  status: 'ativo' | 'ferias' | 'afastado';
}

interface OperatorRegisterProps {
  operators: Operator[];
  onBack: () => void;
  onAddOperator: (operator: Omit<Operator, 'id'>) => void;
  onDeleteOperator: (id: number) => void;
  onUpdateOperator: (id: number, data: Partial<Operator>) => void;
}

export function OperatorRegister({ operators, onBack, onAddOperator, onDeleteOperator, onUpdateOperator }: OperatorRegisterProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [operatorPhone, setOperatorPhone] = useState('');
  const [operatorEmail, setOperatorEmail] = useState('');
  const [operatorPassword, setOperatorPassword] = useState('');
  const [operatorStatus, setOperatorStatus] = useState<'ativo' | 'ferias' | 'afastado'>('ativo');
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
    
    if (!operatorName.trim() || !operatorPhone.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (editingId !== null) {
      onUpdateOperator(editingId, {
        name: operatorName,
        phone: operatorPhone,
        email: operatorEmail,
        password: operatorPassword,
        status: operatorStatus
      });
      setEditingId(null);
    } else {
      onAddOperator({
        name: operatorName,
        phone: operatorPhone,
        email: operatorEmail,
        password: operatorPassword,
        status: operatorStatus
      });
    }

    // Limpar formulário
    setOperatorName('');
    setOperatorPhone('');
    setOperatorEmail('');
    setOperatorPassword('');
    setOperatorStatus('ativo');
  };

  const handleEdit = (operator: Operator) => {
    setEditingId(operator.id);
    setOperatorName(operator.name);
    setOperatorPhone(operator.phone);
    setOperatorEmail(operator.email);
    setOperatorPassword(operator.password);
    setOperatorStatus(operator.status);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setOperatorName('');
    setOperatorPhone('');
    setOperatorEmail('');
    setOperatorPassword('');
    setOperatorStatus('ativo');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Ativo</span>;
      case 'ferias':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">Férias</span>;
      case 'afastado':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">Afastado</span>;
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
              <Users className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">Cadastro de Operadores</h1>
              <p className="text-blue-100 text-sm">Gerencie seus operadores</p>
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
                <h2 className="text-slate-800 text-2xl">Editar Operador</h2>
              </>
            ) : (
              <>
                <Plus className="size-6 text-blue-600" />
                <h2 className="text-slate-800 text-2xl">Novo Operador</h2>
              </>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="operatorName" className="text-slate-700">
                  Nome Completo *
                </Label>
                <Input
                  id="operatorName"
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatorPhone" className="text-slate-700">
                  Telefone *
                </Label>
                <Input
                  id="operatorPhone"
                  type="tel"
                  placeholder="(27) 99999-9999"
                  value={operatorPhone}
                  onChange={(e) => setOperatorPhone(e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatorEmail" className="text-slate-700">
                  Email
                </Label>
                <Input
                  id="operatorEmail"
                  type="email"
                  placeholder="operador@email.com"
                  value={operatorEmail}
                  onChange={(e) => setOperatorEmail(e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatorPassword" className="text-slate-700">
                  Senha
                </Label>
                <Input
                  id="operatorPassword"
                  type="password"
                  placeholder="********"
                  value={operatorPassword}
                  onChange={(e) => setOperatorPassword(e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatorStatus" className="text-slate-700">
                  Status
                </Label>
                <select
                  id="operatorStatus"
                  value={operatorStatus}
                  onChange={(e) => setOperatorStatus(e.target.value as 'ativo' | 'ferias' | 'afastado')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ativo">Ativo</option>
                  <option value="ferias">Férias</option>
                  <option value="afastado">Afastado</option>
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
                    Atualizar Operador
                  </>
                ) : (
                  <>
                    <Plus className="size-5 mr-2" />
                    Adicionar Operador
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Operators List */}
        <Card className="bg-white shadow-2xl rounded-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-b">
            <h2 className="text-slate-800 text-xl">Operadores Cadastrados</h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-slate-700">Nome</TableHead>
                  <TableHead className="text-slate-700">Telefone</TableHead>
                  <TableHead className="text-slate-700">Email</TableHead>
                  <TableHead className="text-slate-700">Status</TableHead>
                  <TableHead className="text-center text-slate-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhum operador cadastrado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  operators.map((operator, index) => (
                    <TableRow 
                      key={operator.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      <TableCell className="text-slate-900">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-blue-600" />
                          {operator.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="flex items-center gap-2">
                          <Phone className="size-4 text-slate-400" />
                          {operator.phone}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {operator.email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="size-4 text-slate-400" />
                            {operator.email}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(operator.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja deletar este operador?')) {
                                onDeleteOperator(operator.id);
                              }
                            }}
                            title="Deletar operador"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                            onClick={() => handleEdit(operator)}
                            title="Editar operador"
                          >
                            <Edit2 className="size-4" />
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