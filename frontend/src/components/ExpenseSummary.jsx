import { useAuth } from "@/helper/auth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const ExpenseSummary = () => {
  const { LoggedInUserData } = useAuth();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    setExpenses(LoggedInUserData?.expenses || []);
  }, [LoggedInUserData]);

  const getCategoryColor = (category) => {
    const colors = {
      "Food": "bg-orange-500",
      "Transportation": "bg-blue-500",
      "Entertainment": "bg-purple-500",
      "Shopping": "bg-pink-500",
      "Bills": "bg-red-500",
      "Healthcare": "bg-green-500",
      "Education": "bg-indigo-500",
      "Other": "bg-gray-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="animate-slide-up glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          <span>Recent Expenses</span>
        </CardTitle>
        <CardDescription>
          Your latest spending activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your expenses to get insights</p>
            <Link to="/expenses">
              <Button className="gradient-bg text-white hover:opacity-90 transition-all duration-200 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                Add First Expense
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">Total Recent Expenses</span>
              <span className="font-bold text-red-600">₹{totalExpenses.toLocaleString()}</span>
            </div>

            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${getCategoryColor(expense.category)} rounded-full`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-600">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-bold text-red-600">₹{expense.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <Link to="/expenses">
                <Button variant="outline" className="w-full transition-all duration-200 hover:scale-105">
                  View All Expenses
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;
