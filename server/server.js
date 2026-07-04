import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"

// Load env variables
dotenv.config()

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.warn("WARNING: Nodemailer transporter failed to verify SMTP credentials. Emails will not send unless configured correctly in server/.env.")
    console.warn("Nodemailer verification error details:", error.message)
  } else {
    console.log("Nodemailer transporter is ready to send emails.")
  }
})

// Helper function to send welcome email
const sendWelcomeEmail = async (email, name) => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes("your-email@gmail.com")) {
    console.log(`Skipping Welcome Email to ${email} (SMTP credentials not configured)`)
    return
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Rommo - Premium Workspaces!",
    html: `
      <div style="background-color: #f6f9fc; padding: 40px 10px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #eef2f6;">
          
          <!-- Hero Banner with Rommo Brand -->
          <div style="background: linear-gradient(135deg, #f95716 0%, #ff7c43 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">ROMMO</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Your Premium Workspace Awaits</p>
          </div>

          <!-- Content Body -->
          <div style="padding: 40px 30px; color: #333333;">
            <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 16px 0; color: #1a1a1a;">Welcome to the family, ${name}! 🎉</h2>
            
            <p style="font-size: 15px; line-height: 1.6; color: #555555; margin: 0 0 24px 0;">
              We are thrilled to welcome you to <strong>Rommo</strong>. You have just taken the first step toward a more productive, flexible, and premium workspace experience.
            </p>

            <!-- Key Perks List -->
            <div style="background-color: #fcfcfc; border: 1px solid #f1f1f1; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
              <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #f95716; margin: 0 0 15px 0;">What you can do with Rommo:</h3>
              
              <div style="margin-bottom: 15px; display: flex; align-items: start;">
                <span style="font-size: 18px; margin-right: 12px; margin-top: 2px;">📍</span>
                <div>
                  <strong style="font-size: 14px; color: #222222; display: block;">Flexible Locations</strong>
                  <span style="font-size: 13px; color: #666666; display: block; margin-top: 2px;">Book premium focus cabins and shared desks in hot-spot areas across Bangalore.</span>
                </div>
              </div>

              <div style="margin-bottom: 15px; display: flex; align-items: start;">
                <span style="font-size: 18px; margin-right: 12px; margin-top: 2px;">⚡</span>
                <div>
                  <strong style="font-size: 14px; color: #222222; display: block;">Instant Access & High-Speed WiFi</strong>
                  <span style="font-size: 13px; color: #666666; display: block; margin-top: 2px;">Seamless online booking with zero waiting times. Just step in, connect, and start creating.</span>
                </div>
              </div>

              <div style="display: flex; align-items: start;">
                <span style="font-size: 18px; margin-right: 12px; margin-top: 2px;">🤝</span>
                <div>
                  <strong style="font-size: 14px; color: #222222; display: block;">Meeting Rooms & Studio Apartments</strong>
                  <span style="font-size: 13px; color: #666666; display: block; margin-top: 2px;">Host team meetups or client board meetings in professionally equipped workspaces.</span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0 10px 0;">
              <a href="http://localhost:5174/signin" style="background-color: #f95716; color: #ffffff; padding: 14px 32px; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px rgba(249, 87, 22, 0.15); transition: background-color 0.2s;">
                Explore Your Dashboard
              </a>
            </div>
            
            <p style="font-size: 13px; line-height: 1.5; color: #888888; text-align: center; margin: 15px 0 0 0;">
              Have questions? Reply directly to this email or write to us at <a href="mailto:support@rommo.in" style="color: #f95716; text-decoration: none;">support@rommo.in</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #fafbfc; border-top: 1px solid #eef2f6; padding: 30px; text-align: center;">
            <p style="font-size: 12px; color: #999999; margin: 0 0 8px 0;">
              &copy; ${new Date().getFullYear()} Rommo Inc. All rights reserved.
            </p>
            <p style="font-size: 11px; color: #b5b5b5; margin: 0;">
              Koramangala, Indiranagar, and HSR Layout, Bangalore, India.
            </p>
          </div>

        </div>
      </div>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Welcome email successfully sent to ${email}. MessageId: ${info.messageId}`)
  } catch (err) {
    console.error(`Failed to send welcome email to ${email}:`, err.message)
  }
}

// Helper function to send OTP email
const sendOtpEmail = async (email, otp, name) => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes("your-email@gmail.com")) {
    console.log(`Skipping OTP Email to ${email} (SMTP credentials not configured)`)
    return
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Reset your Rommo Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #f95716; margin: 0; font-size: 28px; letter-spacing: 2px;">ROMMO</h1>
          <p style="font-size: 12px; color: #666; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Premium Workspaces</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <h2 style="color: #333; margin-top: 20px;">Password Reset Request</h2>
        <p style="color: #555; line-height: 1.6;">
          Hello ${name},<br />
          We received a request to reset the password for your Rommo account. Use the following One-Time Password (OTP) to proceed:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; font-size: 32px; font-weight: bold; color: #f95716; letter-spacing: 5px; padding: 15px 30px; border: 2px dashed #f95716; border-radius: 4px; background-color: #fff9f6;">
            ${otp}
          </div>
          <p style="font-size: 11px; color: #888; margin-top: 10px;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
        </div>
        <p style="color: #555; line-height: 1.6;">
          If you did not request a password reset, please ignore this email or contact support if you have security concerns.
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 11px; color: #999; text-align: center; margin-top: 20px;">
          &copy; ${new Date().getFullYear()} Rommo Inc. All rights reserved.<br />
          Koramangala, Bangalore, India.
        </p>
      </div>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`OTP email successfully sent to ${email}. MessageId: ${info.messageId}`)
  } catch (err) {
    console.error(`Failed to send OTP email to ${email}:`, err.message)
  }
}

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())

