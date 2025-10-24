import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, MessageSquare, Stethoscope } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RegisterData } from '@/types';
import { validateEmail, validatePassword, validateName, validatePhone } from '@/utils/validator';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

const Register = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterData) => {
    try {
      setError('');
      await registerUser(data);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <MessageSquare className="h-12 w-12 text-primary-600 dark:text-primary-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join ChatSupport Dashboard today
          </p>
        </div>

        {/* Register Form */}
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Fill in your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                icon={<User />}
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  validate: (value) => {
                    const result = validateName(value);
                    return result.isValid || result.message;
                  },
                })}
              />

              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                icon={<Mail />}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  validate: (value) => validateEmail(value) || 'Invalid email format',
                })}
              />

              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                icon={<Lock />}
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  validate: (value) => {
                    const result = validatePassword(value);
                    return result.isValid || result.message;
                  },
                })}
              />

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'patient', label: 'Patient', desc: 'Seeking medical support' },
                    { value: 'doctor', label: 'Doctor', desc: 'Providing medical consultation' },
                    { value: 'admin', label: 'Administrator', desc: 'System administration' },
                  ].map((role) => (
                    <label key={role.value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600">
                      <input
                        type="radio"
                        value={role.value}
                        {...register('role', { required: 'Please select a role' })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {role.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {role.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
                )}
              </div>

              {/* Conditional fields based on role */}
              {selectedRole === 'doctor' && (
                <Input
                  label="Specialization"
                  type="text"
                  placeholder="e.g., Cardiology, Pediatrics"
                  icon={<Stethoscope />}
                  error={errors.specialization?.message}
                  {...register('specialization', {
                    required: selectedRole === 'doctor' ? 'Specialization is required for doctors' : false,
                  })}
                />
              )}

              <Input
                label="Phone Number (Optional)"
                type="tel"
                autoComplete="tel"
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

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Sign in to your account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;