const pool = require("../config/db");
const { saveMessage, getMessages } = require("../models/therapistModel");
const OpenAI = require("openai").default;


const therapistChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // 🔥 Get couple_id from DB (IMPORTANT)
    const userResult = await pool.query(
      "SELECT couple_id FROM users WHERE id = $1",
      [userId]
    );

    const coupleId = userResult.rows[0]?.couple_id || null;

    // Save user message
    await saveMessage(coupleId, userId, "user", message);

    // Get previous messages (context)
    const history = await getMessages(coupleId, userId);

    // 🧠 SYSTEM PROMPT (your rules)
    const systemPrompt = {
      role: "system",
      content: `
You are a neutral relationship therapist.

Rules:
- Do NOT take sides early
- Do NOT assume intent
- Ask clarifying questions if context is missing
- Encourage both partners to share their perspective
- If only one side is speaking, explicitly say more context is needed
- Only give conclusions after hearing both sides
- Be calm, empathetic, and concise
      `,
    };


    // Limit history to last 15 messages (prevent token overflow)
    const limitedHistory = history.slice(-15);

    // Convert DB messages → OpenAI format
    const finalMessages = [
      systemPrompt,
      ...limitedHistory.map(m => ({
        role: m.role,
        content: m.message,
      })),
    ];

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const aiResponse = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: finalMessages,
    });

    const reply = aiResponse.choices[0].message.content;

    // Save AI response
    await saveMessage(coupleId, userId, "assistant", reply);

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Therapist failed" });
  }
};

const getTherapistHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      "SELECT couple_id FROM users WHERE id = $1",
      [userId]
    );

    const coupleId = userResult.rows[0]?.couple_id || null;

    const messages = await getMessages(coupleId, userId);

    res.json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

module.exports = { therapistChat, getTherapistHistory };