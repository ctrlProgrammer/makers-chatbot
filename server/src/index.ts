import Express from "express";

class APICore {
  private app: Express.Application = Express();
  private port: string = "3000";

  private intializeEnv() {
    this.port = process.env.PORT || this.port;
  }

  private initializeMiddlewares() {}

  private initializeRoutes() {}

  public initServer() {
    this.intializeEnv();
    this.initializeMiddlewares();
    this.initializeRoutes();

    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }
}
