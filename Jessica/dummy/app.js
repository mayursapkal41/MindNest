import { TalkingHead } from "talkinghead";

console.log("🔥 FIXED app.js – NO SSML, NO PROSODY 🔥");

window.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ app.js running");

  const avatarDiv = document.getElementById("avatar");
  const sendBtn = document.getElementById("sendBtn");
  const textInput = document.getElementById("textInput");

  /* ================================
     CREATE TALKING HEAD
     ================================ */
  const head = new TalkingHead(avatarDiv, {
    ttsEndpoint: "http://localhost:3000/gtts",
    lipsyncModules: ["en"],
    lipsyncType: "visemes",
  });

  /* ================================
     LOAD AVATAR (STABLE)
     ================================ */
  await head.showAvatar({
    url: "./avatars/avatar.glb",
    body: "F",
    avatarMood: "neutral",
    lipsyncLang: "en",
    ttsLang: "en-GB",
    ttsVoice: "en-GB-Neural2-F",
    view: "upper", // official half-body framing
  });

  console.log("✅ Avatar ready");

  /* ================================
     GEMINI CALL
     ================================ */
  async function talkToGemini(userText) {
    const res = await fetch("http://localhost:3000/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userText }),
    });

    const data = await res.json();
    return data.reply?.trim();
  }

  /* ================================
     SEND BUTTON
     ================================ */
  sendBtn.addEventListener("click", async () => {
    try {
      const userText = textInput.value.trim();
      if (!userText) return;

      textInput.value = "";

      // 🔑 unlock audio (required by browser)
      if (head.audioCtx && head.audioCtx.state !== "running") {
        await head.audioCtx.resume();
      }

      const reply = await talkToGemini(userText);
      if (!reply) return;

      console.log("🤖 Gemini reply:", reply);
      console.log("🔊 Speaking clean text");

      // ✅ IMPORTANT: PLAIN TEXT ONLY
      await head.speakText(reply);

    } catch (err) {
      console.error("❌ Speak error:", err);
    }
  });
});
