import { Property, Agent } from '../types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export const generateShareMessage = (property: Property, agent: Agent): string => {
    const message = `
📢 Stock for Sale – ${property.propertyType}

📍 Project Name: ${property.projectName}, ${property.subLocation}, ${property.mainLocation}
🛏 BHK: ${property.bhk}
📏 Size: ${property.sizeSqft} sq. ft.
🏢 Floor: ${property.floor}
🛋 Furnishing: ${property.furnishing}
🚗 Car Parking: ${property.parkingCount}
💰 Price: ${formatCurrency(property.price)}
💼 Brokerage: ${property.brokeragePercent}%

📲 Call Us ${agent.phone}

Google Location - ${property.googleMapLink || 'Not available'}
    `;
    return message.trim();
};
