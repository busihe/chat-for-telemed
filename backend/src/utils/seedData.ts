import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { connectDb } from '../config/db';

const seedData = async (): Promise<void> => {
  try {
    await connectDb();
    
    // Clear existing data
    await User.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    
    // Create users
    const users = await User.create([
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
    
    // Create conversations
    const conversations = await Conversation.create([
      {
        participants: [users[0]!._id, users[2]!._id] // Dr. Sarah & John Doe
      },
      {
        participants: [users[1]!._id, users[3]!._id] // Dr. Michael & Jane Smith
      },
      {
        participants: [users[0]!._id, users[1]!._id, users[4]!._id] // All doctors + admin
      }
    ]);
    
    console.log('Created conversations:', conversations.length);
    
    // Create sample messages
    const messages = await Message.create([
      {
        senderId: users[2]!._id,
        conversationId: conversations[0]!._id,
        text: 'Hello Dr. Johnson, I have been experiencing some chest pain recently.',
        read: true
      },
      {
        senderId: users[0]!._id,
        conversationId: conversations[0]!._id,
        text: 'Hello John, I understand your concern. Can you describe the pain in more detail?',
        read: true
      },
      {
        senderId: users[2]!._id,
        conversationId: conversations[0]!._id,
        text: 'It\'s a sharp pain that comes and goes, usually after eating.',
        read: false
      },
      {
        senderId: users[3]!._id,
        conversationId: conversations[1]!._id,
        text: 'Hi Dr. Chen, I need to schedule my follow-up appointment.',
        read: true
      },
      {
        senderId: users[1]!._id,
        conversationId: conversations[1]!._id,
        text: 'Hello Jane, I can help you with that. What day works best for you?',
        read: false
      }
    ]);
    
    console.log('Created messages:', messages.length);
    console.log('✅ Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
