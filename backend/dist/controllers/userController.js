"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const listUsers = async (_req, res) => {
    try {
        const users = await User_1.default.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        console.error('List users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listUsers = listUsers;
//# sourceMappingURL=userController.js.map