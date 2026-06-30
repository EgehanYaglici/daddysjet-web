export type FlightWithOperator = {
  id: string;
  externalId: string | null;
  fromCity: string;
  fromCode: string;
  fromAirport: string;
  toCity: string;
  toCode: string;
  toAirport: string;
  departureAt: string; // ISO string when serialized
  durationHrs: number;
  aircraft: string;
  category: string;
  capacity: number;
  baggage: string;
  priceUSD: number;
  listUSD: number;
  petFriendly: boolean | null;
  isHotDeal: boolean;
  tags: string[];
  scene: string;
  photoKeys: string[];
  status: string;
  operator: {
    code: string;
    rating: number;
    reviewCount: number;
    trusted: boolean;
    flightCount: number;
  };
};

export type BookingInput = {
  flightId: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  passengerDob?: string;
  passengerGender?: string;
  paymentMethod: "CREDIT_CARD" | "TL_TRANSFER" | "USD_SWIFT";
  userId?: string;
};
