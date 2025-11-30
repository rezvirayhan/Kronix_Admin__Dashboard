export interface IPricing {
  _id: string;
  pricing: string;
  pricingPackage: string;
  description: string;
  priceTitle: string;
  price: string;
  options: string[];
  createdAt?: string;
}
