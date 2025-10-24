import mongoose, { Document } from 'mongoose';
export interface ICall extends Document {
    conversationId: mongoose.Types.ObjectId;
    callerId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    callType: 'video' | 'audio';
    status: 'initiated' | 'answered' | 'ended' | 'missed' | 'rejected';
    startedAt?: Date;
    endedAt?: Date;
    duration?: number;
}
declare const _default: mongoose.Model<ICall, {}, {}, {}, mongoose.Document<unknown, {}, ICall, {}, {}> & ICall & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Call.d.ts.map