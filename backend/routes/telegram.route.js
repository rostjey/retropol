import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/call-waiter", async (req, res) => {
  const { tableNumber } = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: `🛎️ Yeni çağrı! Masa ${tableNumber} garson çağırıyor.`,
    });

    res.status(200).json({ success: true, message: "Bildirim gönderildi." });
  } catch (error) {
    console.error("Telegram API hatası:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Bildirim gönderilemedi." });
  }
});

export default router;
