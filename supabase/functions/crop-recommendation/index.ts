import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CROP_KNOWLEDGE = `
You are CropBot, a friendly agricultural AI assistant. Analyze soil and environmental parameters to recommend suitable crops.

CROP REQUIREMENTS DATABASE:
- Rice: N(80-100), P(40-60), K(40-60), pH(5-7), temp(20-30°C), humidity(80-90%), rainfall(200-300mm)
- Wheat: N(100-120), P(50-70), K(50-70), pH(6-7.5), temp(15-25°C), humidity(50-70%), rainfall(50-100mm)
- Maize: N(80-100), P(40-60), K(20-40), pH(5.5-7), temp(18-27°C), humidity(60-80%), rainfall(50-100mm)
- Cotton: N(120-150), P(40-60), K(40-60), pH(6-8), temp(21-30°C), humidity(50-80%), rainfall(50-100mm)
- Sugarcane: N(150-200), P(60-80), K(80-100), pH(6-7.5), temp(20-30°C), humidity(70-90%), rainfall(150-250mm)
- Coffee: N(100-120), P(20-40), K(60-80), pH(5-6.5), temp(15-24°C), humidity(60-80%), rainfall(150-250mm)
- Potato: N(100-150), P(50-80), K(100-150), pH(5-6.5), temp(15-20°C), humidity(70-90%), rainfall(50-100mm)
- Tomato: N(120-150), P(60-80), K(80-120), pH(6-7), temp(18-27°C), humidity(60-80%), rainfall(50-100mm)
- Banana: N(150-200), P(40-60), K(200-300), pH(5.5-7), temp(20-30°C), humidity(75-95%), rainfall(200-400mm)
- Mango: N(50-100), P(30-50), K(50-100), pH(5.5-7.5), temp(24-30°C), humidity(50-70%), rainfall(75-200mm)
- Grapes: N(60-100), P(40-80), K(80-150), pH(6-7), temp(15-25°C), humidity(60-80%), rainfall(50-100mm)
- Orange: N(100-150), P(40-60), K(80-120), pH(6-7.5), temp(13-30°C), humidity(60-80%), rainfall(100-200mm)
- Apple: N(80-120), P(40-60), K(80-120), pH(5.5-7), temp(10-24°C), humidity(60-75%), rainfall(100-150mm)
- Coconut: N(100-150), P(30-50), K(120-200), pH(5.5-8), temp(20-32°C), humidity(70-90%), rainfall(150-300mm)

When user provides values:
1. Extract N, P, K, pH, temperature, humidity, rainfall from their message
2. Recommend TOP 3 most suitable crops based on how well parameters match
3. For each crop, provide:
   - Crop name
   - Match score (why it's suitable)
   - Brief growing tips

Format response as friendly, encouraging advice. Use emojis. Be conversational but informative.
If values are missing, make reasonable recommendations and ask for more details if needed.
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing crop recommendation request");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CROP_KNOWLEDGE },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires credits. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Error in crop-recommendation function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
