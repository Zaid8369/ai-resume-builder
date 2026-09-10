const apiKey = import.meta.env.VITE_GROQ_API_KEY;
// llama-3.3-70b-versatile was deprecated by Groq (announced 17 Jun 2026) and fully
// decommissioned on 16 Aug 2026 - requests using it now fail with a
// "model_decommissioned" error. Using a currently supported model instead, and
// allowing it to be overridden via env var so future migrations don't need a code change.
const model = import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-120b";

export const AIChatSession = {
  sendMessage: async (prompt) => {
    if (!apiKey) {
      throw new Error(
        "Missing Groq API key. Set VITE_GROQ_API_KEY in your .env file (restart the dev server after adding it)."
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 1,
        top_p: 0.95,
        max_tokens: 8192,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Mimic the Gemini SDK's response shape so calling code (result.response.text()) needs no changes
    return {
      response: {
        text: () => content,
      },
    };
  },
};