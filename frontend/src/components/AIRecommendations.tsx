
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, Shield, Zap } from "lucide-react";
import { useUser } from "@civic/auth/react";

const AIRecommendations = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <Card className="animate-slide-up glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span>AI Recommendations</span>
          </CardTitle>
          <CardDescription>Complete your profile to get personalized suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Please update your annualIncome and risk profile to receive AI-powered investment recommendations.</p>
        </CardContent>
      </Card>
    );
  }

  const annualIncome = user?.annualIncome;
  const riskTolerance = user?.riskTolerance || 'moderate';

  // AI Logic for recommendations based on annualIncome and risk profile
  const getRecommendations = () => {
    const recommendations = [];

    // Emergency Fund (universal recommendation)
    const emergencyFund = annualIncome * 6;
    recommendations.push({
      type: "Emergency Fund",
      description: `Build an emergency fund of ₹${emergencyFund.toLocaleString()} (6 months of annualIncome)`,
      allocation: "20% of income",
      risk: "Low",
      icon: Shield,
      color: "bg-green-500",
      priority: "High"
    });

    // Risk-based recommendations
    if (riskTolerance === 'conservative') {
      recommendations.push(
        {
          type: "Fixed Deposit",
          description: `Invest ₹${(annualIncome * 0.3).toLocaleString()} monthly in FDs for guaranteed returns`,
          allocation: "30% of income",
          risk: "Very Low",
          icon: Shield,
          color: "bg-blue-500",
          priority: "High"
        },
        {
          type: "PPF",
          description: `Invest ₹${Math.min(annualIncome * 0.2, 12500).toLocaleString()} monthly in PPF for tax benefits`,
          allocation: "20% of income",
          risk: "Low",
          icon: TrendingUp,
          color: "bg-indigo-500",
          priority: "Medium"
        }
      );
    } else if (riskTolerance === 'moderate') {
      recommendations.push(
        {
          type: "SIP in Mutual Funds",
          description: `Start SIP of ₹${(annualIncome * 0.25).toLocaleString()} in diversified equity funds`,
          allocation: "25% of income",
          risk: "Medium",
          icon: TrendingUp,
          color: "bg-purple-500",
          priority: "High"
        },
        {
          type: "ELSS",
          description: `Invest ₹${Math.min(annualIncome * 0.15, 12500).toLocaleString()} in ELSS for tax savings`,
          allocation: "15% of income",
          risk: "Medium",
          icon: Zap,
          color: "bg-orange-500",
          priority: "Medium"
        }
      );
    } else if (riskTolerance === 'aggressive') {
      recommendations.push(
        {
          type: "Direct Equity",
          description: `Allocate ₹${(annualIncome * 0.3).toLocaleString()} for direct stock investments`,
          allocation: "30% of income",
          risk: "High",
          icon: Zap,
          color: "bg-red-500",
          priority: "High"
        },
        {
          type: "Growth Mutual Funds",
          description: `Invest ₹${(annualIncome * 0.2).toLocaleString()} in small & mid-cap funds`,
          allocation: "20% of income",
          risk: "High",
          icon: TrendingUp,
          color: "bg-pink-500",
          priority: "Medium"
        }
      );
    }

    return recommendations.slice(0, 3); // Show top 3 recommendations
  };

  const recommendations = getRecommendations();

  return (
    <Card className="animate-slide-up glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span>AI Recommendations</span>
        </CardTitle>
        <CardDescription>
          Personalized investment suggestions based on your ₹{annualIncome.toLocaleString()} annualIncome and {riskTolerance} risk profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${rec.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{rec.type}</h4>
                    <div className="flex space-x-2">
                      <Badge variant={rec.priority === 'High' ? 'default' : 'secondary'}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="outline">{rec.risk} Risk</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <p className="text-xs text-green-600 font-medium">Recommended: {rec.allocation}</p>
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
            {riskTolerance === 'conservative'
              ? "Your conservative approach is great for stability. Consider gradually increasing equity exposure as you become more comfortable."
              : riskTolerance === 'moderate'
                ? "Your balanced approach allows for good growth with manageable risk. Consider reviewing your portfolio quarterly."
                : "Your aggressive strategy has high growth potential. Ensure you have adequate emergency funds before high-risk investments."
            }
          </p>
        </div>

        <Button className="w-full mt-4 gradient-bg text-white hover:opacity-90 transition-all duration-200 hover:scale-105">
          Get Detailed Investment Plan
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
