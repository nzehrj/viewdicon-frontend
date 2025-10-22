import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { BarChart3, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const ProjectTracker: React.FC = () => {
  const projects = [
    {
      id: 1,
      name: 'Residential Complex - Victoria Island',
      progress: 75,
      status: 'on-track',
      deadline: '2025-12-15',
      budget: '₦45M',
      spent: '₦33.75M'
    },
    {
      id: 2,
      name: 'Commercial Plaza - Lekki',
      progress: 45,
      status: 'delayed',
      deadline: '2026-02-28',
      budget: '₦120M',
      spent: '₦54M'
    },
    {
      id: 3,
      name: 'Bridge Construction - Ikoyi',
      progress: 90,
      status: 'on-track',
      deadline: '2025-11-30',
      budget: '₦200M',
      spent: '₦180M'
    },
  ];

  return (
    <WidgetContainer
      title="Project Tracker"
      icon={BarChart3}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          New Project
        </button>
      }
    >
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {project.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Due: {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              {project.status === 'on-track' ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  On Track
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-medium">
                  <AlertCircle className="w-3 h-3" />
                  Delayed
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`rounded-full h-2 transition-all ${
                    project.status === 'on-track' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Budget: {project.budget}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Spent: {project.spent}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
};

export default ProjectTracker;