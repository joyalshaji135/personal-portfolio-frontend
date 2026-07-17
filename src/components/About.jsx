import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "./ui/ProfileCard";
import { X, Download, ExternalLink } from "lucide-react";
import { aboutService } from "../services/public-api/aboutService";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const response = await aboutService.getPublicAbout();
        if (response.status && response.data) {
          setAboutData(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError('Failed to load about data');
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleDownload = () => {
    if (aboutData?.resumeUrl) {
      // If resumeUrl is a full URL, open it in new tab for download
      window.open(aboutData.resumeUrl, '_blank');
    } else {
      // Fallback to local file
      const link = document.createElement("a");
      link.href = "/Resume.pdf";
      link.download = "Resume.pdf";
      link.click();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section className="flex flex-col lg:flex-row justify-between items-center lg:items-start px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-8 lg:space-y-0 lg:space-x-8 min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB]"></div>
          <p className="text-gray-400 font-mono text-sm">Loading about...</p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="flex flex-col lg:flex-row justify-between items-center lg:items-start px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-8 lg:space-y-0 lg:space-x-8 min-h-[60vh] items-center justify-center">
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
      </section>
    );
  }

  // Use data from API or fallback to defaults
  const data = aboutData || {};
  const name = data.name || 'Joyal Shaji';
  const title = data.title || 'Full-Stack Developer';
  const handle = data.handle || 'joyalshaji';
  const status = data.status || 'Currently Working on Backend Developer at BeetStack';
  const location = data.location || 'India';
  const heading = data.heading || 'A developer who';
  const headingHighlight = data.headingHighlight || 'cares about the details';
  const intro = data.intro || 'Final year Computer Science student with a solid foundation in software development, committed to creating scalable and reliable full-stack applications.';
  const quote = data.quote || 'Curiosity drives how I approach technology - from solving coding problems to developing intuitive, useful software. I enjoy transforming abstract ideas into tangible, usable solutions.';
  const interests = data.interests || ['Software Development', 'Web Technologies', 'AI & Automation', 'Problem-Solving'];
  const avatarUrl = data.avatarUrl || null;
  const miniAvatarUrl = data.miniAvatarUrl || null;
  const resumeUrl = data.resumeUrl || null;

  return (
    <>
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col lg:flex-row justify-between items-center lg:items-start px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-8 lg:space-y-0 lg:space-x-8"
      >
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full max-w-md lg:max-w-none"
        >
          <ProfileCard
            name={name}
            title={title}
            handle={handle}
            status={status}
            contactText="Let's Connect"
            miniAvatarUrl={miniAvatarUrl}
            avatarUrl={avatarUrl}
            showUserInfo
            enableTilt
            enableMobileTilt={false}
            location={location}
          />
        </motion.div>
        <motion.div
          variants={container}
          className="flex flex-col justify-center space-y-6 md:space-y-8 w-full lg:max-w-xl lg:mr-40"
        >
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-3xl sm:text-4xl font-semibold leading-tight text-center lg:text-left"
          >
            {heading}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#27CBCB] to-[#26D868]">
              {headingHighlight}
            </span>
          </motion.h2>
          <motion.div variants={fadeUp} className="relative pl-6">
            <div className="absolute left-0 top-2 w-1 h-20 bg-linear-to-b from-[#27CBCB] to-[#26D868] rounded-full" />
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {intro}
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="bg-linear-to-br from-gray-900/50 to-transparent p-4 sm:p-5 rounded-xl border border-gray-800/50"
          >
            <p className="text-[#80978F] text-sm sm:text-base leading-relaxed italic">
              &quot;{quote}&quot;
            </p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="space-y-3"
          >
            <motion.h3 variants={fadeUp} className="text-lg text-[#80978F] text-center lg:text-left">
              Interests
            </motion.h3>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
              {interests.map((item, i) => (
                <motion.div
                  key={item}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27CBCB] mr-2" />
                  <span className="text-xs sm:text-sm text-gray-400">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowResume(true)}
            className="cursor-pointer group w-full border border-gray-700 px-6 py-3 rounded-lg hover:border-[#27CBCB] hover:text-[#27CBCB] transition-all"
          >
            <span className="flex justify-center items-center gap-2">
              View Full Resume
              <ExternalLink
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </motion.button>
        </motion.div>
      </motion.section>
      <AnimatePresence>
        {showResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="bg-[#101318] rounded-2xl w-full max-w-6xl h-[90vh] border border-gray-800 overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800">
                <h3 className="text-xl sm:text-2xl font-bold text-[#27CBCB]">Resume</h3>
                <div className="flex gap-2 sm:gap-3">
                  {resumeUrl ? (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 sm:px-4 sm:py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                    >
                      <ExternalLink size={18} />
                    </a>
                  ) : (
                    <a
                      href="/Resume.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 sm:px-4 sm:py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  <button
                    onClick={handleDownload}
                    className="p-2 sm:px-4 sm:py-2 bg-linear-to-r from-[#27CBCB] to-[#26D868] rounded-lg cursor-pointer"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => setShowResume(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>
              {resumeUrl ? (
                <iframe
                  src={resumeUrl}
                  className="w-full h-[calc(90vh-80px)] sm:h-[calc(90vh-88px)] bg-white"
                  title="Resume"
                />
              ) : (
                <iframe
                  src="/Resume.pdf"
                  className="w-full h-[calc(90vh-80px)] sm:h-[calc(90vh-88px)] bg-white"
                  title="Resume"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default About;