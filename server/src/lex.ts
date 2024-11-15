import Express from "express";
import { LexRuntimeV2Client, RecognizeTextCommand, RecognizeTextCommandInput } from "@aws-sdk/client-lex-runtime-v2";
import { fromEnv } from "@aws-sdk/credential-providers";

const BOT_NAME = "StoreInventoryManager";

export class Router {
  protected app: Express.Application;

  constructor(app: Express.Application) {
    this.app = app;
  }

  public validate() {
    return this.app != null;
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
  }

  private createRoutes() {
    this.app.get("/state", (req, res) => this.getState(req, res));
    this.app.get("/test", (req, res) => this.receiveMessage(req, res));
  }

  private getState(_: Express.Request, res: Express.Response) {
    res.json({
      error: false,
      data: true,
    });
  }

  private async receiveMessage(req: Express.Request, res: Express.Response) {
    const lexParams: RecognizeTextCommandInput = {
      botId: "2098HGEBIJ",
      botAliasId: "3LVER1CIMH",
      text: "Hola",
      localeId: "es_419",
      sessionId: "test_session_1",
    };

    try {
      const data = await this.lexClient.send(new RecognizeTextCommand(lexParams));
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
}
