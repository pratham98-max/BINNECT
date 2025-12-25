const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function for exponential backoff
const wait = (ms) => new Promise(res => setTimeout(res, ms));

async function generateWithRetry(model, prompt, maxRetries = 3) {
  let delay = 2000; // Start with a 2-second delay
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      // Check if the error is a 429 (Rate Limit)
      if (error.status === 429 && i < maxRetries - 1) {
        console.log(`Rate limit hit. Retrying in ${delay/1000}s... (Attempt ${i+1}/${maxRetries})`);
        await wait(delay);
        delay *= 2; // Double the wait time for the next retry
        continue;
      }
      throw error; // If not a 429 or max retries reached, throw the error
    }
  }
}

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: "You are the Binnect AI Assistant. Keep it professional and helpful."
    });

    const result = await generateWithRetry(model, message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(error.status || 500).json({ 
      error: error.status === 429 ? "System is busy. Please try again in a minute." : "AI failed to respond." 
    });
  }
});

module.exports = router;