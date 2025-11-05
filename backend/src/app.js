import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import { detectIntent } from "./controllers/chatbotController.js";

dotenv.config(); //it's a library

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));  // easily access to backend
app.use(express.json());   //parses JSON requests automatically

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend server is running!',
    endpoints: {
      health: '/health',
      chat: '/api/chat/message',
      chatHealth: '/api/chat/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Chat health check
app.get('/api/chat/health', (req, res) => {
  console.log('Chat health check called');
  res.json({ status: 'ok', message: 'Chat API is running' });
});

// Chat message endpoint
app.post('/api/chat/message', async (req, res) => {
  try {
    console.log('Message received');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { contents } = req.body;

    if (!contents || !Array.isArray(contents)) {
      console.log('Invalid request format');
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // Get the latest user message (run time msgs)
    const lastMessage = contents[contents.length - 1];
    const userMessage = lastMessage.parts[0].text;

    console.log(`User: "${userMessage}"`);

    // Generate session ID
    const sessionId = req.headers['x-session-id'] || 'default-session';

    // Get Dialogflow response
    const reply = await detectIntent(sessionId, userMessage);

    console.log(`Reply: "${reply}"`);
    res.json({ reply });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Route not found',
    requestedUrl: req.url,
    method: req.method
  });
});

// Create server
const server = createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('SERVER STARTED SUCCESSFULLY');
  console.log('='.repeat(60));
  console.log(`Server: http://localhost:${PORT}`);
});