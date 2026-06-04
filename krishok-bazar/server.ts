import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

dotenv.config();

// Pre-defined FAQ answers for instant (<200ms) response to common questions
const FAQ_MAP: Array<{ patterns: string[]; answer: string }> = [
  {
    patterns: ['\u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf', '\u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09c0', 'delivery', '\u0995\u09a4\u09a6\u09bf\u09a8', '\u0995\u09a4 \u09a6\u09bf\u09a8', '\u0995\u0996\u09a8 \u09aa\u09be\u09ac'],
    answer: '\ud83d\udce6 \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf \u09a4\u09a5\u09cd\u09af:\n\u2022 \u09a2\u09be\u0995\u09be \u09b8\u09bf\u099f\u09bf: \u09e8\u09ea-\u09ea\u09ee \u0998\u09a3\u09cd\u099f\u09be (\u099a\u09be\u09b0\u09cd\u099c \u09ee\u09e6 \u099f\u09be\u0995\u09be)\n\u2022 \u09b8\u09be\u09ac-\u09a2\u09be\u0995\u09be: \u09ea\u09ee \u0998\u09a3\u09cd\u099f\u09be (\u099a\u09be\u09b0\u09cd\u099c \u09e7\u09e6\u09e6 \u099f\u09be\u0995\u09be)\n\u2022 \u099c\u09c7\u09b2\u09be \u09b8\u09a6\u09b0: \u09ea\u09ee-\u09ed\u09e8 \u0998\u09a3\u09cd\u099f\u09be (\u099a\u09be\u09b0\u09cd\u099c \u09e7\u09eb\u09e6 \u099f\u09be\u0995\u09be)\n\u2022 \u09eb\u09e6\u09e6 \u099f\u09be\u0995\u09be\u09b0 \u09ac\u09c7\u09b6\u09bf \u0985\u09b0\u09cd\u09a1\u09be\u09b0\u09c7 \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf \u09ab\u09cd\u09b0\u09bf!'
  },
  {
    patterns: ['\u09a6\u09be\u09ae', '\u09ae\u09c2\u09b2\u09cd\u09af', 'price', '\u0995\u09a4 \u099f\u09be\u0995\u09be', '\u0995\u09a4 \u09a6\u09be\u09ae'],
    answer: '\ud83d\udcb0 \u0986\u09ae\u09be\u09a6\u09c7\u09b0 \u09ae\u09c2\u09b2\u09cd\u09af \u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u0995\u09c3\u09b7\u0995 \u09a5\u09c7\u0995\u09c7 \u09a8\u09c7\u0993\u09df\u09be \u2014 \u09ac\u09be\u099c\u09be\u09b0\u09c7\u09b0 \u099a\u09c7\u09df\u09c7 \u09e7\u09eb-\u09e9\u09e6% \u0995\u09ae\u0964 \u09aa\u09a3\u09cd\u09af\u09c7\u09b0 \u09aa\u09c7\u099c\u09c7 \u0997\u09bf\u09df\u09c7 \u09b8\u09a0\u09bf\u0995 \u09a6\u09be\u09ae \u09a6\u09c7\u0996\u09c1\u09a8\u0964 \u0993\u099c\u09a8 \u0985\u09a8\u09c1\u09af\u09be\u09df\u09c0 \u09a6\u09be\u09ae \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u09b9\u09df (\u09eb\u09e6\u09e6\u0997\u09cd\u09b0\u09be\u09ae, \u09e7\u0995\u09c7\u099c\u09bf, \u09e8\u0995\u09c7\u099c\u09bf)\u0964'
  },
  {
    patterns: ['\u09ab\u09b0\u09ae\u09be\u09b2\u09bf\u09a8', '\u09b0\u09be\u09b8\u09be\u09df\u09a8\u09bf\u0995', '\u0995\u09c7\u09ae\u09bf\u0995\u09cd\u09af\u09be\u09b2', 'organic', '\u0985\u09b0\u09cd\u0997\u09be\u09a8\u09bf\u0995', '\u09a8\u09bf\u09b0\u09be\u09aa\u09a6'],
    answer: '\u2705 \u0995\u09c3\u09b7\u0995 \u09ac\u09be\u099c\u09be\u09b0\u09c7\u09b0 \u09b8\u0995\u09b2 \u09aa\u09a3\u09cd\u09af \u09e7\u09e6\u09e6% \u09ab\u09b0\u09ae\u09be\u09b2\u09bf\u09a8\u09ae\u09c1\u0995\u09cd\u09a4 \u0993 \u09b0\u09be\u09b8\u09be\u09df\u09a8\u09bf\u0995 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u0995\u09ae\u09c1\u0995\u09cd\u09a4\u0964 \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u0995\u09c3\u09b7\u0995 \u0985\u0999\u09cd\u0997\u09c0\u0995\u09be\u09b0\u09a8\u09be\u09ae\u09be \u09b8\u09cd\u09ac\u09be\u0995\u09cd\u09b7\u09b0 \u0995\u09b0\u09c7\u099b\u09c7\u09a8\u0964 \u09ae\u09be\u09a0 \u09a5\u09c7\u0995\u09c7 \u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u09ea\u09ee \u0998\u09a3\u09cd\u099f\u09be\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u0986\u09aa\u09a8\u09be\u09b0 \u09a6\u09cb\u09b0\u0997\u09cb\u09dc\u09be\u09df\u0964'
  },
  {
    patterns: ['\u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f', 'payment', '\u09ac\u09bf\u0995\u09be\u09b6', 'bkash', '\u09a8\u0997\u09a6', 'nagad', '\u0995\u09cd\u09af\u09be\u09b6', 'cash'],
    answer: '\ud83d\udcb3 \u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f \u09aa\u09a6\u09cd\u09a7\u09a4\u09bf:\n\u2022 \u0995\u09cd\u09af\u09be\u09b6 \u0985\u09a8 \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf (COD) \u2014 \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf\u09b0 \u09b8\u09ae\u09df \u099f\u09be\u0995\u09be \u09a6\u09bf\u09a8\n\u2022 bKash: 01931355398\n\u2022 Nagad: 01931355398\n\u0985\u09b0\u09cd\u09a1\u09be\u09b0 \u0995\u09b0\u09be\u09b0 \u09aa\u09b0\u09c7 WhatsApp-\u098f \u09ac\u09bf\u09b8\u09cd\u09a4\u09be\u09b0\u09bf\u09a4 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09ac\u09c7\u0964'
  },
  {
    patterns: ['\u09ab\u09c7\u09b0\u09a4', 'return', '\u09b0\u09bf\u09ab\u09be\u09a8\u09cd\u09a1', 'refund', '\u09b8\u09ae\u09b8\u09cd\u09af\u09be', 'problem', '\u09a8\u09b7\u09cd\u099f', '\u0996\u09be\u09b0\u09be\u09aa'],
    answer: '\ud83d\udd04 \u09b0\u09bf\u099f\u09be\u09b0\u09cd\u09a8 \u09aa\u09b2\u09bf\u09b8\u09bf: \u09aa\u09a3\u09cd\u09af \u09aa\u09c7\u09df\u09c7 \u09e8 \u0998\u09a3\u09cd\u099f\u09be\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u09b8\u09ae\u09b8\u09cd\u09af\u09be \u099c\u09be\u09a8\u09be\u09b2\u09c7 \u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u09ac\u09bf\u09a8\u09be\u09ae\u09c2\u09b2\u09cd\u09af\u09c7 \u09b0\u09bf\u09aa\u09cd\u09b2\u09c7\u09b8\u09ae\u09c7\u09a8\u09cd\u099f \u09a6\u09c7\u0993\u09df\u09be \u09b9\u09ac\u09c7\u0964 WhatsApp: 01931355398'
  },
  {
    patterns: ['\u09b8\u09be\u09ac\u09b8\u09cd\u0995\u09cd\u09b0\u09bf\u09aa\u09b6\u09a8', 'subscription', '\u09aa\u09cd\u09b0\u09bf\u09ae\u09bf\u09df\u09be\u09ae', 'premium', '\u09ae\u09c7\u09ae\u09cd\u09ac\u09be\u09b0', 'member'],
    answer: '\ud83d\udc51 \u09aa\u09cd\u09b0\u09bf\u09ae\u09bf\u09df\u09be\u09ae \u09b8\u09a6\u09b8\u09cd\u09af\u09a4\u09be:\n\u2022 \u09e7,\u09e6\u09e6\u09e6 \u099f\u09be\u0995\u09be/\u09ae\u09be\u09b8 \u2014 \u09ab\u09cd\u09b0\u09bf \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf\n\u2022 \u09e8,\u09e6\u09e6\u09e6 \u099f\u09be\u0995\u09be/\u09ae\u09be\u09b8 \u2014 \u09ab\u09cd\u09b0\u09bf \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf + \u09eb% \u099b\u09be\u09dc\n\u2022 \u09e9,\u09e6\u09e6\u09e6 \u099f\u09be\u0995\u09be/\u09ae\u09be\u09b8 \u2014 \u09e7\u09e6% \u099b\u09be\u09dc + \u098f\u0995\u09cd\u09b8\u0995\u09cd\u09b2\u09c1\u09b8\u09bf\u09ad \u09b8\u09c1\u09ac\u09bf\u09a7\u09be\nbKash/Nagad-\u098f \u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f \u0995\u09b0\u09c7 TxnID \u09b8\u09b9 \u0986\u09ac\u09c7\u09a6\u09a8 \u0995\u09b0\u09c1\u09a8\u0964'
  },
  {
    patterns: ['\u0995\u09c3\u09b7\u0995', 'farmer', '\u09af\u09cb\u0997 \u09a6\u09bf\u09a4\u09c7', 'join', '\u09a8\u09bf\u09ac\u09a8\u09cd\u09a7\u09a8', 'register'],
    answer: '\ud83c\udf3e \u0995\u09c3\u09b7\u0995 \u09b9\u09bf\u09b8\u09c7\u09ac\u09c7 \u09af\u09cb\u0997 \u09a6\u09bf\u09a4\u09c7:\n\u09e7. \u09b9\u09cb\u09ae\u09aa\u09c7\u099c\u09c7 "\u0995\u09c3\u09b7\u0995 \u09b2\u0997\u0987\u09a8" \u09ac\u09be\u099f\u09a8\u09c7 \u0995\u09cd\u09b2\u09bf\u0995 \u0995\u09b0\u09c1\u09a8\n\u09e8. "\u09a8\u09a4\u09c1\u09a8 \u0995\u09c3\u09b7\u0995 \u09a8\u09bf\u09ac\u09a8\u09cd\u09a7\u09a8" \u09ab\u09b0\u09cd\u09ae \u09aa\u09c2\u09b0\u09a3 \u0995\u09b0\u09c1\u09a8\n\u09e9. \u0985\u09cd\u09af\u09be\u09a1\u09ae\u09bf\u09a8 \u09ad\u09c7\u09b0\u09bf\u09ab\u09be\u09bf \u0995\u09b0\u09be\u09b0 \u09aa\u09b0\u09c7 \u098f\u0995\u09be\u0989\u09a8\u09cd\u099f \u09b8\u0995\u09cd\u09b0\u09bf\u09df \u09b9\u09ac\u09c7 (\u09e7\u09e8-\u09e8\u09ea \u0998\u09a3\u09cd\u099f\u09be)\n\u0995\u09c3\u09b7\u0995 \u09b9\u09b2\u09c7 \u09a8\u09cd\u09af\u09be\u09af\u09cd\u09af \u09ae\u09c2\u09b2\u09cd\u09af\u09c7 \u09aa\u09a3\u09cd\u09af \u09ac\u09bf\u0995\u09cd\u09b0\u09bf \u0995\u09b0\u09c1\u09a8 \u2014 \u09a6\u09be\u09b2\u09be\u09b2 \u099b\u09be\u09dc\u09be!'
  },
  {
    patterns: ['\u09b0\u09c7\u09a1\u09bf \u099f\u09c1 \u0995\u09c1\u0995', 'ready to cook', '\u0995\u09be\u099f\u09be \u09b8\u09ac\u099c\u09bf', '\u09aa\u09b0\u09bf\u09b7\u09cd\u0995\u09be\u09b0', 'clean'],
    answer: '\ud83c\udf73 \u09b0\u09c7\u09a1\u09bf-\u099f\u09c1-\u0995\u09c1\u0995 \u09b8\u09be\u09b0\u09cd\u09ad\u09bf\u09b8:\n\u2022 \u09b8\u09ac\u099c\u09bf \u09aa\u09b0\u09bf\u09b7\u09cd\u0995\u09be\u09b0 \u0995\u09b0\u09c7, \u0995\u09c7\u099f\u09c7 \u09aa\u09cd\u09af\u09be\u0995 \u0995\u09b0\u09c7 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09df\n\u2022 \u09b6\u09c1\u09a7\u09c1 \u09b0\u09be\u09a8\u09cd\u09a8\u09be \u0995\u09b0\u09b2\u09c7\u0987 \u09b9\u09ac\u09c7 \u2014 \u09b8\u09ae\u09df \u09ac\u09be\u0981\u099a\u09be\u09a8!\n\u2022 \u09b9\u09cb\u09ae\u09aa\u09c7\u099c\u09c7\u09b0 "\u09b0\u09c7\u09a1\u09bf-\u099f\u09c1-\u0995\u09c1\u0995" \u09b8\u09c7\u0995\u09b6\u09a8 \u09a5\u09c7\u0995\u09c7 \u0985\u09b0\u09cd\u09a1\u09be\u09b0 \u0995\u09b0\u09c1\u09a8\u0964'
  },
  {
    patterns: ['\u0995\u09ae\u09cd\u09ac\u09cb', 'combo', '\u09ac\u09be\u09b8\u09cd\u0995\u09c7\u099f', 'basket', '\u09b8\u09aa\u09cd\u09a4\u09be\u09b9', 'weekly', '\u09aa\u09b0\u09bf\u09ac\u09be\u09b0', 'family'],
    answer: '\ud83e\uddf9 \u09ab\u09cd\u09af\u09be\u09ae\u09bf\u09b2\u09bf \u0995\u09ae\u09cd\u09ac\u09cb \u09ac\u09be\u09b8\u09cd\u0995\u09c7\u099f:\n\u2022 \u09e9 \u099c\u09a8\u09c7\u09b0 \u09aa\u09b0\u09bf\u09ac\u09be\u09b0: \u09e9\u09ef\u09ef-\u09ea\u09ef\u09ef \u099f\u09be\u0995\u09be/\u09b8\u09aa\u09cd\u09a4\u09be\u09b9\n\u2022 \u09eb \u099c\u09a8\u09c7\u09b0 \u09aa\u09b0\u09bf\u09ac\u09be\u09b0: \u09eb\u09ef\u09ef-\u09ed\u09ef\u09ef \u099f\u09be\u0995\u09be/\u09b8\u09aa\u09cd\u09a4\u09be\u09b9\n[PRODUCT_CARD: weekly-family-basket]'
  },
  {
    patterns: ['\u09af\u09cb\u0997\u09be\u09af\u09cb\u0997', 'contact', '\u09ab\u09cb\u09a8', 'phone', '\u09a8\u09ae\u09cd\u09ac\u09b0', 'number', '\u09a0\u09bf\u0995\u09be\u09a8\u09be', 'address'],
    answer: '\ud83d\udcde \u09af\u09cb\u0997\u09be\u09af\u09cb\u0997:\n\u2022 WhatsApp/\u0995\u09b2: 01931355398\n\u2022 \u0987\u09ae\u09c7\u0987\u09b2: krishokbazar.com@gmail.com\n\u2022 \u09b8\u0995\u09be\u09b2 \u09ee\u099f\u09be \u09a5\u09c7\u0995\u09c7 \u09b0\u09be\u09a4 \u09e7\u09e6\u099f\u09be (\u09ed \u09a6\u09bf\u09a8)'
  }
];

