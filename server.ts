import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialize Gemini API client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON body parsing (with large limit for base64 camera images)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'PackCheck Legal Metrology Compliance Engine',
      version: '2.4.0',
      pcrStandard: 'Rules 2011 & 2022 Amendment',
      timestamp: new Date().toISOString(),
    });
  });

  // AI Package Analysis endpoint (Rule 6, Rule 7, Rule 11 PCR 2011)
  app.post('/api/analyze-package', async (req, res) => {
    try {
      const { images, commodityHint, categoryHint, packageTypeHint } = req.body;

      const ai = getGeminiClient();

      // No API key configured — tell the caller clearly instead of faking data
      if (!ai) {
        console.error('GEMINI_API_KEY is missing or invalid. Set it in your deployment env vars.');
        return res.status(500).json({
          success: false,
          error: 'AI analysis is not configured on the server (missing GEMINI_API_KEY).',
        });
      }

      // No image sent — also a real error, not a case for fake data
      if (!images || images.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No image was provided for analysis.',
        });
      }

      // Convert images to contents for Gemini
      const imageParts = images.map((img: { data: string; mimeType: string }) => ({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType || 'image/jpeg',
        },
      }));

      const prompt = `You are a certified Legal Metrology Enforcement Officer in India specializing in The Legal Metrology Act, 2009 and Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011).
Inspect the attached package photographs and extract all mandatory statutory declarations as per Rule 6 and Rule 7.

Return ONLY a valid JSON object matching this schema:
{
  "commodityName": "string",
  "brand": "string",
  "manufacturer": "string",
  "mfgAddress": "string",
  "countryOfOrigin": "string",
  "netQuantity": "string",
  "mrp": "string",
  "unitSalePrice": "string",
  "mfgDate": "string",
  "expiryDate": "string",
  "consumerCare": "string",
  "status": "COMPLIANT" | "REVIEW_REQUIRED" | "NON_COMPLIANT",
  "score": number between 40 and 100,
  "violations": [
    {
      "ruleNumber": "string e.g. Rule 6(11)",
      "ruleTitle": "string",
      "severity": "high" | "medium" | "low",
      "evidence": "string",
      "legalClause": "string",
      "penaltySection": "string"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt, ...imageParts],
      });

      const responseText = response.text || '';
      let parsedData;
      try {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      } catch (e) {
        // Parsing failed — surface the real problem instead of inventing a product
        console.error('Failed to parse Gemini response as JSON:', responseText);
        return res.status(502).json({
          success: false,
          error: 'AI response could not be parsed. Try a clearer photo of the label.',
        });
      }

      return res.json({
        success: true,
        source: 'gemini_vision_ocr',
        data: parsedData,
      });
    } catch (error: any) {
      console.error('AI Analysis Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Inspection processing error',
      });
    }
  });

  // Vite development middleware or production static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PackCheck Server running on port ${PORT}`);
  });
}

startServer();
