import dialogflow from '@google-cloud/dialogflow';
import dotenv from 'dotenv';

dotenv.config();

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const sessionsClient = new dialogflow.SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

export async function detectIntent(sessionId, text, languageCode = 'en-US') {
  const sessionPath = sessionsClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode,
      },
    },
  };

  try {
    const responses = await sessionsClient.detectIntent(request);
    return responses[0].queryResult.fulfillmentText || 'Sorry, I didn’t understand.';
  } catch (err) {
    console.error('Dialogflow Error:', err);
    return 'Error communicating with Dialogflow';
  }
}
