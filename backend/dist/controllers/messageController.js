"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markReadOne = exports.markRead = exports.sendMessage = exports.listMessages = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const sockets_1 = require("../sockets");
const mongoose_1 = __importDefault(require("mongoose"));
const listMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message_1.default.find({ conversationId }).sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        console.error('List messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listMessages = listMessages;
const sendMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!conversationId || !text) {
            res.status(400).json({ message: 'Missing fields' });
            return;
        }
        const conversation = await Conversation_1.default.findById(conversationId);
        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }
        if (!conversation.participants.map(String).includes(userId)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        const message = await Message_1.default.create({
            senderId: userId,
            conversationId,
            text
        });
        const io = (0, sockets_1.getIo)();
        io.to(conversationId).emit('receiveMessage', {
            conversationId,
            message
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.sendMessage = sendMessage;
const markRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await Message_1.default.updateMany({
            conversationId,
            read: false,
            senderId: { $ne: userId }
        }, { $set: { read: true } });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.markRead = markRead;
const markReadOne = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const conversationId = (req.params.conversationId || req.body.conversationId);
        const messageId = (req.params.messageId || req.body.messageId);
        if (!conversationId || !messageId) {
            res.status(400).json({ message: 'conversationId and messageId are required' });
            return;
        }
        const conversation = await Conversation_1.default.findById(conversationId);
        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }
        if (!conversation.participants.map(String).includes(userId)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        const updated = await Message_1.default.findOneAndUpdate({ _id: messageId, conversationId }, { $addToSet: { readBy: new mongoose_1.default.Types.ObjectId(userId) } }, { new: true });
        if (!updated) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }
        if (!updated.read && String(updated.senderId) !== userId) {
            updated.read = true;
            await updated.save();
        }
        console.log(`[messages] markReadOne user=${userId} conversation=${conversationId} message=${messageId}`);
        res.json(updated);
    }
    catch (error) {
        console.error('Mark single message read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.markReadOne = markReadOne;
//# sourceMappingURL=messageController.js.map