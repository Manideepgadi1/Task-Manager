import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, User, Calendar } from 'lucide-react';
import { formatDate, isOverdue, getPriorityColor, getStatusColor } from '../utils/helpers';

const TaskCard = ({ task, onClick, showAssignee = false }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className="card cursor-pointer border-l-4 hover:border-l-black transition-all"
      style={{
        borderLeftColor: task.priority === 'High' ? '#ef4444' : 
                         task.priority === 'Medium' ? '#f59e0b' : '#10b981'
      }}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 text-lg flex-1 pr-4">
            {task.title}
          </h3>
          <span className={`badge ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {task.description}
        </p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className={overdue ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.dueDate)}
            </span>
            {overdue && (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
          </div>

          {showAssignee && task.assignedTo && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <User className="w-4 h-4" />
              <span>{task.assignedTo.name}</span>
            </div>
          )}

          <span className={`badge ${getStatusColor(task.status)} ml-auto`}>
            {task.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
