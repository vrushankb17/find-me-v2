import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import API_BASE_URL from '../config/constants';
import './ChatBot.css';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const quickQuestions = [
        { label: '🚑 Emergency', text: 'Emergency help' },
        { label: '🏥 Hospital', text: 'Where is the hospital?' },
        { label: '☀️ Heat Stroke', text: 'I feel dizzy (Heat Stroke)' },
        { label: '📋 Register', text: 'How to register?' },
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            if (messages.length === 0) {
                addBotMessage('Namaste! 🙏 Welcome to Find-Me. I\'m here to help with medical information and guidance. How can I assist you today?');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const addBotMessage = (text) => {
        const botMessage = {
            id: Date.now().toString() + '-bot',
            text,
            sender: 'bot',
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
    };

    const handleSend = async (text) => {
        const messageText = text || inputText;
        if (!messageText.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString() + '-user',
            text: messageText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    history: messages.slice(-10).map((m) => ({
                        role: m.sender === 'user' ? 'user' : 'assistant',
                        content: m.text,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            addBotMessage(data.response);
        } catch (error) {
            console.error('Chatbot error:', error);
            addBotMessage('Sorry, I\'m having trouble responding. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="chatbot-fab"
                    aria-label="Open medical chatbot"
                >
                    <MessageCircle className="fab-icon" />
                    <span className="fab-indicator"></span>
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="header-info">
                            <div className="bot-avatar-wrapper">
                                <Bot className="bot-avatar-icon" />
                            </div>
                            <div>
                                <h3 className="bot-title">Medical Assistant</h3>
                                <p className="bot-status">Online • Here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="close-btn"
                            aria-label="Close chat"
                        >
                            <X className="close-icon" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="messages-container">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message-row ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.sender === 'bot' && (
                                    <div className="avatar bot-avatar">
                                        <Bot size={20} />
                                    </div>
                                )}
                                <div className={`message-bubble ${message.sender}`}>
                                    <p className="message-text">{message.text}</p>
                                    <p className="message-time">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                {message.sender === 'user' && (
                                    <div className="avatar user-avatar">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="message-row justify-start">
                                <div className="avatar bot-avatar">
                                    <Bot size={20} />
                                </div>
                                <div className="message-bubble bot typing">
                                    <Loader2 className="spinner" size={16} />
                                    <span>Typing...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    {(
                        <div className="suggestions-container">
                            {quickQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q.text)}
                                    className="suggestion-chip"
                                >
                                    {q.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="input-area">
                        <div className="input-wrapper">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="chat-input"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!inputText.trim() || isLoading}
                                className="send-btn"
                                aria-label="Send message"
                            >
                                {isLoading ? <Loader2 className="spinner" size={20} /> : <Send size={20} />}
                            </button>
                        </div>
                        <p className="disclaimer">
                            AI Assistant • Call 108 for emergencies
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
