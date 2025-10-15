import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Icon } from '../components/common/Icon';
import { Client, Property } from '../types';

export const ProfileScreen: React.FC = () => {
    const { agent, clients, properties, setModalView, logout } = useAppContext();

    const exportToCSV = <T,>(data: T[], filename: string) => {
        if (data.length === 0) {
            alert("No data to export.");
            return;
        }
        const headers = Object.keys(data[0] as object).join(',');
        const rows = data.map(row => 
            Object.values(row as object).map(value => {
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                if (typeof value === 'object' && value !== null) {
                    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>

            <div className="p-6 bg-white rounded-xl shadow-md text-center">
                <img src={`https://i.pravatar.cc/150?u=${agent.id}`} alt="Agent" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800">{agent.name}</h2>
                <p className="text-gray-500">{agent.email}</p>
                <p className="text-gray-500">{agent.phone}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-2">
                <div className="divide-y">
                    <button onClick={() => setModalView({ type: 'edit-profile' })} className="w-full flex items-center p-4 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg">
                        <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-6 h-6 mr-4 text-primary" />
                        <span>Edit Profile</span>
                    </button>
                    <button className="w-full flex items-center p-4 text-left text-gray-700 hover:bg-gray-50">
                        <Icon path="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" className="w-6 h-6 mr-4 text-primary" />
                        <span>Share Defaults</span>
                    </button>
                    <button onClick={() => exportToCSV<Client>(clients, 'clients_export')} className="w-full flex items-center p-4 text-left text-gray-700 hover:bg-gray-50">
                        <Icon path="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" className="w-6 h-6 mr-4 text-primary" />
                        <span>Export Clients (CSV)</span>
                    </button>
                    <button onClick={() => exportToCSV<Property>(properties, 'properties_export')} className="w-full flex items-center p-4 text-left text-gray-700 hover:bg-gray-50">
                        <Icon path="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" className="w-6 h-6 mr-4 text-primary" />
                        <span>Export Properties (CSV)</span>
                    </button>
                     <button className="w-full flex items-center p-4 text-left text-gray-700 hover:bg-gray-50">
                        <Icon path="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" className="w-6 h-6 mr-4 text-primary" />
                        <span>Support / FAQ</span>
                    </button>
                    <button onClick={logout} className="w-full flex items-center p-4 text-left text-red-600 hover:bg-red-50 rounded-b-lg">
                        <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" className="w-6 h-6 mr-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};