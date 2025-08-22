"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIServiceClient = void 0;
// backend/src/services/aiClient.ts
class AIServiceClient {
    constructor() {
        this.baseURL = 'http://localhost:5001';
    }
    async analyzeContent(content) {
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
        }
        catch (error) {
            console.error('AI Service unavailable:', error);
            return null;
        }
    }
}
exports.AIServiceClient = AIServiceClient;
// backend/src/routes/ai.ts
const express_1 = require("express");
const aiClient_1 = require("../services/aiClient");
const router = (0, express_1.Router)();
const aiClient = new aiClient_1.AIServiceClient();
router.post('/analyze', async (req, res) => {
    const { content } = req.body;
    const analysis = await aiClient.analyzeContent(content);
    if (analysis) {
        res.json(analysis);
    }
    else {
        res.status(503).json({ error: 'AI Service unavailable' });
    }
});
exports.default = router;
//# sourceMappingURL=aiClients.js.map