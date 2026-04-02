import { GoogleGenAI, Type } from "@google/genai";
import { Competitor, CompanyDetails, CompetitorAnalysisResult, UrlValidationResult, SWOTAnalysis, ComparisonData, Notification } from '../types';

// FIX: Initialize GoogleGenAI with a named apiKey parameter
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const safelyParseJSON = <T>(jsonString: string, fallback: T): T => {
    try {
        // FIX: Added trim() to handle potential leading/trailing whitespace from AI response
        const trimmedString = jsonString.trim();
        return JSON.parse(trimmedString);
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        console.error("JSON string was:", jsonString);
        return fallback;
    }
};

export const chatWithAIAssistant = async (
    message: string,
    competitors: Competitor[],
    context: string
): Promise<string> => {
    const competitorInfo = competitors.map(c => `- ${c.name}: ${c.description}`).join('\n');
    const prompt = `
        You are a helpful AI assistant for a competitive intelligence platform.
        Current user context: Viewing the ${context} page.
        List of tracked competitors:
        ${competitorInfo}

        User's question: "${message}"

        Provide a concise and helpful answer based on the user's question and the provided context.
    `;
    
    try {
        // FIX: Use ai.models.generateContent instead of a model instance.
        const response = await ai.models.generateContent({
            // FIX: Use 'gemini-2.5-flash' model
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // FIX: Access text directly from response.text
        return response.text;
    } catch (error) {
        console.error("Error chatting with AI assistant:", error);
        throw new Error("Failed to get a response from the AI assistant.");
    }
};

export const validateCompetitorUrl = async (url: string): Promise<UrlValidationResult> => {
    const prompt = `
        Analyze the following URL to determine if it is a valid, active, and appropriate website for a B2B software or tech company.
        URL: ${url}
        - Is the domain valid and does the URL resolve?
        - Does the content of the website seem to be for a technology or software company?
        - Are there any signs that this is a parked domain, an error page, or completely unrelated content (e.g., a personal blog, a dangerous site)?
        
        Respond ONLY in JSON format with the following structure:
        {
          "isValid": boolean,
          "reason": "string (provide a brief explanation for your decision, especially if invalid)"
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                // FIX: Set responseMimeType to application/json
                responseMimeType: "application/json",
                // FIX: Define responseSchema for structured output
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isValid: { type: Type.BOOLEAN },
                        reason: { type: Type.STRING },
                    },
                    required: ['isValid', 'reason'],
                },
            },
        });
        
        return safelyParseJSON(response.text, { isValid: false, reason: "AI response was not valid JSON." });
    } catch (error) {
        console.error("Error validating URL:", error);
        throw new Error("Failed to validate competitor URL with AI.");
    }
};

export const generateSingleCompetitorAnalysis = async (competitor: Competitor): Promise<CompetitorAnalysisResult> => {
    const prompt = `
        Provide a detailed analysis of the competitor: ${competitor.name} (${competitor.domain}).
        Use their provided description as a starting point: "${competitor.description}".
        
        Based on publicly available information, generate insights for the following categories.
        If a specific piece of information isn't readily available, make a reasonable estimation and note it as such (e.g., "Estimated ~X%").

        - summary: A brief, 2-3 sentence executive summary of their current market position and strategy.
        - marketShare: An estimated market share percentage (e.g., "15%").
        - recentFunding: A brief summary of their latest funding round, or "N/A" if none is recent.
        - productLaunches: A list of 2-3 of their most recent significant product launches or feature updates.
        - opportunities: A list of 2-3 potential strategic opportunities for them.
        - threats: A list of 2-3 potential threats they face.

        Respond ONLY in JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        marketShare: { type: Type.STRING },
                        recentFunding: { type: Type.STRING },
                        productLaunches: { type: Type.ARRAY, items: { type: Type.STRING } },
                        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['summary', 'marketShare', 'recentFunding', 'productLaunches', 'opportunities', 'threats']
                }
            }
        });
        const fallback: CompetitorAnalysisResult = {
            summary: "Could not generate analysis.", marketShare: "N/A", recentFunding: "N/A",
            productLaunches: [], opportunities: [], threats: []
        };
        return safelyParseJSON(response.text, fallback);
    } catch (error) {
        console.error("Error generating single competitor analysis:", error);
        throw new Error(`Failed to analyze ${competitor.name}.`);
    }
};

