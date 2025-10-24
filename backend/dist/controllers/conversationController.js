"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = exports.listConversations = void 0;
const Conversation_1 = __importDefault(require("../models/Conversation"));
const Message_1 = __importDefault(require("../models/Message"));
const mongoose_1 = __importDefault(require("mongoose"));
const listConversations = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const conversations = await Conversation_1.default.find({ participants: userId })
            .populate('participants', 'name role')
            .lean();
        const convIds = conversations.map((c) => c._id);
        if (convIds.length === 0) {
            const empty = [];
            console.log(`[conversations] user=${userId} fetched=0`);
            res.json({ conversations: empty });
            return;
        }
        const lastMessages = await Message_1.default.aggregate([
            { $match: { conversationId: { $in: convIds } } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: '$conversationId', doc: { $first: '$$ROOT' } } },
        ]);
        const lastMap = new Map(lastMessages.map((m) => [String(m._id), m.doc]));
        const unreadCounts = await Message_1.default.aggregate([
            { $match: { conversationId: { $in: convIds }, read: false, senderId: { $ne: new mongoose_1.default.Types.ObjectId(userId) } } },
            { $group: { _id: '$conversationId', count: { $sum: 1 } } },
        ]);
        const unreadMap = new Map(unreadCounts.map((u) => [String(u._id), u.count]));
        const sanitized = conversations.map((conv) => {
            const participants = Array.isArray(conv.participants) ? conv.participants : [];
            const last = lastMap.get(String(conv._id));
            return {
                _id: String(conv._id),
                participants: participants.map((p) => ({
                    _id: String(p._id),
                    name: p.name,
                    role: p.role,
                })),
                lastMessage: last
                    ? {
                        _id: String(last._id),
                        conversationId: String(last.conversationId),
                        senderId: String(last.senderId),
                        text: last.text,
                        read: !!last.read,
                        createdAt: last.createdAt,
                    }
                    : null,
                unreadCount: unreadMap.get(String(conv._id)) || 0,
            };
        });
        console.log(`[conversations] user=${userId} fetched=${sanitized.length}`);
        console.log(`[conversations] data=${JSON.stringify(sanitized, null, 2)}`);
        res.json({ conversations: sanitized });
    }
    catch (error) {
        console.error('List conversations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listConversations = listConversations;
const createConversation = async (req, res) => {
    try {
        const { participantIds } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const unique = Array.from(new Set([...(participantIds || []), userId]));
        if (unique.length < 2) {
            res.status(400).json({ message: 'Need at least two participants' });
            return;
        }
        const existing = await Conversation_1.default.findOne({
            participants: { $all: unique, $size: unique.length }
        });
        if (existing) {
            res.status(200).json(existing);
            return;
        }
        const conversation = await Conversation_1.default.create({ participants: unique });
        res.status(201).json(conversation);
    }
    catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createConversation = createConversation;
//# sourceMappingURL=conversationController.js.map