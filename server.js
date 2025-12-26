const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "arpan_secret_key_900";

// --- MIDDLEWARE ---
// Standard CORS - Allows all origins during development.
// In production, you should specify your frontend domain.
app.use(cors());

app.use(express.json({ limit: "50mb" }));

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.info("👉 Troubleshooting: Is your local MongoDB instance running?");
  });

// --- MODELS ---
const options = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const ProjectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    imageUrl: String,
    objectPosition: String,
    createdAt: { type: Number, default: Date.now },
  },
  options
);
const Project = mongoose.model("Project", ProjectSchema);

const MessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    date: { type: Number, default: Date.now },
  },
  options
);
const Message = mongoose.model("Message", MessageSchema);

const SettingsSchema = new mongoose.Schema(
  {
    designerName: String,
    heroHeading: String,
    heroSubtext: String,
    contactEmail: String,
    socialLinks: Object,
    footerText: String,
    footerCopyright: String,
    stats: Array,
    aboutText: String,
    aboutImageUrl: String,
  },
  { ...options, strict: false }
);
const Settings = mongoose.model("Settings", SettingsSchema);

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Session expired. Please login again." });
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// Health Check
app.get("/api/health", (req, res) =>
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  })
);

// Auth
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "arpan900";

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Invalid passkey" });
});

// Projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects", authenticateToken, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings
app.get("/api/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      return res.json({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/settings", authenticateToken, async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Messages
app.post("/api/messages", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/messages", authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/messages/:id", authenticateToken, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API active at: http://localhost:${PORT}/api`);
});
