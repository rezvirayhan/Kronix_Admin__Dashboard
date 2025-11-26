export interface Step {
  id: number;
  title: string;
  description: string;
  image: string;
  file?: File;
}

export interface IHero {
  _id?: string;
  mainTitle: string;
  description: string;
  steps: Step[];
}
