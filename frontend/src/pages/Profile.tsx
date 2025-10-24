import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Save, Stethoscope } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { User as UserType } from '@/types';
import { validateEmail, validateName, validatePhone } from '@/utils/validator';
import { getRoleColor, getInitials } from '@/utils/ui';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<UserType>>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      specialization: user?.specialization || '',
    },
  });

  const onSubmit = async (data: Partial<UserType>) => {
    try {
      setIsLoading(true);
      setError('');
      
      const updatedUser = await userService.updateProfile(data);
      updateUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      reset(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>
                Your current profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <div className="h-24 w-24 mx-auto rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(user.name)}
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {user.email}
              </p>
              <div className="flex justify-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              {user.specialization && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Specialization:</strong> {user.specialization}
                  </p>
                </div>
              )}
              {user.phone && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Phone:</strong> {user.phone}
                  </p>
                </div>
              )}
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your profile information below
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  icon={<User />}
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Name is required',
                    validate: (value) => {
                      const result = validateName(value || '');
                      return result.isValid || result.message;
                    },
                  })}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={<Mail />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    validate: (value) => validateEmail(value || '') || 'Invalid email format',
                  })}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  icon={<Phone />}
                  error={errors.phone?.message}
                  {...register('phone', {
                    validate: (value) => {
                      if (!value) return true; // Optional field
                      const result = validatePhone(value);
                      return result.isValid || result.message;
                    },
                  })}
                />

                {user.role === 'doctor' && (
                  <Input
                    label="Specialization"
                    type="text"
                    placeholder="e.g., Cardiology, Pediatrics"
                    icon={<Stethoscope />}
                    error={errors.specialization?.message}
                    {...register('specialization')}
                  />
                )}

                {/* Role Badge (Read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Role cannot be changed. Contact an administrator if you need to change your role.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Important details about your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-gray-900 dark:text-white">Account Created:</strong>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">Last Updated:</strong>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">Account ID:</strong>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                    {user._id}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">Role:</strong>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;