const axios = require('axios');
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

if (!process.env.DISCORD_TOKEN || !process.env.CHANNEL_ID || !process.env.REPLICATE_API_TOKEN) {
    console.error('Missing required environment variables: DISCORD_TOKEN and/or CHANNEL_ID and/or REPLICATE_API_TOKEN');
    process.exit(1);
}

client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to login to Discord:', error.message);
    process.exit(1);
});

async function getPredictionResult(predictionId) {
    try {
        const response = await axios.get(
            `https://api.replicate.com/v1/predictions/${predictionId}`,
            {
                headers: {
                    'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to get prediction result:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get prediction result');
    }
}

const startWebhookServer = (port) => {
    const app = express();
    app.use(express.json());

app.post('/webhook', async (req, res) => {
    console.log('Received webhook:', req.body);

    const predictionId = req.body.id;
    const predictionResult = await getPredictionResult(predictionId);
    const channelId = process.env.CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        let resultMessage;
        if (predictionResult.status === 'succeeded') {
            resultMessage = `Prediction ID: ${predictionId}\nResult: ${predictionResult.output}`;
        } else {
            resultMessage = `Prediction ID: ${predictionId}\nStatus: ${predictionResult.status}`;
        }
        await channel.send(resultMessage).catch(error => {
            console.error('Failed to send message to channel:', error.message);
        });
    } else {
        console.error('Channel not found');
    }

    res.setHeader('Content-Type', 'application/json');
    res.sendStatus(200);
});


    app.get('/health', (req, res) => {
        console.debug('Received health probe');
        res.sendStatus(200);
    });

    app.get('/uptime', (req, res) => {
        console.debug('Received uptime probe');
        res.sendStatus(200);
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Unhandled Error:', err.message);
        res.status(500).send({ error: 'Server Error' });
    });

    app.listen(port, () => {
        console.log(`HTTP server listening at http://localhost:${port}`);
    });
};

client.once('ready', () => {
    console.log('Logged in as', client.user.tag);

    const port = process.env.PORT || 3000;
    startWebhookServer(port);
});

module.exports = {
    startWebhookServer,
};
