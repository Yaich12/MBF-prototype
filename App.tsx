
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CalendarPage from './pages/CalendarPage';
import ClientsPage from './pages/ClientsPage';
import ServicesPage from './pages/ServicesPage';
import InvoicesPage from './pages/InvoicesPage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import AppsPage from './pages/AppsPage';
import { Page, Client } from './types';
import ClientDetailPage from './pages/ClientDetailPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Calendar);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleAddClient = (clientData: Omit<Client, 'id' | 'status'>) => {
      const newClient: Client = {
          id: new Date().toISOString() + Math.random(),
          status: 'Aktiv',
          ...clientData
      };
      setClients(prev => [...prev, newClient]);
  };
  
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  }

  const handleBackToClients = () => {
    setSelectedClient(null);
  }

  const renderPage = () => {
    switch (activePage) {
      case Page.Calendar:
        return <CalendarPage />;
      case Page.Clients:
        if (selectedClient) {
          return <ClientDetailPage client={selectedClient} onBack={handleBackToClients} />;
        }
        return <ClientsPage clients={clients} onAddClient={handleAddClient} onClientSelect={handleClientSelect} />;
      case Page.Services:
        return <ServicesPage />;
      case Page.Invoices:
        return <InvoicesPage />;
      case Page.Statistics:
        return <StatisticsPage />;
      case Page.Settings:
        return <SettingsPage />;
      case Page.Apps:
        return <AppsPage />;
      default:
        return <CalendarPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;