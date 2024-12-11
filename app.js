const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db.js");
const app = express();
connectDB();
app.use(express.json());

const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 6969;

app.get("/", (req, res) => {
  res.json("working");
});

const fs = require("fs").promises;
const path = require("path");

// Function to recursively load route files
async function registerRoutes(folderPath, app) {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        // Recursively process subdirectories
        await registerRoutes(fullPath, app);
      } else if (file.endsWith(".js") || file.endsWith(".ts")) {
        // Convert file path to route path
        const routePath = fullPath
          .replace(/\\/g, "/")
          .replace(/^.*\/routes/, "")
          .replace(/\.[jt]s$/, "")
          .replace(/\/index$/, "");

        // Import route module
        const route = require(fullPath);

        // Register the route
        app.use(routePath, route);
        console.log(`Registered route: ${routePath}`);
      }
    }
  } catch (error) {
    console.error("Error loading routes:", error);
  }
}

// Initialize routes
registerRoutes(path.join(__dirname, "./routes"), app);

app.use(express.json());

module.exports = app;

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
