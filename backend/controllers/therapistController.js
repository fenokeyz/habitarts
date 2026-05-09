const pool = require("../config/db");
const { saveMessage, getMessages } = require("../models/therapistModel");
const OpenAI = require("openai").default;
const { getIO } = require("../socket");

const therapistChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // 🔥 Get couple_id from DB (IMPORTANT)
    const userResult = await pool.query(
      "SELECT couple_id, name FROM users WHERE id = $1",
      [userId]
    );

    const coupleId = userResult.rows[0]?.couple_id || null;

    // Save user message
    await saveMessage(coupleId, userId, "user", message);

    getIO().to(`couple_${coupleId || userId}`).emit(
      "new_message",
      {
        role: "user",
        message,
        user_id: userId,
        name: userResult.rows[0]?.name || "User",
      }
    );

    // Get previous messages (context)
    const history = await getMessages(coupleId, userId);

    // 🧠 SYSTEM PROMPT (your rules)
    const systemPrompt = {
      role: "system",
      content: `
    You are a calm, neutral relationship therapist.

    STRICT RULES:
    - Do NOT take sides.
    - Do NOT assume intentions.
    - If only one person is speaking, explicitly say that you need the partner’s perspective.
    - Ask clarifying questions before giving advice.
    - Encourage both partners to express feelings calmly.
    - Do NOT give conclusions unless both perspectives are clearly presented.
    - If conflict appears one-sided, say that more context is needed.

    STYLE:
    - Warm, empathetic, concise
    - No long paragraphs
    - No moral lecturing
    - Focus on communication, not blame
    `,
    };

    const uniqueUsers = new Set(history.map(m => m.user_id));

    let contextHint = "";

    if (coupleId && uniqueUsers.size < 2) {
      contextHint = `
    Note: Only one partner has spoken so far.
    Encourage hearing the other partner before forming conclusions.
    `;
    }

    // 🔹 Build participant identity context
    const participantsMap = new Map();

    history
      .filter(m => m.role === "user")
      .forEach(m => {
        if (!participantsMap.has(m.user_id)) {
          participantsMap.set(m.user_id, m.name || "User");
        }
      });

    const participants = Array.from(participantsMap.values());

    const identityPrompt = {
      role: "system",
      content: `
      Participants in this conversation:
      ${participants.map((name, i) => `${i + 1}. ${name}`).join("\n")}

      Each message will be prefixed with the speaker's name in this format:
      [User: Name]

      You MUST:
      - Track who is speaking based on this prefix
      - Never guess identities
      - If unsure, explicitly ask for clarification
      `,
    };

    // Limit history to last 15 messages (prevent token overflow)
    const limitedHistory = history.slice(-15);

    // Convert DB messages → OpenAI format
    const finalMessages = [
      systemPrompt,
      identityPrompt,
      { role: "system", content: contextHint },
        ...limitedHistory.map(m => ({
          role: m.role,
          content:
            m.role === "assistant"
              ? m.message
              : `[User: ${m.name || "User"}] ${m.message}`,
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

    getIO().to(`couple_${coupleId || userId}`).emit(
      "new_message",
      {
        role: "assistant",
        message: reply,
      }
    );

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