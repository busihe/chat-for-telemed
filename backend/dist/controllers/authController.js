"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const register = async (req, res) => {
    try {
        const { name, email, password, role, specialization, phone } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const exists = await User_1.default.findOne({ email });
        if (exists) {
            res.status(409).json({ message: 'Email already in use' });
            return;
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            role,
            specialization,
            phone
        });
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            specialization: user.specialization,
            phone: user.phone
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'changeme-super-secret', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map