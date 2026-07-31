export const PRICING_REGIONS = [
  'Asia',
  'Europe',
  'Middle East',
  'North America',
  'Latin America',
  'Caribbean',
  'Oceania',
  'Africa',
] as const;

export type PricingRegion = (typeof PRICING_REGIONS)[number];
