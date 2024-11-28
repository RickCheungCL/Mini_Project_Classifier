import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeWebsite, addMessage, setCurrentUrl, resetChat,setLoading } from '../store/slices/chatSlice';
import { Send, RefreshCw, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const VisitorClassifier = () => {
  const dispatch = useDispatch();
  const { messages, loading, currentUrl } = useSelector(state => state.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const handleNewChat = () => {
    setShowResetConfirm(true);
  };
  const confirmNewChat = () => {
    dispatch(resetChat());
    setInput('');
    setShowResetConfirm(false);
    toast.success('Started a new chat!', {
      icon: '🎉',
      duration: 2000,
    });
  };
  const handleOptionClick = async (option, skipUserMessage = false) => {
    if (loading) return; // Prevent multiple clicks while loading
    
    dispatch(setLoading(true));
    if (!skipUserMessage) {
        dispatch(addMessage({ type: 'user', content: option }));
      }

    try {
      const response = await fetch('http://localhost:5000/api/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          option: option,
          context: currentUrl
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        dispatch(addMessage({
          type: 'bot',
          content: data.response
        }));
      }
    } catch (error) {
      console.error('Option selection error:', error);
      toast.error('Failed to get response');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !input.trim()) return;

    const userInput = input.trim();
    setInput('');
    dispatch(setLoading(true));

    dispatch(addMessage({ type: 'user', content: userInput }));

    if (!currentUrl) {
      const cleanedUrl = userInput.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
      try {
        const resultAction = await dispatch(analyzeWebsite(cleanedUrl));
        if (analyzeWebsite.fulfilled.match(resultAction)) {
          dispatch(setCurrentUrl(cleanedUrl));
        }
      } catch (error) {
        console.error('Analysis error:', error);
        toast.error('Failed to analyze website');
      }
    } else {
      await handleOptionClick(userInput,true);
    }
    
    dispatch(setLoading(false));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        {/*New Chat Button */}
        <div className="border-b p-4 flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Website Analysis Chat</h2>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>
        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-4 bg-gray-50">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`p-2 rounded-full ${
                    message.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    {message.type === 'user' ? 
                      <User className="h-4 w-4 text-white" /> : 
                      <Bot className="h-4 w-4 text-gray-600" />
                    }
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800'
                  }`}>
                    <p>{message.content}</p>
                    {message.options && (
                      <div className="mt-2 space-y-2">
                        {message.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionClick(option)}
                            disabled={loading}
                            className={`block w-full text-left px-3 py-2 rounded 
                              ${loading 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white hover:bg-gray-50 border border-gray-200'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center my-4"
            >
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder={loading ? "Please wait..." : (currentUrl ? "Type your message..." : "Enter a website URL...")}
              className={`flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                ${loading ? 'bg-gray-100 text-gray-400' : 'bg-white'}`}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`px-6 py-2 rounded-full flex items-center space-x-2
                ${loading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <Send className="h-4 w-4" />
              <span>{loading ? 'Processing...' : 'Send'}</span>
            </button>
          </form>
        </div>
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4"
            >
              <h3 className="text-lg font-semibold mb-2">Start New Chat?</h3>
              <p className="text-gray-600 mb-4">
                This will clear the current conversation. Are you sure?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmNewChat}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Start New
                </button>
              </div>
            </motion.div>
          </div>
        )}
        


    
      </div>
    </div>
  );
};

export default VisitorClassifier;