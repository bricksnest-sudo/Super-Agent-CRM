import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Client, ClientStatus } from '../types';
import { Icon } from '../components/common/Icon';
import { CLIENT_STATUS_OPTIONS } from '../constants';

const getStatusColor = (status: ClientStatus) => {
    switch (status) {
        case ClientStatus.Hot: return 'bg-red-100 text-red-800';
        case ClientStatus.Warm: return 'bg-orange-100 text-orange-800';
        case ClientStatus.Cold: return 'bg-blue-100 text-blue-800';
        case ClientStatus.New: return 'bg-green-100 text-green-800';
        case ClientStatus.Cancelled: return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const ClientCard: React.FC<{ client: Client }> = ({ client }) => {
    const { setModalView } = useAppContext();
    return (
        <div onClick={() => setModalView({ type: 'view-client', client })} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.phone}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                    {client.status}
                </span>
            </div>
            <div className="mt-4 border-t pt-2">
                 <p className="text-sm text-gray-600">
                    {client.requirement.intent} • {client.requirement.propertyType} • {client.requirement.configurations.join(', ')}
                 </p>
            </div>
        </div>
    );
};

export const ClientsScreen: React.FC = () => {
    const { clients } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ClientStatus | 'All'>('All');
    const [sourceFilter, setSourceFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');


    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.phone.includes(searchTerm);
            const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
            const matchesSource = !sourceFilter || (client.source && client.source.toLowerCase().includes(sourceFilter.toLowerCase()));
            
            // Compare only the date part, ignoring time, by converting both to date strings.
            // The date input provides a 'YYYY-MM-DD' string. We need to create a Date object from it in a way that avoids timezone issues.
            // Appending 'T00:00:00' makes it a local time date object.
            const matchesDate = !dateFilter || new Date(client.createdAt).toDateString() === new Date(dateFilter + 'T00:00:00').toDateString();

            return matchesSearch && matchesStatus && matchesSource && matchesDate;
        });
    }, [clients, searchTerm, statusFilter, sourceFilter, dateFilter]);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
            <div className="sticky top-0 bg-gray-50 py-2 z-10 space-y-2">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'All')}
                        className="w-full p-2 border rounded-lg bg-white"
                    >
                        <option value="All">All Statuses</option>
                        {CLIENT_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                     <input
                        type="text"
                        placeholder="Filter by source..."
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-white"
                    />
                    <div className="relative">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-white text-gray-500"
                        />
                         {dateFilter && (
                            <button onClick={() => setDateFilter('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4 text-gray-400 hover:text-gray-600"/>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                {filteredClients.length > 0 ? (
                    filteredClients.map(client => <ClientCard key={client.id} client={client} />)
                ) : (
                    <p className="text-center text-gray-500 pt-8">No clients found.</p>
                )}
            </div>
        </div>
    );
};