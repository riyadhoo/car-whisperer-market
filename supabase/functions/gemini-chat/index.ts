
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

    const systemPrompt = `You are a friendly automotive expert who helps people find the perfect car. Your goal is to understand their needs through brief questions and provide personalized recommendations.

CONVERSATION STYLE:
- Keep responses short (2-4 sentences max)
- Be warm and conversational, like talking to a trusted car salesperson
- Use simple, everyday language

CAR RECOMMENDATION PROCESS:
When someone asks for car recommendations, follow this structured approach:

1. FIRST INTERACTION - Ask about their PRIMARY NEED:
   "I'd love to help you find the perfect car! Let me ask a few quick questions:
   What will you mainly use this car for?
   A) Daily commuting in the city
   B) Family trips and errands  
   C) Weekend adventures/off-road
   D) Business/professional use"

2. SECOND QUESTION - Ask about BUDGET:
   "Great choice! What's your budget range?
   A) Under 1,000,000 DA
   B) 1,000,000 - 2,000,000 DA
   C) 2,000,000 - 3,000,000 DA
   D) Above 3,000,000 DA"

3. THIRD QUESTION - Ask about SIZE PREFERENCE:
   "Perfect! What size car works best for you?
   A) Compact (easy parking, fuel efficient)
   B) Medium (balanced space and efficiency)
   C) Large (maximum space and comfort)
   D) SUV (high seating, versatility)"

4. FINAL RECOMMENDATION - After getting 3 answers, provide recommendations:
   - Analyze their answers (usage, budget, size)
   - Filter available cars based on their preferences
   - Include [RECOMMEND_CARS] at the end
   - Explain why these cars match their needs

BRAND PREFERENCE HANDLING:
- If user mentions a specific brand (like Volkswagen, Toyota, BMW, etc.), prioritize that brand in recommendations
- If no cars from preferred brand are available, acknowledge this and suggest similar alternatives
- Always respect brand preferences when filtering cars

PREFERENCE MATCHING LOGIC:
- City commuting → Fuel efficient, compact/medium cars
- Family use → Sedans, SUVs with good seating
- Adventures → SUVs, all-wheel drive
- Business → Professional looking sedans
- Budget matching → Filter by price ranges
- Size preference → Match body style
- Brand preference → Filter by make first, then other criteria

DIAGNOSTIC APPROACH (for car problems):
- If user mentions a car problem, ask ONE specific clarifying question
- Provide brief diagnosis with 2-3 possibilities
- Include [RECOMMEND_PARTS:part_type] when suggesting parts

Available cars in inventory: ${JSON.stringify(cars.slice(0, 15))}

Remember: Ask questions one at a time, wait for answers, then provide personalized recommendations that respect brand preferences!`;

    // Include conversation context
    const contextMessages = context?.previousMessages || [];
    const conversationContext = contextMessages.length > 0 
      ? `Previous conversation: ${contextMessages.map(m => `${m.isUser ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}`
      : '';

    // Check if this is a car recommendation request
    const isCarRecommendationRequest = message.toLowerCase().includes('recommend') && 
      (message.toLowerCase().includes('car') || message.toLowerCase().includes('vehicle'));

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
          maxOutputTokens: 300,
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
      
      // Enhanced car filtering based on conversation context
      const userMessages = contextMessages.filter(m => m.isUser).map(m => m.text.toLowerCase());
      const currentMessage = message.toLowerCase();
      const allUserText = [...userMessages, currentMessage].join(' ');
      
      let filteredCars = [...cars];
      
      // Enhanced brand filtering - check for specific car makes
      const carBrands = ['volkswagen', 'toyota', 'honda', 'bmw', 'mercedes', 'audi', 'ford', 'chevrolet', 'nissan', 'hyundai', 'kia', 'mazda', 'subaru', 'lexus', 'infiniti', 'acura', 'volvo', 'jaguar', 'land rover', 'porsche', 'ferrari', 'lamborghini', 'bentley', 'rolls royce', 'maserati', 'alfa romeo', 'fiat', 'jeep', 'dodge', 'chrysler', 'cadillac', 'lincoln', 'buick', 'gmc', 'ram', 'tesla', 'peugeot', 'citroen', 'renault', 'dacia', 'skoda', 'seat'];
      
      for (const brand of carBrands) {
        if (allUserText.includes(brand)) {
          const brandFilteredCars = filteredCars.filter(car => 
            car.make.toLowerCase().includes(brand) || car.make.toLowerCase() === brand
          );
          if (brandFilteredCars.length > 0) {
            filteredCars = brandFilteredCars;
            console.log(`Filtered by brand: ${brand}, found ${filteredCars.length} cars`);
            break;
          }
        }
      }
      
      // Budget filtering (only if no specific brand preference dominated the filtering)
      if (allUserText.includes('under 1,000,000') || allUserText.includes('budget a') || allUserText.includes('cheap')) {
        filteredCars = filteredCars.filter(car => car.price < 15000);
      } else if (allUserText.includes('1,000,000') && allUserText.includes('2,000,000')) {
        filteredCars = filteredCars.filter(car => car.price >= 15000 && car.price < 25000);
      } else if (allUserText.includes('2,000,000') && allUserText.includes('3,000,000')) {
        filteredCars = filteredCars.filter(car => car.price >= 25000 && car.price < 35000);
      } else if (allUserText.includes('above 3,000,000') || allUserText.includes('expensive') || allUserText.includes('luxury')) {
        filteredCars = filteredCars.filter(car => car.price >= 35000);
      }
      
      // Usage-based filtering
      if (allUserText.includes('city') || allUserText.includes('commut')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('sedan') || 
          car.body_style?.toLowerCase().includes('hatch') ||
          car.fuel_consumption?.toLowerCase().includes('efficient')
        );
      } else if (allUserText.includes('family') || allUserText.includes('trip')) {
        filteredCars = filteredCars.filter(car => 
          car.seating_capacity >= 5 ||
          car.body_style?.toLowerCase().includes('suv') ||
          car.body_style?.toLowerCase().includes('sedan')
        );
      } else if (allUserText.includes('adventure') || allUserText.includes('off-road')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('suv') ||
          car.drivetrain?.toLowerCase().includes('awd') ||
          car.drivetrain?.toLowerCase().includes('4wd')
        );
      } else if (allUserText.includes('business') || allUserText.includes('professional')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('sedan') ||
          car.category?.toLowerCase().includes('luxury')
        );
      }
      
      // Size preference filtering
      if (allUserText.includes('compact')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('hatch') ||
          car.body_style?.toLowerCase().includes('compact')
        );
      } else if (allUserText.includes('large') || allUserText.includes('suv')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('suv') ||
          car.seating_capacity >= 7
        );
      }
      
      // If no cars match the criteria, provide feedback
      if (filteredCars.length === 0) {
        // Check if user mentioned a specific brand that we don't have
        for (const brand of carBrands) {
          if (allUserText.includes(brand)) {
            aiResponse += ` Unfortunately, we don't have any ${brand.charAt(0).toUpperCase() + brand.slice(1)} vehicles in our current inventory. Would you like me to suggest similar cars from other brands?`;
            break;
          }
        }
        filteredCars = cars.slice(0, 4);
      } else {
        filteredCars = filteredCars.slice(0, 4);
      }
      
      recommendations = {
        type: 'cars',
        items: filteredCars,
        title: 'Perfect Cars for You'
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
