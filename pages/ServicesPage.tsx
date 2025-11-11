import React, { useState } from 'react';
import { PlusIcon, XIcon, ChevronDownIcon } from '../components/icons';
import { Service } from '../types';

interface ServiceModalProps {
    onClose: () => void;
    onAddService: (service: Omit<Service, 'id'>) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ onClose, onAddService }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(60);
    const [price, setPrice] = useState('0,00');
    const [includeMoms, setIncludeMoms] = useState(false);
    const [color, setColor] = useState('#e0f2fe');

    const handleSubmit = () => {
        if (!name) {
            alert('Navn er påkrævet.');
            return;
        }

        const priceNumber = parseFloat(price.replace(',', '.'));
        if (isNaN(priceNumber)) {
            alert('Ugyldig pris. Brug komma som decimaladskiller.');
            return;
        }

        onAddService({
            name,
            description,
            duration,
            price: priceNumber,
            includeMoms,
            color,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Opret ny ydelse</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Navn</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
                        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Varighed</label>
                            <div className="relative mt-1">
                                <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="appearance-none w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value={30}>30 minutter</option>
                                    <option value={45}>45 minutter</option>
                                    <option value={60}>1 time</option>
                                    <option value={90}>1.5 timer</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Spærretid</label>
                             <div className="relative mt-1">
                                <select className="appearance-none w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option>Ingen spærretid</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Farve</label>
                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 block w-full h-10 border border-gray-300 rounded-md cursor-pointer" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Pris</label>
                        <div className="mt-1 flex items-center space-x-4">
                            <div className="relative rounded-md shadow-sm">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 sm:text-sm">DKK</span>
                                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="pl-12 pr-4 py-2 w-full border border-gray-300 rounded-md" />
                            </div>
                            <div className="flex items-center">
                                <button 
                                    type="button" 
                                    onClick={() => setIncludeMoms(!includeMoms)}
                                    className={`${includeMoms ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`} 
                                    role="switch" 
                                    aria-checked={includeMoms}
                                >
                                    <span className="sr-only">Use setting</span>
                                    <span 
                                        aria-hidden="true" 
                                        className={`${includeMoms ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                    ></span>
                                </button>
                                <span className="ml-3 text-sm font-medium text-gray-900">Moms</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                     <button onClick={handleSubmit} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Næste
                    </button>
                </div>
            </div>
        </div>
    );
};

const initialServices: Service[] = [
    {
        id: '1',
        name: 'Førstegangskonsultation',
        description: 'En grundig undersøgelse og behandling.',
        duration: 45,
        price: 10.00,
        includeMoms: true,
        color: '#e0f2fe',
    }
];

const ServicesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [services, setServices] = useState<Service[]>(initialServices);

    const handleAddService = (serviceData: Omit<Service, 'id'>) => {
        const newService: Service = {
            id: new Date().toISOString() + Math.random(),
            ...serviceData,
        };
        setServices(prev => [...prev, newService]);
    };

    return (
        <div className="p-8 bg-gray-50 h-full">
            {isModalOpen && <ServiceModal onClose={() => setIsModalOpen(false)} onAddService={handleAddService} />}
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Ydelser</h1>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <PlusIcon className="mr-2" />
                        Opret ny
                    </button>
                </div>
            </header>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Dine Ydelser</h2>
                <div className="space-y-4">
                {services.map(service => (
                    <div key={service.id} className="border rounded-md p-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{service.name}</p>
                            <p className="text-sm text-gray-500">Varighed: {service.duration} min.</p>
                        </div>
                        <p className="text-sm text-gray-700">
                            DKK {service.price.toFixed(2).replace('.', ',')}
                            {service.includeMoms 
                                ? ` (DKK ${(service.price * 1.25).toFixed(2).replace('.', ',')} inkl. moms)`
                                : " ex. moms"}
                        </p>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
