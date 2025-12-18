import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { DailySchedule } from './components/DailySchedule';
import { NewSchedule } from './components/NewSchedule';
import { MachineRegister } from './components/MachineRegister';
import { OperatorRegister } from './components/OperatorRegister';
import { ScheduleDetails } from './components/ScheduleDetails';
import { CalendarView } from './components/CalendarView';
import { MapView } from './components/MapView';
import { MaintenanceRegister } from './components/MaintenanceRegister';
import { FuelRegister } from './components/FuelRegister';
import logo from './assets/logo.png';

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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [currentView, setCurrentView] = useState<'schedule' | 'new' | 'machines' | 'operators' | 'details' | 'calendar' | 'map' | 'maintenance' | 'fuel'>('schedule');
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(null);
  
  const [schedules, setSchedules] = useState<ScheduleData[]>([
    {
      id: 1,
      date: '24/11/2025',
      time: '08:00',
      machine: 'Prassi',
      operator: 'Igor Silva',
      location: 'Viana - ES',
      plate: 'ABC-1234',
      status: 'em-andamento',
      description: 'Manutenção preventiva da máquina',
      attachments: []
    },
    {
      id: 2,
      date: '24/11/2025',
      time: '09:00',
      machine: 'BG',
      operator: 'João Santos',
      location: 'Vila Velha - ES',
      plate: 'XYZ-5678',
      status: 'agendado',
      description: 'Instalação de equipamento',
      attachments: []
    },
    {
      id: 3,
      date: '24/11/2025',
      time: '10:00',
      machine: 'Prassi',
      operator: 'Pedro Costa',
      location: 'Cariacica - ES',
      plate: 'ABC-1234',
      status: 'concluido',
      description: 'Serviço de içamento',
      attachments: []
    },
    {
      id: 4,
      date: '24/11/2025',
      time: '14:00',
      machine: 'Guzzo',
      operator: 'Mateus Oliveira',
      location: 'Vitória - ES',
      plate: 'GHI-3456',
      status: 'agendado',
      description: 'Transporte de carga',
      attachments: []
    },
    {
      id: 5,
      date: '24/11/2025',
      time: '15:00',
      machine: 'BG',
      operator: 'Carlos Ferreira',
      location: 'Serra - ES',
      plate: 'XYZ-5678',
      status: 'em-andamento',
      description: 'Montagem de estrutura',
      attachments: []
    },
    {
      id: 6,
      date: '24/11/2025',
      time: '16:00',
      machine: 'Prassi',
      operator: 'Lucas Almeida',
      location: 'Guarapari - ES',
      plate: 'ABC-1234',
      status: 'agendado',
      description: 'Desmontagem de equipamento',
      attachments: []
    }
  ]);

  const [machines, setMachines] = useState<Machine[]>([
    { id: 1, name: 'Prassi', model: '2024', plate: 'ABC-1234', status: 'ativa' },
    { id: 2, name: 'BG', model: 'Premium', plate: 'XYZ-5678', status: 'ativa' },
    { id: 3, name: 'Guzzo', model: 'Standard', plate: 'GHI-3456', status: 'ativa' },
  ]);

  const [operators, setOperators] = useState<Operator[]>([
    { id: 1, name: 'Igor Silva', phone: '(27) 99999-1111', email: 'igor@email.com', password: 'senha123', status: 'ativo' },
    { id: 2, name: 'João Santos', phone: '(27) 99999-2222', email: 'joao@email.com', password: 'senha123', status: 'ativo' },
    { id: 3, name: 'Pedro Costa', phone: '(27) 99999-3333', email: 'pedro@email.com', password: 'senha123', status: 'ativo' },
    { id: 4, name: 'Mateus Oliveira', phone: '(27) 99999-4444', email: 'mateus@email.com', password: 'senha123', status: 'ativo' },
    { id: 5, name: 'Carlos Ferreira', phone: '(27) 99999-5555', email: 'carlos@email.com', password: 'senha123', status: 'ativo' },
    { id: 6, name: 'Lucas Almeida', phone: '(27) 99999-6666', email: 'lucas@email.com', password: 'senha123', status: 'ativo' },
  ]);

  const [maintenances, setMaintenances] = useState<Maintenance[]>([
    { id: 1, machineId: 1, machineName: 'Prassi', type: 'preventiva', description: 'Troca de óleo', scheduledDate: '2025-11-24', completedDate: '2025-11-24', status: 'concluida', attachments: [] },
    { id: 2, machineId: 2, machineName: 'BG', type: 'corretiva', description: 'Reparo de motor', scheduledDate: '2025-11-24', completedDate: '2025-11-24', status: 'concluida', attachments: [] },
    { id: 3, machineId: 3, machineName: 'Guzzo', type: 'preventiva', description: 'Limpeza de filtros', scheduledDate: '2025-11-24', completedDate: '2025-11-24', status: 'concluida', attachments: [] },
  ]);

  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([
    { id: 1, machineId: 1, machineName: 'Prassi', date: '2025-11-24', liters: 100, totalValue: 500, odometer: 50000, paymentStatus: 'pago', description: 'Abastecimento diário', attachments: [] },
    { id: 2, machineId: 2, machineName: 'BG', date: '2025-11-24', liters: 150, totalValue: 750, odometer: 60000, paymentStatus: 'pago', description: 'Abastecimento diário', attachments: [] },
    { id: 3, machineId: 3, machineName: 'Guzzo', date: '2025-11-24', liters: 120, totalValue: 600, odometer: 55000, paymentStatus: 'pago', description: 'Abastecimento diário', attachments: [] },
  ]);

  const handleLogin = (email: string, password: string) => {
    // Verificar se é o administrador
    if (email === 'admin@admin' && password === 'admin') {
      setIsLoggedIn(true);
      setCurrentUser('Administrador');
      return true;
    }
    
    // Verificar se é um operador cadastrado
    const operator = operators.find(op => op.email === email && op.password === password);
    if (operator) {
      setIsLoggedIn(true);
      setCurrentUser(operator.name);
      return true;
    }
    return false;
  };

  const handleNewSchedule = () => {
    setCurrentView('new');
  };

  const handleBackToSchedule = () => {
    setCurrentView('schedule');
    setSelectedScheduleId(null);
  };

  const handleSaveSchedule = (data: Omit<ScheduleData, 'id'>) => {
    // Validar conflito de agenda
    const hasConflict = schedules.some(schedule => 
      schedule.operator === data.operator && 
      schedule.date === data.date && 
      schedule.time === data.time &&
      schedule.status !== 'concluido'
    );

    if (hasConflict) {
      alert('CONFLITO DE AGENDA: Este operador já possui uma programação para este horário!');
      return;
    }

    const newSchedule = {
      ...data,
      id: schedules.length + 1
    };
    setSchedules([...schedules, newSchedule]);
    setCurrentView('schedule');
  };

  const handleUpdateSchedule = (id: number, data: Partial<ScheduleData>) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, ...data } : schedule
    ));
    setCurrentView('schedule');
  };

  const handleDeleteSchedule = (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta programação?')) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    }
  };

  const handleCompleteSchedule = (id: number) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id 
        ? { ...schedule, status: 'concluido' } 
        : schedule
    ));
  };

  const handleSelectSchedule = (id: number) => {
    setSelectedScheduleId(id);
    setCurrentView('details');
  };

  const handleRegisterMachine = () => {
    setCurrentView('machines');
  };

  const handleRegisterOperator = () => {
    setCurrentView('operators');
  };

  const handleViewCalendar = () => {
    setCurrentView('calendar');
  };

  const handleViewMap = () => {
    setCurrentView('map');
  };

  const handleAddMachine = (data: Omit<Machine, 'id'>) => {
    const newMachine = {
      ...data,
      id: machines.length + 1
    };
    setMachines([...machines, newMachine]);
  };

  const handleDeleteMachine = (id: number) => {
    setMachines(machines.filter(machine => machine.id !== id));
  };

  const handleUpdateMachine = (id: number, data: Partial<Machine>) => {
    setMachines(machines.map(machine => 
      machine.id === id ? { ...machine, ...data } : machine
    ));
  };

  const handleAddOperator = (data: Omit<Operator, 'id'>) => {
    const newOperator = {
      ...data,
      id: operators.length + 1
    };
    setOperators([...operators, newOperator]);
  };

  const handleDeleteOperator = (id: number) => {
    setOperators(operators.filter(operator => operator.id !== id));
  };

  const handleUpdateOperator = (id: number, data: Partial<Operator>) => {
    setOperators(operators.map(operator => 
      operator.id === id ? { ...operator, ...data } : operator
    ));
  };

  const handleAddMaintenance = (data: Omit<Maintenance, 'id'>) => {
    const newMaintenance = {
      ...data,
      id: maintenances.length + 1
    };
    setMaintenances([...maintenances, newMaintenance]);
  };

  const handleDeleteMaintenance = (id: number) => {
    setMaintenances(maintenances.filter(maintenance => maintenance.id !== id));
  };

  const handleUpdateMaintenance = (id: number, data: Partial<Maintenance>) => {
    setMaintenances(maintenances.map(maintenance => 
      maintenance.id === id ? { ...maintenance, ...data } : maintenance
    ));
  };

  const handleAddFuelRecord = (data: Omit<FuelRecord, 'id'>) => {
    const newFuelRecord = {
      ...data,
      id: fuelRecords.length + 1
    };
    setFuelRecords([...fuelRecords, newFuelRecord]);
  };

  const handleDeleteFuelRecord = (id: number) => {
    setFuelRecords(fuelRecords.filter(fuelRecord => fuelRecord.id !== id));
  };

  const handleUpdateFuelRecord = (id: number, data: Partial<FuelRecord>) => {
    setFuelRecords(fuelRecords.map(fuelRecord => 
      fuelRecord.id === id ? { ...fuelRecord, ...data } : fuelRecord
    ));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <img 
                src={logo} 
                alt="Logo JP Usinagem & Guindastes" 
                className="h-24 w-auto"
              />
            </div>
          </div>
          <LoginForm onLogin={handleLogin} />
        </div>
        
        <div className="mt-12">
          <p className="text-slate-400 text-sm">Desenvolvido por Allan Diniz</p>
        </div>
      </div>
    );
  }

  if (currentView === 'new') {
    return (
      <NewSchedule 
        onBack={handleBackToSchedule} 
        onSave={handleSaveSchedule}
        machines={machines}
        operators={operators}
        schedules={schedules}
      />
    );
  }

  if (currentView === 'details' && selectedScheduleId) {
    const schedule = schedules.find(s => s.id === selectedScheduleId);
    if (!schedule) {
      setCurrentView('schedule');
      return null;
    }
    return (
      <ScheduleDetails
        schedule={schedule}
        machines={machines}
        operators={operators}
        schedules={schedules}
        onBack={handleBackToSchedule}
        onSave={handleUpdateSchedule}
        onDelete={handleDeleteSchedule}
      />
    );
  }

  if (currentView === 'machines') {
    return (
      <MachineRegister 
        machines={machines} 
        onBack={handleBackToSchedule} 
        onAddMachine={handleAddMachine} 
        onDeleteMachine={handleDeleteMachine}
        onUpdateMachine={handleUpdateMachine}
        onViewMaintenance={(machineId) => {
          setSelectedMachineId(machineId);
          setCurrentView('maintenance');
        }}
        onViewFuel={(machineId) => {
          setSelectedMachineId(machineId);
          setCurrentView('fuel');
        }}
      />
    );
  }

  if (currentView === 'operators') {
    return (
      <OperatorRegister 
        operators={operators} 
        onBack={handleBackToSchedule} 
        onAddOperator={handleAddOperator} 
        onDeleteOperator={handleDeleteOperator}
        onUpdateOperator={handleUpdateOperator}
      />
    );
  }

  if (currentView === 'calendar') {
    return (
      <CalendarView
        schedules={schedules}
        maintenances={maintenances}
        onBack={handleBackToSchedule}
        onSelectSchedule={handleSelectSchedule}
      />
    );
  }

  if (currentView === 'map') {
    return (
      <MapView
        schedules={schedules}
        operators={operators}
        onBack={handleBackToSchedule}
      />
    );
  }

  if (currentView === 'maintenance' && selectedMachineId) {
    const machine = machines.find(m => m.id === selectedMachineId);
    if (!machine) {
      setCurrentView('machines');
      return null;
    }
    return (
      <MaintenanceRegister
        machine={machine}
        maintenances={maintenances}
        onBack={() => setCurrentView('machines')}
        onAddMaintenance={handleAddMaintenance}
        onDeleteMaintenance={handleDeleteMaintenance}
        onCompleteMaintenance={(id) => {
          handleUpdateMaintenance(id, { status: 'concluida' });
        }}
      />
    );
  }

  if (currentView === 'fuel' && selectedMachineId) {
    const machine = machines.find(m => m.id === selectedMachineId);
    if (!machine) {
      setCurrentView('machines');
      return null;
    }
    return (
      <FuelRegister
        machine={machine}
        fuelRecords={fuelRecords}
        onBack={() => setCurrentView('machines')}
        onAddFuelRecord={handleAddFuelRecord}
        onDeleteFuelRecord={handleDeleteFuelRecord}
      />
    );
  }

  return (
    <DailySchedule 
      schedules={schedules} 
      onNewSchedule={handleNewSchedule} 
      onDeleteSchedule={handleDeleteSchedule} 
      onCompleteSchedule={handleCompleteSchedule}
      onSelectSchedule={handleSelectSchedule}
      onMachineRegister={handleRegisterMachine} 
      onOperatorRegister={handleRegisterOperator}
      onViewCalendar={handleViewCalendar}
      onViewMap={handleViewMap}
    />
  );
}