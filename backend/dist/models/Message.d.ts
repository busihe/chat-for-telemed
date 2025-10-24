import mongoose, { Document } from 'mongoose';
export interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId;
    conversationId: mongoose.Types.ObjectId;
    text: string;
    read: boolean;
    readBy: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Message.d.ts.map