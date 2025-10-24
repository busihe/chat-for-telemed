import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  text: string;
  read: boolean; // legacy/global read flag
  readBy: mongoose.Types.ObjectId[]; // per-user read receipts
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IMessage>('Message', messageSchema);
