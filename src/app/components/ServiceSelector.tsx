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
    <div className="relative w-fit mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 min-w-[250px] justify-between"
      >
        <span className="flex items-center gap-2">
          {selectedService ? (
            <>
              <img src={selectedService.icon} alt="" className="w-5 h-5 rounded-full" />
              <span>{selectedService.name}</span>
            </>
          ) : (
            'Выбрать сервис'
          )}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-[250px] bg-white rounded-xl border border-gray-300 shadow-lg z-10 py-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                onServiceChange(service);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <img src={service.icon} alt="" className="w-5 h-5 rounded-full" />
              <span>{service.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}