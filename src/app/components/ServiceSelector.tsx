import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Import service icons
import directIcon from '../../assets/4fc638e88f2e51da614acd43317324d0549754f9.png';
import businessIcon from '../../assets/ya_business.png';
import metrikaIcon from '../../assets/4aa17a4963e1fb88045ac65ae472565cb05c64e9.png';
import viewIcon from '../../assets/de12ec5e3a90550bccc89beb2cfacc964d595d13.png';
import rsyaIcon from '../../assets/55145204d5155184866da8f7f4aaa6dea42b5830.png';

export interface Service {
  id: string;
  name: string;
  icon: string;
}

export const services: Service[] = [
  { id: 'direct', name: 'Яндекс Директ', icon: directIcon },
  { id: 'rsya', name: 'РСЯ', icon: rsyaIcon },
  { id: 'business', name: 'Яндекс Бизнес', icon: businessIcon },
  { id: 'metrika', name: 'Яндекс Метрика', icon: metrikaIcon },
  { id: 'view', name: 'Яндекс Взгляд', icon: viewIcon },
];

interface ServiceSelectorProps {
  selectedService: Service | null;
  onServiceChange: (service: Service) => void;
}

export function ServiceSelector({
  selectedService,
  onServiceChange,
}: ServiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-fit mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all min-w-[280px] justify-between text-white"
      >
        <span className="flex items-center gap-3">
          {selectedService ? (
            <>
              <img src={selectedService.icon} alt="" className="w-6 h-6 rounded-full" />
              <span className="font-medium">{selectedService.name}</span>
            </>
          ) : (
            <span className="font-medium">Выбрать сервис</span>
          )}
        </span>
        <ChevronDown className="w-5 h-5 text-white/70" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-[280px] bg-white rounded-2xl border border-gray-200 shadow-2xl z-10 py-2 overflow-hidden">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                onServiceChange(service);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-[#191E28]"
            >
              <img src={service.icon} alt="" className="w-6 h-6 rounded-full" />
              <span className="font-medium">{service.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}