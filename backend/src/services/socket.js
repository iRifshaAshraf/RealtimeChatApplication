
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { detectIntent } from "../controllers/chatbotController.js";

export function setupSocket(server) {
  // imported WebSocketServer constructor...
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");
    const sessionId = uuidv4();

    ws.on("message", async (messageRaw) => {
      try {
        const payload = JSON.parse(messageRaw);
        if (!payload.text) {
          ws.send(JSON.stringify({ error: "Missing text property" }));
          return;
        }

        // Send user message back --- replying/ texting to user
        ws.send(JSON.stringify({ role: "user", text: payload.text }));

        // Get bot reply  -- user message
        const replyText = await detectIntent(sessionId, payload.text);

        // Send bot reply  -- bot's message /reply
        ws.send(JSON.stringify({ role: "bot", text: replyText }));
      } catch (err) {
        console.error("WebSocket Error:", err);
        // Handle invalid JSON
        ws.send(
          JSON.stringify({
            error: "Server error occurred. Message must be valid JSON.",
          })
        );
      }
    });

    ws.on("close", () => console.log("Client disconnected"));
  });
}
