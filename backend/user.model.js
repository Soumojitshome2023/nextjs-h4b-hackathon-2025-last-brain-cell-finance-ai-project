import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    picture: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    age: {
      type: Number,
      min: 0,
      default: 22
    },
    annualIncome: {
      type: Number,
      min: 0,
      default: 100000
    },
    monthlyExpense: {
      type: Number,
      min: 0,
      default: 20000
    },
    savings: {
      type: Number,
      min: 0,
      default: 5000
    },
    investmentHorizon: {
      type: Number, // in years
      min: 0,
      default: 2
    },
    riskTolerance: {
      type: String,
      default: "Medium",
      enum: ["Low", "Medium", "High"],
    },
    financialGoal: {
      type: String,
    },
    preferredAssets: {
      type: String,
    }
  },
  { timestamps: true }
);

export const User = mongoose.models.users || mongoose.model("users", userSchema);
