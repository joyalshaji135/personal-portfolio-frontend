/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Github, Zap, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { projectService } from "../services/public-api/projectService";

// Fallback images
import careerquillImg from "../assets/careerquill.png";
import flowmindImg from "../assets/flowmind.png";
import proctorlyImg from "../assets/proctorly.png";
import hiremeImg from "../assets/hireme.png";

const fallbackImages = {
  "CareerQuill": careerquillImg,
  "FlowMind-AI": flowmindImg,
  "Proctorly": proctorlyImg,
  "HireMe": hiremeImg,
  "TaskFlow": flowmindImg,
};

const ProjectCard = ({ project, onOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError || !project.projectImage) {
      return fallbackImages[project.title] || careerquillImg;
    }
    return project.projectImage;
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      onClick={() => onOpen(project)}
      className="group rounded-xl border border-gray-700/40 bg-gray-900/20 backdrop-blur overflow-hidden cursor-pointer"
    >
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <img
          src={getImageSrc()}
          alt={project.title}
          className="h-full w-full object-cover scale-105 blur-[2px] group-hover:blur-0 group-hover:scale-100 transition-all duration-500"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <motion.div
          initial={{ x: "-60%" }}
          whileHover={{ x: "60%" }}
          transition={{ duration: 1.2 }}
          className={`absolute inset-0 bg-linear-to-r ${project.accent || 'from-[#27CBCB]/40'} to-transparent opacity-60`}
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs rounded-full bg-black/60 backdrop-blur text-[#27CBCB] border border-[#27CBCB]/30">
            {project.category?.name || 'Uncategorized'}
          </span>
        </div>
        <div className="absolute bottom-3 left-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">{project.title}</h3>
          <p className="text-xs text-[#27CBCB]">{project.subtitle}</p>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-3 py-1 text-xs bg-black/60 backdrop-blur rounded-full text-white border border-[#27CBCB]/30">
            Click to view
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1 sm:gap-2 text-xs text-gray-400">
          {project.highlights?.slice(0, 3).map((h) => (
            <span key={h} className="text-xs">• {h}</span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2">
          {project.tech?.slice(0, expanded ? project.tech.length : 4).map((t) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-2 py-1 text-xs rounded-md bg-gray-950 border border-gray-700/40 text-gray-400"
            >
              {t}
            </motion.span>
          ))}
          {project.tech?.length > 4 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="px-2 py-1 text-xs rounded-md border border-gray-700/40 text-[#27CBCB] hover:bg-[#27CBCB]/10 transition-colors"
            >
              {expanded ? "− less" : `+${project.tech.length - 4}`}
            </button>
          )}
        </div>

        <div className="flex gap-4 text-gray-400 pt-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-white transition-colors"
            >
              <FaGithub size={16} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false);

  if (!project) return null;

  const getImageSrc = () => {
    if (imageError || !project.projectImage) {
      return fallbackImages[project.title] || careerquillImg;
    }
    return project.projectImage;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-700/40 bg-gray-900/95 backdrop-blur shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-gray-400 hover:text-white transition-all duration-300"
            >
              <X size={20} />
            </button>

            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 text-xs rounded-full bg-black/60 backdrop-blur text-[#27CBCB] border border-[#27CBCB]/30">
                {project.category?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Hero Image */}
            <div className="relative h-56 sm:h-72 overflow-hidden">
              <img
                src={getImageSrc()}
                alt={project.title}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent" />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 bg-linear-to-r ${project.accent || 'from-[#27CBCB]/40'} to-transparent opacity-30`}
              />
              <div className="absolute bottom-6 left-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {project.title}
                </h2>
                <p className="text-[#27CBCB] text-lg">{project.subtitle}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-[#27CBCB]">●</span> Overview
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Detailed Description */}
              {project.detailedDescription && project.detailedDescription.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-[#27CBCB]">●</span> Key Features & Implementation
                  </h3>
                  <ul className="space-y-2">
                    {project.detailedDescription.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed"
                      >
                        <span className="text-[#27CBCB] mt-1">▸</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features Grid */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-[#27CBCB]">●</span> Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/40"
                      >
                        <Zap size={16} className="text-[#27CBCB] flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenge & Solution */}
              {(project.challenge || project.solution) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.challenge && (
                    <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/30">
                      <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                        <span>⚡</span> Challenge
                      </h4>
                      <p className="text-gray-300 text-sm">{project.challenge}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="p-4 rounded-lg bg-green-900/10 border border-green-900/30">
                      <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <span>✓</span> Solution
                      </h4>
                      <p className="text-gray-300 text-sm">{project.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tech Stack */}
              {project.tech && project.tech.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-[#27CBCB]">●</span> Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-sm rounded-lg bg-gray-800/50 border border-gray-700/40 text-gray-300 hover:border-[#27CBCB]/40 hover:text-white transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-700/40">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700/40 text-gray-300 hover:text-white hover:border-[#27CBCB]/40 transition-all duration-300"
                  >
                    <Github size={18} />
                    View Code
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#27CBCB]/10 border border-[#27CBCB]/30 text-[#27CBCB] hover:bg-[#27CBCB]/20 transition-all duration-300"
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getPublicProjects();
        if (response.status && response.data) {
          setProjects(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Get unique categories from projects
  const categories = useMemo(() => {
    const categoryMap = new Map();
    projects.forEach(project => {
      if (project.category) {
        const id = project.category._id || project.category;
        const name = project.category.name || project.category;
        if (!categoryMap.has(id)) {
          categoryMap.set(id, { id, name });
        }
      }
    });
    return [
      { id: "all", label: "All Projects" },
      ...Array.from(categoryMap.values()).map(cat => ({
        id: cat.id,
        label: cat.name
      }))
    ];
  }, [projects]);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedProject(null), 300);
  };

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") {
      return projects;
    }
    return projects.filter(project => {
      const categoryId = project.category?._id || project.category;
      return categoryId === selectedCategory;
    });
  }, [projects, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-6 sm:space-y-8 max-w-6xl lg:mr-36 mx-auto min-h-[60vh] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB]"></div>
          <p className="text-gray-400 font-mono text-sm">Loading projects...</p>
        </div>
      </motion.section>
    );
  }

  if (error) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-6 sm:space-y-8 max-w-6xl lg:mr-36 mx-auto min-h-[60vh] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-red-400 text-4xl">⚠️</div>
          <p className="text-gray-400 font-mono text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#27CBCB]/20 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/30 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </motion.section>
    );
  }

  return (
    <>
      <motion.section
        id="projects-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-6 sm:space-y-8 max-w-6xl lg:mr-36 mx-auto"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#27CBCB] text-center lg:text-left">
            Things I&apos;ve Built
          </h2>
          <p className="mt-2 text-[#80978F] text-base sm:text-lg max-w-xl text-center lg:text-left mx-auto lg:mx-0">
            Real-world projects focused on system design, scalability, and clean engineering.
          </p>
        </div>

        {/* Category Filters - Dynamic from API */}
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-[#27CBCB]/20 border-[#27CBCB] text-[#27CBCB] shadow-[0_0_15px_rgba(39,203,203,0.15)]"
                  : "border-gray-700/40 text-gray-400 hover:border-[#27CBCB]/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                {category.id !== "all" && <Filter size={14} />}
                {category.label}
                {category.id !== "all" && (
                  <span className="text-xs opacity-60">
                    ({projects.filter(p => {
                      const catId = p.category?._id || p.category;
                      return catId === category.id;
                    }).length})
                  </span>
                )}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Project Count */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.label || selectedCategory}`}
          </span>
          {totalPages > 1 && (
            <span>Page {currentPage} of {totalPages}</span>
          )}
        </div>

        {/* Projects Grid */}
        <motion.div
          key={selectedCategory + currentPage}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {currentProjects.length > 0 ? (
            currentProjects.map((project) => (
              <ProjectCard 
                key={project._id || project.title} 
                project={project} 
                onOpen={handleOpenModal}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-400">No projects found in this category.</p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && currentProjects.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6 pb-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition-all duration-300 ${
                currentPage === 1
                  ? "border-gray-700/40 text-gray-600 cursor-not-allowed opacity-50"
                  : "border-gray-700/40 text-gray-400 hover:border-[#27CBCB]/40 hover:text-white hover:bg-[#27CBCB]/5"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers().map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  …
                </span>
              ) : (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[40px] px-3 py-2 rounded-lg border transition-all duration-300 ${
                    currentPage === pageNum
                      ? "bg-[#27CBCB]/20 border-[#27CBCB] text-[#27CBCB] shadow-[0_0_15px_rgba(39,203,203,0.15)]"
                      : "border-gray-700/40 text-gray-400 hover:border-[#27CBCB]/40 hover:text-white hover:bg-[#27CBCB]/5"
                  }`}
                >
                  {pageNum}
                </motion.button>
              )
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border transition-all duration-300 ${
                currentPage === totalPages
                  ? "border-gray-700/40 text-gray-600 cursor-not-allowed opacity-50"
                  : "border-gray-700/40 text-gray-400 hover:border-[#27CBCB]/40 hover:text-white hover:bg-[#27CBCB]/5"
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <div className="flex justify-center text-[#27CBCB]">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 group"
          >
            <span className="relative">
              View all projects on GitHub
              <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-[#27CBCB] transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </span>
            <ExternalLink
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </motion.section>

      {/* Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Projects;