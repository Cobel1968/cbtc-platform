// backend/src/services/aiClient.ts
export class AIServiceClient {
  private baseURL = 'http://localhost:5001';
  
  async analyzeContent(content: string) {
    try {
      const response = await fetch(`${this.baseURL}/analyze-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        throw new Error(`AI Service error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI Service unavailable:', error);
      return null;
    }
  }
}

// backend/src/routes/ai.ts
import { Router } from 'express';
import { AIServiceClient } from '../services/aiClient';

const router = Router();
const aiClient = new AIServiceClient();

router.post('/analyze', async (req, res) => {
  const { content } = req.body;
  const analysis = await aiClient.analyzeContent(content);
  
  if (analysis) {
    res.json(analysis);
  } else {
    res.status(503).json({ error: 'AI Service unavailable' });
  }
});

export default router;
