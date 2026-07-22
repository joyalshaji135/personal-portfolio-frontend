import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, Quote, Award, CheckCircle } from 'lucide-react';

const aboutData = {
  name: "Joyal Shaji",
  title: "Full-Stack Developer",
  handle: "joyalshaji",
  status: "Currently Working on Backend Developer at BeetStack",
  location: "Kerala, India",
  heading: "A developer who",
  headingHighlight: "cares about the details",
  intro: "Final year Computer Science student with a solid foundation in software development, committed to creating scalable and reliable full-stack applications.",
  quote: "Curiosity drives how I approach technology - from solving coding problems to developing intuitive, useful software. I enjoy transforming abstract ideas into tangible, usable solutions.",
  interests: [
    "Software Development",
    "Web Technologies",
    "AI & Automation",
    "Problem-Solving"
  ],
  resumeUrl: "https://pub-8c9b5bd025e14059bcb1f24ae34be68d.r2.dev/about/resumes/77cfc194-5eb4-4486-a2d7-934b7d54bae3.pdf",
  avatarUrl: "https://pub-8c9b5bd025e14059bcb1f24ae34be68d.r2.dev/about/avatars/b8da48df-1e5d-41da-9b6a-ee20c38f4a06.png"
};

const DevDocAbout = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-[#27CBCB]" />
        </div>
        <h1 className="text-3xl font-bold text-white">About Section</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-[#111111] border border-gray-800 rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#27CBCB]/20">
              <img 
                src={aboutData.avatarUrl} 
                alt={aboutData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-white mt-4">{aboutData.name}</h2>
            <p className="text-[#27CBCB] text-sm">{aboutData.title}</p>
            <div className="flex items-center gap-1 text-gray-400 text-sm mt-2">
              <MapPin className="w-4 h-4" />
              {aboutData.location}
            </div>
            <div className="w-full mt-4 pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-sm text-center">{aboutData.status}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Quote className="w-5 h-5 text-[#27CBCB]" />
              Quote
            </h3>
            <p className="text-gray-300 italic mt-2">{aboutData.quote}</p>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#27CBCB]" />
              Introduction
            </h3>
            <p className="text-gray-300 mt-2">{aboutData.intro}</p>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#27CBCB]" />
              Interests
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {aboutData.interests.map((interest) => (
                <span key={interest} className="px-3 py-1 bg-gray-800/50 rounded-full text-sm text-gray-300">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">Resume</h3>
            <a 
              href={aboutData.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevDocAbout;