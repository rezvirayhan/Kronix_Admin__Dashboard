export interface IPortfolio {
  id?: string;
  _id?: string;
  imageUrl: string;
  publicId: string;
  alt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPortfolioForm {
  image: File | null;
  alt: string;
}

export interface IPortfolioResponse {
  success?: boolean;
  data?: IPortfolio | IPortfolio[];
  message?: string;
  errors?: { msg: string; param: string; location: string }[];
}
