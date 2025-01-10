const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const filePath = "counter.txt";

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect(
    // "mongodb+srv://at604281:wetware9211@dashboarddb.ysw862b.mongodb.net/CERTIFICATE-DB",
    "mongodb+srv://amiruncodemy:x86Gg0op2iGx0dhG@cluster0.kzkkh.mongodb.net/CERTIFICATE",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  uniqueKey: String,
  cerficateno: String,
});
const Certificate = mongoose.model("Certificate", certificateSchema);

// Function to read the current counter value from the file
function readCounter() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(parseInt(data, 10) || 0); // Default to 0 if file content is invalid
      }
    });
  });
}

// Function to increment the counter and write it back to the file
async function updateCounter(counter) {
  try {
    const currentCount = await readCounter();
    fs.writeFile(filePath, counter.toString(), (err) => {
      if (err) {
        console.error("Error writing to counter.txt:", err);
      } else {
        console.log(`Counter updated to: ${counter}`);
      }
    });
  } catch (err) {
    console.error("Error reading counter.txt:", err);
  }
}

// Generate Endpoint
app.post("/generate", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the certificate already exists based on email and phone
    const existingCertificate = await Certificate.findOne({ email, phone });
    const uniqueKey = `U-${Math.floor(100000 + Math.random() * 900000)}`;

    if (existingCertificate) {
      // If certificate already exists, return a message to prevent re-download
      return res.status(400).json({
        data: existingCertificate,
        message: "Certificate already exists.",
      });
    }

    // If no existing certificate, generate a new one
    const currentCount = await readCounter();
    updateCounter(currentCount + 1);
    const certificateno = `UC / 2025 / 01 / ${currentCount + 1}`;
    const newCertificate = new Certificate({
      name,
      email,
      phone,
      uniqueKey,
      cerficateno: certificateno,
    });
    await newCertificate.save();

    return res.status(200).json({ data: newCertificate });
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Download Endpoint
app.post("/download", async (req, res) => {
  const { uniqueKey } = req.body;

  if (!uniqueKey) {
    return res.status(400).json({ message: "Unique key is required." });
  }

  try {
    // Find the certificate with the provided unique key
    const certificate = await Certificate.findOne({ uniqueKey });

    if (!certificate) {
      // If no certificate is found, return an error message
      return res
        .status(404)
        .json({ message: "Invalid unique key. Certificate not found." });
    }

    // If certificate is found, return the certificate data
    return res.status(200).json({ data: certificate });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
