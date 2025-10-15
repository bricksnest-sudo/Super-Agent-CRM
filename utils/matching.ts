
import { Client, Property, MatchResult, ClientMatchResult, Intent } from '../types';

const calculatePropertyMatchScore = (client: Client, property: Property): { score: number; reasons: string[] } => {
  const { requirement } = client;
  let score = 0;
  const reasons: string[] = [];

  // Must match criteria
  if (requirement.propertyType !== property.propertyType) return { score: 0, reasons: [] };
  
  const isRent = requirement.intent === Intent.Rent;
  // A property for sale can be rented (not vice versa in this model) but we'll assume a strict match for now.
  // The price check will handle rent/buy disparity. Let's assume price > 100000 is for sale.
  if (isRent && property.price > 100000) return {score: 0, reasons: []};
  if (!isRent && property.price <= 100000) return {score: 0, reasons: []};


  score += 40; // Base score for type and intent match
  reasons.push('Type & Intent');

  // Budget fit
  const priceTolerance = isRent ? 1.15 : 1.10; // 15% for rent, 10% for sale
  if (property.price >= requirement.minBudget && property.price <= requirement.maxBudget * priceTolerance) {
    score += 25;
    reasons.push('Budget');
  }

  // Location match
  let locationScore = 0;
  const clientLocations = requirement.locations;
  for (const loc of clientLocations) {
      if (loc.mainLocation === property.mainLocation) {
          if (loc.subLocations.includes(property.subLocation)) {
              locationScore = Math.max(locationScore, 20); // Exact sub-location match
              break;
          }
          locationScore = Math.max(locationScore, 15); // Main location match
      }
  }
  if (locationScore > 0) {
      score += locationScore;
      reasons.push('Location');
  }
  

  // BHK/config match
  if (requirement.configurations.includes(property.bhk)) {
    score += 10;
    reasons.push('Configuration');
  }

  // Size fit
  const sizeTolerance = 1.15;
  if (property.sizeSqft >= requirement.minSize && property.sizeSqft <= requirement.maxSize * sizeTolerance) {
    score += 5;
    reasons.push('Size');
  }

  return { score, reasons };
};

export const findMatchingProperties = (client: Client, properties: Property[]): MatchResult[] => {
  const matches: MatchResult[] = [];
  for (const property of properties) {
    const { score, reasons } = calculatePropertyMatchScore(client, property);
    if (score >= 60) {
      matches.push({ property, score, reasons });
    }
  }
  return matches.sort((a, b) => b.score - a.score);
};

export const findMatchingClients = (property: Property, clients: Client[]): ClientMatchResult[] => {
    const matches: ClientMatchResult[] = [];
    for (const client of clients) {
        const { score, reasons } = calculatePropertyMatchScore(client, property);
        if (score >= 60) {
            matches.push({ client, score, reasons });
        }
    }
    return matches.sort((a, b) => b.score - a.score);
};
