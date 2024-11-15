import Express from "express";
import { LexRuntimeV2Client, RecognizeTextCommand, RecognizeTextCommandInput } from "@aws-sdk/client-lex-runtime-v2";
import { fromEnv } from "@aws-sdk/credential-providers";
import { Database, OPEN_READWRITE } from "sqlite3";
import { ADD_INVENTORY, CREATE_INVENTORY_TABLE, GET_ALL_INVENTORY } from "./database";

const BOT_ID = "2098HGEBIJ";
const BOT_ALIAS = "TSTALIASID";
const BOT_LOCALE = "es_419";

export class Router {
  protected app: Express.Application;
  protected database: Database | null = null;
  protected openedDatabase: boolean = false;

  constructor(app: Express.Application) {
    this.app = app;
  }

  public validate() {
    return this.app != null && this.database != null;
  }
}

export class LexRoutes extends Router {
  private lexClient: LexRuntimeV2Client;

  constructor(app: Express.Application) {
    super(app);

    this.lexClient = new LexRuntimeV2Client({
      region: "us-east-1",
      credentials: fromEnv(),
    });

    this.createRoutes();
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.database = new Database("./inventory.db", OPEN_READWRITE, (err: any) => {
      if (err && err.code == "SQLITE_CANTOPEN") {
        this.createDatabase();
        return;
      } else if (err) {
        console.log(err);
        this.openedDatabase = false;
        return;
      }

      this.openedDatabase = true;
    });
  }

  private createDatabase() {
    this.database = new Database("./inventory.db", (err: any) => {
      if (err) {
        console.log(err);
        this.openedDatabase = false;
        return;
      }

      this.openedDatabase = true;
      this.createTables();
    });
  }

  private createTables() {
    if (this.database) {
      this.database?.exec(CREATE_INVENTORY_TABLE + ` ` + ADD_INVENTORY, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    }
  }

  private createRoutes() {
    this.app.get("/state", (req, res) => this.getState(req, res));
    this.app.post("/send", (req, res) => this.receiveMessage(req, res));
    this.app.get("/inventory", (req, res) => this.getInventory(req, res));
  }

  private getState(_: Express.Request, res: Express.Response) {
    res.json({
      error: false,
      data: true,
    });
  }

  private async receiveMessage(req: Express.Request, res: Express.Response) {
    // Parse text and create session
    const userInput = req.body.message;

    const lexParams: RecognizeTextCommandInput = {
      botId: BOT_ID,
      botAliasId: BOT_ALIAS,
      text: userInput,
      localeId: BOT_LOCALE,
      sessionId: "test_session_" + req.body.username,
    };

    try {
      const data = await this.lexClient.send(new RecognizeTextCommand(lexParams));

      if (data && data.messages && Array.isArray(data.messages)) {
        for (let i = 0; i < data.messages.length; i++) {
          if (data.messages[i].content == "@@inventory@@") {
            const inventory = await this.getInventoryFromDatabase();
            data.messages[i].content = this.parseInventory(inventory as any[]);
          }
        }
      }

      console.log(data);
      res.json({ error: false, messages: data.messages });
    } catch (error) {
      console.log(error);
      res.json({ error: true });
    }
  }

  private async getInventory(_: Express.Request, res: Express.Response) {
    if (this.database) {
      this.getInventoryFromDatabase().then((value) => {
        if (value == null) {
          res.json({ error: true });
          return;
        }

        res.json(value);
      });
    } else res.json({ error: true });
  }

  // Database actions

  private async getInventoryFromDatabase() {
    return new Promise((res) => {
      this.database?.all(GET_ALL_INVENTORY, [], (err, rows) => {
        if (err) res(null);
        else res(rows);
      });
    });
  }

  // Parse actions

  private parseInventory(inventory: any[]) {
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
