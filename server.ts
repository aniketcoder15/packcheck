import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialize Gemini API client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
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

      if (!images || !Array.isArray(images) || images.length === 0) {
        console.warn('[OCR] Request rejected: No images provided in payload.');
        return res.status(400).json({
          success: false,
          error: 'Please upload or capture at least one package image for analysis.',
        });
      }

      // Filter and validate image parts
      const validImages = images.filter(
        (img: any) => img && typeof img.data === 'string' && img.data.trim().length > 0
      );

      if (validImages.length === 0) {
        console.warn('[OCR] Request rejected: Images array contains empty or invalid image data.');
        return res.status(400).json({
          success: false,
          error: 'Invalid image data provided. Please capture or upload a clear package photo.',
        });
      }

      console.log(`[OCR] Images received: ${validImages.length}`);
      validImages.forEach((img: any, idx: number) => {
        const rawLength = img.data.length;
        const approxBytes = Math.round((rawLength * 3) / 4);
        console.log(`[OCR] Image #${idx + 1} MIME: ${img.mimeType || 'image/jpeg'} | Approx Size: ${approxBytes} bytes`);
      });

      const ai = getGeminiClient();

      if (!ai) {
        console.error('[OCR] Configuration Error: GEMINI_API_KEY environment variable is missing.');
        return res.status(503).json({
          success: false,
          error: 'GEMINI_API_KEY is not configured in environment. Please set GEMINI_API_KEY in the Settings panel.',
        });
      }

      // Convert images to contents for Gemini
      const imageParts = validImages.map((img: { data: string; mimeType: string }) => ({
        inlineData: {
          data: img.data.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, ''),
          mimeType: img.mimeType || 'image/jpeg',
        },
      }));

      const prompt = `You are a certified Legal Metrology Enforcement Officer in India inspecting pre-packaged commodities under The Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011).

CRITICAL OCR DIRECTIVES:
1. Thoroughly examine all provided package photograph(s) (Front, Back, Side, Top/Bottom, MRP/Batch panels) with high-precision vision OCR.
2. Read text regardless of orientation (upright, sideways, rotated, or curved on bottle/can/box).
3. Search carefully for small print, dot-matrix printed dates/batch/MRP, embossed text, nutrition tables, and statutory declaration panels.
4. Extract ONLY declarations, text, numbers, and symbols that are ACTUALLY AND VISIBLY printed on the package labels in these photos.
5. DO NOT guess, fabricate, hallucinate, infer, or use prior examples.
6. DO NOT use generic sample values (such as "400 g", "₹ 160", "SunHarvest", "Plot 88", or standard placeholders).
7. For EVERY field that is not clearly printed or cannot be confidently read from the images, return "Not detected".

Specific field recognition rules:
- commodityName: The generic or specific name of the commodity (e.g., "Atta", "Refined Sunflower Oil", "Instant Noodles", "Toothpaste", "Bath Soap", "Almond Cookies", "Detergent Bar", or "Not detected").
- brand: The prominent brand or trade name (or "Not detected").
- manufacturer: Complete name of the manufacturer, packer, or importer (look for "Mfg by", "Manufactured by", "Mfd. by", "Packed by", "Pkd by", "Marketed by", "Imported by", or "Not detected").
- mfgAddress: Full factory / registered office postal address with locality, state, and PIN code if visible (or "Not detected").
- countryOfOrigin: Country of origin declaration (e.g., "India", "Made in India", "Country of Origin: India", or "Not detected").
- netQuantity: Declared net weight / volume / length / count with standard metric units (look for "Net Qty", "Net Weight", "Net Vol", "Net Content" e.g., "500 g", "1 kg", "200 ml", "1 L", "10 N", "75 g", "100 Tablets", or "Not detected").
- mrp: Maximum Retail Price declaration including currency and tax phrase (look for "MRP", "M.R.P.", "₹", "Rs.", "incl. of all taxes", "inclusive of all taxes", e.g., "₹ 150.00 (incl. of all taxes)", "MRP Rs. 85.00 (inclusive of all taxes)", or "Not detected").
- unitSalePrice: Unit Sale Price per g/kg/ml/l/item if declared (e.g., "₹ 0.30 per g", "₹ 120.00 / kg", "₹ 1.50 / N", or "Not detected").
- mfgDate: Month & Year of manufacture or packing (look for "Mfg Date", "Date of Packing", "Pkd:", "MM/YYYY", e.g., "05/2026", "May 2026", or "Not detected").
- expiryDate: Expiry date or Best Before declaration (look for "Best Before", "Use By", "Exp Date", e.g., "Best Before 12 Months", "Exp: 08/2027", or "Not detected").
- consumerCare: Consumer grievance redressal details (look for helpline phone number, email ID, manager contact, or "Not detected").

Context hints from inspection setup:
- Category hint: ${categoryHint || 'General'}
- Package type hint: ${packageTypeHint || 'Package'}
${commodityHint ? `- Officer notes commodity might be: "${commodityHint}"` : ''}`;

      const MODELS_TO_TRY = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.1-pro-preview'];
      let response: any = null;
      let lastError: any = null;

      for (const modelName of MODELS_TO_TRY) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            console.log(`[OCR] Sending request to Gemini vision model: ${modelName} (attempt ${attempt})`);
            response = await ai.models.generateContent({
              model: modelName,
              contents: [
                { text: prompt },
                ...imageParts,
              ],
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    commodityName: { type: Type.STRING, description: "Generic or specific commodity name visible on label or 'Not detected'" },
                    brand: { type: Type.STRING, description: "Brand name visible on label or 'Not detected'" },
                    manufacturer: { type: Type.STRING, description: "Manufacturer / packer / importer name or 'Not detected'" },
                    mfgAddress: { type: Type.STRING, description: "Full address of manufacturer / packer / importer or 'Not detected'" },
                    countryOfOrigin: { type: Type.STRING, description: "Country of origin or 'Not detected'" },
                    netQuantity: { type: Type.STRING, description: "Net quantity with metric unit e.g. 500 g, 1 L, 10 N or 'Not detected'" },
                    mrp: { type: Type.STRING, description: "MRP declaration e.g. ₹ 150.00 (incl. of all taxes) or 'Not detected'" },
                    unitSalePrice: { type: Type.STRING, description: "Unit sale price e.g. ₹ 0.30/g or 'Not detected'" },
                    mfgDate: { type: Type.STRING, description: "Date of manufacture/packing MM/YYYY or 'Not detected'" },
                    expiryDate: { type: Type.STRING, description: "Expiry date / best before or 'Not detected'" },
                    consumerCare: { type: Type.STRING, description: "Consumer care phone, email, address or 'Not detected'" },
                  },
                  required: [
                    'commodityName',
                    'brand',
                    'manufacturer',
                    'mfgAddress',
                    'countryOfOrigin',
                    'netQuantity',
                    'mrp',
                    'unitSalePrice',
                    'mfgDate',
                    'expiryDate',
                    'consumerCare',
                  ],
                },
              },
            });

            if (response && response.text) {
              console.log(`[OCR] Vision response successfully received from model: ${modelName}`);
              break;
            }
          } catch (err: any) {
            lastError = err;
            const status = err?.status || err?.code || 0;
            console.warn(`[OCR] Error with model ${modelName} attempt ${attempt} (status ${status}): ${err?.message || err}.`);
            
            // If it's a 503 (high demand) or transient failure, wait briefly before retrying or switching
            if (attempt === 1 && (status === 503 || status === 'UNAVAILABLE' || err?.message?.includes('high demand'))) {
              console.log(`[OCR] Transient high demand on ${modelName}, waiting 1.2s before retry...`);
              await new Promise((resolve) => setTimeout(resolve, 1200));
            } else {
              break; // Switch to next model in fallback list
            }
          }
        }

        if (response && response.text) {
          break;
        }
      }

      if (!response || !response.text) {
        throw lastError || new Error('All vision AI models are currently unavailable. Please try again.');
      }

      console.log('[OCR] Vision response received from model.');
      const responseText = response.text || '';
      if (!responseText.trim()) {
        console.warn('[OCR] Empty response text received from vision model.');
        return res.status(422).json({
          success: false,
          error: 'Unable to extract information from this image. Please upload a clearer package label.',
        });
      }

      let parsedData: any;
      try {
        const cleaned = responseText
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/gi, '')
          .trim();
        parsedData = JSON.parse(cleaned);
      } catch (jsonErr) {
        console.error('[OCR] Failed to parse Gemini JSON response:', responseText, jsonErr);
        return res.status(422).json({
          success: false,
          error: 'Unable to parse package declarations from the image. Please upload a sharper, well-lit photo.',
        });
      }

      const commodityNameExtracted = parsedData.commodityName || parsedData.productName || parsedData.commodity || 'Not detected';
      const brandExtracted = parsedData.brand || parsedData.brandName || 'Not detected';
      const manufacturerExtracted = parsedData.manufacturer || parsedData.manufacturerName || parsedData.packerName || parsedData.importerName || 'Not detected';
      const mfgAddressExtracted = parsedData.mfgAddress || parsedData.manufacturerAddress || parsedData.packerAddress || parsedData.address || 'Not detected';
      const countryOfOriginExtracted = parsedData.countryOfOrigin || parsedData.origin || 'Not detected';
      const netQuantityExtracted = parsedData.netQuantity || (parsedData.netQuantityValue ? (parsedData.netQuantityUnit ? `${parsedData.netQuantityValue} ${parsedData.netQuantityUnit}` : parsedData.netQuantityValue) : 'Not detected');
      const mrpExtracted = parsedData.mrp || parsedData.mrpValue || 'Not detected';
      const unitSalePriceExtracted = parsedData.unitSalePrice || parsedData.usp || 'Not detected';
      const mfgDateExtracted = parsedData.mfgDate || parsedData.dateOfManufacture || parsedData.dateOfPacking || 'Not detected';
      const expiryDateExtracted = parsedData.expiryDate || parsedData.bestBefore || parsedData.useBy || 'Not detected';
      const consumerCareExtracted = parsedData.consumerCare || parsedData.customerCare || 'Not detected';

      console.log('[OCR] API response received');
      console.log(`[OCR] productName: ${commodityNameExtracted}`);
      console.log(`[OCR] netQuantity: ${netQuantityExtracted}`);
      console.log(`[OCR] MRP: ${mrpExtracted}`);
      console.log(`[OCR] USP: ${unitSalePriceExtracted}`);
      console.log(`[OCR] countryOfOrigin: ${countryOfOriginExtracted}`);

      return res.json({
        success: true,
        source: 'gemini_vision_ocr',
        data: {
          commodityName: commodityNameExtracted,
          productName: commodityNameExtracted,
          brand: brandExtracted,
          manufacturer: manufacturerExtracted,
          manufacturerName: manufacturerExtracted,
          mfgAddress: mfgAddressExtracted,
          manufacturerAddress: mfgAddressExtracted,
          countryOfOrigin: countryOfOriginExtracted,
          netQuantity: netQuantityExtracted,
          netQuantityValue: netQuantityExtracted,
          mrp: mrpExtracted,
          mrpValue: mrpExtracted,
          unitSalePrice: unitSalePriceExtracted,
          mfgDate: mfgDateExtracted,
          dateOfManufacture: mfgDateExtracted,
          expiryDate: expiryDateExtracted,
          bestBefore: expiryDateExtracted,
          consumerCare: consumerCareExtracted,
        },
      });
    } catch (error: any) {
      console.error('[OCR] AI Analysis Error:', error);
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
