/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaBriefcase, 
  FaCalendar, 
  FaMapMarker, 
  FaExternalLinkAlt 
} from "react-icons/fa";
import { MdWork, MdSchool } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { experienceService } from "../services/public-api/experienceService";
import { educationService } from "../services/public-api/educationService";

const ExperienceCard = ({ experience, index }) => {
  const [expanded, setExpanded] = useState(false);

  // Get icon based on type
  const getIcon = (type) => {
    if (type?.toLowerCase().includes('internship') || type?.toLowerCase().includes('research')) {
      return <MdSchool className="text-[#27CBCB]" />;
    }
    if (type?.toLowerCase().includes('open source')) {
      return <GiSkills className="text-[#27CBCB]" />;
    }
    return <FaBriefcase className="text-[#27CBCB]" />;
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: index % 2 === 0 ? -20 : 20 },
        visible: { opacity: 1, x: 0 }
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl border border-gray-700/40 bg-gray-900/20 backdrop-blur p-5 sm:p-6 hover:border-[#27CBCB]/30 transition-all duration-300"
    >
      {/* Timeline connector */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-700/40 group-hover:bg-[#27CBCB]/30 transition-colors hidden sm:block" />
      
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Icon and timeline dot */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700/40 flex items-center justify-center text-lg relative z-10">
            {getIcon(experience.type)}
            <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-3 h-0.5 bg-gray-700/40 group-hover:bg-[#27CBCB]/30 transition-colors hidden sm:block" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-[#27CBCB] transition-colors">
                {experience.title}
              </h3>
              <p className="text-[#27CBCB] text-sm sm:text-base font-medium">
                {experience.company}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FaCalendar className="text-[#27CBCB]" size={12} />
              <span>{experience.period}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FaMapMarker size={12} />
              {experience.location}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="px-2 py-0.5 rounded-full bg-gray-800/50 border border-gray-700/40">
              {experience.type}
            </span>
          </div>

          <ul className="space-y-1.5 text-gray-300 text-sm leading-relaxed">
            {(expanded ? experience.description : experience.description?.slice(0, 2) || []).map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2"
              >
                <span className="text-[#27CBCB] mt-1.5">▸</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          {experience.description?.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#27CBCB] text-sm hover:underline transition-all"
            >
              {expanded ? "Show less ↑" : `Show ${experience.description.length - 2} more ↓`}
            </button>
          )}

          {/* Technologies */}
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {experience.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs rounded-full bg-gray-800/50 border border-gray-700/40 text-gray-400 hover:border-[#27CBCB]/40 hover:text-white transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const EducationCard = ({ edu }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-gray-700/40 bg-gray-900/20 backdrop-blur p-5 sm:p-6 hover:border-[#27CBCB]/30 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700/40 flex items-center justify-center text-2xl">
            <MdSchool className="text-[#27CBCB]" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">{edu.degree}</h3>
            <p className="text-[#27CBCB] text-sm sm:text-base font-medium">{edu.institution}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FaMapMarker size={12} />
              {edu.location}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="flex items-center gap-1">
              <FaCalendar size={12} />
              {edu.period}
            </span>
          </div>
          <ul className="space-y-1.5 text-gray-300 text-sm">
            {edu.description?.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2"
              >
                <span className="text-[#27CBCB] mt-1.5">▸</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const [experienceData, setExperienceData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expResponse, eduResponse] = await Promise.all([
          experienceService.getPublicExperience(),
          educationService.getPublicEducation()
        ]);

        if (expResponse.status && expResponse.data) {
          setExperienceData(expResponse.data);
        }
        if (eduResponse.status && eduResponse.data) {
          setEducationData(eduResponse.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching experience/education:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from data
  const totalExperience = experienceData.length;
  const totalProjects = experienceData.reduce((acc, exp) => acc + (exp.description?.length || 0), 0);
  const totalCertifications = educationData.length;

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
          <p className="text-gray-400 font-mono text-sm">Loading experience...</p>
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
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-6 sm:space-y-8 max-w-6xl lg:mr-36 mx-auto"
    >
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#27CBCB] text-center lg:text-left">
          Experience & Education
        </h2>
        <p className="mt-2 text-[#80978F] text-base sm:text-lg max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
          Professional journey and academic background in software engineering and AI.
        </p>
      </div>

      {/* Experience Section */}
      {experienceData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-400 border-b border-gray-700/40 pb-3">
            <FaBriefcase className="text-[#27CBCB]" />
            <h3 className="text-lg font-semibold text-white">Professional Experience</h3>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-4"
          >
            {experienceData.map((exp, index) => (
              <ExperienceCard key={exp._id || index} experience={exp} index={index} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Education Section */}
      {educationData.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 text-gray-400 border-b border-gray-700/40 pb-3">
            <MdSchool className="text-[#27CBCB]" />
            <h3 className="text-lg font-semibold text-white">Education</h3>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="space-y-4"
          >
            {educationData.map((edu, index) => (
              <EducationCard key={edu._id || index} edu={edu} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Stats/Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl border border-gray-700/40 bg-gray-900/20 backdrop-blur p-4 text-center hover:border-[#27CBCB]/30 transition-all duration-300"
        >
          <div className="text-3xl font-bold text-[#27CBCB]">{totalExperience}+</div>
          <div className="text-sm text-gray-400">Years Experience</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-xl border border-gray-700/40 bg-gray-900/20 backdrop-blur p-4 text-center hover:border-[#27CBCB]/30 transition-all duration-300"
        >
          <div className="text-3xl font-bold text-[#27CBCB]">{totalProjects}+</div>
          <div className="text-sm text-gray-400">Projects Delivered</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-xl border border-gray-700/40 bg-gray-900/20 backdrop-blur p-4 text-center hover:border-[#27CBCB]/30 transition-all duration-300"
        >
          <div className="text-3xl font-bold text-[#27CBCB]">{totalCertifications}+</div>
          <div className="text-sm text-gray-400">Certifications</div>
        </motion.div>
      </div>

      {/* View Full Resume */}
      <div className="flex justify-center text-[#27CBCB] pt-4">
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 group"
        >
          <span className="relative">
            View Full Resume
            <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-[#27CBCB] transition-all duration-300 group-hover:w-full group-hover:left-0" />
          </span>
          <FaExternalLinkAlt
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </motion.section>
  );
};

export default Experience;