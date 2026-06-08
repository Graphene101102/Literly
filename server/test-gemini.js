import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const models = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-flash-latest',
        'gemini-pro-latest'
    ];
    for (const m of models) {
        try {
            const response = await ai.models.generateContent({
                model: m,
                contents: 'Hi',
            });
            console.log("SUCCESS for", m, ":", response.text);
            return;
        } catch (e) {
            console.error("FAIL for", m, ":", e.status);
        }
    }
}
test();
