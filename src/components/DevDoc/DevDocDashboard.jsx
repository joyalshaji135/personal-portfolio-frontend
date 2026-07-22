import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Layers, 
  FolderGit2, 
  Mail,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  Code,
  Server,
  Database,
  Shield
} from 'lucide-react';

const DevDocDashboard = ({ user }) => {
  const stats = [
    { label: 'About Sections', value: '1', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Experiences', value: '4', icon: Briefcase, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Stack Items', value: '12', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Projects', value: '2', icon: FolderGit2, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  const techCategories = [
    { name: 'Frontend', icon: Code, count: 4, color: 'text-blue-400' },
    { name: 'Backend', icon: Server, count: 3, color: 'text-green-400' },
    { name: 'Database', icon: Database, count: 2, color: 'text-purple-400' },
    { name: 'DevOps', icon: Shield, count: 3, color: 'text-orange-400' },
  ];

  const quickActions = [
    { label: 'View About', page: 'about', icon: User },
    { label: 'View Experience', page: 'experience', icon: Briefcase },
    { label: 'View Stack', page: 'stack', icon: Layers },
    { label: 'View Projects', page: 'project', icon: FolderGit2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name || 'Developer'}! 👋
            </h1>
            <p className="text-gray-400 mt-2">
              Here's what you'll find in the developer documentation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#27CBCB]/10 border border-[#27CBCB]/20 rounded-lg">
              <span className="text-[#27CBCB] font-medium">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111111] border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tech Categories */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Technology Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techCategories.map((category) => (
            <div key={category.name} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <div>
                  <p className="text-white font-medium text-sm">{category.name}</p>
                  <p className="text-gray-400 text-xs">{category.count} technologies</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.page}
                className="flex items-center gap-3 px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl hover:border-[#27CBCB]/30 transition-all group"
              >
                <action.icon className="w-5 h-5 text-gray-400 group-hover:text-[#27CBCB] transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Documentation Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Total Sections</span>
              <span className="text-white">5</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-green-400">Today</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className="text-[#27CBCB]">Complete</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors text-sm">
                <BookOpen className="w-4 h-4" />
                View Full Documentation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevDocDashboard;