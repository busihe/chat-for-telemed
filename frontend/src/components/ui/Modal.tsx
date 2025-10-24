import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/ui';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Modal = ({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

        <div
          className={cn(
            'inline-block transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:p-6 sm:align-middle',
            sizes[size],
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;