import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const ChatbotMessage = ({ message }) => {
  const isBot = message.type === 'bot';

  // Simple markdown-like formatting
  const formatMessage = (text) => {
    // Split by newlines
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Bold text (**text**)
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#27CBCB]">$1</strong>');
      
      // Bullet points (•)
      if (formattedLine.trim().startsWith('•')) {
        return <div key={index} className="flex items-start gap-2 ml-2">
          <span className="text-[#27CBCB]">•</span>
          <span dangerouslySetInnerHTML={{ __html: formattedLine.substring(1).trim() }} />
        </div>;
      }
      
      // Emoji-only lines or empty lines
      if (formattedLine.trim() === '' || /^[\u{1F300}-\u{1F9FF}\s]+$/u.test(formattedLine.trim())) {
        return <div key={index} className="h-1"></div>;
      }
      
      return <div key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isBot 
          ? 'bg-[#27CBCB]/20 text-[#27CBCB]' 
          : 'bg-blue-500/20 text-blue-400'
        }`}
      >
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} max-w-[85%]`}>
        <div className={`px-4 py-2.5 rounded-2xl break-words
          ${isBot 
            ? 'bg-gray-800/50 text-gray-200 rounded-tl-none' 
            : 'bg-[#27CBCB]/20 text-white rounded-tr-none'
          }`}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {isBot ? formatMessage(message.text) : message.text}
          </div>
        </div>
        <span className="text-[10px] text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatbotMessage;