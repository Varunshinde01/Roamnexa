import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini if API key is present
let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `You are Roamnexa's Smart Travel Agent, an enthusiastic, creative, and highly knowledgeable travel concierge.
Your job is to help users plan itineraries, discover top attractions, suggest budget strategies, recommend local cuisines, and estimate flight/hotel rates.
Keep your tone friendly, professional, and visually engaging. Use emojis, clear headers, bullet points, and markdown tables where appropriate.
If the user asks to book something, guide them to use our dedicated Flight/Hotel search tabs above, or offer to draft a custom itinerary for them.`,
    });
    console.log('🤖 Google Gemini AI Initialized successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize Google Gemini AI:', err.message);
  }
} else {
  console.log('⚠️ GEMINI_API_KEY not found in environment. Running in Smart Fallback Mode.');
}

// Smart local fallback responses for presentation safety
const getFallbackResponse = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes('bali')) {
    return `### 🌴 3-Day Tropical Escape to Bali, Indonesia 🇮🇩

Here is a perfect, realistic travel plan crafted for you:

#### 📅 Day 1: Culture & Temples (Ubud)
*   **Morning**: Visit the sacred **Ubud Monkey Forest** and stroll through the lush greenery.
*   **Lunch**: Try traditional **Babi Guling** (suckling pig) or Nasi Campur at a local Ubud warung (approx. ₹350).
*   **Afternoon**: Explore the beautiful **Tegalalang Rice Terraces** and enjoy the iconic swing.
*   **Evening**: Watch a traditional **Kecak Fire Dance** performance at Ubud Temple.

#### 📅 Day 2: Beaches & Sunset (Uluwatu)
*   **Morning**: Head south to **Padang Padang Beach** for sunbathing and surfing.
*   **Lunch**: Enjoy fresh seafood at Jimbaran Bay (approx. ₹1,200).
*   **Afternoon**: Visit the clifftop **Uluwatu Temple** and take in the panoramic ocean views.
*   **Evening**: Dine at a cliffside lounge overlooking the Uluwatu surf break.

#### 📅 Day 3: Waterfalls & Sunset Club (Seminyak/Canggu)
*   **Morning**: Hike down to **Tegenungan Waterfall** for a refreshing dip.
*   **Lunch**: Relax at an organic café in Canggu (approx. ₹600).
*   **Afternoon**: Souvenir shopping at Seminyak Flea Market.
*   **Evening**: Catch a gorgeous sunset at **Potato Head Beach Club** with cocktails and music.

---
💡 *Note: This is a demo fallback itinerary. To enable live AI generation, please set a valid \`GEMINI_API_KEY\` in your \`backend/.env\` file.*`;
  }

  if (msg.includes('paris')) {
    return `### 🗼 3-Day Romantic Itinerary in Paris, France 🇫🇷

Welcome to the City of Lights! Here is your custom daily itinerary:

#### 📅 Day 1: Iconic Landmarks & Seine Cruise
*   **Morning**: Ascend the **Eiffel Tower** (recommend booking in advance; approx. €25) for stunning panoramic views.
*   **Lunch**: Grab a fresh baguette and pastries from a boulangerie near the Champ de Mars.
*   **Afternoon**: Walk along the Seine River to the historic **Arc de Triomphe** and stroll down the Champs-Élysées.
*   **Evening**: Take a romantic 1-hour **Seine River Cruise** at sunset to watch the monuments light up.

#### 📅 Day 2: Art, Culture & Cafes
*   **Morning**: Visit the world-famous **Louvre Museum** (don't miss the Mona Lisa and Venus de Milo).
*   **Lunch**: Enjoy a classic French meal at a Parisian bistro in the Latin Quarter (approx. €20).
*   **Afternoon**: Wander the charming cobblestone streets of **Montmartre** up to the Sacré-Cœur Basilica.
*   **Evening**: Sip coffee at the legendary Café de Flore where writers and artists used to gather.

#### 📅 Day 3: Royal Palace & Gardens
*   **Morning**: Take a short train ride to the magnificent **Palace of Versailles** and explore the Hall of Mirrors.
*   **Lunch**: Dine inside the Palace gardens at La Flottille.
*   **Afternoon**: Return to Paris and stroll through the beautiful **Jardin du Luxembourg**.
*   **Evening**: Enjoy a final dinner at a gourmet French restaurant in Le Marais.

---
💡 *Note: This is a demo fallback itinerary. To enable live AI generation, please set a valid \`GEMINI_API_KEY\` in your \`backend/.env\` file.*`;
  }

  if (msg.includes('goa')) {
    return `### 🏖️ 3-Day Sun & Sand Itinerary in Goa, India 🇮🇳

Here is an ideal balance of beaches, history, and nightlife:

| Day | Focus | Top Attractions & Activities | Est. Budget (per person) |
| :--- | :--- | :--- | :--- |
| **Day 1** | North Goa Vibe | Baga Beach, Calangute Beach, Water Sports (Parasailing), Sunset at Anjuna | ₹2,500 |
| **Day 2** | Heritage & History | Old Goa Churches (Basilica of Bom Jesus), Latin Quarter (Fontainhas), Mandovi River Cruise | ₹1,500 |
| **Day 3** | South Goa Serenity | Colva Beach, Palolem Beach (kayaking), Beachside candlelight dinner | ₹3,000 |

#### 🍽️ Must-Try Goa Cuisine:
- **Goan Fish Curry & Rice** (A staple coastal delicacy)
- **Pork/Chicken Vindaloo** (Spicy, tangy, Portuguese-influenced curry)
- **Bebinca** (A delicious multi-layered traditional dessert)

---
💡 *Note: This is a demo fallback itinerary. To enable live AI generation, please set a valid \`GEMINI_API_KEY\` in your \`backend/.env\` file.*`;
  }

  return `### Hello! I am your Roamnexa Smart Travel Agent 🤖✈️

I'm ready to help you plan your dream vacation, suggest attractions, and make travel recommendations!

**What you can ask me:**
1. 🗺️ *"Plan a 3-day trip to Bali/Paris/Goa"* (Interactive custom plans ready to go!)
2. 🍽️ *"What are the must-try local dishes in Tokyo?"*
3. 💼 *"Give me packing tips for a week-long trek in the Himalayas."*

---
⚠️ **Teacher Presentation Notice:**
I am currently operating in **Smart Fallback Mode** because no \`GEMINI_API_KEY\` is configured in the \`backend/.env\` file. 
To unlock my fully realistic live brain powered by **Google Gemini 1.5 Flash**, simply:
1. Open the \`backend/.env\` file.
2. Add your key: \`GEMINI_API_KEY=AIzaSy...\`
3. Restart the server!`;
};

// Main AI chat/planner endpoint
router.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message field is required.' });
  }

  console.log(`[AI Agent] Received request: "${message.substring(0, 60)}${message.length > 60 ? '...' : ''}"`);

  // If live Gemini client is configured
  if (model) {
    try {
      // Format history for Google Gemini API, ensuring the first message is always from 'user'
      let formattedHistory = [];
      if (history && history.length > 0) {
        const firstUserIdx = history.findIndex(h => h.role === 'user');
        if (firstUserIdx !== -1) {
          formattedHistory = history.slice(firstUserIdx).map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          }));
        }
      }

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message);
      const responseText = result.response.text();
      return res.json({ response: responseText, source: 'gemini-live' });
    } catch (err) {
      console.error('❌ Gemini API Error:', err.message);
      // Fall through to smart fallback if API call fails (e.g. rate limit, invalid key)
    }
  }

  // Fallback mode execution
  const fallbackResponse = getFallbackResponse(message);
  // Introduce a slight delay to mimic thinking time
  setTimeout(() => {
    res.json({ response: fallbackResponse, source: 'smart-fallback' });
  }, 1000);
});

export default router;
