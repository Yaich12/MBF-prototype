export enum Page {
  Calendar = 'Kalender',
  Clients = 'Klienter',
  Services = 'Ydelser',
  Invoices = 'Fakturaer',
  Statistics = 'Statistik',
  Settings = 'Indstillinger',
  Apps = 'Apps',
}

export interface Appointment {
  id: string;
  service: string;
  client: string;
  date: Date;
  startTime: string; // "HH:mm"
  duration: number; // in minutes
  color: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  includeMoms: boolean;
  color: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: Date;
  practitioner: string;
  notes: string;
}


export interface Client {
    id: string;
    name: string;
    status: string;
    email: string;
    phone: string;
    cpr: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    journalEntries?: JournalEntry[];
}