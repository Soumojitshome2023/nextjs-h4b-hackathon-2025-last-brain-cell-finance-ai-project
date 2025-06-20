
import { Button } from "@/components/ui/button";
import { DollarSign, LogOut, User, Home, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@civic/auth/react";

const Navbar = () => {
  // const { logout } = useAuth();
  const location = useLocation();
  const { user } = useUser();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/expenses", label: "Expenses", icon: BarChart3 },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FinanceAI</h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${isActive
                      ? "bg-green-100 text-green-700 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden md:block">
              Welcome, {user?.name}
            </span>
            {/* <Button
              onClick={logout}
              variant="outline"
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button> */}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
