import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import ConversationList from '@/components/chat/ConversationList';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import Loader from '@/components/ui/Loader';

const Chat = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const {
    conversations = [], // ✅ Default empty array
    messages = [],       // ✅ Default empty array
    activeConversation,
    isLoading,
    typing = {},         // ✅ Default empty object
    fetchConversations,
    selectConversation,
    sendSocketMessage,
    emitTyping,
    isConnected,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (conversationId && conversationId !== activeConversation) {
      selectConversation(conversationId);
    }
  }, [conversationId, activeConversation, selectConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (text: string) => {
    if (activeConversation && user?._id) {
      sendSocketMessage(text);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (user?._id) emitTyping(isTyping);
  };

  const getActiveConversation = () =>
    conversations.find(conv => conv._id === activeConversation);

  const getOtherParticipant = () => {
    const conversation = getActiveConversation();
    return conversation?.participants.find(p => p._id !== user?._id);
  };

  const getTypingUsers = () => {
    const conversation = getActiveConversation();
    if (!conversation) return [];
    return Object.entries(typing)
      .filter(([userId, isTyping]) => isTyping && userId !== user?._id)
      .map(([userId]) => {
        const participant = conversation.participants.find(p => p._id === userId);
        return participant?.name || 'Someone';
      });
  };

  // Loader for user data
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" text="Loading user..." />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conversations
          </h2>
          <div className="flex items-center mt-2">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* ✅ Added safety check */}
          <ConversationList
            conversations={Array.isArray(conversations) ? conversations : []}
            activeConversation={activeConversation}
            onSelectConversation={selectConversation}
            currentUserId={user._id}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                  {getOtherParticipant()?.name?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {getOtherParticipant()?.name || 'Unknown User'}
                  </h3>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getOtherParticipant()?.role === 'admin'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : getOtherParticipant()?.role === 'doctor'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}
                    >
                      {getOtherParticipant()?.role || 'user'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Typing indicator */}
              {getTypingUsers().length > 0 && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {getTypingUsers().join(', ')}{' '}
                  {getTypingUsers().length === 1 ? 'is' : 'are'} typing...
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader size="md" text="Loading messages..." />
                </div>
              ) : messages.length > 0 ? (
                <>
                  {messages.map(message => (
                    <MessageBubble key={message._id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No messages yet
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Start the conversation by sending a message
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              disabled={!isConnected}
              placeholder={!isConnected ? 'Disconnected...' : 'Type a message...'}
            />
          </>
        ) : (
          // No conversation selected
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 16c0 7-3 13-3 13s-3-6-3-13a3 3 0 016 0zM35 10c0 7-3 13-3 13s-3-6-3-13a3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Select a conversation
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose a conversation from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
