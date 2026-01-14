
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('❌ Missing GEMINI_API_KEY environment variable.');
    process.exit(1);
}
const MODELS_TO_TEST = [
    'gemini-1.5-pro',
    'gemini-pro-latest',
    'gemini-2.5-pro'
];

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}...`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: "Hi" }] }]
            })
        });

        if (response.ok) {
            console.log(`✅ ${modelName} is WORKING via generateContent!`);
            return true;
        } else {
            const error = await response.json();
            if (response.status === 429) {
                console.log(`✅ ${modelName} is AVAILABLE (but rate limited for now).`);
                return true;
            }
            console.log(`❌ ${modelName} Failed: ${response.status} - ${error.error?.message || response.statusText}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Connection Error for ${modelName}:`, error.message);
        return false;
    }
}

async function runTests() {
    for (const model of MODELS_TO_TEST) {
        await testModel(model);
    }
}

runTests();
