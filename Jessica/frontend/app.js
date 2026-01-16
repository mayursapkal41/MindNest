import { TalkingHead } from "talkinghead";

console.log("🔥 FINAL app.js – SAFE moods + clear lipsync + emotion voice 🔥");

window.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ app.js running");

  const avatarDiv = document.getElementById("avatar");
  const sendBtn = document.getElementById("sendBtn");
  const textInput = document.getElementById("textInput");

  /* ================================
     CREATE TALKING HEAD
     ================================ */
  const head = new TalkingHead(avatarDiv, {
    ttsEndpoint: "https://jessica-backend-shcr.onrender.com/gtts",  // 🔥 FIXED URL
    lipsyncModules: ["en"],
    lipsyncType: "phonemes",
  });

  /* ================================
     LOAD AVATAR
     ================================ */
  await head.showAvatar({
    url: "./avatars/avatar.glb",
    body: "F",
    avatarMood: "neutral",
    lipsyncLang: "en",
    ttsLang: "en-US",
    ttsVoice: "en-US-Wavenet-F",
    view: "upper",
  });

  console.log("✅ Avatar ready");

  /* ================================
     SAFE MOODS
     ================================ */
  const SAFE_MOOD_BY_EMOTION = {
    stressed: "neutral",
    sad: "sad",
    happy: "happy",
    calm: "neutral",
    neutral: "neutral",
  };

  const VOICE_BY_EMOTION = {
    stressed: "en-US-Wavenet-C",
    sad: "en-US-Wavenet-E",
    happy: "en-US-Wavenet-D",
    calm: "en-US-Wavenet-F",
    neutral: "en-US-Wavenet-F",
  };

  function detectEmotion(text) {
    const t = text.toLowerCase();

    if (t.includes("depress") || t.includes("stress") || t.includes("overwhel") || t.includes("anxious"))
      return "stressed";

    if (t.includes("sad") || t.includes("lonely") || t.includes("hurt"))
      return "sad";

    if (t.includes("happy") || t.includes("excited") || t.includes("great"))
      return "happy";

    return "calm";
  }

  /* ================================
     GEMINI → CALL BACKEND API
     ================================ */
  async function talkToGemini(userText) {
    const res = await fetch("https://jessica-backend-shcr.onrender.com/gemini", {  // 🔥 FIXED URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userText }),
    });

    if (!res.ok) throw new Error("Gemini request failed");

    const data = await res.json();
    if (!data || typeof data.reply !== "string")
      throw new Error("Gemini reply missing");

    return data.reply.trim();
  }

  /* ================================
     SEND BUTTON
     ================================ */
  sendBtn.addEventListener("click", async () => {
    try {
      const userText = textInput.value.trim();
      if (!userText) return;

      console.log("🟢 User:", userText);
      textInput.value = "";

      if (head.audioCtx && head.audioCtx.state !== "running") {
        await head.audioCtx.resume();
        console.log("🔓 AudioContext resumed");
      }

      const reply = await talkToGemini(userText);
      console.log("🤖 Gemini reply:", reply);

      const emotion = detectEmotion(reply);
      const mood = SAFE_MOOD_BY_EMOTION[emotion] || "neutral";
      const voice = VOICE_BY_EMOTION[emotion] || "en-US-Wavenet-F";

      head.setMood(mood);
      head.ttsVoice = voice;

      await head.speakText(reply);

      head.setMood("neutral");

    } catch (err) {
      console.error("❌ Speak error:", err);
    }
  });
});
