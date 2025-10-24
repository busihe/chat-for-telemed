"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const sockets_1 = require("./sockets");
const db_1 = require("./config/db");
const PORT = process.env.PORT || 4000;
const start = async () => {
    try {
        await (0, db_1.connectDb)();
        const server = http_1.default.createServer(app_1.default);
        const io = (0, sockets_1.initSocket)(server);
        (0, sockets_1.setIo)(io);
        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Fatal start error:', error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map