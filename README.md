# Real-Time Chat Application using Dialogflow ES, WebSocket, and Next.js

This project is a **real-time AI chat application** that integrates **Dialogflow ES** with a **Node.js (Express + WebSocket)** backend and a **Next.js (TypeScript)** frontend interface. The app allows users to chat with an intelligent assistant that responds dynamically in real time through a WebSocket connection.

---

## Project Overview

### Architecture Diagram

Frontend (Next.js)  <---- WebSocket ---->  Node.js Backend  <---->  Dialogflow ES <br/>
-------- | --------------------------------------------- | ---------------------------- <br/>
-- User Interface -------------------------------AI Intent Detection <br/>

---

## Project Components

### 1. **Frontend (Next.js 16 + TypeScript)**
- Built using the latest Next.js (v16) App Router structure.
- Provides a modern and responsive chat UI.
- Communicates with backend via **WebSocket** and REST API.
- Manages messages, user input, and real-time AI responses.

### 2. **Backend (Node.js + Express + WebSocket)**
- Handles WebSocket connections for real-time message exchange.
- Sends user messages to **Dialogflow ES** via the Fulfillment Webhook.
- Broadcasts assistant responses back to the frontend instantly.

### 3. **Dialogflow ES**
- Handles intent detection and natural language processing.
- Returns structured responses (text, actions, or fulfillment messages) to the backend.

---

## Features

- Real-time chat with Dialogflow AI  
- WebSocket-based two-way communication  
- REST API fallback for message handling  
- Auto-scroll and message timestamps  
- Elegant chat UI (responsive and mobile friendly)  
- Error handling for API, WebSocket, and network issues  

---

## ⚙️ Setup Instructions

### **1. Clone the Repository**
```bash
git clone [https://github.com/iRIfsha/realtime-chat-app.git](https://github.com/iRifshaAshraf/RealtimeChatApplication.git)
cd realtime-chat-app
```

### **2. Setup Backend**
```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
GOOGLE_PROJECT_ID=your-dialogflow-project-id
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY="your-private-key"
```

Run the backend:
```bash
node server.js
```
> Server will start at **http://localhost:5000**

### **3. Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
```
 Frontend runs at **http://localhost:3000**

---

## Communication Flow

1. User sends a message from the chat UI.  
2. Frontend sends this message via WebSocket to the Node.js server.  
3. Server forwards it to Dialogflow ES.  
4. Dialogflow processes and sends a response.  
5. Server relays the response back to frontend in real-time.  
6. UI displays the assistant message smoothly.

---

## Error Handling

- WebSocket connection errors handled via try-catch.  
- Dialogflow API errors validated before sending response.  
- Frontend errors displayed gracefully in chat bubbles.

---


## Author

**Rifsha Ashraf**  
Frontend Developer | Next.js | React.js | Developer <br/>
Email: rifsha.ashraf1@gmail.com <br/>
Porfolio: https://irifshaashraf.github.io/rifshaashraf/

---
