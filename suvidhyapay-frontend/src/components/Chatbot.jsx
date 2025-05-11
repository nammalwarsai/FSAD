import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaTrash, FaCopy, FaRedo, FaRobot, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const mockResponses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What can I assist you with?",
    "Greetings! How may I help you?",
    "Hi! I'm your AI assistant. How can I make your day better?",
    "Hello! I'm here to help. What can I do for you?",
    "Welcome! I'm here to assist you with any questions.",
    "Hey there! How may I make your experience better today?",
    "Good to see you! What brings you here today?"
  ],
  farewell: [
    "Goodbye! Have a great day!",
    "See you later! Take care!",
    "Bye! Feel free to come back if you need help!",
    "Thanks for chatting! Have a wonderful day ahead!",
    "It was great helping you. Come back anytime!",
    "Wishing you a great day ahead. Goodbye!"
  ],
  payment: [
    "SuvidhaPay offers secure and instant payment solutions. Would you like to know more about our payment features?",
    "You can easily make payments using our platform. Need help with a specific payment feature?",
    "Our payment system supports UPI, cards, and bank transfers. What would you like to know?",
    "Want to learn about our latest payment security features?",
    "Looking to set up recurring payments? I can help with that!",
    "Need help with a failed transaction? Let me assist you."
  ],
  account: [
    "I can help you with account-related queries. What specific information do you need?",
    "Your account security is our priority. How can I assist you with your account?",
    "Need help managing your account settings or preferences?",
    "Want to enable two-factor authentication for better security?",
    "I can help you update your account information.",
    "Need help with account verification? I'm here to guide you."
  ],
  technical: [
    "Running into technical issues? Let me help troubleshoot.",
    "I can guide you through our platform's technical features.",
    "Need help with platform integration? I'm here to assist.",
    "Let's solve your technical concerns together."
  ],
  features: [
    "Would you like to explore our premium features?",
    "I can show you how to make the most of our platform.",
    "Discover our latest platform updates and improvements.",
    "Let me tell you about our most popular features."
  ],
  support: [
    "How can I assist you with customer support today?",
    "Having issues? I'm here to help resolve them.",
    "Need specialized support? I can connect you with the right team.",
    "Let's work together to address your concerns."
  ],
  feedback: [
    "We value your feedback! What would you like to share?",
    "How can we improve our services for you?",
    "Your opinion matters to us. What do you think about our service?"
  ],
  pricing: [
    "I can help you understand our pricing plans.",
    "Looking for the best plan for your needs? Let me assist.",
    "Want to know about our special offers and discounts?"
  ],
  security: [
    "Your security is our top priority. How can I assist you with security concerns?",
    "Need help with setting up two-factor authentication?",
    "Want to learn more about our encryption methods?",
    "I can guide you through our security features."
  ],
  card: [
    "Need help with your credit or debit card?",
    "I can assist you with card activation, blocking, or replacement.",
    "Want to know about your card's benefits and rewards?",
    "Need help with a disputed transaction on your card?"
  ],
  loan: [
    "I can help you with loan-related queries.",
    "Need information on loan eligibility or interest rates?",
    "Want to apply for a personal or home loan?",
    "I can guide you through the loan application process."
  ],
  investment: [
    "Looking to invest? I can help you with investment options.",
    "Need information on mutual funds or fixed deposits?",
    "Want to know about our investment advisory services?",
    "I can guide you through our investment products."
  ],
  default: [
    "I understand. Could you please provide more details so I can better assist you?",
    "I'm here to help. Can you elaborate on your question?",
    "Let me help you with that. What specific information are you looking for?",
    "I'm here to help. Could you be more specific?",
    "Let me know more details so I can assist better.",
    "I want to help! Can you provide more information?"
  ]
};

