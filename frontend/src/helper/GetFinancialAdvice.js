import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getFinancialAdvice({
  age,
  annualIncome,
  monthlyExpense,
  savings,
  investmentHorizon,
  riskTolerance,
  financialGoal,
  preferredAssets = "",
  apiKey
}) {
  const riskProfile = assessRiskProfile({
    age,
    annualIncome,
    monthlyExpense,
    savings,
    riskTolerance
  });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a financial advisor AI. Based on the following user profile, provide personalized financial advice.
Keep it clear, concise, and aligned with the user's risk tolerance and financial goals.
Include a summary of their financial position and strategy for the goal. Add a note to consult a human financial advisor.

User Profile:
- Age: ${age}
- Annual Income: ₹${annualIncome}
- Monthly Expenses: ₹${monthlyExpense}
- Current Savings: ₹${savings}
- Investment Horizon: ${investmentHorizon} years
- Risk Tolerance: ${riskProfile}
- Financial Goal: ${financialGoal}
- Preferred Assets: ${preferredAssets}

Advice:
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return { success: true, advice: text, riskProfile };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function assessRiskProfile({ age, annualIncome, monthlyExpense, savings, riskTolerance }) {
  let score = 0;

  score += age < 30 ? 3 : age < 50 ? 2 : 1;

  const incomeMonthly = annualIncome / 12;
  const expenseRatio = incomeMonthly ? monthlyExpense / incomeMonthly : 1;
  score += expenseRatio < 0.5 ? 3 : expenseRatio < 0.75 ? 2 : 1;

  score += savings > annualIncome * 2 ? 3 : savings > annualIncome ? 2 : 1;

  const map = { low: 1, medium: 2, high: 3 };
  score += map[riskTolerance?.toLowerCase()] || 2;

  if (score >= 10) return "High";
  if (score >= 7) return "Medium";
  return "Low";
}