// Default seed data
const DEFAULT_WORKSPACES = [
  { id: "d1", title: "Luxury Penthouse Suite", location: "Lavelle Road, Bangalore", price: 5499, image: "/comfort_room.png", rating: 4.9, type: "Suite", reviews: 48, status: "Available" },
  { id: "d2", title: "Creative Focus Cabin", location: "HSR Layout, Bangalore", price: 650, image: "/meeting_room.png", rating: 4.7, type: "Workspace", reviews: 112, status: "Available" },
  { id: "d3", title: "Greenery Studio Apartment", location: "Koramangala, Bangalore", price: 1899, image: "/urban_studio.png", rating: 4.8, type: "Room", reviews: 89, status: "Available" },
  { id: "d4", title: "Executive Boardroom", location: "Indiranagar, Bangalore", price: 1500, image: "/meeting_room.png", rating: 4.6, type: "Workspace", reviews: 34, status: "Maintenance" },
  { id: "d5", title: "Bachelor Monthly Room", location: "Koramangala, Bangalore", price: 14500, image: "/urban_studio.png", rating: 4.5, type: "Monthly", reviews: 67, status: "Available" }
]

// Workspace Schema
const workspaceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  type: { type: String, required: true },
  reviews: { type: Number, default: 0 },
  status: { type: String, default: "Available" }
})

const Workspace = mongoose.model("Workspace", workspaceSchema)

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date }
})

const User = mongoose.model("User", userSchema)

// Seed database helper
const seedDatabase = async () => {
  try {
    const count = await Workspace.countDocuments()
    if (count === 0) {
      await Workspace.insertMany(DEFAULT_WORKSPACES)
      console.log("Seeded database with default workspaces.")
    }
  } catch (err) {
    console.error("Error seeding database:", err)
  }
}

// Connect to MongoDB
if (!MONGODB_URI || MONGODB_URI.includes("cluster.xxxx.mongodb.net")) {
  console.warn("WARNING: MONGODB_URI is not configured with your real MongoDB Atlas connection string.")
  console.log("Please update MONGODB_URI in server/.env file and restart the server.")
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB Atlas successfully.")
      seedDatabase()
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB Atlas:", err.message)
      console.log("Please check your MONGODB_URI in server/.env")
    })
}

// APIs

// Auth APIs
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" })
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" })
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    })

    await newUser.save()

    // Send welcome email asynchronously
    sendWelcomeEmail(newUser.email, newUser.name)

    res.status(201).json({ message: "Registration successful", user: { name: newUser.name, email: newUser.email } })
  } catch (err) {
    console.error("Signup error:", err)
    res.status(500).json({ error: "Failed to register user" })
  }
})

app.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    res.json({ message: "Login successful", user: { name: user.name, email: user.email } })
  } catch (err) {
    console.error("Signin error:", err)
    res.status(500).json({ error: "Failed to sign in" })
  }
})

app.get("/api/workspaces", async (req, res) => {
  try {
    // If not connected to database, return mock/fallback data
    if (mongoose.connection.readyState !== 1) {
      console.log("Database not connected, returning default seed data...")
      return res.json(DEFAULT_WORKSPACES)
    }
    const data = await Workspace.find({}, { _id: 0, __v: 0 }).lean()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch workspaces from database" })
  }
})

app.post("/api/workspaces", async (req, res) => {
  const list = req.body
  if (!Array.isArray(list)) {
    return res.status(400).json({ error: "Body must be an array of workspaces" })
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" })
    }
    // Delete existing and bulk write
    await Workspace.deleteMany({})
    const inserted = await Workspace.insertMany(list)
    res.json({ message: "Workspaces updated successfully", data: inserted })
  } catch (err) {
    res.status(500).json({ error: "Failed to update workspaces in database" })
  }
})

app.post("/api/workspaces/single", async (req, res) => {
  const workspace = req.body
  if (!workspace || !workspace.id) {
    return res.status(400).json({ error: "Workspace must have an id" })
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" })
    }
    const updated = await Workspace.findOneAndUpdate(
      { id: workspace.id },
      workspace,
      { new: true, upsert: true, projection: { _id: 0, __v: 0 } }
    )
    res.json({ message: "Workspace saved successfully", data: updated })
  } catch (err) {
    res.status(500).json({ error: "Failed to save workspace in database" })
  }
})

// Forgot Password - Generate OTP
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: "Email is required" })
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Return success anyway to avoid email enumeration
      return res.json({ message: "If the email is registered, you will receive an OTP code." })
    }

    // Generate 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Save to user
    user.resetOtp = otp
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    await user.save()

    // Send email
    sendOtpEmail(user.email, otp, user.name)

    res.json({ message: "If the email is registered, you will receive an OTP code." })
  } catch (err) {
    console.error("Forgot password error:", err)
    res.status(500).json({ error: "Failed to initiate password reset" })
  }
})

// Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" })
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" })
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" })
    }

    res.json({ message: "OTP verified successfully. You can now reset your password." })
  } catch (err) {
    console.error("Verify OTP error:", err)
    res.status(500).json({ error: "Failed to verify OTP" })
  }
})

// Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: "Email, OTP and new password are required" })
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" })
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP request session" })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    
    // Clear OTP fields
    user.resetOtp = undefined
    user.resetOtpExpires = undefined
    
    await user.save()

    res.json({ message: "Password reset successful. Please sign in with your new password." })
  } catch (err) {
    console.error("Reset password error:", err)
    res.status(500).json({ error: "Failed to reset password" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
