import Express from "express";
import { LexRuntimeV2Client, RecognizeTextCommand, RecognizeTextCommandInput } from "@aws-sdk/client-lex-runtime-v2";
import { fromEnv } from "@aws-sdk/credential-providers";

const BOT_ID = "2098HGEBIJ";
const BOT_ALIAS = "3LVER1CIMH";
const BOT_LOCALE = "es_419";

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
    this.app.post("/send", (req, res) => this.receiveMessage(req, res));
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
