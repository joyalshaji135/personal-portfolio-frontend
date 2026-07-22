import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatbotInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800 bg-gray-900/50 rounded-b-2xl">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about portfolio..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 
              text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#27CBCB] 
              transition-colors max-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-2.5 bg-[#27CBCB] text-black rounded-xl hover:bg-[#27CBCB]/80 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-gray-500">
          Press Enter to send
        </span>
        <span className="text-[10px] text-gray-500">
          Powered by portfolio data
        </span>
      </div>
    </form>
  );
};

export default ChatbotInput;