"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const lex_1 = require("./lex");
const dotenv_1 = __importDefault(require("dotenv"));
class APICore {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = "3000";
        this.routes = [];
        dotenv_1.default.config();
    }
    intializeEnv() {
        this.port = process.env.PORT || this.port;
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    initializeRoutes() {
        this.routes = [new lex_1.LexRoutes(this.app)];
    }
    initServer() {
        this.intializeEnv();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.app.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`);
        });
    }
}
new APICore().initServer();
