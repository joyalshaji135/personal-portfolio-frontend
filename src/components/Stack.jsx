/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getIcon, renderIcon } from "../utils/iconMapping";
import { stackService } from "../services/public-api/stackService";

const Stack = () => {
  const [stackData, setStackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("all");

  useEffect(() => {
    const fetchStack = async () => {
      try {
        setLoading(true);
        const response = await stackService.getPublicStack();
        if (response.status && response.data) {
          setStackData(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stack data:', err);
        setError('Failed to load stack data');
        setLoading(false);
      }
    };

    fetchStack();
  }, []);

  // Get categories from API data
  const categories = useMemo(() => {
    if (!stackData?.categories) return {};
    
    const categoriesObj = {};
    stackData.categories.forEach(cat => {
      categoriesObj[cat.key] = cat.technologies.map(tech => ({
        name: tech.name,
        icon: tech.icon,
        _id: tech._id
      }));
    });
    return categoriesObj;
  }, [stackData]);

  // Get others from API data
  const others = useMemo(() => {
    if (!stackData?.others) return [];
    return stackData.others.map(item => ({
      name: item.name,
      icon: item.icon,
      _id: item._id
    }));
  }, [stackData]);

  // Get tabs from categories
  const tabs = useMemo(() => {
    return ["all", ...Object.keys(categories)];
  }, [categories]);

  // Get quote from API
  const quote = useMemo(() => {
    return stackData?.quote || {
      text: "Use boring tech. Build something that lasts.",
      author: "Dan McKinley"
    };
  }, [stackData]);

  // Get title and subtitle from API
  const title = stackData?.title || "My Tech Stack";
  const subtitle = stackData?.subtitle || "The technologies I reach for most often - each chosen with purpose";

  const Capsule = ({ tech }) => {
    const IconComponent = getIcon(tech.icon);
    return (
      <motion.div
        whileHover={{ y: -6 }}
        className="group flex items-center gap-3 px-4 sm:px-5 py-3
          rounded-full border border-gray-700/40
          bg-gray-900/40 backdrop-blur transition-all"
      >
        <span className="text-xl text-gray-400 group-hover:text-[#27CBCB] transition-colors">
          {renderIcon(tech.icon, "w-5 h-5")}
        </span>
        <span className="text-sm sm:text-md font-medium text-gray-200">{tech.name}</span>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-8 md:space-y-12 min-h-[60vh] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB]"></div>
          <p className="text-gray-400 font-mono text-sm">Loading stack...</p>
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
        className="px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-8 md:space-y-12 min-h-[60vh] flex items-center justify-center"
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
      className="px-4 sm:px-6 md:px-8 lg:ml-65 lg:p-5 space-y-8 md:space-y-12"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-0">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#27CBCB] text-center lg:text-left">
            {title}
          </h2>
          <p className="text-[#80978F] text-base sm:text-lg mt-2 text-center lg:text-left">
            {subtitle}
          </p>
        </div>
        <div className="w-full lg:w-60 bg-gray-900/40 backdrop-blur-sm py-4 px-5 mr-35 rounded-xl border border-gray-700/40">
          <p className="text-gray-200 text-sm italic leading-relaxed mb-3">
            &quot;{quote.text}&quot;
          </p>
          <div className="flex items-center">
            <div className="flex-1">
              <span className="text-gray-400 text-xs font-medium">
                ~ {quote.author}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#27CBCB]"></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-4 justify-center lg:justify-start">
        {tabs.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`relative px-3 sm:px-4 py-2 text-sm sm:text-md font-medium rounded-lg transition-all
              ${
                active === key
                  ? "text-white bg-[#27CBCB]/20"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            {key === 'all' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}
            {active === key && (
              <motion.span
                layoutId="underline"
                className="absolute left-0 bottom-0 h-1 w-full bg-[#27CBCB]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {active === "all" ? (
        <div className="space-y-6 md:space-y-7 max-w-5xl">
          {Object.entries(categories).map(([group, techs]) => (
            <div key={group} className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-300 uppercase tracking-wide text-center lg:text-left">
                {group}
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start cursor-pointer">
                {techs.map((tech) => (
                  <Capsule key={tech._id || tech.name} tech={tech} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start max-w-4xl"
        >
          {categories[active]?.map((tech) => (
            <motion.div
              key={tech._id || tech.name}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Capsule tech={tech} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Others */}
      {others.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <p className="font-mono text-sm sm:text-md text-gray-500 text-center lg:text-left">
            {"// Also comfortable with:"}
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start">
            {others.map((tech) => (
              <motion.div
                key={tech._id || tech.name}
                whileHover={{ y: -4 }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2
                  rounded-lg border border-gray-700/40
                  bg-gray-900/30 backdrop-blur cursor-pointer"
              >
                <span className="text-lg text-gray-400">
                  {renderIcon(tech.icon, "w-4 h-4")}
                </span>
                <span className="text-sm text-gray-300">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default Stack;