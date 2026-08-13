export type ServiceCategory = 'SPEED_POST_DOC' | 'SPEED_POST_PARCEL' | 'INDIA_POST_PARCEL';
export type CustomerType = 'RETAIL' | 'CONTRACTUAL';

export const ZONES_DOC = [
  { id: 'local', label: 'Local' },
  { id: 'upto200', label: 'Up to 200 Km' },
  { id: 'upto500', label: '201 to 500 Km' },
  { id: 'upto1000', label: '501 to 1000 Km' },
  { id: 'upto2000', label: '1001 to 2000 Km' },
  { id: 'above2000', label: 'Above 2000 Km' },
];

export const ZONES_PARCEL = [
  { id: 'local', label: 'Local' },
  { id: 'withinState', label: 'Within State' },
  { id: 'zoneMetro', label: 'Zone/Metro' },
  { id: 'otherStates', label: 'Other States' },
];

export const speedPostDocRates = [
  { maxWeight: 50, local: 19, upto200: 47, upto500: 47, upto1000: 47, upto2000: 47, above2000: 47 },
  { maxWeight: 250, local: 24, upto200: 59, upto500: 63, upto1000: 68, upto2000: 72, above2000: 77 },
  { maxWeight: 500, local: 28, upto200: 70, upto500: 75, upto1000: 82, upto2000: 86, above2000: 93 },
];

export const speedPostParcelRetailRates = [
  { maxWeight: 500, local: 28, withinState: 76, zoneMetro: 82, otherStates: 90 },
  { maxWeight: 1000, local: 48, withinState: 101, zoneMetro: 137, otherStates: 143 },
  { maxWeight: 1500, local: 60, withinState: 130, zoneMetro: 182, otherStates: 228 },
  { maxWeight: 2000, local: 87, withinState: 178, zoneMetro: 254, otherStates: 319 },
  { maxWeight: 3000, local: 116, withinState: 243, zoneMetro: 355, otherStates: 450 },
  { maxWeight: 4000, local: 145, withinState: 298, zoneMetro: 441, otherStates: 560 },
  { maxWeight: 5000, local: 174, withinState: 361, zoneMetro: 539, otherStates: 686 },
];
export const speedPostParcelRetailAdd = { local: 35, withinState: 60, zoneMetro: 95, otherStates: 120 };

export const speedPostParcelContractualRates = [
  { maxWeight: 500, local: 28, withinState: 36, zoneMetro: 40, otherStates: 47 },
  { maxWeight: 1000, local: 31, withinState: 49, zoneMetro: 65, otherStates: 71 },
  { maxWeight: 1500, local: 36, withinState: 64, zoneMetro: 110, otherStates: 150 },
  { maxWeight: 2000, local: 45, withinState: 89, zoneMetro: 140, otherStates: 190 },
  { maxWeight: 3000, local: 57, withinState: 111, zoneMetro: 190, otherStates: 250 },
  { maxWeight: 4000, local: 69, withinState: 133, zoneMetro: 235, otherStates: 305 },
  { maxWeight: 5000, local: 81, withinState: 156, zoneMetro: 275, otherStates: 350 },
];
export const speedPostParcelContractualAdd = { local: 15, withinState: 25, zoneMetro: 60, otherStates: 65 };

export const indiaPostParcelRetailRates = [
  { maxWeight: 500, local: 28, withinState: 65, zoneMetro: 70, otherStates: 72 },
  { maxWeight: 1000, local: 48, withinState: 91, zoneMetro: 106, otherStates: 114 },
  { maxWeight: 1500, local: 60, withinState: 117, zoneMetro: 142, otherStates: 171 },
  { maxWeight: 2000, local: 87, withinState: 160, zoneMetro: 198, otherStates: 239 },
  { maxWeight: 3000, local: 116, withinState: 219, zoneMetro: 277, otherStates: 337 },
  { maxWeight: 4000, local: 145, withinState: 268, zoneMetro: 344, otherStates: 420 },
  { maxWeight: 5000, local: 174, withinState: 324, zoneMetro: 420, otherStates: 515 },
];
export const indiaPostParcelRetailAdd = { local: 30, withinState: 50, zoneMetro: 70, otherStates: 90 };

export const indiaPostParcelContractualRates = [
  { maxWeight: 500, local: 27, withinState: 31, zoneMetro: 34, otherStates: 35 },
  { maxWeight: 1000, local: 31, withinState: 44, zoneMetro: 51, otherStates: 57 },
  { maxWeight: 1500, local: 36, withinState: 58, zoneMetro: 70, otherStates: 80 },
  { maxWeight: 2000, local: 45, withinState: 80, zoneMetro: 100, otherStates: 115 },
  { maxWeight: 3000, local: 57, withinState: 100, zoneMetro: 125, otherStates: 145 },
  { maxWeight: 4000, local: 69, withinState: 120, zoneMetro: 150, otherStates: 175 },
  { maxWeight: 5000, local: 81, withinState: 140, zoneMetro: 175, otherStates: 205 },
];
export const indiaPostParcelContractualAdd = { local: 15, withinState: 20, zoneMetro: 25, otherStates: 30 };

