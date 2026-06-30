export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { prompt, model, maxTokens } = req.body;

        const groqResponse = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: maxTokens,
                    temperature: 0.75
                })
            }
        );

        const data = await groqResponse.json();

        return res.status(groqResponse.status).json(data);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}