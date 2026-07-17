import { useState } from 'react';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Project One",
      description: "A full-stack application with React and Node.js",
      tech: ["React", "Node.js", "MongoDB"],
      live: "https://project1.com",
      github: "https://github.com/project1",
      image: "project1.jpg"
    },
    // Add more sample projects
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <button className="px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
            <div className="h-48 bg-gray-800/50 flex items-center justify-center">
              <span className="text-gray-500">Project Image</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, i) => (
                  <span key={i} className="px-2 py-1 bg-[#27CBCB]/10 text-[#27CBCB] text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Edit size={18} className="text-gray-400 hover:text-white" />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-gray-400 hover:text-red-400" />
                  </button>
                </div>
                <a 
                  href={project.live} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#27CBCB] hover:text-[#27CBCB]/80 transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;