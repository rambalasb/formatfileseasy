export type ConversionType = {
  from: string;
  to: string;
};

export const SUPPORTED_CONVERSIONS = [
  { from: 'text/plain', to: 'application/json' },
  { from: 'application/json', to: 'text/plain' },
  { from: 'text/plain', to: 'text/csv' },
  { from: 'text/csv', to: 'application/json' },
  { from: 'image/jpeg', to: 'image/webp' },
  { from: 'image/png', to: 'image/webp' },
];