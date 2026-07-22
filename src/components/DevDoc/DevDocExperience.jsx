import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, Tag } from 'lucide-react';

const experienceData = [
  {
    title: "Full Stack Developer",
    company: "TechNova Solutions",
    location: "Bangalore, India",
    period: "2023 - Present",
    type: "Full-time",
    description: [
      "Led development of enterprise-scale React applications serving 50,000+ users",
      "Architected microservices using Node.js, Express, and MongoDB with 99.9% uptime",
      "Implemented CI/CD pipelines using GitHub Actions and Docker, reducing deployment time by 60%",
      "Mentored 5 junior developers and conducted weekly code reviews",
      "Optimized database queries and implemented caching strategies improving API response time by 40%"
    ],
    technologies: ["React", "Node.js", "Express", "MongoDB", "Docker", "AWS", "Redis"]
  },
  {
    title: "Software Engineer Intern",
    company: "DataFlow Labs",
    location: "Hyderabad, India",
    period: "2022 - 2023",
    type: "Internship",
    description: [
      "Built RESTful APIs and integrated third-party services for data processing pipelines",
      "Developed real-time dashboard using React and WebSocket for live data visualization",
      "Collaborated with data science team to implement ML model endpoints using FastAPI",
      "Reduced API response latency by 35% through query optimization and caching"
    ],
    technologies: ["React", "FastAPI", "Python", "PostgreSQL", "WebSocket", "Docker"]
  },
  {
    title: "Research Assistant",
    company: "AI Research Lab - IIT Hyderabad",
    location: "Hyderabad, India",
    period: "2021 - 2022",
    type: "Research",
    description: [
      "Developed NLP models for resume parsing and ATS scoring achieving 85% accuracy",
      "Published research paper on 'Semantic Matching in Recruitment Systems' at ICML 2023",
      "Built and maintained research codebase using Python and PyTorch",
      "Conducted experiments with spaCy, BERT, and transformer models for text classification"
    ],
    technologies: ["Python", "PyTorch", "spaCy", "BERT", "scikit-learn", "FastAPI"]
  }
];

const DevDocExperience = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-[#27CBCB]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Experience</h1>
      </div>

      <div className="space-y-6">
        {experienceData.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111111] border border-gray-800 rounded-2xl p-6"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                <p className="text-[#27CBCB]">{exp.company}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    {exp.location}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {exp.period}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-800/50 rounded-full text-xs text-gray-400">
                    {exp.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <ul className="space-y-2">
                {exp.description.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-[#27CBCB] mt-1">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <span key={tech} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-400">
                    <Tag className="w-3 h-3" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DevDocExperience;