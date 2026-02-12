
// POST /api/chat
export const chatWithGemini = async (req, res) => {
    try {
        const { message } = req.body;
        // Hardcoded key for testing (Correct Key from User)
        const apiKey = 'AIzaSyDYwWFkgKvn01an4gEppzAEI3CuA0aakhQ';

        console.log('Using Gemini Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');

        // Use v1 API (stable)
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API error:', JSON.stringify(data));
            // Handle specific errors
            if (response.status === 429) {
                return res.status(429).json({ message: 'Server đang quá tải, bạn vui lòng đợi 1 chút rồi thử lại nhé!' });
            }
            return res.status(response.status).json({ message: data.error?.message || 'Lỗi khi gọi AI' });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, mình không hiểu ý bạn.';
        res.json({ reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
