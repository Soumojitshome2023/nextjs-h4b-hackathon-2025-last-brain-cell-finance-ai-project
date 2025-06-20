
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Target, Bot, AlertCircle, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AIRecommendations from "@/components/AIRecommendations";
import ExpenseSummary from "@/components/ExpenseSummary";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const monthlySalary = user.salary || 0;
  const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
  const remainingBudget = monthlySalary - totalExpenses;
  const budgetPercentage = monthlySalary > 0 ? (totalExpenses / monthlySalary) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your financial overview and AI-powered recommendations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          <Card className="glass-effect hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Salary</p>
                  <p className="text-2xl font-bold text-gray-900">₹{monthlySalary.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remaining Budget</p>
                  <p className="text-2xl font-bold text-green-600">₹{remainingBudget.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Usage</p>
                  <p className="text-2xl font-bold text-purple-600">{budgetPercentage.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="animate-slide-up glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>Monthly Budget Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Budget Used: ₹{totalExpenses.toLocaleString()}</span>
                <span>Total Budget: ₹{monthlySalary.toLocaleString()}</span>
              </div>
              <Progress 
                value={Math.min(budgetPercentage, 100)} 
                className="w-full h-3"
              />
              {budgetPercentage > 80 && (
                <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    You've used {budgetPercentage.toFixed(1)}% of your monthly budget. Consider reviewing your expenses.
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Recommendations */}
          <AIRecommendations />
          
          {/* Recent Expenses */}
          <ExpenseSummary />
        </div>

        {/* Quick Actions */}
        <Card className="animate-slide-up glass-effect">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your finances efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/expenses">
                <Button className="w-full gradient-bg text-white hover:opacity-90 transition-all duration-200 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full transition-all duration-200 hover:scale-105">
                  Update Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
