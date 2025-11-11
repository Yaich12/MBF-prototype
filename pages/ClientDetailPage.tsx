
import React, { useState } from 'react';
import { Client } from '../types';
import { 
    TrashIcon, 
    PencilIcon,
    UserCircleIcon,
    CheckCircleIcon,
    DocumentAddIcon,
    CloudDownloadIcon,
    PrinterIcon,
    MinusCircleIcon,
    UserIcon,
    ClockIcon,
    PencilAltIcon,
    StarIcon,
    LockClosedIcon,
    PlusIcon
} from '../components/icons';

interface ClientDetailPageProps {
    client: Client;
    onBack: () => void;
}

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ client, onBack }) => {
    const [activeTab, setActiveTab] = useState('Journal');
    const tabs = ['Journal', 'Begivenheder', 'Aftaler', 'Fakturaer'];

    // Mock data for journal entry
    const journalEntry = {
        id: '1',
        title: 'Migræne',
        date: '11. november 2025',
        notes: 'Han tænker for meget. / diagnoseret kronisk skeptisk fra alder af 16 år'
    };
    
    return (
        <div className="p-8 bg-gray-50 h-full overflow-y-auto">
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center text-xl font-semibold text-gray-800">
                    <button onClick={onBack} className="text-blue-600 hover:underline">Klienter</button>
                    <span className="mx-2 text-gray-400">&gt;</span>
                    <span>{client.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Slet
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                         <PencilIcon className="w-4 h-4 mr-2" />
                        Rediger
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column - Client Info */}
                <div className="col-span-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                        <UserCircleIcon className="w-24 h-24 text-gray-300 mx-auto" />
                        <h2 className="text-xl font-bold mt-4">{client.name}</h2>
                        <p className="text-sm text-gray-500">{client.address}</p>
                        <p className="text-sm text-gray-500">{client.zip} {client.city}</p>
                        
                        <hr className="my-6" />

                        <div className="text-left">
                           <p className="text-sm text-gray-500">E-mail</p>
                           <a href={`mailto:${client.email}`} className="text-sm font-medium text-blue-600">{client.email}</a>
                        </div>
                        
                        <hr className="my-6" />
                        
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
                        <p className="text-lg font-semibold mt-2">Aktiv</p>
                        <p className="text-sm text-gray-500">Klientens status</p>
                        <button className="text-sm text-blue-600 hover:underline mt-1">Skift status</button>
                    </div>
                </div>

                {/* Right Column - Tabs */}
                <div className="col-span-8">
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6 px-6">
                                {tabs.map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === tab 
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        
                        {activeTab === 'Journal' && (
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"><PlusIcon className="w-4 h-4 mr-2"/>Nyt indlæg</button>
                                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"><DocumentAddIcon className="w-4 h-4 mr-2"/>Tilføj Journalfil</button>
                                    <button className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"><CloudDownloadIcon className="w-5 h-5"/></button>
                                    <button className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"><PrinterIcon className="w-5 h-5"/></button>
                                </div>
                                <input type="text" placeholder="Søg..." className="w-full border rounded-md px-3 py-2 text-sm mb-4" />
                                
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="flex items-center space-x-3">
                                            <MinusCircleIcon className="w-5 h-5 text-gray-400" />
                                            <h4 className="font-semibold text-gray-800">{journalEntry.title}</h4>
                                            <span className="text-sm text-gray-500">{journalEntry.date}</span>
                                            <UserIcon className="w-4 h-4 text-gray-500" />
                                            <ClockIcon className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600 pl-8">{journalEntry.notes}</p>
                                      </div>
                                      <div className="flex items-center space-x-2 text-gray-500">
                                        <button className="hover:text-gray-800"><PencilAltIcon className="w-5 h-5"/></button>
                                        <button className="hover:text-gray-800"><ClockIcon className="w-5 h-5"/></button>
                                        <button className="hover:text-gray-800"><StarIcon className="w-5 h-5"/></button>
                                        <button className="hover:text-gray-800"><LockClosedIcon className="w-5 h-5"/></button>
                                        <button className="hover:text-gray-800"><PrinterIcon className="w-5 h-5"/></button>
                                        <button className="hover:text-gray-800"><TrashIcon className="w-5 h-5"/></button>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab !== 'Journal' && (
                             <div className="p-6 text-center text-gray-500">Indhold for {activeTab} kommer snart.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientDetailPage;