/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IColumn {
  key: string;
  label: string;
  render?: (value: any, row?: any) => React.ReactNode;
  thClass?: string;
  tdClass?: string;
  headerComponent?: React.ReactNode;
}
