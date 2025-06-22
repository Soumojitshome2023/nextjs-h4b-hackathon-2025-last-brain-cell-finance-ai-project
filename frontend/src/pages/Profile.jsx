import { useState, useEffect } from "react";
import { useAuth } from "@/helper/auth";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UpdateUserDataFunc from "../helper/UpdateUserDataFunc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NotFound from "./NotFound"

const Profile = () => {
  const { LoggedInUserData, setLoggedInUserData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    annualIncome: "",
    age: 22,
    monthlyBudget: ""
  });

  useEffect(() => {
    if (LoggedInUserData) {
      setFormData({
        name: LoggedInUserData.name || "",
        age: LoggedInUserData.age || 22,
        annualIncome: LoggedInUserData.annualIncome || "",
        monthlyBudget: LoggedInUserData.monthlyBudget || "",
      });
    }
  }, [LoggedInUserData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        ...LoggedInUserData,
        annualIncome: formData.annualIncome,
        age: formData.age,
        monthlyBudget: formData.monthlyBudget,
      };

      const result = await UpdateUserDataFunc(updatedData);

      setLoggedInUserData(result);

      toast({
        title: "Profile updated!",
        description: "Your information has been saved successfully.",
      });

      // navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        title: "Error",
        description: "Something went wrong while saving your data.",
        variant: "destructive",
      });
    }
  };

  if (!LoggedInUserData) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-effect animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
              <CardDescription>
                Help us provide better financial recommendations by sharing your details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Age</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    placeholder="20000"
                    value={formData.age}
                    onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    placeholder="20000"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData((prev) => ({ ...prev, annualIncome: e.target.value }))}
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Monthly Budget (₹)</Label>
                  <Input
                    id="monthlyBudget"
                    type="number"
                    placeholder="1000"
                    value={formData.monthlyBudget}
                    onChange={(e) => setFormData((prev) => ({ ...prev, monthlyBudget: e.target.value }))}
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                  <p className="text-sm text-gray-600">
                    This helps us suggest appropriate investment options for your income level.
                  </p>
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Investment Risk Profile</Label>
                  <Select
                    value={formData.riskTolerance}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, riskTolerance: value }))}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:scale-105">
                      <SelectValue placeholder="Select your risk tolerance" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Low">
                        <div>
                          <div className="font-medium">Low</div>
                          <div className="text-sm text-gray-600">Low risk, stable returns (FD, Bonds)</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div>
                          <div className="font-medium">Medium</div>
                          <div className="text-sm text-gray-600">Balanced risk, steady growth (SIP, Mutual Funds)</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="High">
                        <div>
                          <div className="font-medium">High</div>
                          <div className="text-sm text-gray-600">High risk, high returns (Stocks, Trading)</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🔒 Data Security</h4>
                  <p className="text-sm text-blue-800">
                    Your financial information is encrypted and stored securely. We never share your personal data with third parties.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-bg text-white hover:opacity-90 transition-all duration-200 hover:scale-105"
                >
                  Save Profile & Continue to Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
