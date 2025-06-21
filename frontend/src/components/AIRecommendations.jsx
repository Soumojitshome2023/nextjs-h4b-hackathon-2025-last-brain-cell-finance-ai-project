"use client";
import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/helper/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bot, Loader2, AlertCircle } from "lucide-react";
import { getFinancialAdvice } from "../helper/GetFinancialAdvice";
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
  const [aiAdvice, setAiAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [monthlyExpense, setMonthlyExpense] = useState("");
  const [savings, setSavings] = useState("");
  const [investmentHorizon, setInvestmentHorizon] = useState("");
  const [financialGoal, setFinancialGoal] = useState("");
  const [preferredAssets, setPreferredAssets] = useState("");
  const [riskTolerance, setriskTolerance] = useState("");

  const promptMap = {
    investment: `Give very short investment advice with 3–4 Indian asset types.`,
    tax: `Give short tax-saving tips using Indian tax options like ELSS, PPF, 80C.`,
    retirement: `Give short retirement planning advice for India by age 60.`,
    budgeting: `Give short monthly budget tips to save more.`,
  };

  const fetchAdvice = async () => {
    if (!LoggedInUserData) return;
    setLoading(true);
    setError("");
    setAiAdvice("");

    const result = await getFinancialAdvice({
      age: LoggedInUserData.age,
      annualIncome: LoggedInUserData.annualIncome,
      riskTolerance: riskTolerance,
      monthlyExpense: parseInt(monthlyExpense) || 0,
      savings: parseInt(savings) || 0,
      investmentHorizon: parseInt(investmentHorizon) || 0,
      financialGoal: financialGoal || "Wealth Growth",
      preferredAssets: preferredAssets || "Mutual Funds, FD",
      apiKey: import.meta.env.VITE_GeminiAPI, // ✅ safer and compatible with Next.js
      customPrompt: promptMap[recommendationType],
    });

    if (result.ok) {
      setAiAdvice(result.advice);
    } else {
      setError(result.error);
    }

    setLoading(false);
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
          Income: ₹{LoggedInUserData.annualIncome.toLocaleString()} • Risk: {LoggedInUserData.riskTolerance}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Type Selector */}
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

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Monthly Expenses (₹)"
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Total Current Savings (₹)"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Investment Horizon (years)"
            value={investmentHorizon}
            onChange={(e) => setInvestmentHorizon(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Financial Goal (e.g., Buy a house)"
            value={financialGoal}
            onChange={(e) => setFinancialGoal(e.target.value)}
          />
          {/* <Input
            type="text"
            placeholder="Preferred Assets (e.g., Equity, FD)"
            value={preferredAssets}
            onChange={(e) => setPreferredAssets(e.target.value)}
          /> */}

          <div className="space-y-2">
            <Label htmlFor="riskTolerance">Investment Risk Profile</Label>
            <Select
              value={riskTolerance}
              onValueChange={(value) => setriskTolerance(value)}
            >
              <SelectTrigger className="transition-all duration-200 focus:scale-105">
                <SelectValue placeholder="Select your risk tolerance" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Low">
                  <div>
                    <div className="font-medium">Low</div>
                    {/* <div className="text-sm text-gray-600">Low risk, stable returns (FD, Bonds)</div> */}
                  </div>
                </SelectItem>
                <SelectItem value="Medium">
                  <div>
                    <div className="font-medium">Medium</div>
                    {/* <div className="text-sm text-gray-600">Balanced risk, steady growth (SIP, Mutual Funds)</div> */}
                  </div>
                </SelectItem>
                <SelectItem value="High">
                  <div>
                    <div className="font-medium">High</div>
                    {/* <div className="text-sm text-gray-600">High risk, high returns (Stocks, Trading)</div> */}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={fetchAdvice}
          disabled={loading}
          className="w-full gradient-bg text-white hover:scale-105 transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Generating...
            </span>
          ) : "Get Advice"}
        </Button>

        {/* Output */}
        <div className="mt-4 text-sm text-gray-800 whitespace-pre-wrap">
          {error && (
            <div className="text-red-500 flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!loading && !aiAdvice && !error && (
            <p className="text-gray-400">Fill the fields and click “Get Advice”.</p>
          )}

          {!loading && aiAdvice && (
            <div className="prose max-w-none prose-sm prose-blue">
              <Markdown remarkPlugins={[remarkGfm]}>{aiAdvice}</Markdown>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
