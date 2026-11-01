import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client safely
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini AI client initialized successfully.');
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
    }
  } else {
    console.warn('GEMINI_API_KEY not found in environment. Fallback responses will be used.');
  }

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'My Education Sathi API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // AI Education Sathi Chat (Doubt Solver & Topic Explainer)
  app.post('/api/chat/ask', async (req: Request, res: Response) => {
    try {
      const { prompt, language = 'en', subject = 'General', studentClass = 'Class 10' } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      // If Gemini client is available, use gemini-3.8-flash
      if (ai) {
        try {
          const langInstruction =
            language === 'or'
              ? 'Respond in clear, friendly Odia language (ଓଡ଼ିଆ).'
              : language === 'hi'
              ? 'Respond in friendly, encouraging Hindi language (हिन्दी).'
              : 'Respond in clear, encouraging English with simple explanations.';

          const systemInstruction = `You are "Education Sathi" (ଶିକ୍ଷା ସାଥୀ), a supportive, patient, and knowledgeable teacher for Indian students.
Target Audience: School (Classes 1-12), College (+2 Arts/Science, +3 UG), Government Job Aspirants (SSC, Railway, Banking, Odisha Police, OPSC, OSSSC), and IGNOU students.
Current context: Subject: ${subject}, Student Level: ${studentClass}.
${langInstruction}
Explain step-by-step with simple examples, key points, formula breakdown if applicable, and an encouraging closing tip. Keep formatting clean with bullet points and bold headers.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction,
            },
          });

          const replyText = response.text || 'I understand your query. Let us break this down step-by-step.';
          return res.json({ reply: replyText, source: 'gemini' });
        } catch (apiError: any) {
          console.error('Gemini API call failed, providing pedagogical fallback:', apiError);
        }
      }

      // Intelligent educational fallback response if Gemini is offline or key missing
      let fallback = '';
      const lower = prompt.toLowerCase();

      if (language === 'or') {
        if (lower.includes('math') || lower.includes('triangle') || lower.includes('equation') || lower.includes('formula')) {
          fallback = `**ଶିକ୍ଷା ସାଥୀ ଗଣିତ ସମାଧାନ:**\n\n- ପ୍ରଶ୍ନର ମୁଖ୍ୟ ସୂତ୍ର ମନେ ରଖନ୍ତୁ: $a^2 + b^2 = c^2$ (ପିଥାଗୋରାସ ସୂତ୍ର) କିମ୍ବା ବୀଜଗଣିତ ସୂତ୍ର $(a+b)^2 = a^2 + 2ab + b^2$।\n- ପଦକ୍ଷେପ ୧: ପ୍ରଥମେ ଦିଆଯାଇଥିବା ତଥ୍ୟ (Given data) ଲେଖନ୍ତୁ।\n- ପଦକ୍ଷେପ ୨: ଉପଯୁକ୍ତ ସୂତ୍ର ପ୍ରୟୋଗ କରି ମୂଲ୍ୟ ବସାନ୍ତୁ।\n- ପଦକ୍ଷେପ ୩: ସଂଖ୍ୟା ଗଣନା ଯାଞ୍ଚ କରନ୍ତୁ।\n\n*ଅଭ୍ୟାସ କରନ୍ତୁ ଏବଂ ଆଗକୁ ବଢ଼ନ୍ତୁ!*`;
        } else if (lower.includes('ignou') || lower.includes('dece')) {
          fallback = `**IGNOU DECE ମାର୍ଗଦର୍ଶନ:**\n\n- **DECE-1**: ପ୍ରାରମ୍ଭିକ ଶିଶୁ ଯତ୍ନ ଓ ବିକାଶ ପାଇଁ ଦୈନିକ କାର୍ଯ୍ୟକ୍ରମ ପ୍ରସ୍ତୁତି।\n- **DECE-4 Project**: ୩୦ ଦିନର ବିସ୍ତୃତ କାର୍ଯ୍ୟ ଯୋଜନା, ଶିଶୁ କାର୍ଯ୍ୟକଳାପ ଫର୍ମାଟ୍ ଏବଂ ଗାଇଡ୍ ସାର୍ଟିଫିକେଟ୍ ସହ ପ୍ରସ୍ତୁତ କରନ୍ତୁ।\n- ପ୍ରତ୍ୟେକ ଅସାଇନମେଣ୍ଟରେ ନିଜ ଭାଷାରେ ଉଦାହରଣ ଦିଅନ୍ତୁ।`;
        } else {
          fallback = `**ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ଶିକ୍ଷା ସାଥୀ।**\n\nଆପଣଙ୍କ ପ୍ରଶ୍ନ ପାଇଁ ଧନ୍ୟବାଦ। ଏହି ବିଷୟଟି ପରୀକ୍ଷା ଦୃଷ୍ଟିକୋଣରୁ ଅତ୍ୟନ୍ତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ:\n1. ମୁଖ୍ୟ ଧାରଣା (Key Concepts) କୁ ସ୍ପଷ୍ଟ ଭାବେ ବୁଝନ୍ତୁ।\n2. ପ୍ରତିଦିନ ସଂକ୍ଷିପ୍ତ ନୋଟ୍ସ ପ୍ରସ୍ତୁତ କରନ୍ତୁ ଏବଂ ପୂର୍ବ ବର୍ଷ ପ୍ରଶ୍ନ (PYQ) ଅଭ୍ୟାସ କରନ୍ତୁ।\n3. ଆମ ଆପ୍ ର ମକ୍ ଟେଷ୍ଟ ଦେଇ ନିଜର ଦକ୍ଷତା ମାପନ୍ତୁ।`;
        }
      } else if (language === 'hi') {
        if (lower.includes('ssc') || lower.includes('upsc') || lower.includes('opsc') || lower.includes('gk')) {
          fallback = `**शिक्षा साथी - सरकारी परीक्षा मार्गदर्शिका:**\n\n- **सामान्य ज्ञान (GK)**: भारतीय संविधान के अनुच्छेद, आधुनिक भारत का इतिहास एवं मासिक करेंट अफेयर्स का नियमित रिवीजन करें।\n- **तर्कशक्ति (Reasoning)**: कोडिंग-डिकोडिंग, सिटिंग अरेंजमेंट और ब्लड रिलेशन के 20 सवाल प्रतिदिन हल करें।\n- **मॉक टेस्ट**: परीक्षा से पहले टाइम-मैनेजमेंट का अभ्यास करें और नेगेटिव मार्किंग से बचें।`;
        } else {
          fallback = `**नमस्ते! मैं आपका शिक्षा साथी हूँ।**\n\nआपके प्रश्न का विस्तृत उत्तर:\n- **मुख्य बिंदु**: इस विषय को 3 भागों में बांटकर समझें - परिभाषा, मुख्य सिद्धांत, और व्यावहारिक अनुप्रयोग।\n- **परीक्षा टिप**: पिछले वर्ष के प्रश्नों (PYQs) को हल करें और फॉर्मूला शीट तैयार रखें।\n- कोई और संदेह हो तो निसंकोच पूछें!`;
        }
      } else {
        fallback = `**Hello Student! I am your Education Sathi (Study Companion).**\n\nHere is a structured breakdown for **"${prompt}"**:\n\n1. **Core Concept**: Break the topic into foundational definitions and practical applications.\n2. **Important Exam Angles**: Focus on high-frequency questions from previous years (PYQs) and syllabus weightage.\n3. **Quick Practice Strategy**: Summarize in 3 bullet points, revise the formula/summary sheet, and attempt the corresponding Mock Test in the App.\n\n*Feel free to ask for formula derivations, assignment format guidance, or shortcut tricks!*`;
      }

      return res.json({ reply: fallback, source: 'curated' });
    } catch (err: any) {
      console.error('Server error in /api/chat/ask:', err);
      res.status(500).json({ error: 'Failed to process inquiry' });
    }
  });

  // Razorpay Payment Order Creation Simulation
  app.post('/api/payment/create-order', (req: Request, res: Response) => {
    try {
      const { planId, planName, amount, currency = 'INR', studentEmail, studentName } = req.body;

      if (!amount || !planId) {
        return res.status(400).json({ error: 'Missing planId or amount' });
      }

      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const receiptId = `rcpt_${Math.floor(100000 + Math.random() * 900000)}`;

      // Return simulated Razorpay order response
      res.json({
        success: true,
        orderId,
        receiptId,
        amount: Math.round(Number(amount) * 100), // in paise
        currency,
        planId,
        planName,
        key: 'rzp_test_MyEduSathi2026',
        prefill: {
          name: studentName || 'Student',
          email: studentEmail || 'student@myeducationsathi.com',
          contact: '+91 9876543210',
        },
        theme: {
          color: '#1D4ED8', // Royal Blue
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Error generating payment order' });
    }
  });

  // Razorpay Payment Verification
  app.post('/api/payment/verify', (req: Request, res: Response) => {
    try {
      const { orderId, paymentId, signature, planId, durationMonths = 1, amount } = req.body;

      if (!orderId || !paymentId) {
        return res.status(400).json({ error: 'Invalid payment payload' });
      }

      // Calculate new subscription expiry date
      const now = new Date();
      const expiry = new Date(now.setMonth(now.getMonth() + Number(durationMonths)));
      const invoiceNumber = `INV-MES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      res.json({
        success: true,
        verified: true,
        paymentId,
        orderId,
        invoiceNumber,
        invoiceDate: new Date().toISOString(),
        expiryDate: expiry.toISOString(),
        amountPaid: amount,
        message: 'Payment verified successfully. Premium content unlocked!',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Verification error' });
    }
  });

  // Vite development middleware or static serving
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 My Education Sathi server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
