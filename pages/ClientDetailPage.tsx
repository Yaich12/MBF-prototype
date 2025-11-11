
import React, { useEffect, useMemo, useState } from 'react';
import { Client, JournalEntry } from '../types';
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

type ExtendedJournalEntry = JournalEntry & {
    isPrivate?: boolean;
    isDraft?: boolean;
};

interface JournalFormState {
    title: string;
    date: string;
    notes: string;
    isPrivate: boolean;
}

interface JournalFormErrors {
    title?: string;
    date?: string;
    notes?: string;
}

const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (date: Date) => {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const createInitialEntry = (): ExtendedJournalEntry => ({
    id: 'initial-entry',
    title: 'Migræne',
    date: new Date('2025-11-11'),
    practitioner: 'Ukendt behandler',
    notes: 'Han tænker for meget. / Diagnoseret kronisk skeptisk fra alder af 16 år',
});

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ client, onBack }) => {
    const [activeTab, setActiveTab] = useState('Journal');
    const tabs = ['Journal', 'Begivenheder', 'Aftaler', 'Fakturaer'];

    const initialJournalEntries = useMemo<ExtendedJournalEntry[]>(() => {
        if (client.journalEntries && client.journalEntries.length > 0) {
            return client.journalEntries.map(entry => ({
                ...entry,
                date: entry.date instanceof Date ? entry.date : new Date(entry.date),
            }));
        }
        return [createInitialEntry()];
    }, [client]);

    const [journalEntries, setJournalEntries] = useState<ExtendedJournalEntry[]>(initialJournalEntries);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formState, setFormState] = useState<JournalFormState>({
        title: '',
        date: formatDateForInput(new Date()),
        notes: '',
        isPrivate: false,
    });
    const [formErrors, setFormErrors] = useState<JournalFormErrors>({});

    useEffect(() => {
        setJournalEntries(initialJournalEntries);
    }, [initialJournalEntries]);

    const sortedJournalEntries = useMemo(
        () => [...journalEntries].sort((a, b) => b.date.getTime() - a.date.getTime()),
        [journalEntries]
    );

    const resetForm = () => {
        setFormState({
            title: '',
            date: formatDateForInput(new Date()),
            notes: '',
            isPrivate: false,
        });
        setFormErrors({});
    };

    const handleOpenForm = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        resetForm();
        setIsFormOpen(false);
    };

    const handleFormChange = (field: keyof JournalFormState, value: string | boolean) => {
        setFormState(prev => ({
            ...prev,
            [field]: value,
        }));
        setFormErrors(prev => ({
            ...prev,
            [field]: undefined,
        }));
    };

    const validateForm = (): boolean => {
        const errors: JournalFormErrors = {};

        if (!formState.title.trim()) {
            errors.title = 'Indtast en titel';
        }

        if (!formState.date) {
            errors.date = 'Vælg en dato';
        } else if (Number.isNaN(new Date(formState.date).getTime())) {
            errors.date = 'Datoen er ikke gyldig';
        }

        if (!formState.notes.trim()) {
            errors.notes = 'Indtast indhold';
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSaveEntry = (closeAfterSave = true, isDraft = false) => {
        if (!validateForm()) {
            return;
        }

        const newEntry: ExtendedJournalEntry = {
            id: `${Date.now()}`,
            title: formState.title.trim(),
            date: new Date(formState.date),
            practitioner: 'Ukendt behandler',
            notes: formState.notes.trim(),
            isPrivate: formState.isPrivate,
            isDraft,
        };

        setJournalEntries(prev => [...prev, newEntry]);

        if (closeAfterSave) {
            handleCloseForm();
        } else {
            setFormErrors({});
        }
    };
    const handleSaveDraft = () => handleSaveEntry(false, true);
    const handleSaveAndClose = () => handleSaveEntry(true, false);
    
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
                                            onClick={handleOpenForm}
                                        >
                                            <PlusIcon className="w-4 h-4 mr-2"/>
                                            Nyt indlæg
                                        </button>
                                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"><DocumentAddIcon className="w-4 h-4 mr-2"/>Tilføj Journalfil</button>
                                    <button className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"><CloudDownloadIcon className="w-5 h-5"/></button>
                                    <button className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"><PrinterIcon className="w-5 h-5"/></button>
                                </div>
                                <input type="text" placeholder="Søg..." className="w-full border rounded-md px-3 py-2 text-sm mb-4" />

                                    {isFormOpen && (
                                        <div className="border rounded-lg bg-white shadow-sm p-6 mb-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                                                    <input
                                                        type="text"
                                                        value={formState.title}
                                                        onChange={event => handleFormChange('title', event.target.value)}
                                                        className={`w-full border rounded-md px-3 py-2 text-sm ${
                                                            formErrors.title ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {formErrors.title && <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dato</label>
                                                    <input
                                                        type="date"
                                                        value={formState.date}
                                                        onChange={event => handleFormChange('date', event.target.value)}
                                                        className={`w-full border rounded-md px-3 py-2 text-sm ${
                                                            formErrors.date ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {formErrors.date && <p className="mt-1 text-xs text-red-500">{formErrors.date}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-700">Privat journal</span>
                                                    <button
                                                        type="button"
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                            formState.isPrivate ? 'bg-blue-600' : 'bg-gray-200'
                                                        }`}
                                                        onClick={() => handleFormChange('isPrivate', !formState.isPrivate)}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                                formState.isPrivate ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 text-right">
                                                    Tip: Du kan lave skabeloner til dine journaler. Gå til Indstillinger &rarr; Journal for at se mere.
                                                </p>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Indhold</label>
                                                <textarea
                                                    value={formState.notes}
                                                    onChange={event => handleFormChange('notes', event.target.value)}
                                                    className={`w-full border rounded-md px-3 py-2 text-sm h-40 ${
                                                        formErrors.notes ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Skriv din journal..."
                                                />
                                                {formErrors.notes && <p className="mt-1 text-xs text-red-500">{formErrors.notes}</p>}
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 space-y-3 md:space-y-0">
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
                                                        onClick={handleCloseForm}
                                                    >
                                                        Annuller
                                                    </button>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-md hover:bg-blue-100"
                                                        onClick={handleSaveDraft}
                                                    >
                                                        Gem som kladde
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                        onClick={handleSaveAndClose}
                                                    >
                                                        Gem og luk
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                
                                    <div className="space-y-4">
                                        {sortedJournalEntries.map(entry => (
                                            <div key={entry.id} className="border rounded-lg p-4 bg-white">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex flex-wrap items-center space-x-3">
                                                            <MinusCircleIcon className="w-5 h-5 text-gray-400" />
                                                            <h4 className="font-semibold text-gray-800">{entry.title}</h4>
                                                            <span className="text-sm text-gray-500">{formatDateForDisplay(entry.date)}</span>
                                                            <div className="flex items-center space-x-2 text-gray-500">
                                                                <UserIcon className="w-4 h-4" />
                                                                <span className="text-xs">{entry.practitioner}</span>
                                                                <ClockIcon className="w-4 h-4" />
                                                            </div>
                                                            {entry.isPrivate && (
                                                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Privat</span>
                                                            )}
                                                            {entry.isDraft && (
                                                                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Kladde</span>
                                                            )}
                                                        </div>
                                                        <p className="mt-2 text-sm text-gray-600 pl-8 whitespace-pre-line">{entry.notes}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-500">
                                                        <button className="hover:text-gray-800" aria-label="Rediger"><PencilAltIcon className="w-5 h-5"/></button>
                                                        <button className="hover:text-gray-800" aria-label="Historik"><ClockIcon className="w-5 h-5"/></button>
                                                        <button className="hover:text-gray-800" aria-label="Marker som favorit"><StarIcon className="w-5 h-5"/></button>
                                                        <button className="hover:text-gray-800" aria-label="Lås"><LockClosedIcon className="w-5 h-5"/></button>
                                                        <button className="hover:text-gray-800" aria-label="Print"><PrinterIcon className="w-5 h-5"/></button>
                                                        <button className="hover:text-gray-800" aria-label="Slet"><TrashIcon className="w-5 h-5"/></button>
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
        </div>
    );
}

export default ClientDetailPage;