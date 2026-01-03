const GEMINI_API_KEY = 'AIzaSyBy3T3Obr_mYll-gwpE0OKPi0X2qB-N0yI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function testGemini() {
    console.log("Testing Gemini API connection...");
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: "Hello, tell me a joke." }]
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("❌ API Failed:", response.status, JSON.stringify(error, null, 2));
        } else {
            const data = await response.json();
            console.log("✅ API Success!");
            if (data.candidates && data.candidates[0].content) {
                console.log("Response:", data.candidates[0].content.parts[0].text);
            } else {
                console.log("Response structure:", JSON.stringify(data, null, 2));
            }
        }
    } catch (error) {
        console.error("❌ Connection Error:", error);
    }
}

testGemini();
