import { useState } from 'react';
import { Mail, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      message: "I'm interested in your services...",
      date: "2024-01-15",
      read: false
    },
    // Add more messages
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const markAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const deleteMessage = (id) => {
    if (window.confirm('Delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 mt-1">View and manage contact messages</p>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    {msg.read ? (
                      <CheckCircle size={18} className="text-green-400" />
                    ) : (
                      <Mail size={18} className="text-[#27CBCB]" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">{msg.name}</td>
                  <td className="px-6 py-4 text-gray-400">{msg.email}</td>
                  <td className="px-6 py-4 text-gray-400">{msg.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedMessage(msg)}
                        className="p-1 hover:bg-gray-800 rounded transition-colors"
                      >
                        <Eye size={18} className="text-gray-400 hover:text-white" />
                      </button>
                      {!msg.read && (
                        <button 
                          onClick={() => markAsRead(msg.id)}
                          className="p-1 hover:bg-gray-800 rounded transition-colors"
                        >
                          <CheckCircle size={18} className="text-gray-400 hover:text-green-400" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMessage(msg.id)}
                        className="p-1 hover:bg-gray-800 rounded transition-colors"
                      >
                        <Trash2 size={18} className="text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-gray-800 rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedMessage.name}</h3>
                <p className="text-gray-400 text-sm">{selectedMessage.email}</p>
              </div>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
              <p className="text-gray-300">{selectedMessage.message}</p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-[#27CBCB] text-black rounded-lg hover:bg-[#27CBCB]/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;