export const generateSWOTAnalysis = async (competitor: Competitor): Promise<SWOTAnalysis> => {
     const prompt = `
        Generate a SWOT analysis for the competitor: ${competitor.name} (${competitor.domain}).
        Description: "${competitor.description}".

        Provide 3-4 bullet points for each category.
        - strengths: Internal attributes that give them an advantage.
        - weaknesses: Internal attributes that are a disadvantage.
        - opportunities: External factors they could exploit.
        - threats: External factors that could harm them.
        
        Respond ONLY in JSON format.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats']
                }
            }
        });
        const fallback: SWOTAnalysis = { strengths: [], weaknesses: [], opportunities: [], threats: [] };
        return safelyParseJSON(response.text, fallback);
    } catch (error) {
        console.error("Error generating SWOT analysis:", error);
        throw new Error(`Failed to generate SWOT for ${competitor.name}.`);
    }
}

export const generateSummaryDashboard = async (competitors: Competitor[]): Promise<string> => {
    const competitorNames = competitors.map(c => c.name).join(', ');
    const prompt = `
        Act as a market analyst. I am tracking the following competitors: ${competitorNames}.
        Based on the latest publicly available news and trends, provide a high-level summary dashboard of the competitive landscape.
        Include key highlights, recent major moves (launches, funding, partnerships), and one emerging trend to watch.
        Format the response as a concise, easy-to-read text report with clear headings. Do not use markdown.
    `;
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary dashboard:", error);
        throw new Error("Failed to generate summary dashboard.");
    }
};

export const generateMarketTrendsAnalysis = async (topic: string): Promise<string> => {
    const prompt = `
        Analyze the following topic in the context of the B2B software and tech industry: "${topic}".
        Provide a detailed analysis covering:
        1.  Current state of the trend.
        2.  Key players and innovators in this space.
        3.  Potential future impact and opportunities.
        4.  Potential risks or challenges.
        
        Structure your response as a well-written report. Do not use markdown.
    `;
    try {
        // Use Google Search grounding for up-to-date information
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             tools: [{googleSearch: {}}],
           },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating market trends analysis:", error);
        throw new Error("Failed to generate market trends analysis.");
    }
};

export const generateStrategicRecommendations = async (companyDetails: CompanyDetails, competitors: Competitor[]): Promise<string> => {
    const competitorInfo = competitors.map(c => `- ${c.name} (${c.domain}): ${c.description}`).join('\n');
    const prompt = `
        I am the owner of "${companyDetails.name}" (${companyDetails.url}).
        I am competing against the following companies:
        ${competitorInfo}

        Based on this competitive landscape, provide 3-5 actionable strategic recommendations for my company.
        Focus on areas like product development, marketing, pricing, or target audience.
        Each recommendation should be clear and have a brief rationale.
        Format as a text report. Do not use markdown.
    `;
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating strategic recommendations:", error);
        throw new Error("Failed to generate strategic recommendations.");
    }
};


export const generateCompetitorComparison = async (
  myCompany: CompanyDetails,
  competitors: Competitor[]
): Promise<ComparisonData> => {
  const competitorPrompts = competitors
    .map((c, i) => `Competitor ${i + 1}: ${c.name} (${c.domain}) - ${c.description}`)
    .join('\n');
  
  const prompt = `
    Generate a detailed comparison between my company and its competitors.
    My Company: ${myCompany.name} (${myCompany.url})
    ${competitorPrompts}

    Provide the output ONLY in a valid JSON format.
    The root object should have two keys: "table" and "charts".

    1. "table": An object with "columns" and "rows".
       - "columns": An array of objects, each with "id" and "label". The first column should be "parameter", followed by my company, then each competitor.
       - "rows": An array of objects, each with "parameter" (e.g., "Key Features", "Pricing Model", "Target Audience") and "data", which is an array of arrays of strings. Each inner array represents a cell's bullet points.

    2. "charts": An object with "pricingBarChart" and "featuresRadarChart".
       - "pricingBarChart": An object with a "data" array. Each item in the array is an object with "name" (company name) and "price" (a single number representing their average or starting monthly price).
       - "featuresRadarChart": An object with "subjects" and "data".
         - "subjects": An array of 5-6 key feature categories (e.g., "Collaboration", "Integrations", "AI Features"), each an object with "subject" (string) and "max" (number, always 10).
         - "data": An array, one object per company. Each object has "company" (string) and "values" (an array of objects with "subject" and "value" (a score from 1-10)).

    Ensure all company names match exactly what was provided.
    Make reasonable estimations for data points if not publicly available.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            table: {
              type: Type.OBJECT,
              properties: {
                columns: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, label: { type: Type.STRING } }, required: ['id', 'label'] } },
                rows: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { parameter: { type: Type.STRING }, data: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } } }, required: ['parameter', 'data'] } }
              },
              required: ['columns', 'rows']
            },
            charts: {
              type: Type.OBJECT,
              properties: {
                pricingBarChart: {
                  type: Type.OBJECT,
                  properties: { data: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, price: { type: Type.NUMBER } }, required: ['name', 'price'] } } },
                  required: ['data']
                },
                featuresRadarChart: {
                  type: Type.OBJECT,
                  properties: {
                    subjects: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, max: { type: Type.NUMBER } }, required: ['subject', 'max'] } },
                    data: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          company: { type: Type.STRING },
                          values: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, value: { type: Type.NUMBER } }, required: ['subject', 'value'] } }
                        },
                        required: ['company', 'values']
                      }
                    }
                  },
                  required: ['subjects', 'data']
                }
              },
              required: ['pricingBarChart', 'featuresRadarChart']
            }
          },
          required: ['table', 'charts']
        }
      }
    });

    const fallback: ComparisonData = {
        table: { columns: [], rows: [] },
        charts: { pricingBarChart: { data: [] }, featuresRadarChart: { subjects: [], data: [] } }
    };
    return safelyParseJSON(response.text, fallback);
  } catch (error) {
    console.error("Error generating competitor comparison:", error);
    throw new Error('Failed to generate comparison report.');
  }
};

