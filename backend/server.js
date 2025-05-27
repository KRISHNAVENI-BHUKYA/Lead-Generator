const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 5000;

app.use(cors()); // Use cors middleware
app.use(express.json()); // Parse JSON bodies

// Route to test server
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// POST route to receive lead data
app.post("/api/lead", async (req, res) => {
    const { name, email, company, message } = req.body;
  
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
  
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
  
    try {
      console.log("Sending to n8n:", {
        url: process.env.N8N_WEBHOOK_URL,
        data: { name, email, company, message },
      });
  
      const response = await axios.post('https://krishnavenibhukya.app.n8n.cloud/webhook/602e8818-e093-4946-84e9-3823fdd1f8cb', {
        name, email, company, message,
      });
  
      console.log("n8n response status:", response.status);
  
      res.status(200).json({ message: "Lead submitted successfully." });
    } catch (error) {
      console.error("n8n error:", error.message); // ← this helps identify the issue
      res.status(500).json({ error: "Server error. Please try again." });
    }
  });
  

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});