export interface TariffParams {
  category: ServiceCategory;
  customerType: CustomerType;
  weight: number;
  zone: string;
  hasRegistration: boolean;
  hasOtp: boolean;
  hasProofOfDelivery: boolean;
  codValue: number | null;
  insuranceValue: number | null;
  studentDiscount: boolean;
  contractualDiscountPercent: number;
}

export interface CalculationResult {
  baseTariff: number;
  vas: {
    registration: number;
    otp: number;
    proofOfDelivery: number;
    cod: number;
    insurance: number;
    total: number;
  };
  discountAmount: number;
  subtotal: number; // baseTariff + vas.total - discountAmount
  gst: number; // 18% of subtotal
  totalPayable: number;
}

export function calculateTariff(params: TariffParams): CalculationResult {
  let baseTariff = 0;
  const w = params.weight || 0;
  
  if (params.category === 'SPEED_POST_DOC') {
    const tier = speedPostDocRates.find(t => w <= t.maxWeight) || speedPostDocRates[speedPostDocRates.length - 1];
    baseTariff = (tier as any)[params.zone] || 0;
  } else {
    // Parcels
    let rates = [];
    let addRates = { local: 0, withinState: 0, zoneMetro: 0, otherStates: 0 };
    
    if (params.category === 'SPEED_POST_PARCEL') {
      if (params.customerType === 'RETAIL') {
        rates = speedPostParcelRetailRates;
        addRates = speedPostParcelRetailAdd;
      } else {
        rates = speedPostParcelContractualRates;
        addRates = speedPostParcelContractualAdd;
      }
    } else {
      if (params.customerType === 'RETAIL') {
        rates = indiaPostParcelRetailRates;
        addRates = indiaPostParcelRetailAdd;
      } else {
        rates = indiaPostParcelContractualRates;
        addRates = indiaPostParcelContractualAdd;
      }
    }

    if (w <= 5000) {
      const tier = rates.find(t => w <= t.maxWeight) || rates[rates.length - 1];
      baseTariff = (tier as any)[params.zone] || 0;
    } else {
      const tier = rates[rates.length - 1];
      const base = (tier as any)[params.zone] || 0;
      const extraWeight = w - 5000;
      const extraUnits = Math.ceil(extraWeight / 1000);
      const additionalRate = (addRates as any)[params.zone] || 0;
      baseTariff = base + (extraUnits * additionalRate);
    }
  }

  const vas = {
    registration: 0,
    otp: 0,
    proofOfDelivery: 0,
    cod: 0,
    insurance: 0,
    total: 0
  };

  // Value added services
  if (params.hasRegistration && (params.category === 'SPEED_POST_DOC' || params.category === 'SPEED_POST_PARCEL')) {
    vas.registration = 5;
  }
  
  if (params.hasOtp && (params.category === 'SPEED_POST_DOC' || params.category === 'SPEED_POST_PARCEL')) {
    vas.otp = params.customerType === 'RETAIL' ? 5 : 1.5;
  }
  
  if (params.hasProofOfDelivery && params.category === 'SPEED_POST_DOC') {
    vas.proofOfDelivery = 10;
  }
  
  if (params.codValue !== null && params.customerType === 'CONTRACTUAL') {
    if (params.codValue <= 6500) {
      vas.cod = params.codValue * 0.016;
    } else {
      vas.cod = 100 + ((params.codValue - 6500) * 0.01);
    }
  }
  
  if (params.insuranceValue !== null && params.customerType === 'CONTRACTUAL' && params.category !== 'SPEED_POST_DOC') {
    if (params.insuranceValue <= 200) {
      vas.insurance = 4;
    } else {
      vas.insurance = 4 + ((params.insuranceValue - 200) * 0.015);
    }
  }
  
  vas.total = vas.registration + vas.otp + vas.proofOfDelivery + vas.cod + vas.insurance;

  let discountAmount = 0;
  
  if (params.studentDiscount && params.customerType === 'RETAIL' && (params.category === 'SPEED_POST_DOC' || params.category === 'SPEED_POST_PARCEL')) {
    discountAmount = baseTariff * 0.10;
  } else if (params.customerType === 'CONTRACTUAL' && params.contractualDiscountPercent > 0) {
    discountAmount = baseTariff * (params.contractualDiscountPercent / 100);
  }

  const subtotal = Math.max(0, baseTariff + vas.total - discountAmount);
  const gst = subtotal * 0.18;
  const totalPayable = subtotal + gst;

  return {
    baseTariff,
    vas,
    discountAmount,
    subtotal,
    gst,
    totalPayable
  };
}
