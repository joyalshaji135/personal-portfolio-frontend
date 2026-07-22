import { motion } from 'framer-motion';
import { FolderGit2, Github, ExternalLink, Tag, Zap, Lightbulb } from 'lucide-react';

const projectData = [
  {
    title: "CareerQuill",
    subtitle: "AI Resume Builder & ATS Scoring Platform",
    description: "Create professional resumes with AI assistance and ATS compatibility scoring.",
    detailedDescription: [
      "AI-powered resume generation",
      "ATS score analysis",
      "Multiple resume templates",
      "PDF export",
      "Resume version management"
    ],
    highlights: ["AI Resume Generator", "ATS Score Checker", "JWT Authentication", "Responsive UI"],
    tech: ["React", "Node.js", "Express", "MongoDB", "FastAPI", "spaCy"],
    features: ["AI Suggestions", "Resume Templates", "PDF Download", "Keyword Optimization", "Dashboard"],
    github: "https://github.com/yourusername/careerquill",
    live: "https://careerquill.vercel.app",
    challenge: "Providing accurate ATS scoring for different job descriptions.",
    solution: "Integrated NLP using spaCy and custom keyword matching algorithms.",
    accent: "from-orange-500/40"
  },
  {
    title: "TaskFlow",
    subtitle: "Project & Task Management Platform",
    description: "Collaborative task management application inspired by Trello and Jira.",
    detailedDescription: [
      "Workspace management",
      "Kanban board",
      "Real-time collaboration",
      "Role-based permissions"
    ],
    highlights: ["Drag & Drop", "Socket.io", "Role Management", "Notifications"],
    tech: ["React", "Node.js", "MongoDB", "Socket.io", "Tailwind CSS"],
    features: ["Kanban Board", "Due Dates", "Team Chat", "Activity Logs", "Dark Mode"],
    github: "https://github.com/yourusername/taskflow",
    live: "https://taskflow.vercel.app",
    challenge: "Keeping project updates synchronized across users.",
    solution: "Implemented Socket.io for instant board synchronization.",
    accent: "from-red-500/40"
  }
];

const DevDocProject = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
          <FolderGit2 className="w-5 h-5 text-[#27CBCB]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Projects</h1>
      </div>

      <div className="space-y-6">
        {projectData.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111111] border border-gray-800 rounded-2xl p-6"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="text-[#27CBCB]">{project.subtitle}</p>
                <p className="text-gray-400 text-sm mt-2">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Github className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#27CBCB]/10 rounded-lg hover:bg-[#27CBCB]/20 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-[#27CBCB]" />
                </a>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {/* Highlights */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Zap className="w-4 h-4 text-[#27CBCB]" />
                  <span className="font-medium">Highlights</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.highlights.map((highlight) => (
                    <span key={highlight} className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Tag className="w-4 h-4 text-[#27CBCB]" />
                  <span className="font-medium">Technologies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Lightbulb className="w-4 h-4 text-orange-400" />
                    <span className="font-medium">Challenge</span>
                  </div>
                  <p className="text-gray-300 text-sm">{project.challenge}</p>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="font-medium">Solution</span>
                  </div>
                  <p className="text-gray-300 text-sm">{project.solution}</p>
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <FolderGit2 className="w-4 h-4 text-[#27CBCB]" />
                  <span className="font-medium">Features</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature) => (
                    <span key={feature} className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DevDocProject;