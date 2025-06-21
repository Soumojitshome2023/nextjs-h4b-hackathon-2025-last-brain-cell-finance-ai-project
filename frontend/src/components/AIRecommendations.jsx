import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/helper/auth";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getFinancialAdvice } from "../helper/GetFinancialAdvice";
import { Bot, Loader2, AlertCircle, TrendingUp, Shield, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const recommendationTypes = [
  { key: "investment", label: "Investment Plan", hint: "Build long-term wealth using diversified assets." },
  { key: "tax", label: "Tax Saving", hint: "Explore tax benefits via PPF, ELSS, etc." },
  { key: "retirement", label: "Retirement Plan", hint: "Plan for retirement by age 60 with monthly targets." },
  { key: "budgeting", label: "Monthly Budgeting", hint: "Save more by cutting unnecessary expenses." },
];

export default function AIRecommendations() {
  const { LoggedInUserData } = useAuth();
  const [recommendationType, setRecommendationType] = useState("investment");
  const [error, setError] = useState("");

  const [monthlyExpense, setMonthlyExpense] = useState("");
  const [savings, setSavings] = useState("");
  const [investmentHorizon, setInvestmentHorizon] = useState("");
  const [financialGoal, setFinancialGoal] = useState("");
  const [preferredAssets, setPreferredAssets] = useState("");
  const [riskTolerance, setriskTolerance] = useState("");

  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiGenerating, setAiGenerating] = useState(false);

  const promptMap = {
    investment: `Give very short investment advice with 3–4 Indian asset types.`,
    tax: `Give short tax-saving tips using Indian tax options like ELSS, PPF, 80C.`,
    retirement: `Give short retirement planning advice for India by age 60.`,
    budgeting: `Give short monthly budget tips to save more.`,
  };

  const emergencyFund = LoggedInUserData?.annualIncome * 6 || 0;
  const recommendations = [
    {
      type: "Emergency Fund",
      description: `Build an emergency fund of ₹${emergencyFund.toLocaleString()} (6 months of salary)`,
      allocation: "20% of income",
      risk: "Low",
      icon: Shield,
      color: "bg-green-500",
      priority: "High"
    },
    {
      type: "Fixed Deposit",
      description: `Invest ₹${(LoggedInUserData?.annualIncome * 0.3 || 0).toLocaleString()} monthly in FDs for guaranteed returns`,
      allocation: "30% of income",
      risk: "Very Low",
      icon: Shield,
      color: "bg-blue-500",
      priority: "High"
    },
    {
      type: "PPF",
      description: `Invest ₹${Math.min(LoggedInUserData?.annualIncome * 0.2 || 0, 12500).toLocaleString()} monthly in PPF for tax benefits`,
      allocation: "20% of income",
      risk: "Low",
      icon: TrendingUp,
      color: "bg-indigo-500",
      priority: "Medium"
    },
    {
      type: "SIP in Mutual Funds",
      description: `Start SIP of ₹${(LoggedInUserData?.annualIncome * 0.25 || 0).toLocaleString()} in diversified equity funds`,
      allocation: "25% of income",
      risk: "Medium",
      icon: TrendingUp,
      color: "bg-purple-500",
      priority: "High"
    },
    {
      type: "ELSS",
      description: `Invest ₹${Math.min(LoggedInUserData?.annualIncome * 0.15 || 0, 12500).toLocaleString()} in ELSS for tax savings`,
      allocation: "15% of income",
      risk: "Medium",
      icon: Zap,
      color: "bg-orange-500",
      priority: "Medium"
    },
    {
      type: "Direct Equity",
      description: `Allocate ₹${(LoggedInUserData?.annualIncome * 0.3 || 0).toLocaleString()} for direct stock investments`,
      allocation: "30% of income",
      risk: "High",
      icon: Zap,
      color: "bg-red-500",
      priority: "High"
    },
    {
      type: "Growth Mutual Funds",
      description: `Invest ₹${(LoggedInUserData?.annualIncome * 0.2 || 0).toLocaleString()} in small & mid-cap funds`,
      allocation: "20% of income",
      risk: "High",
      icon: TrendingUp,
      color: "bg-pink-500",
      priority: "Medium"
    }
  ];

  const fetchAllAICards = async () => {
    if (!LoggedInUserData) return;
    setAiGenerating(true);
    const results = [];
    for (const rec of recommendations) {
      const result = await getFinancialAdvice({
        age: LoggedInUserData.age,
        annualIncome: LoggedInUserData.annualIncome,
        riskTolerance,
        monthlyExpense: parseInt(monthlyExpense) || 0,
        savings: parseInt(savings) || 0,
        investmentHorizon: parseInt(investmentHorizon) || 0,
        financialGoal: rec.type,
        preferredAssets: preferredAssets || "Mutual Funds, FD",
        apiKey: import.meta.env.VITE_GeminiAPI,
        customPrompt: `Give short actionable financial advice in India for ${rec.type} with ₹${LoggedInUserData.annualIncome.toLocaleString()} annual income and ${riskTolerance} risk.`
      });
      results.push({
        ...rec,
        aiAdvice: result.ok ? result.advice : `❌ ${result.error || "Error generating advice"}`
      });
    }
    setAiRecommendations(results);
    setAiGenerating(false);
  };

  if (!LoggedInUserData) {
    return (
      <Card className="animate-slide-up glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Complete your profile to receive personalized financial insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">Update age, income, expenses, etc. to unlock advice.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Recommendations
        </CardTitle>
        <CardDescription>
          Income: ₹{LoggedInUserData.annualIncome.toLocaleString()} • Risk: {riskTolerance || "Not selected"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {recommendationTypes.map((type) => (
            <Button
              key={type.key}
              variant={recommendationType === type.key ? "default" : "outline"}
              onClick={() => setRecommendationType(type.key)}
              className="text-sm py-2"
            >
              {type.label}
            </Button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground italic">
          {recommendationTypes.find(t => t.key === recommendationType)?.hint}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input type="number" placeholder="Monthly Expenses (₹)" value={monthlyExpense} onChange={(e) => setMonthlyExpense(e.target.value)} />
          <Input type="number" placeholder="Total Current Savings (₹)" value={savings} onChange={(e) => setSavings(e.target.value)} />
          <Input type="number" placeholder="Investment Horizon (years)" value={investmentHorizon} onChange={(e) => setInvestmentHorizon(e.target.value)} />
          <Input type="text" placeholder="Financial Goal (e.g., Buy a house)" value={financialGoal} onChange={(e) => setFinancialGoal(e.target.value)} />

          <div className="space-y-2">
            <Label htmlFor="riskTolerance">Investment Risk Profile</Label>
            <Select value={riskTolerance} onValueChange={(value) => setriskTolerance(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={fetchAllAICards} disabled={aiGenerating} className="w-full gradient-bg text-white hover:scale-105">
          {aiGenerating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" /> Generating All Recommendations...
            </span>
          ) : "Generate Full Plan with AI"}
        </Button>

        {error && (
          <div className="text-red-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {aiRecommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${rec.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{rec.type}</h4>
                    <div className="flex space-x-2">
                      <Badge variant={rec.priority === 'High' ? 'default' : 'secondary'}>{rec.priority}</Badge>
                      <Badge variant="outline">{rec.risk} Risk</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <p className="text-xs text-green-600 font-medium">Recommended: {rec.allocation}</p>
                  {rec.aiAdvice && <p className="mt-2 text-sm text-blue-900 italic">
                    <Markdown remarkPlugins={[remarkGfm]}>{rec.aiAdvice}</Markdown>
                  </p>}
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">AI Insight</span>
          </div>
          <p className="text-sm text-blue-800">
            {riskTolerance === 'Low'
              ? "Your conservative approach is great for stability. Consider gradually increasing equity exposure."
              : riskTolerance === 'Medium'
                ? "Your balanced approach allows for good growth with manageable risk. Review your portfolio quarterly."
                : "Your aggressive strategy has high growth potential. Ensure you have adequate emergency funds."}
          </p>
        </div>

        <Button className="w-full mt-4 gradient-bg text-white hover:opacity-90 hover:scale-105">
          Get Detailed Investment Plan
        </Button>
      </CardContent>
    </Card>
  );
}