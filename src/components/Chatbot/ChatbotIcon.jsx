import { motion } from 'framer-motion';
import { Bot, MessageCircle } from 'lucide-react';

const ChatbotIcon = ({ onClick, isOpen, unreadCount = 0 }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative p-4 bg-[#27CBCB] text-black rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {isOpen ? (
        <Bot className="w-6 h-6" />
      ) : (
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </div>
      )}
    </motion.button>
  );
};

export default ChatbotIcon;