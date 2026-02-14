const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createFaculty = async () => {
    try {
        // Connect to Database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        console.log("\n--- Create Faculty User ---");

        // Interactive Questions
        const name = await question("Enter Faculty Name: ");
        if (!name) throw new Error("Name is required");

        const email = await question("Enter Faculty Email: ");
        if (!email) throw new Error("Email is required");

        const password = await question("Enter Password: ");
        if (!password) throw new Error("Password is required");

        console.log("\nAvailable Departments: CS, SE, CYS, AI, DS, IT, General");
        let department = await question("Enter Department (default: General): ");
        
        // Validation & Defaulting
        const validDepartments = ["CS", "SE", "CYS", "AI", "DS", "IT", "General"];
        department = department.trim();
        if (!department) {
            department = "General";
        } else if (!validDepartments.includes(department)) {
            console.log(`Invalid department '${department}'. Allowed: ${validDepartments.join(", ")}`);
            console.log("Aborting creation.");
            process.exit(1);
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("\n❌ User already exists with this email.");
            process.exit(1);
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create User
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: "faculty",
            department: department,
            isVerified: true,
        });

        await user.save();
        console.log(`\n✅ Faculty user created successfully!`);
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Department: ${department}`);
        
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error creating faculty user:", error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
};

createFaculty();
