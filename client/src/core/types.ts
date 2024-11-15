export interface InventoryItem {
  item_name: string;
  item_price: number;
  item_brand: string;
  item_balance: number;
  item_image: string;
  inventory_id: string;
}

export type Inventory = InventoryItem[];
