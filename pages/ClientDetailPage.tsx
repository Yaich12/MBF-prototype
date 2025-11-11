
import React, { useMemo, useRef, useState } from 'react';
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

interface JournalEntry {
    id: string;
    title: string;
    date: string;
    notes: string;
    isFavorite?: boolean;
    isLocked?: boolean;
    history?: Array<{
        title: string;
        notes: string;
        date: string;
        updatedAt: string;
    }>;
}

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ client, onBack }) => {
    const [activeTab, setActiveTab] = useState('Journal');
    const tabs = ['Journal', 'Begivenheder', 'Aftaler', 'Fakturaer'];

    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
        {
            id: '1',
            title: 'Migræne',
            date: '11. november 2025',
            notes: 'Han tænker for meget. / diagnoseret kronisk skeptisk fra alder af 16 år',
            history: [],
            isFavorite: false,
            isLocked: false,
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [draftEntry, setDraftEntry] = useState<{ title: string; notes: string; date: string } | null>(null);
    const [expandedHistories, setExpandedHistories] = useState<Record<string, boolean>>({});
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const filteredEntries = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            return journalEntries;
        }
        return journalEntries.filter(
            (entry) =>
                entry.title.toLowerCase().includes(term) ||
                entry.notes.toLowerCase().includes(term) ||
                entry.date.toLowerCase().includes(term),
        );
    }, [journalEntries, searchTerm]);

    const startEditing = (entry: JournalEntry) => {
        if (entry.isLocked) {
            window.alert('Indlægget er låst og kan ikke redigeres.');
            return;
        }
        setEditingEntryId(entry.id);
        setDraftEntry({
            title: entry.title,
            notes: entry.notes,
            date: entry.date,
        });
    };

    const handleAddEntry = () => {
        const newEntry: JournalEntry = {
            id: `${Date.now()}`,
            title: 'Nyt indlæg',
            date: new Date().toLocaleDateString('da-DK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            notes: 'Tilføj dine noter her...',
            history: [],
            isFavorite: false,
            isLocked: false,
        };
        setJournalEntries((prev) => [newEntry, ...prev]);
        setTimeout(() => startEditing(newEntry), 0);
    };

    const handleDeleteEntry = (id: string) => {
        setJournalEntries((prev) => prev.filter((entry) => entry.id !== id));
    };

    const handleSaveEntry = () => {
        if (!editingEntryId || !draftEntry) return;

        setJournalEntries((prev) =>
            prev.map((entry) => {
                if (entry.id !== editingEntryId) return entry;

                const now = new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
                const updatedHistory = [
                    ...(entry.history ?? []),
                    {
                        title: entry.title,
                        notes: entry.notes,
                        date: entry.date,
                        updatedAt: now,
                    },
                ];

                return {
                    ...entry,
                    ...draftEntry,
                    history: updatedHistory,
                };
            }),
        );
        setEditingEntryId(null);
        setDraftEntry(null);
    };

    const handleCancelEditing = () => {
        setEditingEntryId(null);
        setDraftEntry(null);
    };

    const toggleFavorite = (id: string) => {
        setJournalEntries((prev) =>
            prev.map((entry) =>
                entry.id === id
                    ? {
                          ...entry,
                          isFavorite: !entry.isFavorite,
                      }
                    : entry,
            ),
        );
    };

    const toggleLock = (id: string) => {
        setJournalEntries((prev) =>
            prev.map((entry) =>
                entry.id === id
                    ? {
                          ...entry,
                          isLocked: !entry.isLocked,
                      }
                    : entry,
            ),
        );
    };

    const toggleHistory = (id: string) => {
        setExpandedHistories((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handlePrintEntry = (entry: JournalEntry) => {
        window.print();
        console.info(`Printing entry: ${entry.title}`);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
            window.alert(`Fil ${file.name} blev tilføjet til journalen.`);
        }
    };

    const handleExportEntries = () => {
        const data = JSON.stringify(journalEntries, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `journal-${client.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const isEditing = (id: string) => editingEntryId === id && draftEntry;

    const renderNotes = (entry: JournalEntry) => {
        if (isEditing(entry.id) && draftEntry) {
            return (
                <textarea
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={draftEntry.notes}
                    onChange={(event) =>
                        setDraftEntry((prev) => (prev ? { ...prev, notes: event.target.value } : prev))
                    }
                    rows={4}
                />
            );
        }

        return <p className="mt-2 text-sm text-gray-600 pl-8 whitespace-pre-line">{entry.notes}</p>;
    };

    const renderTitle = (entry: JournalEntry) => {
        if (isEditing(entry.id) && draftEntry) {
            return (
                <input
                    className="border rounded-md px-3 py-1 text-sm font-semibold text-gray-800"
                    value={draftEntry.title}
                    onChange={(event) =>
                        setDraftEntry((prev) => (prev ? { ...prev, title: event.target.value } : prev))
                    }
                />
            );
        }

        return (
            <h4 className="font-semibold text-gray-800 flex items-center">
                {entry.title}
                {entry.isFavorite && <StarIcon className="w-4 h-4 text-yellow-500 ml-2" />}
            </h4>
        );
    };

    const renderDate = (entry: JournalEntry) => {
        if (isEditing(entry.id) && draftEntry) {
            return (
                <input
                    type="text"
                    className="border rounded-md px-3 py-1 text-xs text-gray-600"
                    value={draftEntry.date}
                    onChange={(event) =>
                        setDraftEntry((prev) => (prev ? { ...prev, date: event.target.value } : prev))
                    }
                />
            );
        }

        return <span className="text-sm text-gray-500">{entry.date}</span>;
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
                                          onClick={handleAddEntry}
                                          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                      >
                                          <PlusIcon className="w-4 h-4 mr-2" />
                                          Nyt indlæg
                                      </button>
                                      <button
                                          onClick={triggerFileUpload}
                                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
                                      >
                                          <DocumentAddIcon className="w-4 h-4 mr-2" />
                                          Tilføj Journalfil
                                      </button>
                                      <input
                                          ref={fileInputRef}
                                          type="file"
                                          className="hidden"
                                          onChange={handleFileChange}
                                      />
                                      <button
                                          onClick={handleExportEntries}
                                          className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"
                                          title="Eksporter journalen"
                                      >
                                          <CloudDownloadIcon className="w-5 h-5" />
                                      </button>
                                      <button
                                          onClick={() => window.print()}
                                          className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"
                                          title="Print alt"
                                      >
                                          <PrinterIcon className="w-5 h-5" />
                                      </button>
                                </div>
                                  <input
                                      type="text"
                                      placeholder="Søg..."
                                      value={searchTerm}
                                      onChange={(event) => setSearchTerm(event.target.value)}
                                      className="w-full border rounded-md px-3 py-2 text-sm mb-4"
                                  />

                                  {selectedFileName && (
                                      <div className="mb-4 text-sm text-gray-500">
                                          Tilføjet fil:{' '}
                                          <span className="font-medium text-gray-700">{selectedFileName}</span>
                                      </div>
                                  )}

                                  {filteredEntries.length === 0 ? (
                                      <div className="border rounded-lg p-6 text-center text-gray-500">
                                          Ingen journalindlæg matcher din søgning.
                                      </div>
                                  ) : (
                                      <div className="space-y-4">
                                          {filteredEntries.map((entry) => (
                                              <div key={entry.id} className="border rounded-lg p-4 bg-white">
                                                  <div className="flex justify-between items-start">
                                                      <div className="flex-1">
                                                          <div className="flex items-center space-x-3">
                                                              <button
                                                                  onClick={() => handleDeleteEntry(entry.id)}
                                                                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                  title="Slet indlæg"
                                                                  disabled={entry.isLocked}
                                                              >
                                                                  <MinusCircleIcon className="w-5 h-5" />
                                                              </button>
                                                              {renderTitle(entry)}
                                                              {renderDate(entry)}
                                                              <UserIcon className="w-4 h-4 text-gray-500" />
                                                              <ClockIcon className="w-4 h-4 text-gray-500" />
                                                          </div>
                                                          {renderNotes(entry)}
                                                          {expandedHistories[entry.id] && entry.history && entry.history.length > 0 && (
                                                              <div className="mt-3 ml-8 border-l pl-4 text-sm text-gray-500 space-y-2">
                                                                  {entry.history.map((historyItem, index) => (
                                                                      <div key={`${entry.id}-history-${index}`}>
                                                                          <p className="font-medium text-gray-600">
                                                                              {historyItem.title} &middot; {historyItem.date}
                                                                          </p>
                                                                          <p className="whitespace-pre-line">{historyItem.notes}</p>
                                                                          <p className="text-xs text-gray-400">
                                                                              Opdateret kl. {historyItem.updatedAt}
                                                                          </p>
                                                                      </div>
                                                                  ))}
                                                              </div>
                                                          )}
                                                      </div>
                                                      <div className="flex items-center space-x-2 text-gray-500 ml-4">
                                                          {isEditing(entry.id) ? (
                                                              <>
                                                                  <button
                                                                      onClick={handleSaveEntry}
                                                                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                                  >
                                                                      Gem
                                                                  </button>
                                                                  <button
                                                                      onClick={handleCancelEditing}
                                                                      className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-50"
                                                                  >
                                                                      Annuller
                                                                  </button>
                                                              </>
                                                          ) : (
                                                              <>
                                                                  <button
                                                                      onClick={() => startEditing(entry)}
                                                                      className="hover:text-gray-800"
                                                                      title="Rediger indlæg"
                                                                  >
                                                                      <PencilAltIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      onClick={() => toggleHistory(entry.id)}
                                                                      className="hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                                                                      title="Historik"
                                                                      disabled={!entry.history || entry.history.length === 0}
                                                                  >
                                                                      <ClockIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      onClick={() => toggleFavorite(entry.id)}
                                                                      className={`hover:text-gray-800 ${entry.isFavorite ? 'text-yellow-500' : ''}`}
                                                                      title={entry.isFavorite ? 'Fjern favorit' : 'Markér som favorit'}
                                                                  >
                                                                      <StarIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      onClick={() => toggleLock(entry.id)}
                                                                      className={`hover:text-gray-800 ${entry.isLocked ? 'text-blue-600' : ''}`}
                                                                      title={entry.isLocked ? 'Lås op' : 'Lås indlæg'}
                                                                  >
                                                                      <LockClosedIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      onClick={() => handlePrintEntry(entry)}
                                                                      className="hover:text-gray-800"
                                                                      title="Print indlæg"
                                                                  >
                                                                      <PrinterIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      onClick={() => handleDeleteEntry(entry.id)}
                                                                      className="hover:text-gray-800 text-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
                                                                      title="Slet indlæg"
                                                                      disabled={entry.isLocked}
                                                                  >
                                                                      <TrashIcon className="w-5 h-5" />
                                                                  </button>
                                                              </>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  )}
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