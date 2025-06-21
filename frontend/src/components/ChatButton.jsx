import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import useChatBotGemini from "./ChatBotGemini";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export default function ChatButton() {
  const { chatBotMessages, setChatBotMessages, sendMessage } = useChatBotGemini();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current && isChatOpen) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatBotMessages, isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      setHasNewMessage(false);
    }
  }, [isChatOpen]);

  const handleSendMessage = async () => {
    if (!message.trim() || !sendMessage || isLoading) return;

    setIsLoading(true);

    try {
      setMessage("");
      await sendMessage(message);
    } catch (error) {
      console.error("Gemini AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-green-600 text-white rounded-full p-3 shadow-lg`}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
        {hasNewMessage && <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border border-white"></span>}
      </button>

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-green-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">AI-Powered Financial Intelligence</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-green-200 transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-gray-50" ref={chatContainerRef}>
            {chatBotMessages.map((chatMessage, index) => (
              <div
                key={index}
                className={`mb-3 flex ${chatMessage.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex max-w-[80%]">
                  {chatMessage.role === "model" && (
                    <div className="mr-2 mt-1">
                      <Avatar className="h-8 w-8 bg-green-200">
                        <AvatarImage src="/heropic.jpg" alt="AI-Powered Financial Intelligence" />
                        <AvatarFallback className="bg-green-200 text-green-700">AI</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div>
                    <div className={`rounded-lg p-2 ${chatMessage.role === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white border border-gray-200"
                      }`}>
                      <p className="text-sm">{chatMessage.text}</p>
                    </div>
                    {chatMessage.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(chatMessage.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="flex max-w-[80%]">
                  <div className="mr-2 mt-1">
                    <Avatar className="h-8 w-8 bg-green-200">
                      <AvatarImage src="/heropic.jpg" alt="AI-Powered Financial Intelligence" />
                      <AvatarFallback className="bg-green-200 text-green-700">AI</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="min-h-[40px] flex-1 resize-none mr-2 focus-visible:ring-green-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700 h-10 w-10 p-2 rounded"
                disabled={!message.trim() || isLoading}
                aria-label="Send message"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
