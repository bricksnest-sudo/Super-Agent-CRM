
import { Client, Property, FollowUp, ClientStatus, PropertyType, Intent, PropertyCategory, Furnishing } from '../types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client1',
    agentId: 'agent1',
    name: 'Amit Kumar',
    phone: '+919988776655',
    email: 'amit.k@example.com',
    status: ClientStatus.Hot,
    source: 'Reference',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requirement: {
      id: 'req1',
      propertyType: PropertyType.Residential,
      intent: Intent.Buy,
      configurations: ['3 BHK', '4 BHK'],
      minBudget: 8000000,
      maxBudget: 12000000,
      minSize: 1400,
      maxSize: 2000,
      locations: [
        { id: 'loc1', mainLocation: 'New Town', subLocations: ['Action Area 1', 'Action Area 2'] },
        { id: 'loc2', mainLocation: 'Salt Lake', subLocations: ['Salt Lake Sector-V'] }
      ]
    }
  },
  {
    id: 'client2',
    agentId: 'agent1',
    name: 'Priya Singh',
    phone: '+919123456789',
    email: 'priya.s@example.com',
    status: ClientStatus.Warm,
    source: 'Online Portal',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    requirement: {
      id: 'req2',
      propertyType: PropertyType.Residential,
      intent: Intent.Rent,
      configurations: ['2 BHK'],
      minBudget: 20000,
      maxBudget: 30000,
      minSize: 900,
      maxSize: 1200,
      locations: [
        { id: 'loc3', mainLocation: 'Garia', subLocations: ['Patuli Township', 'Kavi Nazrul Metro'] },
      ]
    }
  },
    {
    id: 'client3',
    agentId: 'agent1',
    name: 'Rohan Bose',
    phone: '+918877665544',
    email: 'rohan.b@example.com',
    status: ClientStatus.Cold,
    source: 'Walk-in',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    requirement: {
      id: 'req3',
      propertyType: PropertyType.Commercial,
      intent: Intent.Buy,
      configurations: ['Office'],
      minBudget: 5000000,
      maxBudget: 7500000,
      minSize: 800,
      maxSize: 1500,
      locations: [
        { id: 'loc4', mainLocation: 'Salt Lake', subLocations: ['Salt Lake Sector-V'] },
      ]
    }
  },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop1',
    agentId: 'agent1',
    category: PropertyCategory.NewProject,
    propertyType: PropertyType.Residential,
    projectName: 'DLF The Banyan Tree',
    city: 'Kolkata',
    mainLocation: 'New Town',
    subLocation: 'Action Area 1',
    bhk: '3 BHK',
    sizeSqft: 1800,
    floor: '12th (out of G+20)',
    furnishing: Furnishing.SemiFurnished,
    parkingCount: 2,
    price: 11000000,
    brokeragePercent: 1,
    googleMapLink: 'https://maps.app.goo.gl/example',
    mediaUri: 'https://picsum.photos/seed/prop1/800/600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop2',
    agentId: 'agent1',
    category: PropertyCategory.Resale,
    propertyType: PropertyType.Residential,
    projectName: 'Sunrise Apartments',
    city: 'Kolkata',
    mainLocation: 'Garia',
    subLocation: 'Patuli Township',
    bhk: '2 BHK',
    sizeSqft: 1050,
    floor: '3rd (out of G+4)',
    furnishing: Furnishing.Unfurnished,
    parkingCount: 1,
    price: 25000,
    brokeragePercent: 0,
    googleMapLink: 'https://maps.app.goo.gl/example2',
    mediaUri: 'https://picsum.photos/seed/prop2/800/600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop3',
    agentId: 'agent1',
    category: PropertyCategory.NewProject,
    propertyType: PropertyType.Commercial,
    projectName: 'Bengal Silicon Valley Hub',
    city: 'Kolkata',
    mainLocation: 'Salt Lake',
    subLocation: 'Salt Lake Sector-V',
    bhk: 'Office',
    sizeSqft: 1200,
    floor: '8th (out of 15)',
    furnishing: Furnishing.Unfurnished,
    parkingCount: 3,
    price: 6800000,
    brokeragePercent: 2,
    googleMapLink: 'https://maps.app.goo.gl/example3',
    mediaUri: 'https://picsum.photos/seed/prop3/800/600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

export const MOCK_FOLLOW_UPS: FollowUp[] = [
    {
        id: 'fu1',
        clientId: 'client1',
        dueAt: today.toISOString(),
        note: 'Call to confirm site visit on Saturday.',
        isCompleted: false,
    },
    {
        id: 'fu2',
        clientId: 'client2',
        dueAt: today.toISOString(),
        note: 'Send more rental options in Patuli.',
        isCompleted: false,
    },
    {
        id: 'fu3',
        clientId: 'client3',
        dueAt: tomorrow.toISOString(),
        note: 'Follow up on the Sector V office proposal.',
        isCompleted: false,
    },
    {
        id: 'fu4',
        clientId: 'client1',
        dueAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Initial call made, client is interested.',
        isCompleted: true,
    }
];
