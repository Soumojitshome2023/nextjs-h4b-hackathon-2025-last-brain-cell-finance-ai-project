
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    salary: "",
    riskProfile: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user) {
      setFormData({
        name: user.name || "",
        salary: user.salary?.toString() || "",
        riskProfile: user.riskProfile || "",
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      name: formData.name,
      salary: parseInt(formData.salary),
      riskProfile: formData.riskProfile as 'conservative' | 'moderate' | 'aggressive',
    });

    toast({
      title: "Profile updated!",
      description: "Your information has been saved successfully.",
    });

    navigate("/dashboard");
  };

  if (!isAuthenticated) {
    return null;
  }

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
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Monthly Salary (₹)</Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="20000"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                  <p className="text-sm text-gray-600">
                    This helps us suggest appropriate investment options for your income level.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskProfile">Investment Risk Profile</Label>
                  <Select
                    value={formData.riskProfile}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, riskProfile: value }))}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:scale-105">
                      <SelectValue placeholder="Select your risk tolerance" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="conservative">
                        <div>
                          <div className="font-medium">Conservative</div>
                          <div className="text-sm text-gray-600">Low risk, stable returns (FD, Bonds)</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="moderate">
                        <div>
                          <div className="font-medium">Moderate</div>
                          <div className="text-sm text-gray-600">Balanced risk, steady growth (SIP, Mutual Funds)</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="aggressive">
                        <div>
                          <div className="font-medium">Aggressive</div>
                          <div className="text-sm text-gray-600">High risk, high returns (Stocks, Trading)</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
