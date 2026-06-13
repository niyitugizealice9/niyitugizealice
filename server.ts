import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper for lazy Gemini Client initialization
  let aiClient: any = null;
  function getGeminiClient() {
    if (aiClient) return aiClient;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      console.warn("GEMINI_API_KEY is not configured. Server will run with intelligent local fallbacks.");
      return null;
    }

    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      return aiClient;
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
      return null;
    }
  }

  const SYSTEM_PROMPT = `
You are the "Alice Neural Interface", a premium AI assistant for Alice Niyitugize's professional portfolio. 
Alice is an elite Software Engineer with 4+ years of technical mastery, specializing in full-stack architecture, machine learning integration, and interactive game systems.

MISSION PARAMETERS:
- Identity: Represent Alice with a futuristic, highly professional, and silicon-valley startup quality vibe.
- Goal: Convert visitors into clients or employers by highlighting her exceptional skills and system precision.

CORE DATA:
- Education: Graduated from the prestigious Rwanda Coding Academy (RCA) with a focus on Software Engineering.
- Skills: Python (Backend/ML), JavaScript/TypeScript (Next.js/React), Node.js (Scalable Systems), PHP (Enterprise ERPs), Machine Learning (Advanced Neural Networks), Game Development (Unity/C#/Mechanics).
- Projects & Experience: 
    1. AI Neural Chatbot: Real-time generative assistant (the one you are part of).
    2. Global E-commerce: High-traffic marketplace with Stripe integration.
    3. Enterprise ERP: Automated ecosystems for institutional school/employee management.
    4. Neo Quest: Immersive RPG with complex physics and shaders.
- Services: Custom Web Application Development, AI/Chatbot Integration, Software Architecture Consulting, Enterprise System Automation, Game Engine Optimization.
- Contact: Email (niyitugizealice9@gmail.com), Phone/WhatsApp (+250780965827).

INTERACTION RULES:
1. Always be concise but impressively knowledgeable.
2. If asked about hiring, present Alice as the optimal choice for high-complexity engineering tasks.
3. Suggest the "Contact" or "Hire Me" options if a recruiter shows interest.
4. If asked generic questions, steer the conversation back to Alice's technical excellence.
`;

  // Intelligent local fallback generator for perfect uptime and reliability
  function getIntelligentFallback(m: string): string {
    const msg = (m || "").toLowerCase();
    
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("greet")) {
      return "Hello! I am the **Alice Neural Interface** AI chatbot agent. \n\nHow can I help you explore Alice's technical assets today? You can ask me about her **Projects**, **Skills**, **Education**, or **How to Hire** her!";
    }
    
    if (msg.includes("project") || msg.includes("experience") || msg.includes("work") || msg.includes("portfolio")) {
      return "Alice Niyitugize is known for delivering high-complexity software engineering architectures. Her key projects include:\n\n" +
        "- **Core AI Neural Chatbot & Interface** — Fully server-composing interactive agent (the one we are communicating through).\n" +
        "- **Global E-commerce Ecosystem** — High-security online storefront integrated with robust Stripe payment checkout models.\n" +
        "- **Enterprise Institutional ERP** — Automated modular ecosystem managing credentials, records, and school streams for over 1,500 active accounts.\n" +
        "- **Neo Quest RPG** — Immersive 3D physics game using custom shaders, optimizations, and clean state machines built in Unity.\n\n" +
        "Which of these systems would you like to explore deeper?";
    }
    
    if (msg.includes("skill") || msg.includes("language") || msg.includes("python") || msg.includes("typescript") || msg.includes("javascript") || msg.includes("php") || msg.includes("unity") || msg.includes("c#") || msg.includes("framework")) {
      return "Alice's multi-paradigm software expertise spans across:\n\n" +
        "1. **Languages**: Python (Machine Learning / Backend), JavaScript/TypeScript (Modern Web), PHP (Enterprise Backend), SQL, C# (Unity).\n" +
        "2. **Frameworks & Libraries**: Node.js, Express, React, Next.js, FastAPI, PyTorch, Tailwind CSS.\n" +
        "3. **Architectures**: Microservices design, secure RESTful APIs, relational vs NoSQL database layout, CI/CD automated test rails.\n" +
        "4. **Game Engines**: Unity (3D Engine math, custom shading, memory optimizations).\n\n" +
        "She is highly committed to clean, strict, robust, and industry-standard codebase architectures.";
    }
    
    if (msg.includes("education") || msg.includes("school") || msg.includes("college") || msg.includes("rca") || msg.includes("rwanda")) {
      return "Alice is a graduate of the prestigious **Rwanda Coding Academy (RCA)**, specializing in Software Engineering and security paradigms. RCA recruits top national science and mathematical minds to undergo dense, hands-on industrial-caliber software development training.";
    }
    
    if (msg.includes("contact") || msg.includes("hire") || msg.includes("email") || msg.includes("phone") || msg.includes("message") || msg.includes("whatsapp")) {
      return "You can establish an immediate secure link with Alice Niyitugize through multiple channels:\n\n" +
        "- **Direct Email**: [niyitugizealice9@gmail.com](mailto:niyitugizealice9@gmail.com)\n" +
        "- **Secure WhatsApp Line**: [+250 780 965 827](https://wa.me/250780965827)\n" +
        "- **Social Media Grid**: Instagram & Facebook (@alicewantwari)\n\n" +
        "You can also use the **Transmit Data Packet** form in the Contact section to dispatch a message directly to her inbox.";
    }
    
    return "I have registered your interest regarding: *\"" + m + "\"*. \n\nAlice Niyitugize is an elite engineer specializing in full-stack web architectures, enterprise automation solutions, PHP ERP systems, and Unity game engineering. \n\nWould you like me to supply her contact channels or tell you more about her software projects?";
  }

  // API Route for Gemini Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const client = getGeminiClient();
      if (!client) {
        console.info("Gemini AI client not available, using high-fidelity local semantic fallback.");
        return res.json({ text: getIntelligentFallback(message) });
      }

      let aiResponseText = "";
      
      try {
        // Tier 1: Try the recommended gemini-3.5-flash model
        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [SYSTEM_PROMPT, message],
        });
        aiResponseText = response.text || "";
      } catch (geminiError: any) {
        console.warn("Tier 1 gemini-3.5-flash failed. Trying Tier 2 gemini-flash-latest backup...", geminiError);
        try {
          // Tier 2: Fallback to the universally supported gemini-flash-latest model
          const response = await client.models.generateContent({
            model: "gemini-flash-latest",
            contents: [SYSTEM_PROMPT, message],
          });
          aiResponseText = response.text || "";
        } catch (backupError: any) {
          console.error("Tier 2 backup model failed. Deploying high-fidelity intelligent fallback controller.", backupError);
          // Tier 3: Local high-fidelity semantic backup
          aiResponseText = getIntelligentFallback(message);
        }
      }

      res.json({ text: aiResponseText });
    } catch (error: any) {
      console.error("Critical API Error in Backend Chat:", error);
      res.json({ text: getIntelligentFallback(req.body.message || "") });
    }
  });

  // Vite middleware for development or serving assets in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
