// @deno-types="npm:@supabase/supabase-js@2"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const NASA_API_KEY = Deno.env.get('NASA_API_KEY');
const CACHE_DURATION_MINUTES = 15;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const nasaEndpoints = {
  apod: `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
  neows: `https://api.nasa.gov/neo/rest/v1/feed?start_date=${new Date().toISOString().split('T')[0]}&api_key=${NASA_API_KEY}`,
  eonet: `https://eonet.gsfc.nasa.gov/api/v3/events`,
  donki: `https://api.nasa.gov/DONKI/notifications?startDate=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&endDate=${new Date().toISOString().split('T')[0]}&type=all&api_key=${NASA_API_KEY}`,
  epic: 'https://epic.gsfc.nasa.gov/api/natural',
  exoplanet: 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,sy_snum,sy_pnum,discoverymethod,disc_year+from+pscomppars&format=json',
  mars: `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${NASA_API_KEY}`,
  techport: `https://api.nasa.gov/techport/api/projects?api_key=${NASA_API_KEY}`,
  techtransfer: `https://api.nasa.gov/techtransfer/patent/?q=space&api_key=${NASA_API_KEY}`,
};

type NasaEndpoint = keyof typeof nasaEndpoints;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { endpoint, options }: { endpoint: NasaEndpoint; options?: Record<string, unknown> } = await req.json();
  const endpointUrl = nasaEndpoints[endpoint];

  if (!endpointUrl) {
    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  // 1. Check for cached data
  const { data: cachedData } = await supabaseClient
    .from('api_cache')
    .select('data, cached_at')
    .eq('endpoint', endpoint)
    .single();

  if (cachedData) {
    const cacheAge = (new Date().getTime() - new Date(cachedData.cached_at).getTime()) / (1000 * 60);
    if (cacheAge < CACHE_DURATION_MINUTES) {
      return new Response(JSON.stringify(cachedData.data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }

  // 3. Fetch new data from NASA
  try {
    const response = await fetch(endpointUrl);
    if (!response.ok) throw new Error(`NASA API request failed with status ${response.status}`);
    const newData = await response.json();

    await supabaseClient.from('api_cache').upsert({ endpoint, data: newData, cached_at: new Date().toISOString() }, { onConflict: 'endpoint' });

    return new Response(JSON.stringify(newData), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    if (cachedData) {
      return new Response(JSON.stringify(cachedData.data), { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Stale-Data': 'true' } });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});