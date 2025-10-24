"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDb = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/message_backend';
    mongoose_1.default.set('strictQuery', true);
    await mongoose_1.default.connect(uri);
    console.log('MongoDB connected');
};
exports.connectDb = connectDb;
//# sourceMappingURL=db.js.map