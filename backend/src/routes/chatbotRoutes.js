import express from 'express';
const router = express.Router();

// Optional REST endpoint for testing
router.get('/', (req, res) => res.json({ message: 'Chatbot API running...' }));

export default router;
