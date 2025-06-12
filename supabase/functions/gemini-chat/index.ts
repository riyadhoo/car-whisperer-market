
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, cars, context } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Initialize Supabase client for fetching parts
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const systemPrompt = `You are a friendly automotive expert who helps people with their cars. Keep responses conversational and helpful:

CONVERSATION STYLE:
- Keep responses short (2-4 sentences max)
- Be warm and conversational, like talking to a trusted mechanic friend
- Use simple, everyday language - avoid technical jargon unless necessary

DIAGNOSTIC APPROACH:
- If a user mentions a car problem but hasn't given enough details, ask ONE specific clarifying question first
- Once you have enough info (car make/model/year + clear symptoms), provide a concise diagnosis with 2-3 main possibilities
- Give brief, actionable next steps - don't overwhelm with long explanations
- Include safety warnings only when absolutely necessary

QUESTIONS TO ASK (when needed):
- What's the make, model, and year of your car?
- When does this happen - during startup, driving, or idling?
- Any warning lights on the dashboard?
- How long has this been happening?

RECOMMENDATION FEATURES:
- When users need car recommendations, include [RECOMMEND_CARS] at the end
- When users need specific car parts, include [RECOMMEND_PARTS:part_type] at the end
- For parts recommendations, be specific: [RECOMMEND_PARTS:battery] or [RECOMMEND_PARTS:brakes] etc.

Available cars in inventory: ${JSON.stringify(cars.slice(0, 10))}

Be helpful but keep it brief and conversational.`;

    // Include conversation context
    const contextMessages = context?.previousMessages || [];
    const conversationContext = contextMessages.length > 0 
      ? `Previous conversation: ${contextMessages.map(m => `${m.isUser ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}`
      : '';

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${conversationContext}\n\nUser message: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200, // Reduced from 400 to keep responses shorter
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, response.statusText, errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    let recommendations = null;

    // Check for car recommendations
    if (aiResponse.includes('[RECOMMEND_CARS]')) {
      aiResponse = aiResponse.replace('[RECOMMEND_CARS]', '').trim();
      
      // Get car recommendations based on conversation context
      const recommendedCars = cars.slice(0, 4); // Show top 4 cars
      recommendations = {
        type: 'cars',
        items: recommendedCars,
        title: 'Recommended Cars for You'
      };
    }

    // Check for parts recommendations
    const partsMatch = aiResponse.match(/\[RECOMMEND_PARTS:([^\]]+)\]/);
    if (partsMatch) {
      const partType = partsMatch[1];
      aiResponse = aiResponse.replace(partsMatch[0], '').trim();
      
      // Extract car make/model from previous messages to filter parts
      const userMessages = contextMessages.filter(m => m.isUser).map(m => m.text.toLowerCase());
      const currentMessage = message.toLowerCase();
      const allUserText = [...userMessages, currentMessage].join(' ');
      
      // Fetch parts from database
      let query = supabase
        .from('approved_parts')
        .select('id, title, price, condition, image_url, compatible_cars, seller_id')
        .ilike('title', `%${partType}%`)
        .limit(4);

      const { data: partsData, error: partsError } = await query;
      
      if (!partsError && partsData) {
        // Get profiles for sellers
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username');
        
        const formattedParts = partsData.map((part) => {
          const sellerProfile = profilesData?.find((profile) => profile.id === part.seller_id);
          return {
            id: part.id,
            title: part.title,
            price: part.price,
            condition: part.condition,
            image_url: part.image_url,
            compatible_cars: part.compatible_cars,
            seller: {
              username: sellerProfile?.username || "Unknown seller",
            }
          };
        });

        recommendations = {
          type: 'parts',
          items: formattedParts,
          title: `${partType.charAt(0).toUpperCase() + partType.slice(1)} Parts for Your Car`
        };
      }
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      recommendations: recommendations 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
