import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IConversation>('Conversation', conversationSchema);
