export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = diff / (1000 * 60 * 60);
  const days = diff / (1000 * 60 * 60 * 24);

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return minutes < 1 ? 'Just now' : `${minutes}m ago`;
  }
  
  if (hours < 24) {
    return `${Math.floor(hours)}h ago`;
  }
  
  if (days < 7) {
    return `${Math.floor(days)}d ago`;
  }
  
  return d.toLocaleDateString();
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const getRoleColor = (role: 'admin' | 'doctor' | 'patient'): string => {
  const colors = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    doctor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    patient: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  };
  return colors[role];
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};