export const checkForCompetitorUpdates = async (competitors: Competitor[]): Promise<Omit<Notification, 'id' | 'read' | 'timestamp'>[]> => {
    const competitorInfo = competitors.map(c => `{ "name": "${c.name}", "logo": "${c.logo}" }`).join(', ');
    const prompt = `
        You are an AI monitoring system for a competitive intelligence platform.
        I am tracking the following competitors: [${competitorInfo}].
        
        Simulate a real-time scan and invent 1-3 recent, plausible updates for these competitors.
        The updates can be new feature launches, pricing changes, funding announcements, etc.
        
        Respond ONLY in a valid JSON array format with the following structure for each update:
        [
          {
            "type": "launch" | "pricing" | "feature" | "funding",
            "competitorName": "string",
            "competitorLogo": "string (use the one provided)",
            "title": "string (a concise headline for the update)",
            "description": "string (a one-sentence summary of the update)"
          }
        ]
        
        Do not return more than 3 updates. If you cannot generate updates, return an empty array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['launch', 'pricing', 'feature', 'funding'] },
                            competitorName: { type: Type.STRING },
                            competitorLogo: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ['type', 'competitorName', 'competitorLogo', 'title', 'description']
                    }
                }
            }
        });

        return safelyParseJSON(response.text, []);
    } catch (error) {
        console.error("Error checking for competitor updates:", error);
        throw new Error("Failed to check for competitor updates with AI.");
    }
};
