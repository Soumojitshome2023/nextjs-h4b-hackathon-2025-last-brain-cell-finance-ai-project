import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/helper/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, BarChart3, Calendar, DollarSign, ImagePlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UpdateUserDataFunc from "../helper/UpdateUserDataFunc";

const VITE_GeminiAPI = "YOUR_GEMINI_API_KEY_HERE";

const ExpenseTracker = () => {
  const { LoggedInUserData, setLoggedInUserData } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0]
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
    toast({
      title: "Expense added!",
      description: `₹${newExpense.amount.toLocaleString()} for ${newExpense.description}`,
    });
    setFormData({ description: "", amount: "", category: "", date: new Date().toISOString().split("T")[0] });
  };

  const deleteExpense = async (id) => {
    const updatedExpenses = expenses.filter(expense => expense._id !== id);
    const result = await UpdateUserDataFunc({
      email: LoggedInUserData.email,
      expenses: updatedExpenses
    });
    setLoggedInUserData(result);
    toast({ title: "Expense deleted", description: "The expense has been removed from your records." });
  };

const handleReceiptScan = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result?.toString().split(",")[1];

    const requestPayload = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: file.type,
                data: base64Image,
              },
            },
            {
              text: `
You are an expense parsing assistant. Read this receipt image and extract the following fields clearly and strictly in plain text (no extra commentary):

Description: <Business or item name, max 5 words>
Amount: <Total amount in digits like 234.50>
Category: <One of: Food, Bills, Shopping, Transportation, Entertainment, Healthcare, Education, Other>
Date: <In YYYY-MM-DD format only>

Only respond with 4 clean lines like:
Description: Domino's Pizza
Amount: 456.90
Category: Food
Date: 2025-06-20
              `.trim()
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${VITE_GeminiAPI}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        }
      );

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Optional: Log raw Gemini response to debug
      console.log("Gemini Response Text:\n", rawText);

      const extract = (label, fallback = "") => {
        const regex = new RegExp(`${label}\\s*[:|-]?\\s*(.+)`, "i");
        const match = rawText.match(regex);
        return match?.[1]?.trim() || fallback;
      };

      const amountRaw = extract("amount", "0").replace(/[^\d.]/g, "");
      const amountValue = parseFloat(amountRaw);
      const isValidAmount = !isNaN(amountValue) && amountValue > 0;

      setFormData((prev) => ({
        ...prev,
        description: extract("description", "Bill"),
        amount: isValidAmount ? amountRaw : "",
        category: extract("category", "Other"),
        date: extract("date", new Date().toISOString().split("T")[0]),
      }));

      toast({ title: "Receipt scanned", description: "Form fields auto-filled using AI" });
    } catch (error) {
      console.error("Gemini receipt parsing failed:", error);
      toast({ title: "Scan failed", description: "Could not extract data from image." });
    }
  };

  reader.readAsDataURL(file);
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

  if (!LoggedInUserData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
        <p className="text-gray-600">Track and manage your daily expenses with intelligent categorization.</p>

        <div className="mb-6">
          <Label htmlFor="receipt-upload">Scan Receipt (AI)</Label>
          <div className="flex gap-2 mt-2">
            <Input id="receipt-upload" type="file" accept="image/*" onChange={handleReceiptScan} ref={fileInputRef} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>Fill out the form or use the AI scanner above.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addExpense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expenses.map((expense) => (
              <div key={expense._id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <p className="font-semibold">{expense.description}</p>
                  <p className="text-sm text-gray-600">{expense.date}</p>
                  <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">₹{expense.amount}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExpense(expense._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseTracker;