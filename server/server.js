import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"

// Load env variables
dotenv.config()

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
  createdAt: { type: Date, default: Date.now }
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
