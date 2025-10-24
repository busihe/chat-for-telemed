import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useFetch } from '@/hooks/useFetch';
import { userService } from '@/services/userService';
import { User } from '@/types';
import { formatDate, getRoleColor, getInitials } from '@/utils/ui';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { conversations, fetchConversations } = useChat();
  const navigate = useNavigate();

  // Fetch users for admins
  const { 
    data: users, 
    isLoading: usersLoading
  } = useFetch<User[]>(
    () => userService.getAllUsers(),
    [],
    { immediate: isAdmin }
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const safeConversations = conversations ?? [];
  const safeUsers = users ?? [];

  const stats = {
    totalConversations: safeConversations.length,
    unreadMessages: safeConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0),
    totalUsers: safeUsers.length,
    onlineUsers: 0, // Placeholder for real-time online user count
  };

  const recentConversations = safeConversations
    .filter(conv => conv.lastMessage)
    .sort(
      (a, b) =>
        new Date(b.lastMessage!.createdAt).getTime() -
        new Date(a.lastMessage!.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Here's what's happening with your conversations today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-5">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalConversations}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Conversations
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-5">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.unreadMessages}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Unread Messages
              </p>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-5">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.totalUsers}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Users
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-5">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.onlineUsers}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Online Now
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>Your latest chat activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentConversations.length > 0 ? (
              <div className="space-y-4">
                {recentConversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(
                    (p) => p._id !== user?._id
                  );
                  return (
                    <div
                      key={conversation._id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => navigate(`/chat/${conversation._id}`)}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                        {getInitials(otherParticipant?.name || 'U')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {otherParticipant?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {conversation.lastMessage?.text || 'No message'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {conversation.lastMessage?.createdAt
                          ? formatDate(conversation.lastMessage.createdAt)
                          : ''}
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4">
                  <Button
                    onClick={() => navigate('/chat')}
                    variant="outline"
                    className="w-full"
                  >
                    View All Conversations
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No conversations
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Start a new conversation to begin chatting.
                </p>
                <div className="mt-6">
                  <Button onClick={() => navigate('/chat')}>Start Chatting</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users List (Admin only) */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Recently registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <Loader size="sm" />
              ) : safeUsers.length > 0 ? (
                <div className="space-y-4">
                  {safeUsers.slice(0, 5).map((userItem) => (
                    <div key={userItem._id} className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                        {getInitials(userItem.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {userItem.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {userItem.email}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            userItem.role
                          )}`}
                        >
                          {userItem.role}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button
                      onClick={() => navigate('/users')}
                      variant="outline"
                      className="w-full"
                    >
                      View All Users
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No users
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    No users have registered yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
