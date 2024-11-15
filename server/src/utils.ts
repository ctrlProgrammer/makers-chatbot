export class Utils {
  static ParseInventory(inventory: any[]): string {
    let text = "";

    for (let i = 0; i < inventory.length; i++) {
      text += "---------------------------------------\n";
      text += "Nombre: " + inventory[i].item_name + "\n";
      text += "Marca: " + inventory[i].item_brand + "\n";
      text += "Inventario: " + inventory[i].item_balance + "\n";
      text += "Precio: " + inventory[i].item_price + "\n";
      text += "---------------------------------------\n";
    }

    return text;
  }
}
