import { useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
    const [token, setToken] = useState('');
    const [conversationId, setConversationId] = useState('');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const getToken = async () => {
        const response = await axios.get('/api/token');
        setToken(response.data.token);
    };

    const startConversation = async () => {
        const response = await axios.post('/api/conversation', { token });
        setConversationId(response.data.conversationId);
    };

    const sendMessage = async () => {
        const response = await axios.post('/api/message', {
            token,
            conversationId,
            message: input
        });
        setMessages(response.data.activities);
    };

    return (
        <div>
            <button onClick={getToken}>Get Token</button>
            <button onClick={startConversation}>Start Conversation</button>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg['text']}</div>
                ))}
            </div>
        </div>
    );
};

export default ChatComponent;
