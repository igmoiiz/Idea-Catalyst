const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs").promises;
const path = require("path");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.prompts = {};
    this.promptsLoaded = false;
  }

  async loadPrompts() {
    if (this.promptsLoaded) return;

    const promptsDir = path.join(__dirname, "../system-prompts");
    try {
      const files = await fs.readdir(promptsDir);

      for (const file of files) {
        if (file.endsWith(".txt")) {
          const content = await fs.readFile(path.join(promptsDir, file), "utf-8");
          const key = file.replace(".txt", "");
          this.prompts[key] = content;
        }
      }
      this.promptsLoaded = true;
      console.log("System prompts loaded successfully");
    } catch (error) {
      console.error("Error loading system prompts:", error);
      throw error;
    }
  }

  async generatePersonaResponse(ideaContent, personaType) {
    if (!this.promptsLoaded) {
      await this.loadPrompts();
    }

    // Map personaType to file key
    const personaMapping = {
      "Market Analyst": "Analyst Persona",
      "Project Manager": "Project Manager Persona",
      "Investor": "Investor Simulation Module",
      "Team Builder": "Team Builder System",
      "Pitch Deck": "AI Pitch Deck Generator",
      // Mappings for Personas.tsx
      "VC": "Investor Simulation Module",
      "Customer": "Analyst Persona",
      "Skeptic": "Analyst Persona",
    };

    const promptKey = personaMapping[personaType] || personaType;
    const systemPrompt = this.prompts[promptKey];

    if (!systemPrompt) {
      console.warn(`System prompt for '${personaType}' (key: ${promptKey}) not found. Using fallback.`);
      return {
        content: this.getFallbackResponse(personaType, ideaContent),
        rating: Math.floor(Math.random() * 30) + 60
      };
    }

    const fullPrompt = `${systemPrompt}\n\nUser Idea:\n${ideaContent}\n\nPlease provide your analysis/response based on the above idea.`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        rating: this.extractRating(text) || 0
      };
    } catch (error) {
      console.error("Gemini generation error:", error.message);
      console.warn("Falling back to simulated response due to API error.");

      return {
        content: this.getFallbackResponse(personaType, ideaContent),
        rating: Math.floor(Math.random() * 30) + 60
      };
    }
  }

  getFallbackResponse(type, idea) {
    const templates = {
      "Market Analyst": "Based on current market trends, this idea addresses a significant gap. However, saturation in this sector is a risk. I recommend focusing on your unique value proposition to stand out. \n\n(Note: Live AI analysis unavailable, this is a simulation based on your input).",
      "Investor": "The financial viability looks promising, though customer acquisition costs need verification. The valuation seems reasonable for a pre-seed stage. I would be interested in seeing a more detailed pitch deck. \n\n(Note: Live AI analysis unavailable, this is a simulation based on your input).",
      "Project Manager": "Implementation roadmap seems feasible. I suggest an agile approach to MVP. Key milestones should include user validation within the first 3 months. \n\n(Note: Live AI analysis unavailable, this is a simulation based on your input).",
      "Team Builder": "You'll need a strong technical co-founder and a marketing lead. Building a diverse team will be crucial for execution. \n\n(Note: Live AI analysis unavailable, this is a simulation based on your input).",
      "VC": "As a Venture Capitalist, I look for scalability and a strong moat. This idea has potential, but I need to see a clearer path to $100M ARR. Focus on your unit economics and go-to-market strategy. \n\n(Note: Live AI analysis unavailable, this is a simulation).",
      "Customer": "I would definitely consider using this if the price point is accessible. It seems to solve a real problem for me. Make sure the user experience is intuitive. \n\n(Note: Live AI analysis unavailable, this is a simulation).",
      "Skeptic": "I'm not convinced. The market is crowded and existing solutions are 'good enough'. What makes you 10x better? You need a stronger differentiator to survive. \n\n(Note: Live AI analysis unavailable, this is a simulation).",
    };
    return templates[type] || "Analysis simulation: This concept has potential but requires further validation.";
  }

  extractRating(text) {
    // Simple regex to look for "Rating: X/100" or similar patterns
    // Adjust based on actual prompt output
    const match = text.match(/Rating:\s*(\d+)\/100/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  }
}

module.exports = new GeminiService();
