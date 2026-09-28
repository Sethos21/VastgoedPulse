export type PropertyType = 'Woning' | 'Appartement' | 'Kantoor' | 'Logistiek' | 'Winkelruimte';

export type EnergyLabel = 'A++++' | 'A+++' | 'A++' | 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type PropertyStatus = 'Te Koop' | 'Onder Bod' | 'Verkocht' | 'Verhuurd' | 'Nieuw in Aanbod';

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  postalCode: string;
  district: string;
  type: PropertyType;
  price: number;
  areaM2: number;
  pricePerM2: number;
  annualRent: number;
  barYield: number; // Bruto Aanvangsrendement (%)
  narYield: number; // Netto Aanvangsrendement (%)
  energyLabel: EnergyLabel;
  constructionYear: number;
  status: PropertyStatus;
  lastUpdated: string;
  imageUrl?: string;
  wozValue: number;
  cadastralCode: string;
  monthlyHoaFee: number; // VvE bijdrage indien van toepassing
  projectedGrowth: number; // % per jaar
  rooms: number;
  bedrooms: number;
  fundaUrl?: string;
  brokerName?: string;
  source?: 'funda' | 'manual' | 'sample';
  daysOnMarket?: number;
  priceDrop?: {
    originalPrice: number;
    dropAmount: number;
    percentage: number;
  };
  kadasterRecord?: {
    lastPurchasePrice: number;
    lastPurchaseDate: string;
    deedNumber: string;
    ownerType: 'Particulier' | 'Rechtspersoon (B.V.)' | 'Vereniging van Eigenaars';
    mortgageAmount: number;
    mortgageHolder: string;
    bagVerblijfsobjectId: string;
    plotAreaM2?: number;
    verifiedAt: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
}

export interface CityBenchmark {
  id: string;
  name: string;
  avgPricePerM2: number;
  deltaYearPercent: number;
  avgBarYield: number;
  transactionCount24h: number;
  greenLabelPercent: number; // % A of hoger
  x: number; // SVG map X coordinate (0-500)
  y: number; // SVG map Y coordinate (0-600)
  districts: {
    name: string;
    avgPriceM2: number;
    growthPercent: number;
  }[];
}

export interface RealtimeEvent {
  id: string;
  timestamp: string;
  type: 'TRANSACTION' | 'PRICE_CHANGE' | 'NEW_LISTING' | 'OFFER_ACCEPTED';
  propertyId: string;
  propertyTitle: string;
  city: string;
  price: number;
  priceDelta?: number;
  yield: number;
  areaM2: number;
}

export type HeatmapMode = 'pricePerM2' | 'barYield' | 'transactions' | 'energyLabel';

export interface FilterState {
  search: string;
  city: string;
  type: string;
  status: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  energyLabel: string;
  minYield: number;
}

// Trend Analysis Data Structures
export type TrendMetric = 'pricePerM2' | 'medianPrice' | 'volume' | 'overbidding' | 'daysOnMarket' | 'yield';

export interface HistoricalDataPoint {
  period: string; // e.g. '2021-Q1'
  date: string;
  // Cities (€/m² or respective metric)
  amsterdam: number;
  rotterdam: number;
  utrecht: number;
  denHaag: number;
  eindhoven: number;
  groningen: number;
  tilburg: number;
  arnhem: number;
  landelijk: number;
  // By Property Type (€/m²)
  woning: number;
  appartement: number;
  kantoor: number;
  logistiek: number;
  winkel: number;
  // Auxiliary metrics
  overbiddingPercent: number;
  avgDaysOnMarket: number;
  transactionVolume: number;
}

export interface HistoricalSaleRecord {
  id: string;
  date: string;
  city: string;
  district: string;
  address: string;
  propertyType: PropertyType;
  areaM2: number;
  askingPrice: number;
  soldPrice: number;
  pricePerM2: number;
  overbidPercent: number;
  daysToSell: number;
  energyLabel: EnergyLabel;
}

