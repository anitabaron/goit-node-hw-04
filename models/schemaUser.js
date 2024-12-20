const mongoose = require("mongoose");
const bCrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);
// gdy user będzie się rejestrował, kodowanie
userSchema.methods.setPassword = async function (password) {
  this.password = await bCrypt.hash(password, 10);
};
// gdy user będzie się logował, porównanie
userSchema.methods.validatePassword = async function (password) {
  return await bCrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
