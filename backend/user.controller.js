import { User } from './user.model.js';

//  Create a new user with name, picture, email
export async function createUser({ name, picture, email }) {
  if (!name || !email) throw new Error("Name and email are required");

  const existingUser = await User.findOne({ email });
  if (existingUser) return existingUser;

  const newUser = new User({ name, picture, email });
  return await newUser.save();
}

// Fetch user data by email
export async function fetchUserByEmail(email) {
  if (!email) throw new Error("Email is required");
  return await User.findOne({ email });
}

// Set (update) other values using email
export async function updateUserDetails(email, updates) {
  if (!email) throw new Error("Email is required");

  const allowedFields = [
    'age', 'annualIncome', 'monthlyExpense', 'savings',
    'investmentHorizon', 'riskTolerance', 'financialGoal', 'preferredAssets'
  ];

  const filteredUpdates = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
  }

  return await User.findOneAndUpdate(
    { email },
    { $set: filteredUpdates },
    { new: true }
  );
}
