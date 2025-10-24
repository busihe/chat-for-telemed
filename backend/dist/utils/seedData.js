"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const User_1 = __importDefault(require("../models/User"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const Message_1 = __importDefault(require("../models/Message"));
const db_1 = require("../config/db");
const seedData = async () => {
    try {
        await (0, db_1.connectDb)();
        await User_1.default.deleteMany({});
        await Conversation_1.default.deleteMany({});
        await Message_1.default.deleteMany({});
        const users = await User_1.default.create([
            {
                name: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@hospital.com',
                password: 'password123',
                role: 'doctor'
            },
            {
                name: 'Dr. Michael Chen',
                email: 'michael.chen@hospital.com',
                password: 'password123',
                role: 'doctor'
            },
            {
                name: 'John Doe',
                email: 'john.doe@patient.com',
                password: 'password123',
                role: 'patient'
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@patient.com',
                password: 'password123',
                role: 'patient'
            },
            {
                name: 'Admin User',
                email: 'admin@hospital.com',
                password: 'password123',
                role: 'admin'
            }
        ]);
        console.log('Created users:', users.length);
        const conversations = await Conversation_1.default.create([
            {
                participants: [users[0]._id, users[2]._id]
            },
            {
                participants: [users[1]._id, users[3]._id]
            },
            {
                participants: [users[0]._id, users[1]._id, users[4]._id]
            }
        ]);
        console.log('Created conversations:', conversations.length);
        const messages = await Message_1.default.create([
            {
                senderId: users[2]._id,
                conversationId: conversations[0]._id,
                text: 'Hello Dr. Johnson, I have been experiencing some chest pain recently.',
                read: true
            },
            {
                senderId: users[0]._id,
                conversationId: conversations[0]._id,
                text: 'Hello John, I understand your concern. Can you describe the pain in more detail?',
                read: true
            },
            {
                senderId: users[2]._id,
                conversationId: conversations[0]._id,
                text: 'It\'s a sharp pain that comes and goes, usually after eating.',
                read: false
            },
            {
                senderId: users[3]._id,
                conversationId: conversations[1]._id,
                text: 'Hi Dr. Chen, I need to schedule my follow-up appointment.',
                read: true
            },
            {
                senderId: users[1]._id,
                conversationId: conversations[1]._id,
                text: 'Hello Jane, I can help you with that. What day works best for you?',
                read: false
            }
        ]);
        console.log('Created messages:', messages.length);
        console.log('✅ Database seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=seedData.js.map