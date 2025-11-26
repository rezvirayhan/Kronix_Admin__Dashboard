export interface IOption {
  iconFile: any;
  icon: string;
  option_title: string;
  option_subtitle: string;
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
