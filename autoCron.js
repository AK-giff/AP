setInterval(async () => {
  const leads = await Lead.find();
  for (let lead of leads) {
    const hours = (Date.now() - lead.lastInteraction) / (1000 * 60 * 60);
    if (hours > 24 && lead.status === "new") {
      await sendMessage(
        lead.phone,
        Hi! Just checking about your ${lead.destination || ""} trip 😊
      );
    }
  }
}, 3600000);
