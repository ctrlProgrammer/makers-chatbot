import Express from "express";
import Cors from "cors";
import { LexRoutes } from "./lex";
import Dotenv from "dotenv";

class APICore {
  private app: Express.Application = Express();
  private port: string = "3000";
  private routes: any[] = [];

  constructor() {
    Dotenv.config();
  }

  private intializeEnv() {
    this.port = process.env.PORT || this.port;
  }

  private initializeMiddlewares() {
    this.app.use(Cors());
    this.app.use(Express.json());
  }

  private initializeRoutes() {
    this.routes = [new LexRoutes(this.app)];
  }

  public initServer() {
    this.intializeEnv();
    this.initializeMiddlewares();
    this.initializeRoutes();

    this.app.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });
  }
}

new APICore().initServer();
