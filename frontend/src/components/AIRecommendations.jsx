"use client";
import React, { useEffect, useState } from "react";
import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'
import { useAuth } from "@/helper/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp, Shield, Zap } from "lucide-react";
import { getFinancialAdvice } from "../helper/GetFinancialAdvice";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const AIRecommendations = () => {
  const { LoggedInUserData } = useAuth();
  const [aiAdvice, setAiAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice({
      age: LoggedInUserData.age,
      annualIncome: LoggedInUserData.annualIncome,
      monthlyExpense: LoggedInUserData.monthlyExpense,
      savings: LoggedInUserData.savings,
      investmentHorizon: LoggedInUserData.investmentHorizon,
      riskTolerance: LoggedInUserData.riskTolerance,
      financialGoal: LoggedInUserData.financialGoal || "Wealth Growth",
      preferredAssets: LoggedInUserData.preferredAssets || "Mutual Funds, Gold",
      apiKey: import.meta.env.VITE_GeminiAPI
    });

    if (result.success) setAiAdvice(result.advice);
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
          <CardDescription>Log in or complete your profile for insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please add age, income, expenses, savings and risk profile to get AI-powered advice.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span>AI Recommendations</span>
        </CardTitle>
        <CardDescription>
          Based on your profile: ₹{LoggedInUserData.annualIncome.toLocaleString()} income, {LoggedInUserData.riskTolerance} risk
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Generating personalized advice...</p>
        ) : (
          <div className="text-sm whitespace-pre-wrap text-gray-800">
            <Markdown remarkPlugins={[remarkGfm]}>
              {aiAdvice}
            </Markdown>
          </div>
        )}

        <Button onClick={fetchAdvice} className="w-full mt-4 gradient-bg text-white hover:opacity-90 transition-all duration-200 hover:scale-105">
          Get Detailed Investment Plan
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
