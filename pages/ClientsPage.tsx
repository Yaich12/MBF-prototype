
import React, { useState } from 'react';
import { FilterIcon, RefreshIcon, SearchIcon, PlusIcon, SortAscendingIcon, XIcon, UploadIcon, ChevronDownIcon } from '../components/icons';
import { Client } from '../types';


interface AddClientModalProps {
    onClose: () => void;
    onAddClient: (client: Omit<Client, 'id' | 'status'>) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose, onAddClient }) => {
    const [formData, setFormData] = useState({
        name: '',
        cpr: '',
        birthDate: '',
        email: '',
        phone: '',
        address: '',
        zip: '',
        city: '',
        region: '',
        country: 'Danmark',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.name) {
            alert('Navn er påkrævet.');
            return;
        }
        onAddClient({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            cpr: formData.cpr,
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
            country: formData.country,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Tilføj klient</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Billede</label>
                             <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-40">
                                <div className="space-y-1 text-center">
                                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-sm text-gray-600">Klik for at tilføje et billede</p>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Navn</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CPR</label>
                                    <input type="text" name="cpr" value={formData.cpr} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fødselsdato</label>
                                    <input type="text" name="birthDate" placeholder="DD-MM-YYYY" value={formData.birthDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Telefon</label>
                         <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">+45</span>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Adresse</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        <button className="text-sm text-blue-600 hover:underline mt-1">Tilføj 2. linje</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Postnummer</label>
                            <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">By</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Region</label>
                        <input type="text" name="region" value={formData.region} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Land</label>
                        <select name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white">
                            <option>Danmark</option>
                            <option>Sverige</option>
                            <option>Norge</option>
                            <option>Tyskland</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Noter</label>
                        <textarea name="notes" rows={4} value={formData.notes} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                     <button onClick={handleSubmit} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Gem
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ClientsPageProps {
    clients: Client[];
    onAddClient: (client: Omit<Client, 'id' | 'status'>) => void;
    onClientSelect: (client: Client) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ clients, onAddClient, onClientSelect }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tableHeaders = ["Navn", "Status", "E-mail", "Telefon", "CPR", "Adresse", "By", "Postnummer", "Land"];

    return (
        <div className="p-8 bg-gray-50 h-full">
            {isModalOpen && <AddClientModal onClose={() => setIsModalOpen(false)} onAddClient={onAddClient} />}
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Klientoversigt</h1>
                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">Eksporter CSV</button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <PlusIcon className="mr-2" />
                        Tilføj klient
                    </button>
                </div>
            </header>
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">
                            <FilterIcon className="mr-2 text-gray-500" />
                            Filter
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                            <RefreshIcon className="mr-2 text-gray-500" />
                            Gemte filtre
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-800">Rediger kolonner</button>
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Søg" className="pl-10 pr-4 py-1.5 w-48 border rounded-md text-sm" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 w-12 text-left">
                                    <input type="checkbox" className="rounded" />
                                </th>
                                {tableHeaders.map(header => (
                                    <th key={header} className="p-4 text-left font-medium text-gray-500">
                                        <div className="flex items-center">
                                            {header}
                                            <SortAscendingIcon className="ml-1 text-gray-400" />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan={tableHeaders.length + 2}>
                                        <div className="text-center py-20">
                                            <h3 className="text-lg font-medium text-gray-800">Ingen klienter fundet</h3>
                                            <p className="mt-2 text-gray-500">Der blev ikke fundet nogen klienter for de aktuelle filtre. Prøv igen med andre filtre.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                clients.map(client => (
                                    <tr key={client.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4"><input type="checkbox" className="rounded" /></td>
                                        <td className="p-4 font-medium text-gray-800">
                                            <button onClick={() => onClientSelect(client)} className="text-blue-600 hover:underline text-left">
                                                {client.name}
                                            </button>
                                        </td>
                                        <td className="p-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{client.status}</span></td>
                                        <td className="p-4">{client.email}</td>
                                        <td className="p-4">{client.phone}</td>
                                        <td className="p-4">{client.cpr}</td>
                                        <td className="p-4">{client.address}</td>
                                        <td className="p-4">{client.city}</td>
                                        <td className="p-4">{client.zip}</td>
                                        <td className="p-4">{client.country}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientsPage;