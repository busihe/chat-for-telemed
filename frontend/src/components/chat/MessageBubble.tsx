import { Message } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { formatTime, getInitials } from '@/utils/ui';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useAuth();
  const isOwnMessage = message.senderId === user?._id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-medium">
            {getInitials(message.sender?.name || 'U')}
          </div>
        </div>

        {/* Message bubble */}
        <div className="flex flex-col max-w-xs lg:max-w-md">
          {/* Sender name (only for others' messages) */}
          {!isOwnMessage && message.sender && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-3">
              {message.sender.name}
            </p>
          )}
          
          {/* Message content */}
          <div
            className={`px-4 py-2 rounded-lg ${
              isOwnMessage
                ? 'bg-primary-600 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          </div>
          
          {/* Timestamp and read status */}
          <div className={`flex items-center mt-1 space-x-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.createdAt)}
            </p>
            {isOwnMessage && (
              <span className={`text-xs ${message.read ? 'text-blue-500' : 'text-gray-400'}`}>
                {message.read ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;