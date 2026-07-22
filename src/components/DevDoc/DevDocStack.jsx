import { motion } from 'framer-motion';
import { Layers, Tag } from 'lucide-react';

const stackData = {
  title: "My Tech Stack",
  subtitle: "The technologies I reach for most often - each chosen with purpose",
  quote: {
    text: "Use boring tech. Build something that lasts.",
    author: "Dan McKinley"
  },
  categories: [
    {
      key: "frontend",
      technologies: [
        { name: "React", icon: "react" },
        { name: "Tailwind CSS", icon: "tailwind" }
      ]
    },
    {
      key: "backend",
      technologies: [
        { name: "Node.js", icon: "nodejs" },
        { name: "Express", icon: "express" }
      ]
    },
    {
      key: "devops",
      technologies: [
        { name: "Docker", icon: "docker" },
        { name: "GitHub", icon: "github" }
      ]
    }
  ],
  others: [
    { name: "Python", icon: "python" },
    { name: "Java", icon: "java" }
  ]
};

const DevDocStack = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
          <Layers className="w-5 h-5 text-[#27CBCB]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Tech Stack</h1>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white">{stackData.title}</h2>
        <p className="text-gray-400 mt-2">{stackData.subtitle}</p>
        <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
          <p className="text-gray-300 italic">"{stackData.quote.text}"</p>
          <p className="text-gray-400 text-sm mt-1">— {stackData.quote.author}</p>
        </div>
      </div>

      <div className="space-y-6">
        {stackData.categories.map((category) => (
          <div key={category.key} className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-[#27CBCB] capitalize">{category.key}</h3>
            <div className="flex flex-wrap gap-3 mt-4">
              {category.technologies.map((tech) => (
                <span key={tech.name} className="px-4 py-2 bg-gray-800/50 rounded-lg text-gray-300 border border-gray-700">
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white">Also Comfortable With</h3>
        <div className="flex flex-wrap gap-3 mt-4">
          {stackData.others.map((tech) => (
            <span key={tech.name} className="px-4 py-2 bg-gray-800/30 rounded-lg text-gray-400 border border-gray-700">
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DevDocStack;