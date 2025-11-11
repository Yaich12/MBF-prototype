
import React, { useMemo, useState } from 'react';
import { Appointment, Client } from '../types';
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
    appointments: Appointment[];
    onNavigateToAppointmentDate: (date: Date) => void;
}

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ client, onBack, appointments, onNavigateToAppointmentDate }) => {
    const [activeTab, setActiveTab] = useState('Journal');
    const tabs = ['Journal', 'Begivenheder', 'Aftaler', 'Fakturaer'];

    // Mock data for journal entry
    const journalEntry = {
        id: '1',
        title: 'Migræne',
        date: '11. november 2025',
        notes: 'Han tænker for meget. / diagnoseret kronisk skeptisk fra alder af 16 år'
    };

    const relativeTimeFormatter = useMemo(
        () => new Intl.RelativeTimeFormat('da', { numeric: 'auto' }),
        []
    );

    const clientAppointments = useMemo(() => {
        return appointments
            .filter(app => app.client === client.name)
            .map(app => {
                const [hour, minute] = app.startTime.split(':').map(Number);
                const appointmentDate = new Date(app.date);
                appointmentDate.setHours(hour ?? 0, minute ?? 0, 0, 0);
                return { ...app, appointmentDate };
            })
            .sort((a, b) => b.appointmentDate.getTime() - a.appointmentDate.getTime());
    }, [appointments, client.name]);

    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const minutes = Math.round(diffMs / 60000);

        if (Math.abs(minutes) < 60) {
            return relativeTimeFormatter.format(minutes, 'minute');
        }

        const hours = Math.round(diffMs / 3600000);
        if (Math.abs(hours) < 24) {
            return relativeTimeFormatter.format(hours, 'hour');
        }

        const days = Math.round(diffMs / 86400000);
        if (Math.abs(days) < 7) {
            return relativeTimeFormatter.format(days, 'day');
        }

        const weeks = Math.round(diffMs / (86400000 * 7));
        if (Math.abs(weeks) < 5) {
            return relativeTimeFormatter.format(weeks, 'week');
        }

        const months = Math.round(diffMs / (86400000 * 30));
        if (Math.abs(months) < 12) {
            return relativeTimeFormatter.format(months, 'month');
        }

        const years = Math.round(diffMs / (86400000 * 365));
        return relativeTimeFormatter.format(years, 'year');
    };

    const formatAppointmentDate = (date: Date) => {
        const dateLabel = date.toLocaleDateString('da-DK', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        const timeLabel = date.toLocaleTimeString('da-DK', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${dateLabel} kl. ${timeLabel}`;
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
                          {activeTab === 'Begivenheder' && (
                              <div className="p-6">
                                  {clientAppointments.length === 0 ? (
                                      <div className="text-center text-gray-500">
                                          Ingen aftaler er registreret for denne klient endnu.
                                      </div>
                                  ) : (
                                      <div className="relative pl-8">
                                          <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-blue-200" />
                                          <div className="space-y-6">
                                              {clientAppointments.map(appointment => (
                                                  <div key={appointment.id} className="relative">
                                                      <div className="absolute left-2 top-4 w-6 h-6 rounded-full border-4 border-white bg-blue-600 shadow-md"></div>
                                                      <div className="bg-white border border-blue-100 rounded-lg shadow-sm p-5">
                                                          <p className="text-sm text-gray-500">{formatRelativeTime(appointment.appointmentDate)}</p>
                                                          <h4 className="text-lg font-semibold text-gray-800 mt-1">{appointment.service}</h4>
                                                          <p className="text-sm text-gray-600 mt-1">
                                                              {formatAppointmentDate(appointment.appointmentDate)} • Varighed {appointment.duration} minutter
                                                          </p>
                                                          <button
                                                              type="button"
                                                              onClick={() => onNavigateToAppointmentDate(appointment.appointmentDate)}
                                                              className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                          >
                                                              Gå til aftale
                                                          </button>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          )}
                          {activeTab !== 'Journal' && activeTab !== 'Begivenheder' && (
                             <div className="p-6 text-center text-gray-500">Indhold for {activeTab} kommer snart.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientDetailPage;