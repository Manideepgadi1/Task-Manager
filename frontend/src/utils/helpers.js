import { format, formatDistance, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const isOverdue = (dueDate, status) => {
  if (status === 'Completed') return false;
  return isPast(new Date(dueDate));
};

export const getDueDateLabel = (dueDate) => {
  const date = new Date(dueDate);
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  
  return formatDate(dueDate);
};

export const getPriorityColor = (priority) => {
  const colors = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high'
  };
  return colors[priority] || 'badge-low';
};

export const getStatusColor = (status) => {
  const colors = {
    Pending: 'badge-pending',
    'In Progress': 'badge-inprogress',
    Completed: 'badge-completed'
  };
  return colors[status] || 'badge-pending';
};
