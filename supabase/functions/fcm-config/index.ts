import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const vapidKey = Deno.env.get("FIREBASE_VAPID_PUBLIC_KEY") ?? "";
  return new Response(JSON.stringify({ vapidKey }), {
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    status: 200,
  });
});
