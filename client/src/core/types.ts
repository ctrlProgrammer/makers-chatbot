export interface InventoryItem {
  item_name: string;
  item_price: number;
  item_brand: string;
  item_balance: number;
  item_image: string;
  inventory_id: string;
}

export type Inventory = InventoryItem[];

export interface Message {
  from: string;
  content: string;
  type?: string;
  extra?: any;
  special?: boolean;
}
