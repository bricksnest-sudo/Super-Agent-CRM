import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Property, Client, ClientMatchResult } from '../types';
import { Icon } from '../components/common/Icon';
import { formatCurrency, generateShareMessage } from '../utils/helpers';
import { findMatchingClients } from '../utils/matching';

const DetailItem: React.FC<{ label: string, value: string | React.ReactNode, icon?: string }> = ({ label, value, icon }) => (
    <div className="flex items-start">
        {icon && <Icon path={icon} className="w-5 h-5 mt-1 mr-3 text-primary" />}
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

const MatchedClientCard: React.FC<{ match: ClientMatchResult }> = ({ match }) => {
    const { client, score } = match;
    const { setModalView } = useAppContext();
    return (
        <div onClick={() => setModalView({ type: 'view-client', client })} className="bg-white p-3 border rounded-lg flex justify-between items-center cursor-pointer">
            <div>
                <p className="font-bold text-gray-800">{client.name}</p>
                <p className="text-sm text-gray-500">{client.phone}</p>
            </div>
             <div className="text-right">
                <p className="text-sm font-semibold text-green-600">{score} pts</p>
            </div>
        </div>
    )
};


export const PropertyDetailScreen: React.FC<{ property: Property }> = ({ property }) => {
    const { clients, agent, setModalView } = useAppContext();
    const matchingClients = findMatchingClients(property, clients);

    const handleShare = (platform: 'whatsapp' | 'email') => {
        const message = generateShareMessage(property, agent);
        if (platform === 'whatsapp') {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } else {
            const subject = `Stock for Sale – ${property.projectName}`;
            const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            window.location.href = emailUrl;
        }
    };
    
    return (
        <div>
            <img src={property.mediaUri} alt={property.projectName} className="w-full h-64 object-cover"/>
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{property.projectName}</h2>
                        <p className="text-md text-gray-500">{property.subLocation}, {property.mainLocation}</p>
                    </div>
                     <button onClick={() => setModalView({type: 'edit-property', property})} className="p-2 text-gray-500 hover:text-primary">
                        <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-5 h-5"/>
                     </button>
                </div>
                
                <div className="text-3xl font-bold text-primary">{formatCurrency(property.price)}</div>

                <div className="flex space-x-2">
                     <button onClick={() => handleShare('whatsapp')} className="flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors">
                        <Icon path="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.306 3 11.75c0 1.76.54 3.425 1.475 4.816l-1.475 3.442 3.625-1.812A8.93 8.93 0 0012 20.25zM8.25 12.438h7.5" className="w-5 h-5" />
                        <span>Share on WhatsApp</span>
                    </button>
                    <button onClick={() => handleShare('email')} className="flex-1 bg-gray-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors">
                        <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-5 h-5" />
                         <span>Share via Email</span>
                    </button>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Property Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="BHK" value={property.bhk}/>
                        <DetailItem label="Size" value={`${property.sizeSqft} sq.ft.`}/>
                        <DetailItem label="Floor" value={property.floor}/>
                        <DetailItem label="Furnishing" value={property.furnishing}/>
                        <DetailItem label="Parking" value={property.parkingCount.toString()}/>
                        <DetailItem label="Brokerage" value={`${property.brokeragePercent}%`}/>
                        <div className="col-span-2">
                             <DetailItem label="Google Maps" value={
                                 property.googleMapLink ? <a href={property.googleMapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View on Map</a> : 'Not available'
                             }/>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Prospective Clients ({matchingClients.length})</h3>
                    {matchingClients.length > 0 ? (
                        <div className="space-y-2">
                           {matchingClients.map(match => <MatchedClientCard key={match.client.id} match={match} />)}
                        </div>
                    ) : <p className="text-sm text-gray-500 text-center py-4">No prospective clients found.</p>}
                </div>
            </div>
        </div>
    );
};
