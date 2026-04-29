import { GoogleGenAI } from '@google/genai';

// POST /api/chat
export const chatWithGemini = async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('Missing GEMINI_API_KEY');
            return res.status(500).json({ message: 'Lỗi cấu hình AI trên server.' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
        });

        const reply = response.text || 'Xin lỗi, mình không hiểu ý bạn.';
        res.json({ reply });

    } catch (error) {
        console.error('Gemini API error:', error);
        
        // Handle specific errors from SDK
        if (error.status === 429) {
            return res.status(429).json({ message: 'Server đang quá tải, bạn vui lòng đợi 1 chút rồi thử lại nhé!' });
        }
        res.status(500).json({ message: error.message || 'Lỗi khi gọi AI' });
    }
};
