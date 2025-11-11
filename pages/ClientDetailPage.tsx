
import React, { useMemo, useState } from 'react';
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
    PlusIcon,
    XIcon
} from '../components/icons';

interface ClientDetailPageProps {
    client: Client;
    onBack: () => void;
}

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ client, onBack }) => {
    const [activeTab, setActiveTab] = useState('Journal');
    const tabs = ['Journal', 'Begivenheder', 'Aftaler', 'Fakturaer'];

    interface JournalEntry {
        id: string;
        title: string;
        date: string;
        notes: string;
    }

    const defaultEntry: JournalEntry = useMemo(
        () => ({
            id: '1',
            title: 'Migræne',
            date: '2025-11-11',
            notes: 'Han tænker for meget. / diagnoseret kronisk skeptisk fra alder af 16 år'
        }),
        []
    );

    const formatDate = (value: string) => {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return value;
        }
        return parsed.toLocaleDateString('da-DK', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([defaultEntry]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEntry, setNewEntry] = useState<Omit<JournalEntry, 'id'>>({
        title: 'Migræne',
        date: new Date().toISOString().slice(0, 10),
        notes: ''
    });

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewEntry({
            title: 'Migræne',
            date: new Date().toISOString().slice(0, 10),
            notes: ''
        });
    };

    const handleEntrySubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!newEntry.date.trim() || !newEntry.notes.trim()) {
            return;
        }

        const entryToAdd: JournalEntry = {
            id: `${Date.now()}`,
            ...newEntry
        };

        setJournalEntries(prev => [entryToAdd, ...prev]);
        handleModalClose();
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
                                    <button
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Nyt indlæg
                                    </button>
                                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"><DocumentAddIcon className="w-4 h-4 mr-2"/>Tilføj Journalfil</button>
                                    <button className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"><CloudDownloadIcon className="w-5 h-5"/></button>
                                    <button className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"><PrinterIcon className="w-5 h-5"/></button>
                                </div>
                                <input type="text" placeholder="Søg..." className="w-full border rounded-md px-3 py-2 text-sm mb-4" />
                                
                                <div className="space-y-4">
                                    {journalEntries.map(entry => (
                                        <div key={entry.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center space-x-3">
                                                        <MinusCircleIcon className="w-5 h-5 text-gray-400" />
                                                        <h4 className="font-semibold text-gray-800">{entry.title}</h4>
                                                        <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                                                        <UserIcon className="w-4 h-4 text-gray-500" />
                                                        <ClockIcon className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-600 pl-8 whitespace-pre-line">{entry.notes}</p>
                                                </div>
                                                <div className="flex items-center space-x-2 text-gray-500">
                                                    <button className="hover:text-gray-800"><PencilAltIcon className="w-5 h-5" /></button>
                                                    <button className="hover:text-gray-800"><ClockIcon className="w-5 h-5" /></button>
                                                    <button className="hover:text-gray-800"><StarIcon className="w-5 h-5" /></button>
                                                    <button className="hover:text-gray-800"><LockClosedIcon className="w-5 h-5" /></button>
                                                    <button className="hover:text-gray-800"><PrinterIcon className="w-5 h-5" /></button>
                                                    <button className="hover:text-gray-800"><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab !== 'Journal' && (
                             <div className="p-6 text-center text-gray-500">Indhold for {activeTab} kommer snart.</div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 py-8">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Nyt journalindlæg</h3>
                                <p className="text-sm text-gray-500">Udfyld felterne for at gemme et indlæg under Migræne.</p>
                            </div>
                            <button
                                onClick={handleModalClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Luk"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEntrySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                                <input
                                    type="text"
                                    value={newEntry.title}
                                    onChange={event => setNewEntry(prev => ({ ...prev, title: event.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Migræne"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dato</label>
                                <input
                                    type="date"
                                    value={newEntry.date}
                                    onChange={event => setNewEntry(prev => ({ ...prev, date: event.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Noter</label>
                                <textarea
                                    rows={4}
                                    value={newEntry.notes}
                                    onChange={event => setNewEntry(prev => ({ ...prev, notes: event.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Beskriv symptomer, observationer eller andre noter…"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Annuller
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={!newEntry.date.trim() || !newEntry.notes.trim()}
                                >
                                    Gem indlæg
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClientDetailPage;