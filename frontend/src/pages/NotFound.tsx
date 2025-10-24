import { Link } from 'react-router-dom';
import { Home, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <MessageSquare className="mx-auto h-16 w-16 text-primary-600 dark:text-primary-500" />
          
          <div className="mt-8">
            <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-500">
              404
            </h1>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Page not found
          </h2>
          
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link to="/dashboard" className="block">
            <Button className="w-full" size="lg">
              <Home className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <Link to="/chat" className="block">
            <Button variant="outline" className="w-full" size="lg">
              <MessageSquare className="h-5 w-5 mr-2" />
              Go to Chat
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact our{' '}
            <Link
              to="/chat"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;