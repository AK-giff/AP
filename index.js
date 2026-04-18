require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Lead = require("./Lead");

const app = express();
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

// Send message function
async function sendMessage(phone, message) {
  await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: phone,
      text: { body: message }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
      }
    }
  );
}

// Webhook
app.post("/webhook/whatsapp", async (req, res) => {
  const { from, text } = req.body;

  let lead = await Lead.findOne({ phone: from });

  if (!lead) {
    lead = await Lead.create({
      phone: from,
      name: "Unknown",
      lastInteraction: new Date()
    });
  }

  if (text.toLowerCase().includes("bali")) {
    lead.destination = "Bali";
  }

  lead.lastInteraction = new Date();
  await lead.save();

  await sendMessage(from, `Hi! Planning ${lead.destination || "a trip"}? 😊`);

  res.sendStatus(200);
});

// Cron
setInterval(async () => {
  const leads = await Lead.find();

  for (let lead of leads) {
    const hours =
      (Date.now() - lead.lastInteraction) / (1000 * 60 * 60);

    if (hours > 24 && lead.status === "new") {
      await sendMessage(
        lead.phone,
        `Hi! Just checking about your ${lead.destination || ""} trip 😊`
      );
    }
  }
}, 3600000);

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
