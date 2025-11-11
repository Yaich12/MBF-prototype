
import React, { useRef, useState } from 'react';
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
    createdAt: string;
    updatedAt: string;
    starred: boolean;
    locked: boolean;
    reminderActive: boolean;
    reminderNote?: string;
}

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ client, onBack }) => {
    const [activeTab, setActiveTab] = useState('Journal');
    const tabs = ['Journal', 'Begivenheder', 'Aftaler', 'Fakturaer'];

    const [entries, setEntries] = useState<JournalEntry[]>(() => [
        {
            id: 'journal-entry-1',
            title: 'Migræne',
            date: '11. november 2025',
            notes: 'Han tænker for meget. / diagnoseret kronisk skeptisk fra alder af 16 år',
            createdAt: '11. november 2025 kl. 09:15',
            updatedAt: '11. november 2025 kl. 09:15',
            starred: false,
            locked: false,
            reminderActive: false
        }
    ]);
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [entryDraft, setEntryDraft] = useState<{ title: string; date: string; notes: string }>({
        title: '',
        date: '',
        notes: ''
    });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newEntryDraft, setNewEntryDraft] = useState<{ title: string; date: string; notes: string }>({
        title: '',
        date: '',
        notes: ''
    });
    const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDeleteEntry = (entryId: string) => {
        setEntries(prev => prev.filter(entry => entry.id !== entryId));
    };

    const handleToggleStar = (entryId: string) => {
        setEntries(prev =>
            prev.map(entry =>
                entry.id === entryId ? { ...entry, starred: !entry.starred } : entry
            )
        );
    };

    const handleToggleLock = (entryId: string) => {
        setEntries(prev =>
            prev.map(entry => {
                if (entry.id !== entryId) {
                    return entry;
                }
                const wasLocked = entry.locked;
                return {
                    ...entry,
                    locked: !entry.locked,
                    reminderActive: wasLocked ? entry.reminderActive : false,
                    reminderNote: wasLocked ? entry.reminderNote : undefined
                };
            })
        );
        if (editingEntryId === entryId) {
            setEditingEntryId(null);
        }
    };

    const handleToggleReminder = (entry: JournalEntry) => {
        if (entry.locked) {
            return;
        }

        let reminderNote = entry.reminderNote;
        if (!entry.reminderActive) {
            const input = window.prompt('Angiv eventuel opfølgning eller dato', reminderNote ?? '');
            reminderNote = input ?? '';
        }

        setEntries(prev =>
            prev.map(item =>
                item.id === entry.id
                    ? {
                        ...item,
                        reminderActive: !item.reminderActive,
                        reminderNote: item.reminderActive ? undefined : reminderNote || undefined
                    }
                    : item
            )
        );
    };

    const handleStartEditing = (entry: JournalEntry) => {
        if (entry.locked) {
            return;
        }
        setEditingEntryId(entry.id);
        setEntryDraft({
            title: entry.title,
            date: entry.date,
            notes: entry.notes
        });
    };

    const handleCancelEditing = () => {
        setEditingEntryId(null);
    };

    const handleSaveEntry = (entryId: string) => {
        setEntries(prev =>
            prev.map(entry =>
                entry.id === entryId
                    ? {
                        ...entry,
                        title: entryDraft.title,
                        date: entryDraft.date,
                        notes: entryDraft.notes,
                        updatedAt: new Intl.DateTimeFormat('da-DK', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }).format(new Date()) + ' kl. ' + new Intl.DateTimeFormat('da-DK', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }).format(new Date())
                    }
                    : entry
            )
        );
        setEditingEntryId(null);
    };

    const handleOpenCreate = () => {
        setIsCreateOpen(open => !open);
        setNewEntryDraft({
            title: '',
            date: new Intl.DateTimeFormat('da-DK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date()),
            notes: ''
        });
    };

    const handleCreateEntry = () => {
        if (!newEntryDraft.title.trim() || !newEntryDraft.notes.trim()) {
            window.alert('Titel og noter skal udfyldes.');
            return;
        }

        const timestamp = new Intl.DateTimeFormat('da-DK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date()) + ' kl. ' + new Intl.DateTimeFormat('da-DK', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date());

        const newEntry: JournalEntry = {
            id: `journal-entry-${crypto.randomUUID()}`,
            title: newEntryDraft.title,
            date: newEntryDraft.date || timestamp,
            notes: newEntryDraft.notes,
            createdAt: timestamp,
            updatedAt: timestamp,
            starred: false,
            locked: false,
            reminderActive: false
        };

        setEntries(prev => [newEntry, ...prev]);
        setIsCreateOpen(false);
        setNewEntryDraft({ title: '', date: '', notes: '' });
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = event => {
        if (event.target.files) {
            const fileNames = Array.from(event.target.files).map(file => file.name);
            setAttachedFiles(prev => [...prev, ...fileNames]);
            event.target.value = '';
        }
    };

    const handleExportEntries = () => {
        const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `journal-${client.id}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handlePrintAll = () => {
        window.print();
    };

    const handlePrintEntry = (entry: JournalEntry) => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            window.alert('Kunne ikke åbne udskriftsvinduet. Tillad pop-ups og prøv igen.');
            return;
        }
        printWindow.document.write(`
            <html>
                <head>
                    <title>${entry.title}</title>
                    <style>
                        body { font-family: sans-serif; padding: 24px; }
                        h1 { margin-bottom: 8px; }
                        p { white-space: pre-wrap; }
                        .meta { color: #555; margin-bottom: 16px; }
                    </style>
                </head>
                <body>
                    <h1>${entry.title}</h1>
                    <div class="meta">
                        <div>Dato: ${entry.date}</div>
                        <div>Senest opdateret: ${entry.updatedAt}</div>
                    </div>
                    <p>${entry.notes}</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
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
                                  <div className="flex items-center flex-wrap gap-2 mb-4">
                                      <button
                                          type="button"
                                          onClick={handleOpenCreate}
                                          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                      >
                                          <PlusIcon className="w-4 h-4 mr-2" />
                                          {isCreateOpen ? 'Luk formular' : 'Nyt indlæg'}
                                      </button>
                                      <button
                                          type="button"
                                          onClick={handleFileButtonClick}
                                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
                                      >
                                          <DocumentAddIcon className="w-4 h-4 mr-2" />
                                          Tilføj Journalfil
                                      </button>
                                      <input
                                          ref={fileInputRef}
                                          type="file"
                                          multiple
                                          className="hidden"
                                          onChange={handleFileUpload}
                                      />
                                      <button
                                          type="button"
                                          onClick={handleExportEntries}
                                          className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"
                                          title="Eksportér journal som JSON"
                                      >
                                          <CloudDownloadIcon className="w-5 h-5" />
                                      </button>
                                      <button
                                          type="button"
                                          onClick={handlePrintAll}
                                          className="p-2 text-gray-600 bg-white border rounded-md hover:bg-gray-50"
                                          title="Udskriv hele journalen"
                                      >
                                          <PrinterIcon className="w-5 h-5" />
                                      </button>
                                </div>
                                <input type="text" placeholder="Søg..." className="w-full border rounded-md px-3 py-2 text-sm mb-4" />
                                  {isCreateOpen && (
                                      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                                          <h3 className="font-semibold text-gray-700 mb-3">Opret nyt journalindlæg</h3>
                                          <div className="grid gap-3">
                                              <label className="flex flex-col text-sm">
                                                  <span className="text-gray-600 mb-1">Titel</span>
                                                  <input
                                                      type="text"
                                                      value={newEntryDraft.title}
                                                      onChange={event => setNewEntryDraft(prev => ({ ...prev, title: event.target.value }))}
                                                      className="border rounded-md px-3 py-2"
                                                      placeholder="Titel på indlæg"
                                                  />
                                              </label>
                                              <label className="flex flex-col text-sm">
                                                  <span className="text-gray-600 mb-1">Dato</span>
                                                  <input
                                                      type="text"
                                                      value={newEntryDraft.date}
                                                      onChange={event => setNewEntryDraft(prev => ({ ...prev, date: event.target.value }))}
                                                      className="border rounded-md px-3 py-2"
                                                      placeholder="fx 11. november 2025"
                                                  />
                                              </label>
                                              <label className="flex flex-col text-sm">
                                                  <span className="text-gray-600 mb-1">Noter</span>
                                                  <textarea
                                                      value={newEntryDraft.notes}
                                                      onChange={event => setNewEntryDraft(prev => ({ ...prev, notes: event.target.value }))}
                                                      className="border rounded-md px-3 py-2"
                                                      rows={4}
                                                      placeholder="Skriv journalnoter her..."
                                                  />
                                              </label>
                                              <div className="flex items-center gap-2 justify-end">
                                                  <button
                                                      type="button"
                                                      onClick={() => setIsCreateOpen(false)}
                                                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-100"
                                                  >
                                                      Annuller
                                                  </button>
                                                  <button
                                                      type="button"
                                                      onClick={handleCreateEntry}
                                                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                  >
                                                      Gem indlæg
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                                  {attachedFiles.length > 0 && (
                                      <div className="border border-dashed border-gray-300 rounded-lg p-3 mb-4 bg-white">
                                          <p className="text-sm font-medium text-gray-600 mb-2">Vedhæftede filer</p>
                                          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                              {attachedFiles.map((fileName, index) => (
                                                  <li key={`${fileName}-${index}`}>{fileName}</li>
                                              ))}
                                          </ul>
                                      </div>
                                  )}
                                
                                  <div className="space-y-4">
                                      {entries.map(entry => (
                                          <div
                                              key={entry.id}
                                              className={`border rounded-lg p-4 bg-white ${entry.starred ? 'border-yellow-400 shadow-sm' : 'border-gray-200'}`}
                                          >
                                              <div className="flex justify-between items-start">
                                                  <div className="flex-1">
                                                      <div className="flex items-center space-x-3">
                                                          <button
                                                              type="button"
                                                              onClick={() => handleDeleteEntry(entry.id)}
                                                              className="text-gray-400 hover:text-red-500 transition-colors"
                                                              title="Slet indlæg"
                                                          >
                                                              <MinusCircleIcon className="w-5 h-5" />
                                                          </button>
                                                          {editingEntryId === entry.id ? (
                                                              <>
                                                                  <input
                                                                      type="text"
                                                                      value={entryDraft.title}
                                                                      onChange={event => setEntryDraft(prev => ({ ...prev, title: event.target.value }))}
                                                                      className="border rounded-md px-2 py-1 text-sm font-semibold text-gray-800"
                                                                  />
                                                                  <input
                                                                      type="text"
                                                                      value={entryDraft.date}
                                                                      onChange={event => setEntryDraft(prev => ({ ...prev, date: event.target.value }))}
                                                                      className="border rounded-md px-2 py-1 text-sm text-gray-500"
                                                                  />
                                                              </>
                                                          ) : (
                                                              <>
                                                                  <h4 className="font-semibold text-gray-800">{entry.title}</h4>
                                                                  <span className="text-sm text-gray-500">{entry.date}</span>
                                                              </>
                                                          )}
                                                          <UserIcon className="w-4 h-4 text-gray-500" />
                                                          <ClockIcon className="w-4 h-4 text-gray-500" />
                                                      </div>
                                                      {editingEntryId === entry.id ? (
                                                          <textarea
                                                              value={entryDraft.notes}
                                                              onChange={event => setEntryDraft(prev => ({ ...prev, notes: event.target.value }))}
                                                              className="mt-2 w-full border rounded-md px-3 py-2 text-sm text-gray-700"
                                                              rows={4}
                                                          />
                                                      ) : (
                                                          <p className="mt-2 text-sm text-gray-600 pl-8 whitespace-pre-line">{entry.notes}</p>
                                                      )}
                                                      <div className="mt-3 flex items-center text-xs text-gray-500 space-x-3 pl-8">
                                                          <span>Oprettet: {entry.createdAt}</span>
                                                          <span>Opdateret: {entry.updatedAt}</span>
                                                          {entry.reminderActive && (
                                                              <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                                                  <ClockIcon className="w-3 h-3 mr-1" />
                                                                  {entry.reminderNote ? entry.reminderNote : 'Opfølgning aktiveret'}
                                                              </span>
                                                          )}
                                                          {entry.locked && (
                                                              <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                                  <LockClosedIcon className="w-3 h-3 mr-1" />
                                                                  Låst
                                                              </span>
                                                          )}
                                                      </div>
                                                  </div>
                                                  <div className="flex flex-col items-end space-y-2 text-gray-500">
                                                      <div className="flex items-center space-x-2">
                                                          {editingEntryId === entry.id ? (
                                                              <>
                                                                  <button
                                                                      type="button"
                                                                      onClick={() => handleSaveEntry(entry.id)}
                                                                      className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                                  >
                                                                      Gem
                                                                  </button>
                                                                  <button
                                                                      type="button"
                                                                      onClick={handleCancelEditing}
                                                                      className="px-3 py-1 text-xs font-semibold text-gray-600 bg-white border rounded-md hover:bg-gray-50"
                                                                  >
                                                                      Annuller
                                                                  </button>
                                                              </>
                                                          ) : (
                                                              <>
                                                                  <button
                                                                      type="button"
                                                                      onClick={() => handleStartEditing(entry)}
                                                                      className={`hover:text-gray-800 ${entry.locked ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                                      title={entry.locked ? 'Indlæg er låst' : 'Rediger indlæg'}
                                                                      disabled={entry.locked}
                                                                  >
                                                                      <PencilAltIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      type="button"
                                                                      onClick={() => handleToggleReminder(entry)}
                                                                      className={`hover:text-gray-800 ${entry.locked ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                                      title={entry.reminderActive ? 'Fjern opfølgning' : 'Tilføj opfølgning'}
                                                                      disabled={entry.locked}
                                                                  >
                                                                      <ClockIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      type="button"
                                                                      onClick={() => handleToggleStar(entry.id)}
                                                                      className={`hover:text-gray-800 ${entry.starred ? 'text-yellow-500 hover:text-yellow-600' : ''}`}
                                                                      title={entry.starred ? 'Fjern favorit' : 'Marker som favorit'}
                                                                  >
                                                                      <StarIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      type="button"
                                                                      onClick={() => handleToggleLock(entry.id)}
                                                                      className={`hover:text-gray-800 ${entry.locked ? 'text-blue-600 hover:text-blue-700' : ''}`}
                                                                      title={entry.locked ? 'Lås op' : 'Lås indlæg'}
                                                                  >
                                                                      <LockClosedIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      type="button"
                                                                      onClick={() => handlePrintEntry(entry)}
                                                                      className="hover:text-gray-800"
                                                                      title="Udskriv indlæg"
                                                                  >
                                                                      <PrinterIcon className="w-5 h-5" />
                                                                  </button>
                                                                  <button
                                                                      type="button"
                                                                      onClick={() => handleDeleteEntry(entry.id)}
                                                                      className="hover:text-red-600"
                                                                      title="Slet indlæg"
                                                                  >
                                                                      <TrashIcon className="w-5 h-5" />
                                                                  </button>
                                                              </>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      ))}
                                      {entries.length === 0 && (
                                          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                                              Ingen journalindlæg endnu. Opret det første indlæg for denne klient.
                                          </div>
                                      )}
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