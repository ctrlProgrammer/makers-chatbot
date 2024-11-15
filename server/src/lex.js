"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LexRoutes = exports.Router = void 0;
const client_lex_runtime_v2_1 = require("@aws-sdk/client-lex-runtime-v2");
const credential_providers_1 = require("@aws-sdk/credential-providers");
const sqlite3_1 = require("sqlite3");
const database_1 = require("./database");
const utils_1 = require("./utils");
const BOT_ID = "2098HGEBIJ";
const BOT_ALIAS = "TSTALIASID";
const BOT_LOCALE = "es_419";
class Router {
    constructor(app) {
        this.database = null;
        this.openedDatabase = false;
        this.app = app;
    }
    validate() {
        return this.app != null && this.database != null;
    }
}
exports.Router = Router;
class LexRoutes extends Router {
    constructor(app) {
        super(app);
        this.lexClient = new client_lex_runtime_v2_1.LexRuntimeV2Client({
            region: "us-east-1",
            credentials: (0, credential_providers_1.fromEnv)(),
        });
        this.createRoutes();
        this.initializeDatabase();
    }
    initializeDatabase() {
        this.database = new sqlite3_1.Database("./inventory.db", sqlite3_1.OPEN_READWRITE, (err) => {
            if (err && err.code == "SQLITE_CANTOPEN") {
                this.createDatabase();
                return;
            }
            else if (err) {
                console.log(err);
                this.openedDatabase = false;
                return;
            }
            this.openedDatabase = true;
        });
    }
    createDatabase() {
        this.database = new sqlite3_1.Database("./inventory.db", (err) => {
            if (err) {
                console.log(err);
                this.openedDatabase = false;
                return;
            }
            this.openedDatabase = true;
            this.createTables();
        });
    }
    createTables() {
        var _a;
        if (this.database) {
            (_a = this.database) === null || _a === void 0 ? void 0 : _a.exec(database_1.CREATE_INVENTORY_TABLE + ` ` + database_1.ADD_INVENTORY, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }
    }
    createRoutes() {
        this.app.get("/state", (req, res) => this.getState(req, res));
        this.app.post("/send", (req, res) => this.receiveMessage(req, res));
        this.app.get("/inventory", (req, res) => this.getInventory(req, res));
    }
    getState(_, res) {
        res.json({
            error: false,
            data: true,
        });
    }
    receiveMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Parse text and create session
            const userInput = req.body.message;
            const lexParams = {
                botId: BOT_ID,
                botAliasId: BOT_ALIAS,
                text: userInput,
                localeId: BOT_LOCALE,
                sessionId: "test_session_" + req.body.username,
            };
            try {
                const data = yield this.lexClient.send(new client_lex_runtime_v2_1.RecognizeTextCommand(lexParams));
                if (data && data.messages && Array.isArray(data.messages)) {
                    for (let i = 0; i < data.messages.length; i++) {
                        if (data.messages[i].content == "@@inventory@@") {
                            const inventory = yield this.getInventoryFromDatabase();
                            data.messages[i] = {
                                content: utils_1.Utils.ParseInventory(inventory),
                                extra: inventory,
                                special: true,
                                type: "inventory",
                            };
                        }
                        else if ((_a = data.messages[i].content) === null || _a === void 0 ? void 0 : _a.includes("@@device@@")) {
                            const searchedDevice = (_b = data.messages[i].content) === null || _b === void 0 ? void 0 : _b.replace("@@device@@ ", "");
                            if (searchedDevice) {
                                const deviceSearch = yield this.GetDeviceFromDatabase(searchedDevice);
                                if (deviceSearch && Array.isArray(deviceSearch) && deviceSearch[0]) {
                                    data.messages[i] = { content: utils_1.Utils.ParseDevice(deviceSearch[0]), extra: deviceSearch[0], special: true, type: "device" };
                                }
                                else {
                                    data.messages[i].content = "No pudimos encontrar el dispositivo. Intenta con otro.";
                                }
                            }
                            else {
                                data.messages[i].content = "No pudimos encontrar el dispositivo. Intenta con otro.";
                            }
                        }
                    }
                }
                res.json({ error: false, messages: data.messages });
            }
            catch (error) {
                console.log(error);
                res.json({ error: true });
            }
        });
    }
    getInventory(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.database) {
                this.getInventoryFromDatabase().then((value) => {
                    if (value == null) {
                        res.json({ error: true });
                        return;
                    }
                    res.json(value);
                });
            }
            else
                res.json({ error: true });
        });
    }
    // Database actions
    getInventoryFromDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => {
                var _a;
                (_a = this.database) === null || _a === void 0 ? void 0 : _a.all(database_1.GET_ALL_INVENTORY, [], (err, rows) => {
                    if (err)
                        res(null);
                    else
                        res(rows);
                });
            });
        });
    }
    GetDeviceFromDatabase(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => {
                var _a;
                (_a = this.database) === null || _a === void 0 ? void 0 : _a.all(database_1.GET_ONE_FROM_INVENTORY, [deviceId, deviceId, deviceId], (err, rows) => {
                    if (err)
                        res(null);
                    else
                        res(rows);
                });
            });
        });
    }
}
exports.LexRoutes = LexRoutes;
