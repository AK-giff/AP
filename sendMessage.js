const axios = require("axios");
async function sendMessage(phone, message) {
  await axios.post(
    https://graph.facebook.com/v18.0/YOUR_PHONE_ID/messages,
    {
      messaging_product: "whatsapp",
      to: phone,
      text: { body: message }
    },
    {
      headers: {
        Authorization: Bearer ${process.env.WHATSAPP_TOKEN}
      }
    }
  );
}
