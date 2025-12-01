export interface IOption {
  icon: string;
  option_title: string;
  option_subtitle: string;
}

export interface ICategory {
  id: number;
  name: string;
  heading_subtitle: string;
  heading_title: string;
  heading_description: string;
  options: IOption[];
}
