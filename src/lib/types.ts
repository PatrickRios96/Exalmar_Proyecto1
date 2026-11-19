export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  details: string;
  version: number;
  updated_at?: string;
}
export interface ReportRecord {
  id: string;
  user_id?: string;
  name?: string;
  email?: string;
  type: string;
  product: string;
  lot: string;
  presentation: string;
  purchase_date: string;
  description: string;
  status: string;
  response: string;
  created_at: string;
  updated_at: string;
  version: number;
}
export interface Me {
  admin: boolean;
  name: string;
  email: string;
}
