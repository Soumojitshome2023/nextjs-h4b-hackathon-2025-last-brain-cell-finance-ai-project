import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  BarChart3,
  GitCompare,
  PieChart,
  Settings,
  RotateCcw,
  BookOpen,
  FileText,
  Building,
  CreditCard,
  TrendingUp,
  FileCheck,
  Heart,
  Download,
  Info,
  DollarSign,
  Calendar,
  Users,
  Target,
  Zap,
  Shield,
  Award,
  CheckCircle,
  ArrowRight,
  Home,
  Percent,
  TrendingDown,
  AlertCircle,
  Clock,
  Star,
  Plus,
  Minus,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import Navbar from './Navbar';
import { useAuth } from '../helper/auth';

// Tax calculation logic based on Indian tax slabs for FY 2025-26
const calculateTax = (income, regime) => {
  if (regime === 'new') {
    // New Tax Regime Slabs
    let tax = 0;
    if (income <= 300000) tax = 0;
    else if (income <= 600000) tax = (income - 300000) * 0.05;
    else if (income <= 900000) tax = 15000 + (income - 600000) * 0.10;
    else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15;
    else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.20;
    else tax = 150000 + (income - 1500000) * 0.30;

    // Add cess
    const cess = tax * 0.04;
    return { tax, cess, total: tax + cess };
  } else {
    // Old Tax Regime Slabs
    let tax = 0;
    if (income <= 250000) tax = 0;
    else if (income <= 500000) tax = (income - 250000) * 0.05;
    else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.20;
    else tax = 112500 + (income - 1000000) * 0.30;

    // Add cess
    const cess = tax * 0.04;
    return { tax, cess, total: tax + cess };
  }
};

// HRA Calculation
const calculateHRA = (basicSalary, hraReceived, rentPaid, isMetro) => {
  const metroPercent = isMetro ? 0.5 : 0.4;
  const exemption1 = hraReceived;
  const exemption2 = basicSalary * metroPercent;
  const exemption3 = rentPaid - (basicSalary * 0.1);

  const exemption = Math.min(exemption1, exemption2, Math.max(0, exemption3));
  const taxableHRA = hraReceived - exemption;

  return { exemption, taxableHRA };
};

// Advance Tax Calculation
const calculateAdvanceTax = (annualTax) => {
  const q1 = annualTax * 0.15; // 15% by June 15
  const q2 = annualTax * 0.45; // 45% by Sep 15
  const q3 = annualTax * 0.75; // 75% by Dec 15
  const q4 = annualTax * 1.0;  // 100% by Mar 15

  return {
    q1: { amount: q1, dueDate: 'June 15' },
    q2: { amount: q2 - q1, dueDate: 'September 15' },
    q3: { amount: q3 - q2, dueDate: 'December 15' },
    q4: { amount: q4 - q3, dueDate: 'March 15' }
  };
};

// Interest Calculation
const calculateInterest = (principal, rate, time) => {
  const simpleInterest = (principal * rate * time) / 100;
  const compoundInterest = principal * Math.pow((1 + rate / 100), time) - principal;
  return { simpleInterest, compoundInterest };
};



