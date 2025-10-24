import { useEffect, useState } from 'react';
import { Conversation } from '@/types';
import { getInitials, formatDate, truncateText } from '@/utils/ui';
import { chatService } from '@/services/chatService';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

const ConversationList = ({ 
  conversations, 
  activeConversation, 
  onSelectConversation,
  currentUserId 
}: ConversationListProps) => {
  const [localConversations, setLocalConversations] = useState<Conversation[]>(conversations || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations();
        if (mounted) setLocalConversations(data);
      } catch (err) {
        // silently fail; parent may provide conversations via props
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  // Keep in sync if parent passes in conversations later (fallback)
  useEffect(() => {
    if (Array.isArray(conversations) && conversations.length && !localConversations.length) {
      setLocalConversations(conversations);
    }
  }, [conversations, localConversations.length]);

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p._id !== currentUserId);
  };

  const getConversationName = (conversation: Conversation) => {
    const otherParticipant = getOtherParticipant(conversation);
    return otherParticipant?.name || 'Unknown User';
  };

  const items = localConversations.length ? localConversations : conversations;

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-1 p-2">
        {items.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          const isActive = activeConversation === conversation._id;
          
          return (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation._id)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                  {getInitials(getConversationName(conversation))}
                </div>
              </div>

              {/* Content */}
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {getConversationName(conversation)}
                  </p>
                  {conversation.lastMessage && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(conversation.lastMessage.createdAt)}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {conversation.lastMessage 
                      ? truncateText(conversation.lastMessage.text, 40)
                      : 'No messages yet'
                    }
                  </p>
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-medium rounded-full bg-red-500 text-white">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                
                {/* Role badge */}
                {otherParticipant && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    otherParticipant.role === 'admin' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : otherParticipant.role === 'doctor'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {otherParticipant.role}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(items.length === 0 && !loading) && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Start a new conversation to begin chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
