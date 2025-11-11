
import React from 'react';
import { ChartBarIcon, UsersIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '../components/icons';

const StatCard: React.FC<{ title: string, value: number }> = ({ title, value }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
);

const StatisticsPage: React.FC = () => {
    const calendarDays = [
        ...Array.from({ length: 1 }, (_, i) => 27 + i + 1),
        ...Array.from({ length: 30 }, (_, i) => i + 1),
        ...Array.from({ length: 4 }, (_, i) => i + 1),
    ];
    
    return (
        <div className="p-8 bg-gray-50 h-full">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Statistik</h1>
                 <div className="relative">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 flex items-center">
                        Sidste 90 dage <ChevronDownIcon className="ml-2" />
                    </button>
                 </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <nav className="space-y-1">
                            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md bg-gray-100">
                                <ChartBarIcon className="w-5 h-5 mr-3" />
                                Generelt
                            </a>
                             <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 rounded-md bg-blue-100">
                                <UsersIcon className="w-5 h-5 mr-3" />
                                Klienter
                            </a>
                        </nav>
                    </div>
                </div>

                <div className="col-span-9 space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 mb-1">Vælg Klient</label>
                        <select id="client-select" className="w-full p-2 border border-gray-300 rounded-md">
                            <option>Vælg Klient</option>
                        </select>
                        <div className="mt-6 text-center">
                            <h3 className="text-md font-medium text-gray-800">Gennemsnitlige månedlige aftaler pr. klient</h3>
                            <p className="text-sm text-gray-500 mt-1">Der er ingen statistik at vise i det valgte tidsrum</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Aftale oversigt for perioden</h3>
                        <div className="flex space-x-6">
                            <StatCard title="Total antal klienter med aftaler" value={0} />
                            <StatCard title="Gennemsnitlige antal aftaler pr. klient" value={0} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
