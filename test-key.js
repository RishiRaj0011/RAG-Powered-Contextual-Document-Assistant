import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// Wahi key jo aapne naye "RAG Project" se li hai
const apiKey = "AIzaSyAfrtrPYnJ3mO3Y-rYMb8FtAbotcOKC-WQ"; 

async function startTest() {
    console.log("--- Testing with Gemini 2.0 Flash ---");
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Model badal kar 2.0 kar diya
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent("Say '2.0 is working'");
        console.log("------------------------------");
        console.log("✅ RESULT:", result.response.text());
        console.log("------------------------------");
    } catch (error) {
        console.log("------------------------------");
        console.error("❌ ERROR AA GAYA:");
        console.error("Message:", error.message);
        
        // Agar yahan 429 aata hai, toh matlab key exhausted hai
        if (error.message.includes("429")) {
            console.log("\nPOINT TO NOTE: Model sahi hai, par aapki limit 0 hai.");
        }
        console.log("------------------------------");
    }
}

startTest();