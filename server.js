// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Allows requests from Roblox
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Your OpenAI API key from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint to handle AI chat
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'No message provided' });
    }

    try {
        // Call OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // You can change to gpt-4 if you have access
                messages: [
                    { role: 'system', content: 'You are a friendly Roblox NPC AI named Friend, who can chat and respond to commands in Roblox.' },
                    { role: 'user', content: message }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        // Send reply back to Roblox
        res.json({ reply });
    } catch (err) {
        console.error('Error calling OpenAI API:', err.message);
        res.status(500).json({ error: 'AI request failed' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Roblox AI Proxy Server running on port ${PORT}`);
});
