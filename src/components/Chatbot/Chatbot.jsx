import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { useChatbot } from '../../hooks/useChatbot';
import ChatbotMessage from './ChatbotMessage';
import ChatbotInput from './ChatbotInput';
import './ChatbotStyles.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m your AI assistant. I know everything about Joyal\'s portfolio. Ask me about his experience, projects, skills, or anything else!',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { 
    aboutData, 
    contactData, 
    stackData, 
    educationData, 
    experienceData, 
    projectData,
    loading 
  } = useChatbot();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle unread count when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  // Reset unread count when chat opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setTimeout(scrollToBottom, 100);
    }
  };

  const generateBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();

    // About/Profile queries
    if (lowerMsg.includes('who') || lowerMsg.includes('about') || lowerMsg.includes('name')) {
      if (aboutData) {
        return `👤 **About ${aboutData.name}**\n\n${aboutData.name} is a ${aboutData.title} from ${aboutData.location}.\n\n${aboutData.intro}\n\n${aboutData.quote}`;
      }
      return "I'm Joyal Shaji, a Full-Stack Developer passionate about building scalable web applications. 🚀";
    }

    // Experience queries
    if (lowerMsg.includes('experience') || lowerMsg.includes('work') || lowerMsg.includes('job')) {
      if (experienceData && experienceData.length > 0) {
        let response = "💼 **Work Experience**\n\n";
        experienceData.forEach((exp, index) => {
          response += `**${index + 1}. ${exp.title}** at ${exp.company}\n`;
          response += `📍 ${exp.location} | ${exp.period}\n`;
          response += `🔹 ${exp.type}\n`;
          response += `📌 Key responsibilities:\n`;
          exp.description.slice(0, 3).forEach(desc => {
            response += `   • ${desc}\n`;
          });
          response += `🛠️ Technologies: ${exp.technologies.join(', ')}\n\n`;
        });
        return response;
      }
      return "I have experience as a Full-Stack Developer, Software Engineer Intern, and Research Assistant. Check my experience section for details! 💼";
    }

    // Education queries
    if (lowerMsg.includes('education') || lowerMsg.includes('study') || lowerMsg.includes('degree') || lowerMsg.includes('college')) {
      if (educationData && educationData.length > 0) {
        let response = "🎓 **Education**\n\n";
        educationData.forEach((edu, index) => {
          response += `**${edu.degree}**\n`;
          response += `🏛️ ${edu.institution} | 📍 ${edu.location}\n`;
          response += `📅 ${edu.period}\n`;
          response += `📌 Highlights:\n`;
          edu.description.forEach(desc => {
            response += `   • ${desc}\n`;
          });
          response += `\n`;
        });
        return response;
      }
      return "I'm currently pursuing MCA and have completed BCA with a strong foundation in Computer Science. 🎓";
    }

    // Stack/Skills queries
    if (lowerMsg.includes('stack') || lowerMsg.includes('skill') || lowerMsg.includes('tech') || lowerMsg.includes('technology')) {
      if (stackData) {
        let response = "🛠️ **Tech Stack**\n\n";
        response += `**${stackData.title}**\n${stackData.subtitle}\n\n`;
        stackData.categories.forEach(cat => {
          response += `**${cat.key.toUpperCase()}**\n`;
          cat.technologies.forEach(tech => {
            response += `   • ${tech.name}\n`;
          });
          response += `\n`;
        });
        if (stackData.others && stackData.others.length > 0) {
          response += `**Also comfortable with:**\n`;
          stackData.others.forEach(other => {
            response += `   • ${other.name}\n`;
          });
        }
        return response;
      }
      return "I work with React, Node.js, Express, MongoDB, and various other modern technologies. Check my stack section! 💻";
    }

    // Projects queries
    if (lowerMsg.includes('project') || lowerMsg.includes('portfolio') || lowerMsg.includes('work')) {
      if (projectData && projectData.length > 0) {
        let response = "🚀 **Projects**\n\n";
        projectData.forEach((project, index) => {
          response += `**${index + 1}. ${project.title}**\n`;
          response += `📝 ${project.subtitle}\n`;
          response += `🔹 ${project.description}\n`;
          response += `✨ Features:\n`;
          project.highlights.forEach(highlight => {
            response += `   • ${highlight}\n`;
          });
          response += `🛠️ Tech: ${project.tech.join(', ')}\n`;
          if (project.challenge && project.solution) {
            response += `💡 Challenge: ${project.challenge}\n`;
            response += `✅ Solution: ${project.solution}\n`;
          }
          response += `🔗 ${project.github ? `GitHub: ${project.github}` : ''}\n\n`;
        });
        return response;
      }
      return "I've worked on various projects including CareerQuill (AI Resume Builder) and TaskFlow (Project Management). Check my projects section! 🚀";
    }

    // Contact queries
    if (lowerMsg.includes('contact') || lowerMsg.includes('reach') || lowerMsg.includes('email') || lowerMsg.includes('connect')) {
      if (contactData) {
        let response = "📬 **Contact Information**\n\n";
        response += `${contactData.heading}\n${contactData.description}\n\n`;
        response += "🔗 **Social Links:**\n";
        contactData.socials.forEach(social => {
          response += `   • ${social.name}: ${social.url}\n`;
        });
        return response;
      }
      return "You can reach me through the contact form on this page or connect with me on LinkedIn/GitHub. I usually respond within 24 hours! 📧";
    }

    // Greetings
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return "Hello! 👋 How can I help you today? You can ask me about my experience, projects, skills, education, or contact information!";
    }

    // Help
    if (lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('what can you do')) {
      return "🤖 **I can help you with:**\n\n" +
        "• About me and my background\n" +
        "• Work experience and roles\n" +
        "• Education and qualifications\n" +
        "• Tech stack and skills\n" +
        "• Projects and portfolio\n" +
        "• Contact information\n\n" +
        "Just ask me anything! 😊";
    }

    // Thanks
    if (lowerMsg.includes('thanks') || lowerMsg.includes('thank')) {
      return "You're welcome! 😊 If you have any more questions, feel free to ask. I'm always here to help!";
    }

    // Default response with suggestion
    return "That's a great question! 🤔 I can help you with information about my experience, projects, skills, education, or contact details. What would you like to know?";
  };

  const handleSendMessage = async (text) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response with data
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  return (
    <>
      {/* Chat Icon Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#27CBCB] text-black rounded-full shadow-lg hover:bg-[#27CBCB]/80 transition-all duration-300 hover:scale-110 group"
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[380px] md:w-[420px] 
              bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl
              ${isMinimized ? 'h-[60px]' : 'h-[500px] md:h-[550px]'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 cursor-pointer bg-gray-900/50 rounded-t-2xl">
              <div className="flex items-center gap-3" onClick={toggleMinimize}>
                <div className="w-8 h-8 rounded-full bg-[#27CBCB]/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#27CBCB]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
                  <p className="text-xs text-gray-400">Online • Powered by Portfolio Data</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleMinimize}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Minimize"
                >
                  {isMinimized ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100%-130px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                >
                  {messages.map((message) => (
                    <ChatbotMessage key={message.id} message={message} />
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <ChatbotInput onSendMessage={handleSendMessage} disabled={isTyping} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;