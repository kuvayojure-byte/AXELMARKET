import React, { useState, useEffect, useRef } from 'react';
import { User, Chat, Message } from '../types';
import { getChats, getMessages, sendMessage, markChatAsRead, saveUser } from '../data';
import { Send, Check, CheckCheck, MapPin, User as UserIcon, MessageSquare, AlertCircle, ShoppingBag } from 'lucide-react';

interface ChatTabProps {
  currentUser: User;
  onAdSelectedById: (adId: string) => void;
}

export default function ChatTab({ currentUser, onAdSelectedById }: ChatTabProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chats on mount and interval
  useEffect(() => {
    const loadChats = () => {
      const allChats = getChats();
      // Filter chats where user is buyer or seller
      const myChats = allChats.filter(c => c.buyerId === currentUser.id || c.sellerId === currentUser.id);
      setChats(myChats);
    };

    loadChats();
    const interval = setInterval(loadChats, 3000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  // Load messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      markChatAsRead(selectedChat.id);
      const msgs = getMessages(selectedChat.id);
      setMessages(msgs);
      scrollToBottom();
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    const text = inputText;
    setInputText('');

    // Send user message
    const newMsg = sendMessage(selectedChat.id, currentUser.id, text);
    setMessages(prev => [...prev, newMsg]);
    scrollToBottom();

    // Re-load chats to sync last message
    setChats(getChats().filter(c => c.buyerId === currentUser.id || c.sellerId === currentUser.id));

    // Automated Seller Response simulation
    // Only if current user is the buyer
    if (currentUser.id === selectedChat.buyerId) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        let replyText = `D'accord, j'ai bien reçu votre message. Convenons d'un rendez-vous ! Vous pouvez m'appeler directement au numéro indiqué.`;
        const lowerText = text.toLowerCase();

        if (lowerText.includes('prix') || lowerText.includes('combien') || lowerText.includes('diminuer') || lowerText.includes('négociable')) {
          replyText = `Le prix est légèrement négociable si vous êtes un acheteur sérieux. Quelle est votre proposition en BIF ?`;
        } else if (lowerText.includes('dispo') || lowerText.includes('disponible') || lowerText.includes('encore')) {
          replyText = `Oui, c'est toujours disponible ! Je suis situé à ${selectedChat.sellerName === 'Axel Niyonzima' ? 'Bujumbura' : 'Gitega'}. Quand voulez-vous passer voir ?`;
        } else if (lowerText.includes('rencontrer') || lowerText.includes('voir') || lowerText.includes('lieu') || lowerText.includes('rdv')) {
          replyText = `On peut se rencontrer au centre-ville dans un lieu sécurisé et public, comme devant la Galerie d'alimentation ou près du Monument de l'Unité.`;
        } else if (lowerText.includes('ok') || lowerText.includes('marche') || lowerText.includes('super')) {
          replyText = `Parfait ! Appelez-moi directement dès que vous êtes prêt. À bientôt !`;
        }

        const replyMsg = sendMessage(selectedChat.id, selectedChat.sellerId, replyText);
        setMessages(prev => [...prev, replyMsg]);
        scrollToBottom();

        // Refresh chats list
        setChats(getChats().filter(c => c.buyerId === currentUser.id || c.sellerId === currentUser.id));
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex animate-in fade-in duration-200">
      
      {/* Sidebar - Chats List */}
      <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col h-full ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-700" />
            Mes discussions
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Échanges sécurisés entre Burundais</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-gray-500 space-y-2 mt-12">
              <MessageSquare size={36} className="mx-auto text-gray-300" />
              <p className="text-sm font-semibold">Aucun message pour l'instant</p>
              <p className="text-xs text-gray-400">Cliquez sur « Contacter le vendeur » depuis une annonce pour démarrer une discussion.</p>
            </div>
          ) : (
            chats.map((chat) => {
              const isBuyer = chat.buyerId === currentUser.id;
              const counterpartName = isBuyer ? chat.sellerName : chat.buyerName;
              const isSelected = selectedChat?.id === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800 flex-shrink-0 text-sm">
                    {counterpartName.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-extrabold text-sm text-gray-900 truncate">
                        {counterpartName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(chat.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-blue-700 truncate flex items-center gap-1 mb-1">
                      <ShoppingBag size={10} />
                      {chat.adTitle}
                    </div>

                    <p className="text-xs text-gray-500 truncate">{chat.lastMessageText}</p>
                  </div>

                  {chat.unreadCount && chat.unreadCount > 0 ? (
                    <span className="bg-blue-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                      {chat.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main chat stream */}
      <div className={`flex-1 flex flex-col h-full ${!selectedChat ? 'hidden md:flex bg-gray-50 items-center justify-center' : 'flex bg-white'}`}>
        {selectedChat ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  Back
                </button>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-800 text-sm">
                  {(selectedChat.buyerId === currentUser.id ? selectedChat.sellerName : selectedChat.buyerName).charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900">
                    {selectedChat.buyerId === currentUser.id ? selectedChat.sellerName : selectedChat.buyerName}
                  </h4>
                  <button
                    onClick={() => onAdSelectedById(selectedChat.adId)}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 text-left"
                  >
                    Annonce : {selectedChat.adTitle} ({selectedChat.adPrice.toLocaleString()} BIF)
                  </button>
                </div>
              </div>

              <div className="hidden sm:block text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-semibold">
                Paiement direct à convenir
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMe 
                        ? 'bg-blue-700 text-white rounded-br-none' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck size={10} />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Écrivez votre message ici..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-200 text-white rounded-xl transition-all shadow-md shadow-blue-100 disabled:shadow-none cursor-pointer active:scale-95 flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center p-8 space-y-3 text-gray-500 max-w-sm">
            <MessageSquare size={48} className="mx-auto text-gray-300" />
            <h3 className="font-extrabold text-gray-800 text-base">Aucune discussion sélectionnée</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Choisissez une conversation dans la liste de gauche ou contactez un vendeur directement sur son annonce.</p>
          </div>
        )}
      </div>

    </div>
  );
}
