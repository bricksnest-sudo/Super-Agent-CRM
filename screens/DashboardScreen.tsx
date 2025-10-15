
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Icon } from '../components/common/Icon';
import { FollowUp, ClientStatus } from '../types';
import { formatDate } from '../utils/helpers';

const StatCard: React.FC<{ title: string; value: number | string; icon: string, color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon path={icon} className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const FollowUpItem: React.FC<{ followUp: FollowUp }> = ({ followUp }) => {
    const { clients, setModalView } = useAppContext();
    const client = clients.find(c => c.id === followUp.clientId);
    if (!client) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
                <p className="font-bold text-gray-800">{client.name}</p>
                <p className="text-sm text-gray-600">{followUp.note}</p>
            </div>
            <div className="flex items-center space-x-2">
                <a href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                    <Icon path="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.306 3 11.75c0 1.76.54 3.425 1.475 4.816l-1.475 3.442 3.625-1.812A8.93 8.93 0 0012 20.25zM8.25 12.438h7.5" className="w-5 h-5" />
                </a>
                <a href={`tel:${client.phone}`} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                    <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.211-.992-.55-1.33l-2.9-2.9a1.26 1.26 0 00-1.77 0l-1.17 1.17a1.125 1.125 0 01-1.587 0L9.9 12.034a1.125 1.125 0 010-1.587l1.17-1.17a1.26 1.26 0 000-1.77l-2.9-2.9a1.26 1.26 0 00-1.33-.55H5.25a2.25 2.25 0 00-2.25 2.25v2.25z" className="w-5 h-5" />
                </a>
            </div>
        </div>
    );
};

export const DashboardScreen: React.FC = () => {
    const { clients, properties, followUps, agent } = useAppContext();
    const activeClients = clients.filter(c => c.status !== ClientStatus.Cancelled).length;
    
    const today = new Date().toDateString();
    const todaysFollowUps = followUps.filter(f => !f.isCompleted && new Date(f.dueAt).toDateString() === today);

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Hello, {agent.name.split(' ')[0]}!</h1>
                    <p className="text-gray-500">Here's your summary for {formatDate(new Date().toISOString())}.</p>
                </div>
                <img src={`https://i.pravatar.cc/150?u=${agent.id}`} alt="Agent" className="w-12 h-12 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Active Clients" value={activeClients} icon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.318.239-.636.354-.962a3.752 3.752 0 01.284-.938M7.5 14.25A3.75 3.75 0 1011.25 10.5a3.75 3.75 0 00-3.75 3.75z" color="bg-blue-500" />
                <StatCard title="Properties Listed" value={properties.length} icon="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zM15 6.75h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75z" color="bg-green-500" />
                <StatCard title="Today's Follow-ups" value={todaysFollowUps.length} icon="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" color="bg-amber-500" />
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Today's Follow-ups</h2>
                <div className="space-y-3">
                    {todaysFollowUps.length > 0 ? (
                        todaysFollowUps.map(f => <FollowUpItem key={f.id} followUp={f} />)
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No follow-ups scheduled for today. Enjoy your day!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
