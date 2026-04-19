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
  // Simple intent detection
  if (text.toLowerCase().includes("bali")) {
    lead.destination = "Bali";
  }
  await lead.save();
  // Auto reply
  await sendMessage(from, Hi! Planning ${lead.destination || "a trip"}? 😊);
  res.sendStatus(200);
});
