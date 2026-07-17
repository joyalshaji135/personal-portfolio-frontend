import { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Mail, 
  User, 
  Code2,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Calendar,
  ArrowUp,
  ArrowDown,
  MoreVertical
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    projects: 12,
    messages: 34,
    views: 1250,
    visitors: 890,
    monthlyGrowth: 15,
    messagesGrowth: 8,
  });

  // Simulated recent activities
  const recentActivities = [
    { id: 1, action: 'New project added', project: 'E-Commerce Platform', time: '2 hours ago', type: 'project' },
    { id: 2, action: 'Message received', from: 'John Doe', time: '3 hours ago', type: 'message' },
    { id: 3, action: 'Portfolio viewed', from: 'New Visitor', time: '5 hours ago', type: 'view' },
    { id: 4, action: 'Project updated', project: 'Portfolio Website', time: '1 day ago', type: 'project' },
  ];

  const statCards = [
    { 
      icon: FolderGit2, 
      label: 'Total Projects', 
      value: stats.projects, 
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      growth: '+2 this month',
      trend: 'up'
    },
    { 
      icon: Mail, 
      label: 'Messages', 
      value: stats.messages, 
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      growth: '+5 new',
      trend: 'up'
    },
    { 
      icon: Eye, 
      label: 'Total Views', 
      value: stats.views.toLocaleString(), 
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      growth: `+${stats.monthlyGrowth}%`,
      trend: 'up'
    },
    { 
      icon: Users, 
      label: 'Visitors', 
      value: stats.visitors.toLocaleString(), 
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      growth: '-3% this week',
      trend: 'down'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Welcome back! Here's what's happening with your portfolio.
          </p>
        </div>
        <button className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2
          ${isDark 
            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
        >
          <Calendar size={16} />
          Last 30 days
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`rounded-xl p-4 md:p-6 border transition-colors
            ${isDark 
              ? 'bg-[#111111] border-gray-800 hover:border-gray-700' 
              : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <button className={`${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'}`}>
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="mt-4">
              <p className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {stat.trend === 'up' ? (
                  <ArrowUp size={14} className="text-green-400" />
                ) : (
                  <ArrowDown size={14} className="text-red-400" />
                )}
                <span className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.growth}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className={`lg:col-span-2 rounded-xl p-4 md:p-6 border
          ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h3>
            <button className="text-sm text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0
                ${isDark ? 'border-gray-800/50' : 'border-gray-200'}`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 
                  ${activity.type === 'project' ? 'bg-blue-400' : 
                    activity.type === 'message' ? 'bg-green-400' : 'bg-purple-400'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {activity.action}
                    </span>
                    {activity.project && <span> - {activity.project}</span>}
                    {activity.from && <span> from {activity.from}</span>}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {activity.time}
                  </p>
                </div>
                <button className={`${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'}`}>
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className={`rounded-xl p-4 md:p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className={`w-full px-4 py-3 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg 
                hover:bg-[#27CBCB]/20 transition-colors text-left text-sm font-medium`}>
                + Add New Project
              </button>
              <button className={`w-full px-4 py-3 rounded-lg transition-colors text-left text-sm
                ${isDark 
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✏️ Update About Section
              </button>
              <button className={`w-full px-4 py-3 rounded-lg transition-colors text-left text-sm
                ${isDark 
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📧 View Messages
              </button>
              <button className={`w-full px-4 py-3 rounded-lg transition-colors text-left text-sm
                ${isDark 
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔧 Update Stack
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`rounded-xl p-4 md:p-6 border
            ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Projects</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Unread Messages</span>
                <span className="text-[#27CBCB] font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Today's Visitors</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Portfolio Health</span>
                <span className="text-green-400 font-semibold">98%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;