import mongoose, { Document } from 'mongoose';
export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, {}> & IConversation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Conversation.d.ts.map