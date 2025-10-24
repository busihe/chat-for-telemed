import mongoose, { Document, Schema } from 'mongoose';

export interface ICall extends Document {
  conversationId: mongoose.Types.ObjectId;
  callerId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  callType: 'video' | 'audio';
  status: 'initiated' | 'answered' | 'ended' | 'missed' | 'rejected';
  startedAt?: Date;
  endedAt?: Date;
  duration?: number; // in seconds
}

const callSchema = new Schema<ICall>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    callerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    callType: { type: String, enum: ['video', 'audio'], required: true },
    status: { 
      type: String, 
      enum: ['initiated', 'answered', 'ended', 'missed', 'rejected'], 
      default: 'initiated' 
    },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<ICall>('Call', callSchema);