const findBestResponse = (input) => {
  const text = input.toLowerCase();
  
  // Check for greetings
  if (text.match(/\b(hi|hello|hey|greetings|hii+)\b/))
    return mockResponses.greeting[Math.floor(Math.random() * mockResponses.greeting.length)];
  
  // Check for farewell
  if (text.match(/\b(bye|goodbye|see you|farewell)\b/))
    return mockResponses.farewell[Math.floor(Math.random() * mockResponses.farewell.length)];
  
  // Check for payment related queries
  if (text.match(/\b(payment|pay|transfer|money|transaction)\b/))
    return mockResponses.payment[Math.floor(Math.random() * mockResponses.payment.length)];
  
  // Check for account related queries
  if (text.match(/\b(account|profile|settings|password|login)\b/))
    return mockResponses.account[Math.floor(Math.random() * mockResponses.account.length)];
  
  // Check for technical issues
  if (text.match(/\b(technical|bug|issue|error|problem)\b/))
    return mockResponses.technical[Math.floor(Math.random() * mockResponses.technical.length)];
  
  // Check for features
  if (text.match(/\b(feature|functionality|capability|tool)\b/))
    return mockResponses.features[Math.floor(Math.random() * mockResponses.features.length)];
  
  // Check for support
  if (text.match(/\b(support|help|assist|guidance)\b/))
    return mockResponses.support[Math.floor(Math.random() * mockResponses.support.length)];
  
  // Check for feedback
  if (text.match(/\b(feedback|suggest|improve|opinion)\b/))
    return mockResponses.feedback[Math.floor(Math.random() * mockResponses.feedback.length)];
  
  // Check for pricing
  if (text.match(/\b(price|cost|plan|subscription|package)\b/))
    return mockResponses.pricing[Math.floor(Math.random() * mockResponses.pricing.length)];
  
  // Check for security
  if (text.match(/\b(security|secure|encryption|authentication)\b/))
    return mockResponses.security[Math.floor(Math.random() * mockResponses.security.length)];
  
  // Check for card related queries
  if (text.match(/\b(card|credit|debit|activation|block)\b/))
    return mockResponses.card[Math.floor(Math.random() * mockResponses.card.length)];
  
  // Check for loan related queries
  if (text.match(/\b(loan|eligibility|interest|apply)\b/))
    return mockResponses.loan[Math.floor(Math.random() * mockResponses.loan.length)];
  
  // Check for investment related queries
  if (text.match(/\b(invest|investment|mutual fund|fixed deposit)\b/))
    return mockResponses.investment[Math.floor(Math.random() * mockResponses.investment.length)];
  
  // Default response
  return mockResponses.default[Math.floor(Math.random() * mockResponses.default.length)];
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      user: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    simulateResponse();
  };

  const simulateResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = {
        text: "I'm your AI assistant. I'm here to help!",
        user: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleRetry = () => {
    setError(null);
    simulateResponse();
  };

  const formatMessage = (text) => {
    // Handle code blocks and syntax highlighting here
    return text;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaRobot className="text-2xl text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
                <p className="text-sm text-gray-500">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.user ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%]`}>
                  {!message.user && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <FaRobot className="text-white text-sm" />
                    </div>
                  )}
                  <div className={`flex flex-col ${message.user ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.user
                        ? "bg-blue-600 text-white"
                        : "bg-white shadow-sm border"
                    }`}>
                      <div className="prose max-w-none">
                        {formatMessage(message.text)}
                      </div>
                    </div>
                    <div className="flex items-center mt-2 space-x-2 text-xs text-gray-500">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {!message.user && (
                        <button
                          onClick={() => copyToClipboard(message.text)}
                          className="hover:text-blue-600 transition-colors"
                          title="Copy message"
                        >
                          <FaCopy size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  {message.user && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="text-gray-600 text-sm" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <FaRobot className="text-white text-sm" />
              </div>
              <div className="bg-white rounded-full px-4 py-2 shadow-sm border">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-600">
                <span className="mr-2">{error.message}</span>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center text-sm hover:text-red-700"
                >
                  <FaRedo className="mr-1" /> Retry
                </button>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FaPaperPlane />
              </button>
              <button
                onClick={() => setMessages([])}
                className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;