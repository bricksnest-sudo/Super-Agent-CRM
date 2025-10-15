
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Client, Property, MatchResult } from '../types';
import { Icon } from '../components/common/Icon';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import { findMatchingProperties } from '../utils/matching';

const DetailItem: React.FC<{ label: string, value: string | React.ReactNode, icon: string }> = ({ label, value, icon }) => (
    <div className="flex items-start space-x-3">
        <Icon path={icon} className="w-5 h-5 mt-1 text-primary" />
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

const MatchChip: React.FC<{ reason: string }> = ({ reason }) => (
    <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">{reason} ✓</div>
);

const MatchedPropertyCard: React.FC<{ match: MatchResult }> = ({ match }) => {
    const { property, score, reasons } = match;
    const { setModalView } = useAppContext();
    return (
        <div onClick={() => setModalView({ type: 'view-property', property })} className="bg-white border rounded-lg overflow-hidden cursor-pointer">
            <img src={property.mediaUri} alt={property.projectName} className="w-full h-32 object-cover" />
            <div className="p-3">
                <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-800">{property.projectName}</p>
                    <div className="text-right">
                        <p className="font-bold text-primary">{formatCurrency(property.price)}</p>
                        <p className="text-sm font-semibold text-green-600">{score} pts</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                    {reasons.map(r => <MatchChip key={r} reason={r} />)}
                </div>
            </div>
        </div>
    )
};


export const ClientDetailScreen: React.FC<{ client: Client }> = ({ client }) => {
    const { properties, followUps, setModalView, agent } = useAppContext();
    const clientFollowUps = followUps.filter(f => f.clientId === client.id).sort((a,b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime());

    const matchingProperties = findMatchingProperties(client, properties);

    return (
        <div className="p-4 space-y-6">
             <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-gray-800">{client.name}</h2>
                 <button onClick={() => setModalView({type: 'edit-client', client})} className="p-2 text-gray-500 hover:text-primary">
                    <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-5 h-5"/>
                 </button>
            </div>
            
            <div className="flex items-center justify-around bg-gray-100 p-2 rounded-lg">
                <a href={`tel:${client.phone}`} className="flex flex-col items-center text-blue-600 space-y-1 p-2 rounded-md hover:bg-blue-100">
                    <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.211-.992-.55-1.33l-2.9-2.9a1.26 1.26 0 00-1.77 0l-1.17 1.17a1.125 1.125 0 01-1.587 0L9.9 12.034a1.125 1.125 0 010-1.587l1.17-1.17a1.26 1.26 0 000-1.77l-2.9-2.9a1.26 1.26 0 00-1.33-.55H5.25a2.25 2.25 0 00-2.25 2.25v2.25z" className="w-6 h-6"/>
                    <span className="text-xs font-semibold">Call</span>
                </a>
                 <a href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-green-600 space-y-1 p-2 rounded-md hover:bg-green-100">
                    <Icon path="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.306 3 11.75c0 1.76.54 3.425 1.475 4.816l-1.475 3.442 3.625-1.812A8.93 8.93 0 0012 20.25zM8.25 12.438h7.5" className="w-6 h-6" />
                    <span className="text-xs font-semibold">WhatsApp</span>
                </a>
                 <a href={`sms:${client.phone}`} className="flex flex-col items-center text-amber-600 space-y-1 p-2 rounded-md hover:bg-amber-100">
                    <Icon path="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" className="w-6 h-6"/>
                    <span className="text-xs font-semibold">SMS</span>
                </a>
                <a href={`mailto:${client.email}`} className="flex flex-col items-center text-purple-600 space-y-1 p-2 rounded-md hover:bg-purple-100">
                    <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-6 h-6" />
                    <span className="text-xs font-semibold">Email</span>
                </a>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                <h3 className="font-bold text-lg text-gray-800">Requirements</h3>
                <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Intent" value={client.requirement.intent} icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    <DetailItem label="Budget" value={`${formatCurrency(client.requirement.minBudget)} - ${formatCurrency(client.requirement.maxBudget)}`} icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6A.75.75 0 012.25 5.25v-.75m0 0A.75.75 0 013 4.5A.75.75 0 013.75 4.5m1.5.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m3 3.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m3 3.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m3 3.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75M9.75 12a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75A.75.75 0 019.75 12m-3 3.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m-3 3.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75z" />
                    <DetailItem label="Size" value={`${client.requirement.minSize} - ${client.requirement.maxSize} sq.ft.`} icon="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                    <DetailItem label="Configuration" value={client.requirement.configurations.join(', ')} icon="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    <div className="col-span-2">
                        <DetailItem label="Locations" value={client.requirement.locations.map(l => `${l.mainLocation} (${l.subLocations.join(', ')})`).join('; ')} icon="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Follow-ups</h3>
                    <button onClick={() => setModalView({ type: 'add-follow-up', client })} className="text-sm font-semibold text-primary hover:underline">Add New</button>
                </div>
                {clientFollowUps.length > 0 ? (
                    <div className="space-y-2">
                        {clientFollowUps.map(f => (
                            <div key={f.id} className={`p-3 rounded-lg ${f.isCompleted ? 'bg-gray-100' : 'bg-blue-50'}`}>
                                <p className={`font-semibold ${f.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{f.note}</p>
                                <p className="text-xs text-gray-500">{formatDateTime(f.dueAt)}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-sm text-gray-500 text-center py-4">No follow-ups recorded.</p>}
            </div>

             <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800">Matching Properties ({matchingProperties.length})</h3>
                 {matchingProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchingProperties.map(match => <MatchedPropertyCard key={match.property.id} match={match} />)}
                    </div>
                ) : <p className="text-sm text-gray-500 text-center py-4">No matching properties found.</p>}
            </div>
        </div>
    );
};
