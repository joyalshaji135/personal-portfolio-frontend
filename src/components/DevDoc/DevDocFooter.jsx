import { 
  Github, 
  Linkedin, 
  Mail, 
  Twitter,
  Heart,
  Code,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DevDocFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-[#27CBCB]" />
              <span className="text-white font-semibold">Dev Documentation</span>
            </div>
            <p className="text-gray-400 text-sm">
              Complete technical documentation for the portfolio project.
              Built with React, Tailwind CSS, and Framer Motion.
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span>by Joyal Shaji</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#27CBCB] transition-colors text-sm">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/dev-doc" className="text-gray-400 hover:text-[#27CBCB] transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#27CBCB] transition-colors text-sm">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Joyal Shaji. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DevDocFooter;