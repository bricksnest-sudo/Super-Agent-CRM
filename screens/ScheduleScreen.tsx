
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FollowUp } from '../types';
import { formatDateTime } from '../utils/helpers';
import { Icon } from '../components/common/Icon';

const FollowUpCard: React.FC<{ followUp: FollowUp }> = ({ followUp }) => {
    const { clients, setModalView } = useAppContext();
    const client = clients.find(c => c.id === followUp.clientId);

    if (!client) return null;

    const isPast = new Date(followUp.dueAt) < new Date() && !followUp.isCompleted;

    return (
        <div onClick={() => setModalView({ type: 'view-client', client })} className="bg-white p-4 rounded-xl shadow-md cursor-pointer">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-600">{followUp.note}</p>
                </div>
                {followUp.isCompleted && (
                     <div className="flex items-center space-x-1 text-green-600">
                        <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5" />
                        <span className="text-xs font-semibold">Done</span>
                     </div>
                )}
            </div>
            <div className={`mt-2 text-sm font-semibold ${isPast ? 'text-red-500' : 'text-primary'}`}>
                {formatDateTime(followUp.dueAt)}
            </div>
        </div>
    );
};

export const ScheduleScreen: React.FC = () => {
    const { followUps } = useAppContext();

    const sortedFollowUps = [...followUps].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
    
    const upcoming = sortedFollowUps.filter(f => !f.isCompleted);
    const completed = sortedFollowUps.filter(f => f.isCompleted);

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
            
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Upcoming</h2>
                <div className="space-y-3">
                    {upcoming.length > 0 ? (
                        upcoming.map(f => <FollowUpCard key={f.id} followUp={f} />)
                    ) : (
                        <p className="text-center text-gray-500 py-4">No upcoming follow-ups.</p>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Completed</h2>
                <div className="space-y-3">
                    {completed.length > 0 ? (
                        completed.map(f => <FollowUpCard key={f.id} followUp={f} />)
                    ) : (
                        <p className="text-center text-gray-500 py-4">No completed follow-ups yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
