export interface IOption {
  option_title: string;
  option_subtitle: string;
  icon: string;
  iconFile?: File | null;
  file?: File | null;
}

export interface IOurCategory {
  _id: string;
  category: string;
  heading_subtitle: string;
  heading_title: string;
  heading_description: string;
  options: IOption[];
  createdAt: string;
  updatedAt: string;
}
