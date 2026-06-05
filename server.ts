import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

dotenv.config();


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

      if (!ai) {
        // Fallback responses when Gemini API Key is missing (Offline demo mode)
        const fallbackMsg = "সালাম! কৃষক বাজার এআই চ্যাটবটে আপনাকে স্বাগতম। বর্তমানে এআই কী লোড করা না থাকায় আমি অফলাইন ডেমো মোডে সাহায্য করছি। আপনি পণ্য ক্রয় করতে পারেন অথবা কার্টে পণ্য যোগ করে হোয়াটসঅ্যাপে আমাদের সরাসরি অর্ডার পাঠাতে পারেন। ধন্যবাদ!";
        return res.json({ response: fallbackMsg });
      }

      const systemInstruction = 
        "আপনি হচ্ছেন 'Riktaz AI' (কৃষক বাজার এআই সহকারী)।\n" +
        "নিচের নিয়মগুলো অত্যন্ত কঠোরভাবে মেনে চলুন:\n" +
        "১. উত্তর সবসময় অত্যন্ত সংক্ষিপ্ত, সরাসরি, নির্ভুল এবং বাংলায় দিন। কোনো লম্বা ভূমিকা বা অপ্রয়োজনীয় শুভেচ্ছা বার্তা দেবেন না। ঠিক যতটুকু জানতে চাওয়া হয়েছে, শুধুমাত্র ততটুকু বলবেন।\n" +
        "২. ৩ জনের পরিবারের ৪/৫ জনের ১ সপ্তাহের বাজার বা ফ্যামিলি বাজেট সম্পর্কে জানতে চাইলে অত্যন্ত সংক্ষেপে (২-৩ লাইনের মধ্যে) আমাদের ৫ সদস্যের সাপ্তাহিক প্রিমিয়াম ফ্যামিলি বাস্কেট যার মূল্য মাত্র ৳৪৯৯ (স্পেশাল অফার) সেটি সরাসরি অফার করবেন এবং এর শেষে [PRODUCT_CARD: weekly-family-basket] ট্যাগটি যুক্ত করবেন।\n" +
        "৩. গ্রাহক যদি নির্দিষ্ট কোনো পণ্যের নাম জিজ্ঞেস করে (যেমন ‘আলু’, ‘লাউ’, ‘ঘি’) তবে উত্তরের শেষে অবশ্যই [PRODUCT_CARD: <product-slug>] যুক্ত করবেন। যেমন: আলুর জন্য [PRODUCT_CARD: alu-potato], লাউয়ের জন্য [PRODUCT_CARD: lau-bottlegourd], খাঁটি ঘির জন্য [PRODUCT_CARD: pure-cow-ghee]।\n" +
        "৪. কোনো অবস্থাতেই বড় বা অপ্রয়োজনীয় প্যারাগ্রাফ লিখবেন না।";

      // Configure chat with history
      const formattedHistory = Array.isArray(history)
        ? history.map((h: any) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content || "" }],
          }))
        : [];

      // Create a model text generation call using the correct gemini-3.5-flash alias
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

      const responseText = response.text || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";
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

      // HTML Email Body Generation
      const itemsListHtml = order.items.map((item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${item.title}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.selectedWeight || item.unit || "N/A"}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">৳${item.price * item.quantity}</td>
        </tr>
      `).join("");

      const emailSubject = `🚨 New Checkout Alert! ID: ${order.id} - ৳${order.total}`;
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #ffffff; color: #333">
          <div style="background-color: #2E7D32; color: #ffffff; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold;">KRISHOK BAZAR</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">দালাল মুক্ত নতুন কৃষি বাজার - নতুন ক্রয় বিজ্ঞপ্তি</p>
          </div>
          
          <h3 style="color: #2E7D32; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-top: 0;">গ্রাহক বিবরণী (Customer Details)</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr><td style="padding: 6px 0; width: 120px;"><strong>নাম:</strong></td><td style="padding: 6px 0; color: #111;">${order.customerName}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>মোবাইল:</strong></td><td style="padding: 6px 0; color: #111;"><a href="tel:${order.customerPhone}" style="color: #2E7D32; text-decoration: none; font-weight: bold;">${order.customerPhone}</a></td></tr>
            <tr><td style="padding: 6px 0;"><strong>ইমেইল:</strong></td><td style="padding: 6px 0; color: #111;">${order.customerEmail || "Not provided"}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>বিতরণ ঠিকানা:</strong></td><td style="padding: 6px 0; color: #555;">${order.customerAddress}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>ডেলিভারি এরিয়া:</strong></td><td style="padding: 6px 0; color: #555;">${order.deliveryArea || "All Area"}</td></tr>
          </table>

          <h3 style="color: #2E7D32; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">অর্ডার সামগ্রী (Ordered Items)</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background-color: #f7f9f7; color: #2E7D32;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #2E7D32;">পণ্য</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #2E7D32;">ওজন বাছাই</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #2E7D32;">পরিমাণ</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #2E7D32;">উপমোট</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <div style="text-align: right; margin-top: 15px; font-size: 13px; line-height: 1.6; border-top: 1px solid #eeeeee; padding-top: 15px;">
            ডেলিভারি চার্জ: ৳${order.shippingCost || 0}<br/>
            <span style="color: #2E7D32; font-size: 18px; font-weight: bold;">সর্বমোট প্রদেয়: ৳${order.total}</span>
          </div>

          <hr style="border: none; border-top: 1px dashed #dddddd; margin-top: 25px; margin-bottom: 15px;" />
          <p style="font-size: 10px; color: #888; text-align: center; margin: 0;">This email was dispatched securely by Cloud Run SMTP. To stop getting notifications, configure setting flags.</p>
        </div>
      `;

      if (smtpHost && smtpUser && smtpPass) {
        // Build transporter securely, lazy-initialized
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: smtpPort === "465", // true for port 465, false for 587
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
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
        console.warn("SMTP credentials not fully set in .env. Order alert outputted to console log only:");
        console.log(`=======================[ DEMO EMAIL ]=======================\nSubject: ${emailSubject}\nRecipient: ${recipient}\nDetails:\n${JSON.stringify(order, null, 2)}\n============================================================`);
        return res.json({ 
          success: true, 
          method: "console", 
          warning: "SMTP not configured. Order alert is logged to system terminal securely instead." 
        });
      }
    } catch (err: any) {
      console.error("Failed to process order email alert:", err);
      // Return 200/success anyway so it doesn't block the frontend checkout flow
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
          <div style="background-color: #855c1b; background: linear-gradient(135deg, #2E7D32, #855c1b); color: #ffffff; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">KRISHOK BAZAR PREMIUM CLUB</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">নতুন প্রিমিয়াম সাবস্ক্রিপশন আবেদন ও পেমেন্ট বিবরণী</p>
          </div>
          
          <h3 style="color: #2E7D32; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-top: 0;">গ্রাহকের তথ্য (Subscriber profile)</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr><td style="padding: 6px 0; width: 140px;"><strong>নাম:</strong></td><td style="padding: 6px 0; color: #111;">${subscription.customerName}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>মোবাইল (একাউন্ট):</strong></td><td style="padding: 6px 0; color: #111;"><a href="tel:${subscription.customerPhone}" style="color: #2E7D32; text-decoration: none; font-weight: bold;">${subscription.customerPhone}</a></td></tr>
            <tr><td style="padding: 6px 0;"><strong>ঠিকানা:</strong></td><td style="padding: 6px 0; color: #555;">${subscription.customerAddress || "No address provided"}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>লিঙ্গ:</strong></td><td style="padding: 6px 0; color: #111;">${subscription.customerGender || "Not specified / Optional"}</td></tr>
            <tr><td style="padding: 6px 0;"><strong>ইউনিক কোড:</strong></td><td style="padding: 6px 0; font-family: monospace; font-weight: bold; background: #f8f8f8; padding: 2px 6px; border-radius: 4px; display: inline-block;">${subscription.uniqueCode}</td></tr>
          </table>

          <h3 style="color: #855c1b; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">সাবস্ক্রিপশন প্ল্যান ও পেমেন্ট ট্রানজেকশন (Plan & Payment Gateway)</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr>
              <td style="padding: 8px 10px; background-color: #fcf9f2; font-weight: bold; border-bottom: 1px solid #eee;">বাছাইকৃত প্ল্যান:</td>
              <td style="padding: 8px 10px; background-color: #fcf9f2; color: #855c1b; font-weight: bold; border-bottom: 1px solid #eee;">${subscription.tier} (৳${subscription.amount})</td>
            </tr>
            <tr>
              <td style="padding: 8px 10px; border-bottom: 1px solid #eee; font-weight: bold;">পেমেন্ট মেথড:</td>
              <td style="padding: 8px 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #2354c4;">${subscription.paymentMethod || "bKash/Nagad"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 10px; border-bottom: 1px solid #eee; font-weight: bold;">প্রেরক নম্বর (নগদ/বিকাশ):</td>
              <td style="padding: 8px 10px; border-bottom: 1px solid #eee; color: #111; font-weight: bold; font-family: monospace;">${subscription.senderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #fff9e6;">ট্রানজেকশন আইডি (TxnID):</td>
              <td style="padding: 8px 10px; border-bottom: 1px solid #eee; color: #d32f2f; font-weight: bold; font-family: monospace; background-color: #fff9e6;">${subscription.txnId}</td>
            </tr>
          </table>

          <p style="font-size: 11px; color: #d32f2f; background-color: #ffebee; padding: 12px; border-radius: 8px; font-weight: bold; margin: 20px 0;">
            ⚠️ ট্রানজেকশনটি যাচাই করে আগামী ১২-২৪ ঘণ্টার মধ্যে এডমিন প্যানেল থেকে এই প্রিমিয়াম অ্যাকাউন্টটি সচল করে দিন।
          </p>

          <hr style="border: none; border-top: 1px dashed #dddddd; margin-top: 25px; margin-bottom: 15px;" />
          <p style="font-size: 10px; color: #888; text-align: center; margin: 0;">This email was dispatched securely by Cloud Run SMTP for Krishok Bazar subscriptions.</p>
        </div>
      `;

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: smtpPort === "465",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"Krishok Bazar Premium Verification" <${smtpUser}>`,
          to: recipient,
          subject: emailSubject,
          html: emailHtml,
        });

        console.log(`Subscription email successfully dispatched to ${recipient}`);
        return res.json({ success: true, method: "smtp" });
      } else {
        console.warn("SMTP credentials not fully set in .env. Subscription logged to terminal instead:");
        console.log(`=======================[ DEMO SUBSCRIPTION EMAIL ]=======================\nSubject: ${emailSubject}\nRecipient: ${recipient}\nDetails:\n${JSON.stringify(subscription, null, 2)}\n========================================================================`);
        return res.json({ 
          success: true, 
          method: "console", 
          warning: "SMTP not configured. Alert printed to server output channel instead."
        });
      }
    } catch (err: any) {
      console.error("Failed to process subscription notification email:", err);
      return res.status(200).json({ success: false, error: err.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
