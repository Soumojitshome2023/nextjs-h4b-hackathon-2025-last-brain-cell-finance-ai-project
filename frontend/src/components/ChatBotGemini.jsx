import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuth } from "@/helper/auth";

export default function useChatBotGemini() {
  const { LoggedInUserData, FirstLoader } = useAuth();
  const [chatBotMessages, setChatBotMessages] = useState([
    {
      role: "model",
      text: "Hello! How can I assist you today?",
      timestamp: new Date().toISOString()
    },
  ]);

  const apiKey = import.meta.env.VITE_GeminiAPI;

  if (!apiKey) {
    console.error("Gemini API key is missing. Please check your environment variables.");
    return {
      chatBotMessages,
      setChatBotMessages,
      sendMessage: async (message) => {
        // Fallback implementation when API key is missing
        return "I'm sorry, I can't connect to my services right now. Please check the API configuration.";
      }
    };
  }

  // Initialize GoogleGenerativeAI once
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
    You are FinanceAI Chatbot, you are a Finance expert AI designed to predict future market trends and price movements with high accuracy.
Perform the following tasks and return a detailed financial report with data-backed insights and expert-level reasoning:

USER CONTEXT:
- Name: ${LoggedInUserData?.name}
- Age: ${LoggedInUserData?.age}
- Annual Income: ₹${LoggedInUserData?.annualIncome.toLocaleString()}
- Focus: Medium-term (6-month outlook with quarterly checkpoints)

1. Market Overview

Analyze current market trends across major sectors: Technology, Energy, Finance, Healthcare, and Real Estate.

2. Sector Forecasts & Predictions

Predict Technology sector performance for the next 6 months.

Assess risk factors in Energy and Finance sectors with reasoning.

Provide a Healthcare sector outlook with key catalysts and regulatory developments.

Forecast the Real Estate market with actionable investment recommendations.

3. Investment Strategy

Suggest an investment strategy for current market conditions (June 2025).

Propose sector-wise actions: Buy, Hold, Sell with brief justification.

Research Guidelines:

Use at least 5 recent and authoritative sources (2024–2025), prioritizing expert reports, financial journals, and analyst opinions.

Identify and reference key stakeholders (governments, institutions, market leaders).

Highlight emerging patterns, trend correlations, and flag any conflicting viewpoints.

Report Format:

Title: Engaging financial headline

Tone: Professional and objective

Style: Structured like a financial report

Include relevant quotes, stats, and future implications

Ensure clarity in complex concepts for broad audience

Quality Requirements:

All data must be fact-checked and well-attributed

Ensure coherence, narrative flow, and clarity

Cross-check facts and highlight critical inter-sector dependencies

CONSTRAINTS:
- Maximize clarity and brevity (30–70 words per section)  
- Be confident but transparent — answer even when data is limited  
- Avoid generic advice — always anchor in user context  
- Combine fundamental, technical, and macroeconomic views  
- Recommend hedges where uncertainty or volatility exists

    `,

    generationConfig: {
      temperature: 0.1,
    },
  });

  async function sendMessage(userMessage) {
    // Filter out timestamps when sending to the API
    const chatHistory = chatBotMessages.map((message) => ({
      role: message.role,
      parts: [{ text: message.text }],
    }));

    try {

      setChatBotMessages((prev) => [
        ...prev,
        { role: "user", text: userMessage, timestamp: new Date().toISOString() },
      ]);

      const response = await model.generateContent({
        contents: [...chatHistory, { role: "user", parts: [{ text: userMessage }] }],
      });

      const botMessage = response.response.text();

      // Add timestamp to new messages
      setChatBotMessages((prev) => [
        ...prev,
        { role: "model", text: botMessage, timestamp: new Date().toISOString() },
      ]);

      return botMessage;
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return "I'm sorry, I'm having trouble connecting. Please try again later.";
    }
  }

  return { chatBotMessages, setChatBotMessages, sendMessage };
}
