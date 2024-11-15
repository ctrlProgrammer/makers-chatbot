"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_ONE_FROM_INVENTORY = exports.GET_ALL_INVENTORY = exports.ADD_INVENTORY = exports.CREATE_INVENTORY_TABLE = void 0;
exports.CREATE_INVENTORY_TABLE = `create table inventory (
            inventory_id int primary key not null,
            item_brand text not null,
            item_name text not null,
            item_balance int not null,
            item_image text not null,
            item_price int not null
          );`;
exports.ADD_INVENTORY = `insert into inventory (inventory_id, item_brand, item_name, item_balance, item_image, item_price)
        values (1, 'DELL', 'OPTIPLEX 3000', 5, 'https://www.pcware.com.co/wp-content/uploads/2023/01/dell-3000_1.jpg', 2500000),
                (2, 'MAC', 'MacBook pro 14"', 3, 'https://www.apple.com/v/mac/home/cb/images/overview/select/product_tile_mbp_14_16__bkl8zusnkpw2_large.png', 8000000),
                (3, 'MAC', 'MacBook pro 13"', 5, 'https://www.apple.com/v/mac/home/cb/images/overview/select/product_tile_mba_13_15__fx2g3qlubdym_large.png', 6000000),
                (4, 'HP', 'Portatil HP 15-FC00', 5, 'https://d34vmoxq6ylzee.cloudfront.net/catalog/product/cache/314dec89b3219941707ad62ccc90e585/a/z/azure_a38p2la_2imagenprincipalsintexto.jpg', 1600000),
                (5, 'ACER', 'Predator Triton 500', 12, 'https://http2.mlstatic.com/D_Q_NP_982037-MLU78562525106_082024-AC.webp', 8000000);`;
exports.GET_ALL_INVENTORY = `SELECT * FROM inventory;`;
exports.GET_ONE_FROM_INVENTORY = `SELECT * FROM  inventory WHERE inventory_id = ? or item_name = ? or item_brand = ?;`;