function getFaqAnswer(msg: string): string | null {
  const lower = msg.toLowerCase();
  for (const faq of FAQ_MAP) {
    if (faq.patterns.some((p) => lower.includes(p.toLowerCase()))) {
      return faq.answer;
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client safely
  let ai: GoogleGenAI | null = null;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini client successfully initialized");
    } else {
      console.warn("GEMINI_API_KEY not found in environment variables. Chatbot will run in offline mode.");
    }
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
  }

  // API Endpoints for the Interactive AI Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Check FAQ first for instant response (no Gemini API call needed)
      const faqAnswer = getFaqAnswer(message);
      if (faqAnswer) {
        return res.json({ response: faqAnswer, source: "faq" });
      }

      if (!ai) {
        const fallbackMsg =
          "\u09b8\u09be\u09b2\u09be\u09ae! \u0995\u09c3\u09b7\u0995 \u09ac\u09be\u099c\u09be\u09b0 \u098f\u0906\u0987 \u099a\u09cd\u09af\u09be\u099f\u09ac\u099f\u09c7 \u0986\u09aa\u09a8\u09be\u0995\u09c7 \u09b8\u09cd\u09ac\u09be\u0997\u09a4\u09ae\u0964 \u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8\u09c7 \u098f\u0906\u0987 \u09a1\u09c7\u09ae\u09cb \u09ae\u09cb\u09a1\u09c7 \u09b8\u09be\u09b9\u09be\u09af\u09cd\u09af \u0995\u09b0\u099b\u09bf\u0964 \u0986\u09aa\u09a8\u09bf \u09aa\u09a3\u09cd\u09af \u0995\u09cd\u09b0\u09af\u09bc \u0995\u09b0\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u09a8 \u0985\u09a5\u09ac\u09be \u0995\u09be\u09b0\u09cd\u099f\u09c7 \u09aa\u09a3\u09cd\u09af \u09af\u09cb\u0997 \u0995\u09b0\u09c7 \u09b9\u09cb\u09df\u09be\u099f\u09b8\u0985\u09cd\u09af\u09be\u09aa\u09c7 \u0986\u09ae\u09be\u09a6\u09c7\u09b0 \u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u0985\u09b0\u09cd\u09a1\u09be\u09b0 \u09aa\u09be\u09a0\u09be\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u09a8\u0964 \u09a7\u09a8\u09cd\u09af\u09ac\u09be\u09a6!";
        return res.json({ response: fallbackMsg });
      }

      const systemInstruction =
        "\u0986\u09aa\u09a8\u09bf \u09b9\u099a\u09cd\u099b\u09c7\u09a8 'Riktaz AI' (\u0995\u09c3\u09b7\u0995 \u09ac\u09be\u099c\u09be\u09b0 \u098f\u0906\u0987 \u09b8\u09b9\u0995\u09be\u09b0\u09c0)\u0964\n" +
        "\u09a8\u09bf\u099a\u09c7\u09b0 \u09a8\u09bf\u09df\u09ae\u0997\u09c1\u09b2\u09cb \u0985\u09a4\u09cd\u09af\u09a8\u09cd\u09a4 \u0995\u09a0\u09cb\u09b0\u09ad\u09be\u09ac\u09c7 \u09ae\u09c7\u09a8\u09c7 \u099a\u09b2\u09c1\u09a8:\n" +
        "\u09e7. \u0989\u09a4\u09cd\u09a4\u09b0 \u09b8\u09ac\u09b8\u09ae\u09df \u0985\u09a4\u09cd\u09af\u09a8\u09cd\u09a4 \u09b8\u0982\u0995\u09cd\u09b7\u09bf\u09aa\u09cd\u09a4, \u09b8\u09b0\u09be\u09b8\u09b0\u09bf, \u09a8\u09bf\u09b0\u09cd\u09ad\u09c1\u09b2 \u098f\u09ac\u0982 \u09ac\u09be\u0982\u09b2\u09be\u09df \u09a6\u09bf\u09a8\u0964\n" +
        "\u09e8. \u09eb \u099c\u09a8\u09c7\u09b0 \u09aa\u09b0\u09bf\u09ac\u09be\u09b0\u09c7\u09b0 \u09b8\u09be\u09aa\u09cd\u09a4\u09be\u09b9\u09bf\u0995 \u09ac\u09be\u099c\u09be\u09b0 \u09ac\u09bf\u09b7\u09df\u09c7 \u099c\u09bf\u099c\u09cd\u099e\u09c7\u09b8 \u0995\u09b0\u09b2\u09c7 [PRODUCT_CARD: weekly-family-basket] \u09af\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09c1\u09a8\u0964\n" +
        "\u09e9. \u09a8\u09bf\u09b0\u09cd\u09a6\u09bf\u09b7\u09cd\u099f \u09aa\u09a3\u09cd\u09af\u09c7\u09b0 \u09a8\u09be\u09ae \u099c\u09bf\u099c\u09cd\u099e\u09c7\u09b8 \u0995\u09b0\u09b2\u09c7 [PRODUCT_CARD: <slug>] \u09af\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09c1\u09a8\u0964\n" +
        "\u09ea. \u09ac\u09dc \u09aa\u09cd\u09af\u09be\u09b0\u09be\u0997\u09cd\u09b0\u09be\u09ab \u09b2\u09bf\u0996\u09ac\u09c7\u09a8 \u09a8\u09be\u0964";

      const formattedHistory = Array.isArray(history)
        ? history.map((h: any) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content || "" }],
          }))
        : [];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...formattedHistory,
          { role: "user", parts: [{ text: message }] },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });

      const responseText = response.text || "\u09a6\u09c1\u0983\u0996\u09bf\u09a4, \u0995\u09cb\u09a8\u09cb \u0989\u09a4\u09cd\u09a4\u09b0 \u09aa\u09be\u0993\u09df\u09be \u09af\u09be\u09df\u09a8\u09bf\u0964";
      return res.json({ response: responseText });
    } catch (err: any) {
      console.error("Gemini Error:", err);
      return res.status(500).json({ error: err.message || "Gemini execution failed" });
    }
  });

  // Webhook/Endpoint for Order Notification emails
  app.post("/api/notify-order", async (req, res) => {
    try {
      const { order } = req.body;
      if (!order) {
        return res.status(400).json({ error: "Order payload is required" });
      }

      console.log(`Sending immediate email alert for Order ID: ${order.id}`);

      const recipient = process.env.NOTIFY_EMAIL || "krishokbazar.com@gmail.com";
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT || "587";
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      const itemsListHtml = order.items
        .map(
          (item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${item.title}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.selectedWeight || item.unit || "N/A"}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">৳${item.price * item.quantity}</td>
        </tr>
      `
        )
        .join("");

      const emailSubject = `🚨 New Checkout Alert! ID: ${order.id} - ৳${order.total}`;
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #ffffff; color: #333">
          <div style="background-color: #2E7D32; color: #ffffff; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold;">KRISHOK BAZAR</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">দালাল মুক্ত নতুন কৃষি বাজার - নতুন ক্রয় বিজ্ঞপ্তি</p>
          </div>
          <h3 style="color: #2E7D32; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-top: 0;">গ্রাহক বিবরণী</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr><td style="padding: 6px 0; width: 120px;"><strong>নাম:</strong></td><td style="padding: 6px 0; color: #111;">${order.customerName}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>মোবাইল:</strong></td><td style="padding: 6px 0; color: #111;"><a href="tel:${order.customerPhone}" style="color: #2E7D32; text-decoration: none; font-weight: bold;">${order.customerPhone}</a></td></tr>
            <tr><td style="padding: 6px 0;"><strong>ইমেইল:</strong></td><td style="padding: 6px 0; color: #111;">${order.customerEmail || "Not provided"}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>বিতরণ ঠিকানা:</strong></td><td style="padding: 6px 0; color: #555;">${order.customerAddress}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>ডেলিভারি এরিয়া:</strong></td><td style="padding: 6px 0; color: #555;">${order.deliveryArea || "All Area"}</td></tr>
          </table>
          <h3 style="color: #2E7D32; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">অর্ডার সামগ্রী</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background-color: #f7f9f7; color: #2E7D32;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #2E7D32;">পণ্য</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #2E7D32;">ওজন</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #2E7D32;">পরিমাণ</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #2E7D32;">উপমোট</th>
              </tr>
            </thead>
            <tbody>${itemsListHtml}</tbody>
          </table>
          <div style="text-align: right; margin-top: 15px; font-size: 13px; line-height: 1.6; border-top: 1px solid #eeeeee; padding-top: 15px;">
            ডেলিভারি চার্জ: ৳${order.shippingCost || 0}<br/>
            <span style="color: #2E7D32; font-size: 18px; font-weight: bold;">সর্বমোট: ৳${order.total}</span>
          </div>
          <hr style="border: none; border-top: 1px dashed #dddddd; margin-top: 25px; margin-bottom: 15px;" />
          <p style="font-size: 10px; color: #888; text-align: center; margin: 0;">Krishok Bazar SMTP notification service</p>
        </div>
      `;

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: smtpPort === "465",
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"Krishok Bazar Notification" <${smtpUser}>`,
          to: recipient,
          subject: emailSubject,
          html: emailHtml,
        });
        console.log(`Notification sent successfully to ${recipient}`);
        return res.json({ success: true, method: "smtp" });
      } else {
        console.warn("SMTP not configured. Order alert logged:");
        console.log(`Order: ${JSON.stringify(order, null, 2)}`);
        return res.json({ success: true, method: "console", warning: "SMTP not configured" });
      }
    } catch (err: any) {
      console.error("Failed to process order email alert:", err);
      return res.status(200).json({ success: false, error: err.message });
    }
  });

  // Webhook/Endpoint for Farmer Registration Notifications
  app.post("/api/notify-farmer-registration", async (req, res) => {
    try {
      const { farmer } = req.body;
      if (!farmer) {
        return res.status(400).json({ error: "Farmer payload is required" });
      }
      console.log(`New farmer registration: ${farmer.name} (${farmer.phone})`);

      const recipient = process.env.NOTIFY_EMAIL || "krishokbazar.com@gmail.com";
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT || "587";
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      const emailSubject = `🌾 নতুন কৃষক নিবন্ধন! ${farmer.name} - ${farmer.phone}`;
      const emailHtml = `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 580px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background: #fff;">
          <div style="background: linear-gradient(135deg, #1B5E20, #2E7D32); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 20px;">🌾 নতুন কৃষক নিবন্ধন আবেদন</h1>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr><td style="padding: 8px; font-weight: bold; width: 130px;">নাম:</td><td style="padding: 8px; color: #111;">${farmer.name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">ফোন:</td><td style="padding: 8px; color: #111; font-weight: bold;">${farmer.phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">জেলা:</td><td style="padding: 8px; color: #555;">${farmer.location || "N/A"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">খামার:</td><td style="padding: 8px; color: #555;">${farmer.farmName || "N/A"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">NID:</td><td style="padding: 8px; color: #555;">${farmer.nid || "দেওয়া হয়নি"}</td></tr>
          </table>
          <p style="font-size: 11px; color: #d32f2f; background: #ffebee; padding: 12px; border-radius: 8px; font-weight: bold; margin-top: 20px;">
            ⚠️ অ্যাডমিন প্যানেল থেকে এই কৃষকের নিবন্ধন অনুমোদন বা বাতিল করুন।
          </p>
        </div>
      `;

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: smtpPort === "465",
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"Krishok Bazar Farmers" <${smtpUser}>`,
          to: recipient,
          subject: emailSubject,
          html: emailHtml,
        });
        return res.json({ success: true, method: "smtp" });
      } else {
        console.log(`New farmer registration: ${JSON.stringify(farmer, null, 2)}`);
        return res.json({ success: true, method: "console" });
      }
    } catch (err: any) {
      console.error("Farmer registration notification failed:", err);
      return res.status(200).json({ success: false, error: err.message });
    }
  });

  // Webhook/Endpoint for Premium Subscription Notifications
  app.post("/api/notify-subscription", async (req, res) => {
    try {
      const { subscription } = req.body;
      if (!subscription) {
        return res.status(400).json({ error: "Subscription payload is required" });
      }

      console.log(`Sending immediate email alert for subscription of tier: ${subscription.tier}`);

      const recipient = "krishokbazar.com@gmail.com";
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT || "587";
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      const emailSubject = `👑 New Premium Subscription Alert! Plan: ${subscription.tier} - Tk ${subscription.amount}`;
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; border: 1px solid #ccab5e; border-radius: 16px; background-color: #ffffff; color: #333">
          <div style="background: linear-gradient(135deg, #2E7D32, #855c1b); color: #ffffff; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; text-transform: uppercase;">KRISHOK BAZAR PREMIUM CLUB</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">নতুন প্রিমিয়াম সাবস্ক্রিপশন আবেদন</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr><td style="padding: 6px 0; width: 140px;"><strong>নাম:</strong></td><td style="padding: 6px 0; color: #111;">${subscription.customerName}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>মোবাইল:</strong></td><td style="padding: 6px 0; color: #111;">${subscription.customerPhone}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>প্ল্যান:</strong></td><td style="padding: 6px 0; font-weight: bold; color: #855c1b;">${subscription.tier} (৳${subscription.amount})</td></tr>
            <tr><td style="padding: 6px 0;"><strong>TxnID:</strong></td><td style="padding: 6px 0; font-family: monospace; color: #d32f2f;">${subscription.txnId}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>Unique Code:</strong></td><td style="padding: 6px 0; font-family: monospace; font-weight: bold;">${subscription.uniqueCode}</td></tr>
          </table>
          <p style="font-size: 11px; color: #d32f2f; background-color: #ffebee; padding: 12px; border-radius: 8px; font-weight: bold; margin: 20px 0;">
            ⚠️ ট্রানজেকশনটি যাচাই করে ১২-২৪ ঘণ্টার মধ্যে একাউন্ট সক্রিয় করুন।
          </p>
        </div>
      `;

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: smtpPort === "465",
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"Krishok Bazar Premium" <${smtpUser}>`,
          to: recipient,
          subject: emailSubject,
          html: emailHtml,
        });
        console.log(`Subscription email dispatched to ${recipient}`);
        return res.json({ success: true, method: "smtp" });
      } else {
        console.warn("SMTP not configured. Subscription logged:");
        console.log(`Subscription: ${JSON.stringify(subscription, null, 2)}`);
        return res.json({ success: true, method: "console" });
      }
    } catch (err: any) {
      console.error("Failed to process subscription notification:", err);
      return res.status(200).json({ success: false, error: err.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "2.0" });
  });

  // Serve Vite in development / Statics in production
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite dev server integrating as custom middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving built static files in production...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
