import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DIFY_API_URL = 'https://api.dify.ai/v1/workflows/run';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt:', prompt);
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const DIFY_API_KEY = Deno.env.get('DIFY_API_KEY');
    
    if (!DIFY_API_KEY) {
      console.error('DIFY_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'DIFY_API_KEY is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calling Dify API with prompt:', prompt.substring(0, 100));

    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          user_query: prompt,
        },
        response_mode: 'blocking',
        user: `user_${crypto.randomUUID().substring(0, 8)}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Dify API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('Dify API response received:', JSON.stringify(result).substring(0, 200));

    // Extract outputs from Dify workflow response
    let formData;
    
    if (result.data?.outputs) {
      const outputs = result.data.outputs;
      if (typeof outputs === 'string') {
        formData = JSON.parse(outputs);
      } else if (outputs.result && typeof outputs.result === 'string') {
        formData = JSON.parse(outputs.result);
      } else if (outputs.text && typeof outputs.text === 'string') {
        formData = JSON.parse(outputs.text);
      } else {
        formData = outputs;
      }
    } else if (result.outputs) {
      formData = typeof result.outputs === 'string' 
        ? JSON.parse(result.outputs) 
        : result.outputs;
    } else {
      formData = result;
    }

    console.log('Parsed form data:', JSON.stringify(formData).substring(0, 200));

    return new Response(
      JSON.stringify({ data: formData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-form function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
