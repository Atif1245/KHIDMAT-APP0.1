import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MessageCircle, Phone, Send, 
  CheckCheck, Clock, MoreVertical
} from 'lucide-react';

interface Chat {
  id: string;
  providerName: string;
  providerImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  orderId: string;
  status: 'active' | 'completed';
}

interface Message {
  id: string;
  text: string;
  sentByMe: boolean;
  time: string;
  read: boolean;
}

const CustomerChats: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      providerName: 'Ali Raza',
      providerImage: 'https://ui-avatars.com/api/?name=Ali+Raza&background=005F54&color=fff',
      lastMessage: 'I am on my way to your location',
      lastMessageTime: '2 min ago',
      unread: true,
      orderId: 'KH-12345',
      status: 'active'
    },
    {
      id: '2',
      providerName: 'Bilal Ahmed',
      providerImage: 'https://ui-avatars.com/api/?name=Bilal+Ahmed&background=005F54&color=fff',
      lastMessage: 'Your order has been confirmed',
      lastMessageTime: '1 hour ago',
      unread: false,
      orderId: 'KH-12346',
      status: 'active'
    },
    {
      id: '3',
      providerName: 'Sara Khan',
      providerImage: 'https://ui-avatars.com/api/?name=Sara+Khan&background=005F54&color=fff',
      lastMessage: 'Thank you for your service!',
      lastMessageTime: '1 day ago',
      unread: false,
      orderId: 'KH-12344',
      status: 'completed'
    },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: '1', text: 'Hello! I have reached your area.', sentByMe: false, time: '5:55 PM', read: true },
      { id: '2', text: 'Great! I\'m at home.', sentByMe: true, time: '5:56 PM', read: true },
      { id: '3', text: 'I am on my way to your location', sentByMe: false, time: '5:58 PM', read: false },
    ],
    '2': [
      { id: '1', text: 'Your order has been confirmed.', sentByMe: false, time: '1:00 PM', read: true },
      { id: '2', text: 'Thank you for the update!', sentByMe: true, time: '1:05 PM', read: true },
    ],
    '3': [
      { id: '1', text: 'Job completed successfully!', sentByMe: false, time: '2:00 PM', read: true },
      { id: '2', text: 'Thank you for your service!', sentByMe: true, time: '2:05 PM', read: true },
    ],
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sentByMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));
    setMessageText('');
  };

  if (selectedChat) {
    const chatMessages = messages[selectedChat.id] || [];
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Chat Header */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-gray-100 rounded-xl">
              <ArrowLeft size={22} className="text-gray-700" />
            </button>
            <img src={selectedChat.providerImage} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 dark:text-white">{selectedChat.providerName}</h2>
              <p className="text-xs text-green-600">Online</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-xl">
              <Phone size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Order Info Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Order #{selectedChat.orderId}</p>
            <p className="text-xs font-semibold text-emerald-600">
              {selectedChat.status === 'active' ? '● Active' : '✓ Completed'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/tracking')}
            className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg"
          >
            Track Order
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sentByMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl ${msg.sentByMe ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 shadow-sm'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sentByMe ? 'text-emerald-200' : 'text-gray-400'} flex items-center gap-1 justify-end`}>
                  {msg.time}
                  {msg.sentByMe && (msg.read ? <CheckCheck size={12} /> : <Clock size={12} />)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center disabled:opacity-50"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft size={22} className="text-gray-700 dark:text-white" />
          </button>
          <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex-1">Messages</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {chats.length > 0 ? (
          chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-3 cursor-pointer active:scale-[0.99] transition"
            >
              <div className="flex gap-3">
                <img src={chat.providerImage} alt="" className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">{chat.providerName}</h3>
                      <p className="text-xs text-gray-400">Order #{chat.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">{chat.lastMessageTime}</p>
                      {chat.unread && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 ml-auto" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{chat.lastMessage}</p>
                  {chat.status === 'active' && (
                    <span className="text-xs text-green-600 mt-1 inline-block">● Active Order</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerChats;