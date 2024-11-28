import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeWebsite, addMessage, setCurrentUrl, setSelectedOption } from '../store/slices/chatSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal, Loader2 } from 'lucide-react';

const ChatBot = () => {
  const dispatch = useDispatch();
  const { messages, loading, currentUrl } = useSelector(state => state.chat);
  const [input, setInput] = useState('');

  const isValidUrl = (string) => {
    try {
      new URL(string.startsWith('http') ? string : `https://${string}`);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    dispatch(addMessage({ type: 'user', content: input }));
    
    if (!currentUrl) {
      if (isValidUrl(input)) {
        dispatch(setCurrentUrl(input));
        dispatch(analyzeWebsite(input));
      } else {
        dispatch(addMessage({
          type: 'bot',
          content: "That doesn't look like a valid URL. Could you please share a website URL? For example: apple.com"
        }));
      }
    } else {
      dispatch(setSelectedOption(input));
      dispatch(addMessage({
        type: 'bot',
        content: `Great choice! What specific features or information about ${input} are you most interested in?`
      }));
    }
    
    setInput('');
  };

  const handleOptionClick = (option) => {
    setInput(option);
    handleSend();
  };

  return (
    <Card className="w-full max-w-lg mx-auto h-[600px] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <div>{message.content}</div>
                {message.options && (
                  <div className="mt-2 space-y-2">
                    {message.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;