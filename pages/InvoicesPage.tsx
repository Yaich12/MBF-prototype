
import React from 'react';
import { PlusIcon, SortAscendingIcon, DotsHorizontalIcon } from '../components/icons';

const StatCard: React.FC<{ title: string, amount: string }> = ({ title, amount }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{amount} <span className="text-lg font-normal text-gray-500">ex. moms</span></p>
    </div>
);

const InvoicesPage: React.FC = () => {
    const tableHeaders = ["Klient", "Behandler", "Nummer", "Status", "Antal", "Dato", "Forfaldsdato", "Handlinger"];
    const filterTabs = ["alle (1)", "igangværende (0)", "ikke betalte (1)", "forfaldne (0)", "krediterede (0)", "aktive (1)", "ikke betalte sendte (1)", "betalte (0)"];

    return (
        <div className="p-8 bg-gray-50 h-full">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Fakturaer</h1>
                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">Hent fakturaer</button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">Opret ny kreditnota</button>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <PlusIcon className="mr-2" />
                        Opret ny faktura
                    </button>
                </div>
            </header>
            <div className="flex space-x-6 mb-6">
                <StatCard title="Omsætning i år" amount="DKK 10,00" />
                <StatCard title="Omsætning denne måned" amount="DKK 10,00" />
                <StatCard title="Omsætning denne uge" amount="DKK 10,00" />
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <button className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 px-3 py-2">Fakturaer</button>
                        <button className="text-sm font-medium text-gray-500 px-3 py-2 hover:text-gray-700">Aftaler ikke faktureret</button>
                    </div>
                </div>
                <div className="p-4">
                     <p className="text-sm font-medium text-gray-700 mb-2">Skjul nøgletal</p>
                     <div className="flex flex-wrap gap-x-1 gap-y-2">
                        {filterTabs.map((tab, index) => (
                             <button key={tab} className={`px-3 py-1 text-xs rounded-full ${index === 2 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                {tab}
                            </button>
                        ))}
                     </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 w-12 text-left">
                                    <input type="checkbox" className="rounded" />
                                </th>
                                {tableHeaders.map((header, index) => (
                                    <th key={header} className={`p-4 text-left font-medium text-gray-500 ${header === "Handlinger" ? "text-right" : ""}`}>
                                        <div className={`flex items-center ${header === "Handlinger" ? "justify-end" : ""}`}>
                                            {header}
                                            {header !== "Handlinger" && <SortAscendingIcon className="ml-1 text-gray-400" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="p-4"><input type="checkbox" className="rounded" /></td>
                                <td className="p-4 font-medium text-gray-800">Oliver Lauritzen (Test Klient)</td>
                                <td className="p-4"></td>
                                <td className="p-4">1</td>
                                <td className="p-4">
                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">ikke betalt</span>
                                </td>
                                <td className="p-4">12,50 DKK</td>
                                <td className="p-4">2025-11-11</td>
                                <td className="p-4">2025-11-12</td>
                                <td className="p-4 text-right">
                                    <button className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
                                        <DotsHorizontalIcon />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoicesPage;
