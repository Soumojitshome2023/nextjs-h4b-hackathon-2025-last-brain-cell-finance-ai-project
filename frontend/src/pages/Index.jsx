import { useAuth } from "@/helper/auth";
import { Link } from "react-router-dom";
import { useUser } from "@civic/auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserButton } from "@civic/auth/react";
import { ArrowUp, DollarSign, TrendingUp, Shield, Bot, BarChart3 } from "lucide-react";

const Index = () => {
  const { signIn, signOut } = useUser();
  const { LoggedInUserData, FirstLoader } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-4 z-50 px-6 backdrop-blur-xl flex justify-between items-center fixed top-0 w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FinanceAI</h1>
        </div>
        <UserButton />
      </header>

      {/* Hero Section */}
      <section className="px-6 py-28 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            AI-Powered Financial
            <span className="text-green-600"> Intelligence</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 animate-slide-up">
            Track your expenses, get personalized investment suggestions, and make smarter financial decisions with our encrypted AI platform.
          </p>
          <div className="flex justify-center space-x-4 animate-slide-up">
            {FirstLoader ?
              <div className="bg-gray-400 w-28 animate-pulse h-10 rounded-2xl" ></div>
              :
              LoggedInUserData ?
                <Link to="/profile">
                  <Button className="gradient-bg text-white px-8 py-3 text-lg hover:opacity-90">
                    Start Free Trial
                  </Button>
                </Link>
                :
                <Button onClick={signIn} className="gradient-bg text-white px-8 py-3 text-lg hover:opacity-90">
                  Start Free Trial
                </Button>
            }

            <Button variant="outline" className="px-8 py-3 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Everything you need to manage your finances
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect hover:shadow-lg transition-all duration-300 animate-float">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">AI Recommendations</h4>
                <p className="text-gray-600">Get personalized investment suggestions based on your income and risk profile.</p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-all duration-300 animate-float" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Expense Tracking</h4>
                <p className="text-gray-600">Monitor your spending patterns with intelligent categorization and insights.</p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-all duration-300 animate-float" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Bank-Level Security</h4>
                <p className="text-gray-600">Your financial data is encrypted and protected with enterprise-grade security.</p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-all duration-300 animate-float" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Investment Options</h4>
                <p className="text-gray-600">Discover SIPs, Fixed Deposits, and trading opportunities tailored to you.</p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-all duration-300 animate-float" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Growth Analytics</h4>
                <p className="text-gray-600">Track your financial progress with detailed analytics and forecasts.</p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-lg transition-all duration-300 animate-float" style={{ animationDelay: '0.5s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Smart Budgeting</h4>
                <p className="text-gray-600">AI-powered budgeting that adapts to your lifestyle and goals.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 gradient-bg text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">Ready to take control of your finances?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already making smarter financial decisions with FinanceAI.
          </p>

          {LoggedInUserData ?
            <Link to="/profile">
              <Button className="bg-white text-green-600 px-8 py-3 text-lg hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            :
            <Button onClick={signIn} className="bg-white text-green-600 px-8 py-3 text-lg hover:bg-gray-100">
              Start Free Trial
            </Button>
          }
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 bg-gray-50">
        <p>&copy; 2024 FinanceAI. Built for financial empowerment.</p>
      </footer>
    </div>
  );
};

export default Index;
