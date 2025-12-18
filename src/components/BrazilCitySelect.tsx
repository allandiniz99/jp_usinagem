import { useState, useMemo } from 'react';
import { Label } from './ui/label';

interface BrazilCitySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

// Lista de cidades principais do Brasil por estado
const brazilCities = {
  'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'],
  'AL': ['Maceió', 'Arapiraca', 'Palmeira dos Índios'],
  'AP': ['Macapá', 'Santana', 'Laranjal do Jari'],
  'AM': ['Manaus', 'Parintins', 'Itacoatiara'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro'],
  'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú'],
  'DF': ['Brasília'],
  'ES': ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Viana', 'Guarapari', 'Linhares', 'Cachoeiro de Itapemirim', 'São Mateus', 'Colatina'],
  'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde'],
  'MA': ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon'],
  'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop'],
  'MS': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros'],
  'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá'],
  'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos'],
  'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'Foz do Iguaçu'],
  'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Paulista', 'Caruaru'],
  'PI': ['Teresina', 'Parnaíba', 'Picos', 'Floriano'],
  'RJ': ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo'],
  'RN': ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Gravataí'],
  'RO': ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena'],
  'RR': ['Boa Vista', 'Rorainópolis', 'Caracaraí'],
  'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó', 'Criciúma'],
  'SE': ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana'],
  'SP': ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco', 'São José dos Campos', 'Ribeirão Preto', 'Sorocaba', 'Santos'],
  'TO': ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional']
};

export function BrazilCitySelect({ value, onChange, label = 'Cidade', required = false }: BrazilCitySelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Criar lista completa de cidades com formato "Cidade - UF"
  const allCities = useMemo(() => {
    const cities: string[] = [];
    Object.entries(brazilCities).forEach(([state, stateCities]) => {
      stateCities.forEach(city => {
        cities.push(`${city} - ${state}`);
      });
    });
    return cities.sort();
  }, []);

  // Filtrar cidades baseado na busca e estado selecionado
  const filteredCities = useMemo(() => {
    let cities = allCities;
    
    if (selectedState) {
      cities = cities.filter(city => city.endsWith(` - ${selectedState}`));
    }
    
    if (searchTerm) {
      cities = cities.filter(city => 
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return cities;
  }, [allCities, searchTerm, selectedState]);

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-slate-700">
          {label} {required && '*'}
        </Label>
      )}
      
      <div className="space-y-2">
        {/* Filtro por Estado */}
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">Todos os Estados</option>
          {Object.keys(brazilCities).sort().map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar cidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Select de cidades */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma cidade</option>
          {filteredCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