function Navigation({ activeTab, setActiveTab }) {
  const mainTabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'results', label: 'Tax Results', icon: FileText },
    { id: 'comparison', label: 'Comparison', icon: GitCompare },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'features', label: 'Features', icon: Settings },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'changelog', label: 'Changelog', icon: RotateCcw }
  ];

  const subTabs = [
    { id: 'regime-guide', label: 'Regime Guide', icon: BookOpen },
    { id: 'tax-slabs', label: 'Tax Slabs', icon: BarChart3 },
    { id: 'hra-calculator', label: 'HRA Calculator', icon: Building },
    { id: 'advance-tax', label: 'Advance Tax', icon: CreditCard },
    { id: 'interest', label: 'Interest', icon: TrendingUp },
    { id: 'itr-form', label: 'ITR Form', icon: FileCheck }
  ];

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-6 py-4">
          {mainTabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id
                ? 'text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-md'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 pb-4">
          {subTabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1 text-sm rounded-md transition-all ${activeTab === tab.id
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TaxCalculator() {
  const { LoggedInUserData, setLoggedInUserData } = useAuth();
  const [income, setIncome] = useState("");
  const [calculatorType, setCalculatorType] = useState('simple');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const annualIncome = parseFloat(income);
    if (isNaN(annualIncome) || annualIncome < 0) {
      alert('Please enter a valid income amount');
      return;
    }

    const oldRegime = calculateTax(annualIncome, 'old');
    const newRegime = calculateTax(annualIncome, 'new');

    setResults({
      income: annualIncome,
      oldRegime,
      newRegime,
      savings: oldRegime.total - newRegime.total,
      recommendedRegime: oldRegime.total < newRegime.total ? 'old' : 'new'
    });
  };

  useEffect(() => {
    setIncome(LoggedInUserData ? LoggedInUserData.annualIncome : "")
  }, [LoggedInUserData])


  return (
    <div className="space-y-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Calculate Your Income Tax</h2>
        <p className="text-gray-600">Compare tax liabilities under Old and New regimes</p>
      </motion.div>

      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCalculatorType('simple')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${calculatorType === 'simple'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
              : 'text-gray-600 hover:text-green-600'
              }`}
          >
            Simple Calculator
          </button>
          <button
            onClick={() => setCalculatorType('advanced')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${calculatorType === 'advanced'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
              : 'text-gray-600 hover:text-green-600'
              }`}
          >
            Advanced Calculator
          </button>
        </div>
      </div>

      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <Calculator className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Quick Tax Calculator</h3>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Annual Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your total annual income"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-lg"
              />
            </div>
          </div>

          <motion.button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Calculate Tax
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {results && (
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tax Calculation Results</h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  Old Tax Regime
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Income:</span>
                    <span className="font-medium">₹{results.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Income Tax:</span>
                    <span className="font-medium">₹{results.oldRegime.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health & Education Cess:</span>
                    <span className="font-medium">₹{results.oldRegime.cess.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Tax:</span>
                      <span className="text-red-600">₹{results.oldRegime.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  New Tax Regime
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Income:</span>
                    <span className="font-medium">₹{results.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Income Tax:</span>
                    <span className="font-medium">₹{results.newRegime.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health & Education Cess:</span>
                    <span className="font-medium">₹{results.newRegime.cess.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Tax:</span>
                      <span className="text-green-600">₹{results.newRegime.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Recommendation</h4>
              <p className="text-gray-700 mb-4">
                {results.savings > 0
                  ? `You can save ₹${Math.abs(results.savings).toLocaleString()} by choosing the New Tax Regime`
                  : results.savings < 0
                    ? `You can save ₹${Math.abs(results.savings).toLocaleString()} by choosing the Old Tax Regime`
                    : 'Both regimes result in the same tax liability'
                }
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md">
                <Award className="w-5 h-5 mr-2" />
                Recommended: {results.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaxResults() {
  const [savedResults, setSavedResults] = useState([
    {
      id: 1,
      date: '2025-01-15',
      income: 1200000,
      oldRegime: { total: 112500 },
      newRegime: { total: 90000 },
      savings: 22500,
      recommendedRegime: 'new'
    },
    {
      id: 2,
      date: '2025-01-10',
      income: 800000,
      oldRegime: { total: 72500 },
      newRegime: { total: 45000 },
      savings: 27500,
      recommendedRegime: 'new'
    }
  ]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tax Results History</h2>
        <p className="text-gray-600">View your previous tax calculations</p>
      </div>

      <div className="space-y-6">
        {savedResults.map((result) => (
          <motion.div
            key={result.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Income: ₹{result.income.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-500">Calculated on {result.date}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Old Regime</p>
                <p className="text-xl font-semibold text-red-600">₹{result.oldRegime.total.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">New Regime</p>
                <p className="text-xl font-semibold text-green-600">₹{result.newRegime.total.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Savings</p>
                <p className="text-xl font-semibold text-blue-600">₹{result.savings.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm">
                <Award className="w-4 h-4 mr-1" />
                Recommended: {result.recommendedRegime === 'new' ? 'New Regime' : 'Old Regime'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Comparison() {
  const [income1, setIncome1] = useState('');
  const [income2, setIncome2] = useState('');
  const [comparisonResults, setComparisonResults] = useState(null);

  const handleCompare = () => {
    const amount1 = parseFloat(income1);
    const amount2 = parseFloat(income2);

    if (isNaN(amount1) || isNaN(amount2)) {
      alert('Please enter valid income amounts');
      return;
    }

    const scenario1Old = calculateTax(amount1, 'old');
    const scenario1New = calculateTax(amount1, 'new');
    const scenario2Old = calculateTax(amount2, 'old');
    const scenario2New = calculateTax(amount2, 'new');

    setComparisonResults({
      scenario1: { income: amount1, old: scenario1Old, new: scenario1New },
      scenario2: { income: amount2, old: scenario2Old, new: scenario2New }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Income Comparison</h2>
        <p className="text-gray-600">Compare tax liability for different income levels</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scenario 1 Income</label>
              <input
                type="number"
                value={income1}
                onChange={(e) => setIncome1(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter first income amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scenario 2 Income</label>
              <input
                type="number"
                value={income2}
                onChange={(e) => setIncome2(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter second income amount"
              />
            </div>
          </div>

          <button
            onClick={handleCompare}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
          >
            Compare Scenarios
          </button>
        </div>

        {comparisonResults && (
          <motion.div
            className="mt-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Scenario 1: ₹{comparisonResults.scenario1.income.toLocaleString()}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Old Regime:</span>
                    <span className="font-medium text-red-600">₹{comparisonResults.scenario1.old.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Regime:</span>
                    <span className="font-medium text-green-600">₹{comparisonResults.scenario1.new.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Savings:</span>
                    <span className="font-medium text-blue-600">
                      ₹{Math.abs(comparisonResults.scenario1.old.total - comparisonResults.scenario1.new.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Scenario 2: ₹{comparisonResults.scenario2.income.toLocaleString()}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Old Regime:</span>
                    <span className="font-medium text-red-600">₹{comparisonResults.scenario2.old.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Regime:</span>
                    <span className="font-medium text-green-600">₹{comparisonResults.scenario2.new.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Savings:</span>
                    <span className="font-medium text-blue-600">
                      ₹{Math.abs(comparisonResults.scenario2.old.total - comparisonResults.scenario2.new.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Analytics() {
  const analyticsData = [
    { income: 300000, oldTax: 0, newTax: 0 },
    { income: 500000, oldTax: 12500, newTax: 10000 },
    { income: 800000, oldTax: 72500, newTax: 45000 },
    { income: 1200000, oldTax: 112500, newTax: 90000 },
    { income: 1500000, oldTax: 202500, newTax: 150000 },
    { income: 2000000, oldTax: 352500, newTax: 300000 }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tax Analytics</h2>
        <p className="text-gray-600">Visual analysis of tax implications across income levels</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 text-green-600 mr-2" />
            Tax Comparison Chart
          </h3>
          <div className="space-y-4">
            {analyticsData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>₹{data.income.toLocaleString()}</span>
                  <span>Old: ₹{data.oldTax.toLocaleString()} | New: ₹{data.newTax.toLocaleString()}</span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-red-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(data.oldTax / 400000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(data.newTax / 400000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
            Savings Analysis
          </h3>
          <div className="space-y-4">
            {analyticsData.map((data, index) => {
              const savings = data.oldTax - data.newTax;
              const savingsPercent = data.oldTax > 0 ? (savings / data.oldTax) * 100 : 0;
              return (
                <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">₹{data.income.toLocaleString()}</span>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">₹{savings.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{savingsPercent.toFixed(1)}% saved</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₹3L</div>
            <div className="text-sm text-gray-600">Tax-free limit in New Regime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">30%</div>
            <div className="text-sm text-gray-600">Maximum savings possible</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₹8L+</div>
            <div className="text-sm text-gray-600">New regime beneficial above</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegimeGuide() {
  const oldRegimeFeatures = [
    "Standard deduction of ₹50,000",
    "80C deductions up to ₹1.5L",
    "HRA exemption available",
    "Medical insurance deduction",
    "Home loan interest deduction",
    "Various other deductions under Chapter VI-A"
  ];

  const newRegimeFeatures = [
    "Higher tax-free limit of ₹3L",
    "Lower tax rates in most slabs",
    "No deductions except few specified",
    "Simplified tax structure",
    "Standard deduction of ₹75,000",
    "Rebate under section 87A up to ₹7L"
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tax Regime Guide</h2>
        <p className="text-gray-600">Complete guide to choosing the right tax regime</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            Old Tax Regime
          </h3>
          <div className="space-y-3">
            {oldRegimeFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Best for:</h4>
            <p className="text-red-700 text-sm">
              Individuals with significant investments in tax-saving instruments and those claiming multiple deductions
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            New Tax Regime
          </h3>
          <div className="space-y-3">
            {newRegimeFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Best for:</h4>
            <p className="text-green-700 text-sm">
              Young professionals with limited investments and those preferring simplicity over deductions
            </p>
          </div>
        </motion.div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="w-5 h-5 text-blue-600 mr-2" />
          Decision Framework
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Choose Old Regime if:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• You have significant 80C investments</li>
              <li>• You pay house rent and claim HRA</li>
              <li>• You have home loan interest payments</li>
              <li>• You have medical insurance premiums</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Choose New Regime if:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Your total deductions are less than ₹2.5L</li>
              <li>• You prefer simplicity in tax filing</li>
              <li>• You don't have significant investments</li>
              <li>• Your income is between ₹7L-₹15L</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaxSlabs() {
  const oldRegimeSlabs = [
    { range: "Up to ₹2,50,000", rate: "0%", tax: "Nil" },
    { range: "₹2,50,001 - ₹5,00,000", rate: "5%", tax: "₹12,500" },
    { range: "₹5,00,001 - ₹10,00,000", rate: "20%", tax: "₹1,12,500" },
    { range: "Above ₹10,00,000", rate: "30%", tax: "30% of excess" }
  ];

  const newRegimeSlabs = [
    { range: "Up to ₹3,00,000", rate: "0%", tax: "Nil" },
    { range: "₹3,00,001 - ₹6,00,000", rate: "5%", tax: "₹15,000" },
    { range: "₹6,00,001 - ₹9,00,000", rate: "10%", tax: "₹45,000" },
    { range: "₹9,00,001 - ₹12,00,000", rate: "15%", tax: "₹90,000" },
    { range: "₹12,00,001 - ₹15,00,000", rate: "20%", tax: "₹1,50,000" },
    { range: "Above ₹15,00,000", rate: "30%", tax: "30% of excess" }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Income Tax Slabs FY 2025-26</h2>
        <p className="text-gray-600">Compare tax rates under both regimes</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            Old Tax Regime
          </h3>
          <div className="space-y-3">
            {oldRegimeSlabs.map((slab, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{slab.range}</div>
                  <div className="text-sm text-gray-600">Rate: {slab.rate}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-600">{slab.tax}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            New Tax Regime
          </h3>
          <div className="space-y-3">
            {newRegimeSlabs.map((slab, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{slab.range}</div>
                  <div className="text-sm text-gray-600">Rate: {slab.rate}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">{slab.tax}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
          Important Notes
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Additional Charges:</h4>
            <ul className="space-y-1">
              <li>• Health & Education Cess: 4% on tax</li>
              <li>• Surcharge: 10% if income : ₹50L</li>
              <li>• Surcharge: 15% if income : ₹1Cr</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Rebates Available:</h4>
            <ul className="space-y-1">
              <li>• Section 87A: Up to ₹12,500 (Old)</li>
              <li>• Section 87A: Up to ₹25,000 (New)</li>
              <li>• Available for income up to ₹7L</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function HRACalculator() {
  const [basicSalary, setBasicSalary] = useState('');
  const [hraReceived, setHraReceived] = useState('');
  const [rentPaid, setRentPaid] = useState('');
  const [isMetro, setIsMetro] = useState(true);
  const [hraResults, setHraResults] = useState(null);

  const handleHRACalculate = () => {
    const basic = parseFloat(basicSalary);
    const hra = parseFloat(hraReceived);
    const rent = parseFloat(rentPaid);

    if (isNaN(basic) || isNaN(hra) || isNaN(rent)) {
      alert('Please enter valid amounts');
      return;
    }

    const results = calculateHRA(basic, hra, rent, isMetro);
    setHraResults(results);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">HRA Calculator</h2>
        <p className="text-gray-600">Calculate your HRA exemption</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (Annual)</label>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter basic salary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HRA Received (Annual)</label>
              <input
                type="number"
                value={hraReceived}
                onChange={(e) => setHraReceived(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter HRA received"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rent Paid (Annual)</label>
              <input
                type="number"
                value={rentPaid}
                onChange={(e) => setRentPaid(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter rent paid"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isMetro}
                    onChange={() => setIsMetro(true)}
                    className="mr-2"
                  />
                  Metro City
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!isMetro}
                    onChange={() => setIsMetro(false)}
                    className="mr-2"
                  />
                  Non-Metro City
                </label>
              </div>
            </div>

            <button
              onClick={handleHRACalculate}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
            >
              Calculate HRA Exemption
            </button>
          </div>
        </div>

        {hraResults && (
          <motion.div
            className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">HRA Calculation Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">HRA Exemption:</span>
                <span className="font-medium text-green-600">₹{hraResults.exemption.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable HRA:</span>
                <span className="font-medium text-red-600">₹{hraResults.taxableHRA.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AdvanceTaxCalculator() {
  const [annualTax, setAnnualTax] = useState('');
  const [advanceTaxResults, setAdvanceTaxResults] = useState(null);

  const handleAdvanceTaxCalculate = () => {
    const tax = parseFloat(annualTax);
    if (isNaN(tax) || tax < 0) {
      alert('Please enter a valid tax amount');
      return;
    }

    const results = calculateAdvanceTax(tax);
    setAdvanceTaxResults(results);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Advance Tax Calculator</h2>
        <p className="text-gray-600">Calculate your quarterly advance tax payments</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Tax Liability</label>
              <input
                type="number"
                value={annualTax}
                onChange={(e) => setAnnualTax(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter your annual tax liability"
              />
            </div>

            <button
              onClick={handleAdvanceTaxCalculate}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
            >
              Calculate Advance Tax
            </button>
          </div>
        </div>

        {advanceTaxResults && (
          <motion.div
            className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Advance Tax Payment Schedule</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(advanceTaxResults).map(([quarter, data]) => (
                <div key={quarter} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="font-medium text-gray-900">Q{quarter.slice(-1)} - {data.dueDate}</div>
                  <div className="text-lg font-semibold text-green-600">₹{data.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [interestResults, setInterestResults] = useState(null);

  const handleInterestCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      alert('Please enter valid values');
      return;
    }

    const results = calculateInterest(p, r, t);
    setInterestResults(results);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Interest Calculator</h2>
        <p className="text-gray-600">Calculate simple and compound interest</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal Amount</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter principal amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter interest rate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (Years)</label>
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter time period"
              />
            </div>

            <button
              onClick={handleInterestCalculate}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
            >
              Calculate Interest
            </button>
          </div>
        </div>

        {interestResults && (
          <motion.div
            className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interest Calculation Results</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Simple Interest</h4>
                <div className="text-2xl font-semibold text-blue-600">₹{interestResults.simpleInterest.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total: ₹{(parseFloat(principal) + interestResults.simpleInterest).toLocaleString()}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Compound Interest</h4>
                <div className="text-2xl font-semibold text-green-600">₹{interestResults.compoundInterest.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total: ₹{(parseFloat(principal) + interestResults.compoundInterest).toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ITRForm() {
  const itrForms = [
    {
      form: 'ITR-1 (Sahaj)',
      applicability: 'Individuals with salary, pension, and interest income up to ₹50 lakhs',
      features: ['Simple form', 'Online filing only', 'No business income']
    },
    {
      form: 'ITR-2',
      applicability: 'Individuals with capital gains, foreign income, or multiple house properties',
      features: ['Capital gains', 'Foreign assets', 'Multiple properties']
    },
    {
      form: 'ITR-3',
      applicability: 'Individuals with business or professional income',
      features: ['Business income', 'Professional income', 'Partnership income']
    },
    {
      form: 'ITR-4 (Sugam)',
      applicability: 'Presumptive income from business or profession',
      features: ['Presumptive taxation', 'Simplified filing', 'Lower compliance']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">ITR Form Guide</h2>
        <p className="text-gray-600">Choose the right ITR form for your income type</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {itrForms.map((form, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.form}</h3>
            <p className="text-gray-600 mb-4">{form.applicability}</p>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Key Features:</h4>
              <ul className="space-y-1">
                {form.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          Important Dates FY 2025-26
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Filing Deadlines:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• ITR-1, ITR-4: July 31, 2026</li>
              <li>• ITR-2, ITR-3: July 31, 2026</li>
              <li>• Audit cases: October 31, 2026</li>
              <li>• Revised return: December 31, 2026</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Key Requirements:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• PAN/Aadhaar mandatory</li>
              <li>• Bank account details required</li>
              <li>• Form 16 from employer</li>
              <li>• Investment proofs for deductions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: Calculator,
      title: "Tax Calculator",
      description: "Calculate income tax for both old and new regimes with accurate tax slabs"
    },
    {
      icon: Building,
      title: "HRA Calculator",
      description: "Calculate HRA exemption based on salary, rent, and city type"
    },
    {
      icon: CreditCard,
      title: "Advance Tax",
      description: "Calculate quarterly advance tax payments with due dates"
    },
    {
      icon: BarChart3,
      title: "Tax Slabs",
      description: "View current tax slabs for both regimes side by side"
    },
    {
      icon: GitCompare,
      title: "Regime Comparison",
      description: "Compare old vs new tax regime to find the best option"
    },
    {
      icon: PieChart,
      title: "Analytics",
      description: "Visual representation of your tax breakdown and savings"
    },
    {
      icon: TrendingUp,
      title: "Interest Calculator",
      description: "Calculate simple and compound interest for investments"
    },
    {
      icon: FileCheck,
      title: "ITR Form Guide",
      description: "Choose the right ITR form based on your income type"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Features</h2>
        <p className="text-gray-600">Comprehensive tax calculation tools</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">{feature.title}</h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Resources() {
  const resources = [
    {
      title: "Income Tax Act 1961",
      description: "Complete guide to Indian Income Tax Act",
      link: "#"
    },
    {
      title: "Tax Saving Investments",
      description: "80C, 80D and other tax saving options",
      link: "#"
    },
    {
      title: "ITR Filing Guide",
      description: "Step by step guide to file your ITR",
      link: "#"
    },
    {
      title: "TDS Calculator",
      description: "Calculate TDS on salary and other income",
      link: "#"
    },
    {
      title: "Capital Gains Guide",
      description: "Understanding short-term and long-term capital gains",
      link: "#"
    },
    {
      title: "Tax Planning Strategies",
      description: "Effective strategies to minimize tax liability",
      link: "#"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Resources</h2>
        <p className="text-gray-600">Helpful resources for tax planning</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <div className="flex items-center text-green-600 font-medium">
              Learn More <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Changelog() {
  const changes = [
    {
      version: "2.1.0",
      date: "January 15, 2025",
      changes: [
        "Added Interest Calculator",
        "Enhanced ITR Form Guide",
        "Improved mobile responsiveness",
        "Bug fixes and performance improvements"
      ]
    },
    {
      version: "2.0.0",
      date: "January 1, 2025",
      changes: [
        "Updated tax slabs for FY 2025-26",
        "Added new tax regime calculations",
        "Enhanced UI with better animations",
        "Added comprehensive analytics section"
      ]
    },
    {
      version: "1.5.0",
      date: "December 15, 2024",
      changes: [
        "Added HRA Calculator",
        "Advance Tax Calculator improvements",
        "Better comparison tools",
        "Enhanced user experience"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Changelog</h2>
        <p className="text-gray-600">Latest updates and improvements</p>
      </div>

      <div className="space-y-6">
        {changes.map((change, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Version {change.version}</h3>
              <span className="text-sm text-gray-500">{change.date}</span>
            </div>
            <ul className="space-y-2">
              {change.changes.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CalculateCompo() {
  const [activeTab, setActiveTab] = useState('calculator');
  const { LoggedInUserData, setLoggedInUserData } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <TaxCalculator />;
      case 'results':
        return <TaxResults />;
      case 'comparison':
        return <Comparison />;
      case 'analytics':
        return <Analytics />;
      case 'features':
        return <Features />;
      case 'resources':
        return <Resources />;
      case 'changelog':
        return <Changelog />;
      case 'regime-guide':
        return <RegimeGuide />;
      case 'tax-slabs':
        return <TaxSlabs />;
      case 'hra-calculator':
        return <HRACalculator />;
      case 'advance-tax':
        return <AdvanceTaxCalculator />;
      case 'interest':
        return <InterestCalculator />;
      case 'itr-form':
        return <ITRForm />;
      default:
        return <TaxCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>


    </div>
  );
}

export default CalculateCompo;