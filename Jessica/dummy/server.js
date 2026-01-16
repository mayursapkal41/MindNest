import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ✅ IMPORTANT ORDER */
app.use(express.json());
app.use(express.text({ type: "text/*" }));

app.use(cors({ origin: "http://localhost:8000" }));

/* ======================================================
   GOOGLE CLOUD TTS (STABLE & CORRECT)
   ====================================================== */
app.post("/gtts", async (req, res) => {
  try {
    let ssml = "";

    console.log("\n==============================");
    console.log("📩 /gtts RAW BODY:");
    console.log(req.body);

    // Case 1: JSON body (TalkingHead)
    if (typeof req.body === "object" && req.body !== null) {
      if (req.body.input?.ssml) {
        ssml = req.body.input.ssml;
      } else if (req.body.input?.text) {
        ssml = `<speak>${req.body.input.text}</speak>`;
      }
    }

    // Case 2: Raw text
    else if (typeof req.body === "string") {
      const body = req.body.trim();

      if (body.startsWith("{")) {
        const parsed = JSON.parse(body);
        if (parsed.input?.ssml) {
          ssml = parsed.input.ssml;
        } else if (parsed.input?.text) {
          ssml = `<speak>${parsed.input.text}</speak>`;
        }
      } else {
        ssml = body.startsWith("<speak>")
          ? body
          : `<speak>${body}</speak>`;
      }
    }

    if (!ssml) {
      console.warn("⚠️ Empty SSML");
      return res.json({});
    }

    console.log("🎤 FINAL SSML SENT TO GOOGLE:");
    console.log(ssml);

    const ttsRes = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { ssml },
          voice: {
            name: "en-US-Neural2-F",
            languageCode: "en-US",
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        }),
      }
    );

    const data = await ttsRes.json();

    if (!ttsRes.ok) {
      console.error("❌ Google TTS error:", data);
      return res.status(500).json(data);
    }

    res.json({
      audioContent: data.audioContent,
      timepoints: [],
    });

  } catch (err) {
    console.error("🔥 TTS server error:", err);
    res.status(500).json({ error: "TTS failed" });
  }
});

/* ======================================================
   GEMINI 2.5 FLASH — NEW SINGLE-SENTENCE PROMPT
   ====================================================== */
app.post("/gemini", async (req, res) => {
  try {
    const userText = req.body.text;
    console.log("\n🧠 User input:", userText);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are a calm empathetic mental health companion

STRICT RULES YOU MUST FOLLOW
- Write ONLY ONE single long sentence
- Do NOT use full stops commas semicolons colons question marks or line breaks
- Do NOT split thoughts into multiple sentences
- Be polite gentle and supportive
- Acknowledge the users feelings
- Give a simple practical suggestion
- End the same sentence with a short motivational quote like as they win or learn

User message
"${userText}"
                  `.trim(),
                },
              ],
            },
          ],
        }),
      }
    );

    const raw = await geminiRes.json();
    console.log("📦 Gemini RAW:", JSON.stringify(raw, null, 2));

    const reply = raw?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.json({
        reply:
          "I am here with you and you are doing your best and remember as they win or learn",
      });
    }

    console.log("🤖 Gemini reply:", reply);
    res.json({ reply });

  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({
      reply:
        "I am here with you and things can feel lighter with time and remember as they win or learn",
    });
  }
});

/* ======================================================
   START SERVER
   ====================================================== */
app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
