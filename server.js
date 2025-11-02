const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).send({ error: 'No message provided' });

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const reply = response.data.choices[0].message.content;
        res.send({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'AI request failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI Proxy running on port ${PORT}`));
