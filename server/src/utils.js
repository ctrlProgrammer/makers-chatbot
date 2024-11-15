"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
    static ParseInventory(inventory) {
        let text = "";
        for (let i = 0; i < inventory.length; i++) {
            text += "---------------------------------------\n";
            text += "Identificador: " + inventory[i].inventory_id + "\n";
            text += "Nombre: " + inventory[i].item_name + "\n";
            text += "Marca: " + inventory[i].item_brand + "\n";
            text += "Inventario: " + inventory[i].item_balance + "\n";
            text += "---------------------------------------\n";
        }
        return text;
    }
    static ParseDevice(device) {
        let text = "";
        text += "---------------------------------------\n";
        text += "Identificador: " + device.inventory_id + "\n";
        text += "Nombre: " + device.item_name + "\n";
        text += "Marca: " + device.item_brand + "\n";
        text += "Inventario: " + device.item_balance + "\n";
        text += "Precio: " + device.item_price + "\n";
        text += "---------------------------------------\n";
        return text;
    }
}
exports.Utils = Utils;
