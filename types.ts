export enum ClientStatus {
  New = 'New',
  Cold = 'Cold',
  Warm = 'Warm',
  Hot = 'Hot',
  Cancelled = 'Cancelled'
}

export enum PropertyType {
  Residential = 'Residential',
  Commercial = 'Commercial'
}

export enum Intent {
  Buy = 'Buy',
  Rent = 'Rent'
}

export enum PropertyCategory {
  Resale = 'Resale',
  NewProject = 'New Project'
}

export enum Furnishing {
  Unfurnished = 'Unfurnished',
  SemiFurnished = 'Semi-Furnished',
  FullyFurnished = 'Fully-Furnished'
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface ClientLocationPreference {
  id: string;
  mainLocation: string;
  subLocations: string[];
}

export interface ClientRequirement {
  id: string;
  propertyType: PropertyType;
  intent: Intent;
  configurations: string[];
  minBudget: number;
  maxBudget: number;
  minSize: number;
  maxSize: number;
  locations: ClientLocationPreference[];
}

export interface Client {
  id: string;
  agentId: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  status: ClientStatus;
  cancelReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  requirement: ClientRequirement;
}

export interface FollowUp {
  id: string;
  clientId: string;
  dueAt: string;
  note: string;
  isCompleted: boolean;
}

export interface Property {
  id: string;
  agentId: string;
  category: PropertyCategory;
  propertyType: PropertyType;
  projectName: string;
  city: string;
  mainLocation: string;
  subLocation: string;
  addressText?: string;
  bhk: string;
  sizeSqft: number;
  floor: string;
  furnishing: Furnishing;
  parkingCount: number;
  price: number;
  brokeragePercent: number;
  googleMapLink?: string;
  mediaUri: string; // URL for image
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  property: Property;
  score: number;
  reasons: string[];
}

export interface ClientMatchResult {
    client: Client;
    score: number;
    reasons: string[];
}

export type Screen = 'dashboard' | 'clients' | 'properties' | 'schedule' | 'profile';

export type ModalView = 
  | { type: 'none' }
  | { type: 'add-client' }
  | { type: 'edit-client', client: Client }
  | { type: 'view-client', client: Client }
  | { type: 'add-property' }
  | { type: 'edit-property', property: Property }
  | { type: 'view-property', property: Property }
  | { type: 'add-follow-up', client: Client }
  | { type: 'edit-profile' };