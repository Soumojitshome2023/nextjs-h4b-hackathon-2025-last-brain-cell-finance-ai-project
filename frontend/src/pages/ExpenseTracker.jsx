
import { useState, useEffect } from "react";
import NotFound from "./NotFound"
import { useAuth } from "@/helper/auth";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SendMailFunc from "../helper/SendMailFunc";
import UpdateUserDataFunc from "../helper/UpdateUserDataFunc";
import { Plus, Trash2, BarChart3, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ExpenseTracker = () => {
  const { LoggedInUserData, setLoggedInUserData } = useAuth();
  const { toast } = useToast();

  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setExpenses(LoggedInUserData?.expenses || []);
  }, [LoggedInUserData]);

  const categories = [
    "Food", "Transportation", "Entertainment", "Shopping",
    "Bills", "Healthcare", "Education", "Other"
  ];

  const addExpense = async (e) => {
    e.preventDefault();

    const newExpense = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    };

    const updatedExpenses = [newExpense, ...expenses];
    const result = await UpdateUserDataFunc({
      email: LoggedInUserData.email,
      expenses: updatedExpenses
    });


    setLoggedInUserData(result);

    const totalExpenses = result?.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const annualIncome = result?.annualIncome || 0;
    const budgetPercentage = result?.annualIncome > 0 ? (totalExpenses / annualIncome) * 100 : 0;

    if (budgetPercentage > 50) {
      const mailPayload = {
        email: result.email, // or the appropriate email key
        subject: "Budget Alert: You're spending over 50% of your monthly income!",
        html: `
      <h2>⚠️ Budget Alert</h2>
      <p>Hi ${result.name || 'User'},</p>
      <p>You've spent <strong>${budgetPercentage.toFixed(2)}%</strong> of your Annual Income (${annualIncome.toFixed(2)}), which exceeds the safe threshold.</p>
      <p>Please consider reviewing your spending habits.</p>
      <p>- Your Finance Tracker</p>
    `,
        BccArr: []
      };

      SendMailFunc(mailPayload)
    }

    toast({
      title: "Expense added!",
      description: `₹${newExpense.amount.toLocaleString()} for ${newExpense.description}`,
    });

    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteExpense = async (id) => {
    const updatedExpenses = expenses.filter(expense => expense._id !== id);
    const result = await UpdateUserDataFunc({
      email: LoggedInUserData.email,
      expenses: updatedExpenses
    });

    setLoggedInUserData(result);

    toast({
      title: "Expense deleted",
      description: "The expense has been removed from your records.",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Food": "bg-orange-100 text-orange-800",
      "Transportation": "bg-blue-100 text-blue-800",
      "Entertainment": "bg-purple-100 text-purple-800",
      "Shopping": "bg-pink-100 text-pink-800",
      "Bills": "bg-red-100 text-red-800",
      "Healthcare": "bg-green-100 text-green-800",
      "Education": "bg-indigo-100 text-indigo-800",
      "Other": "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (!LoggedInUserData) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
          <p className="text-gray-600">Track and manage your daily expenses with intelligent categorization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="glass-effect hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-red-600">₹{monthlyTotal.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-purple-600">₹{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-blue-600">{expenses.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="animate-slide-up glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-green-600" />
                <span>Add New Expense</span>
              </CardTitle>
              <CardDescription>Record your spending to track your financial habits</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Lunch at restaurant"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full gradient-bg text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="animate-slide-up glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Recent Expenses</span>
              </CardTitle>
              <CardDescription>Your latest spending records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No expenses recorded yet. Add your first expense to get started!</p>
                  </div>
                ) : (
                  expenses.map((expense) => (
                    <div key={expense._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{expense.description}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteExpense(expense._id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getCategoryColor(expense.category)}>
                              {expense.category}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(expense.date).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="font-bold text-red-600">₹{expense.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;