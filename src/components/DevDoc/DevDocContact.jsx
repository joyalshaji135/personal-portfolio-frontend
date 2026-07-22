import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Globe, ExternalLink, MessageSquare } from 'lucide-react';

const contactData = {
  heading: "Let's work together",
  description: "Have an opportunity or project in mind? Send a quick message - I usually respond within 24 hours.",
  socials: [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/joyal-shaji-27ba8b21a/",
      description: "Let's connect professionally",
      icon: "linkedin"
    },
    {
      name: "GitHub",
      url: "https://github.com/joyalshaji135",
      description: "Explore my projects",
      icon: "github"
    }
  ]
};

const DevDocContact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#27CBCB]/10 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-[#27CBCB]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Contact</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white">{contactData.heading}</h2>
          <p className="text-gray-400 mt-3">{contactData.description}</p>
          
          <div className="mt-6 space-y-4">
            {contactData.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-xl hover:border-[#27CBCB]/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {social.icon === 'github' && <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />}
                  {social.icon === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />}
                  <div>
                    <p className="text-white font-medium">{social.name}</p>
                    <p className="text-gray-400 text-sm">{social.description}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#27CBCB] transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Message Form Preview */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-[#27CBCB]" />
            <h2 className="text-xl font-semibold text-white">Send a Message</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                value="Joyal Shaji"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors"
                value="joyalshaji135@gmail.com"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Your message here..."
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#27CBCB] focus:ring-1 focus:ring-[#27CBCB] transition-colors resize-none"
                value="Hi Joyal, I'm interested in working with you..."
                readOnly
              />
            </div>
            <button className="w-full py-2.5 bg-[#27CBCB] text-black font-semibold rounded-lg hover:bg-[#27CBCB]/80 transition-colors">
              Send Message
            </button>
            <p className="text-xs text-gray-500 text-center">This is a preview. Use the contact form on the main page.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevDocContact;