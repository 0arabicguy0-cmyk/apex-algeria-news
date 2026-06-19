// Sends a Firebase Cloud Messaging push to all enabled subscribers about an article.
// Uses the FCM HTTP v1 API with a service-account JWT for auth.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const Body = z.object({ article_id: z.string().uuid() });

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
  token_uri?: string;
}

// ---- JWT signing with Web Crypto (RS256) ----
function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function b64urlText(s: string) { return b64url(new TextEncoder().encode(s)); }

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const body = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const bin = atob(body);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: sa.token_uri ?? "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${b64urlText(JSON.stringify(header))}.${b64urlText(JSON.stringify(claim))}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key.replace(/\\n/g, "\n")),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["sign"],
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${b64url(sig)}`;

  const res = await fetch(claim.aud, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`OAuth token error: ${res.status} ${await res.text()}`);
  const j = await res.json();
  return j.access_token as string;
}

async function sendOne(
  accessToken: string,
  projectId: string,
  token: string,
  data: Record<string, string>,
): Promise<{ ok: boolean; invalid?: boolean; error?: string }> {
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message: { token, data } }),
  });
  if (res.ok) return { ok: true };
  const text = await res.text();
  // 404 UNREGISTERED or 400 INVALID_ARGUMENT for bad tokens -> prune.
  const invalid = res.status === 404 ||
    /UNREGISTERED|NOT_FOUND|INVALID_ARGUMENT/i.test(text);
  return { ok: false, invalid, error: `${res.status}: ${text.slice(0, 200)}` };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { article_id } = parsed.data;

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Caller must be an admin or publisher.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { data: userData } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
  const uid = userData.user?.id;
  if (!uid) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", uid);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "publisher");
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Load the article.
  const { data: article, error: artErr } = await admin
    .from("articles")
    .select("id, title, excerpt, is_breaking, status, image_url")
    .eq("id", article_id)
    .maybeSingle();
  if (artErr || !article) {
    return new Response(JSON.stringify({ error: "Article not found" }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (article.status !== "published") {
    return new Response(JSON.stringify({ ok: false, skipped: "not published" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Load enabled tokens.
  const { data: tokens, error: tokErr } = await admin
    .from("fcm_tokens").select("token").eq("enabled", true);
  if (tokErr) {
    return new Response(JSON.stringify({ error: tokErr.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!tokens || tokens.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0 }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Service account.
  let sa: ServiceAccount;
  try {
    sa = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON") ?? "");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid FIREBASE_SERVICE_ACCOUNT_JSON" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const accessToken = await getAccessToken(sa);

  const data: Record<string, string> = {
    title: article.title,
    body: article.excerpt ?? "",
    is_breaking: article.is_breaking ? "true" : "false",
    url: `/article/${article.id}`,
    article_id: article.id,
    tag: article.is_breaking ? `breaking-${article.id}` : `article-${article.id}`,
  };
  if (article.image_url) data.image = article.image_url;

  // Send with limited concurrency.
  const CONCURRENCY = 20;
  let sent = 0, failed = 0;
  const invalidTokens: string[] = [];

  let i = 0;
  async function worker() {
    while (i < tokens.length) {
      const idx = i++;
      const t = tokens[idx].token;
      const r = await sendOne(accessToken, sa.project_id, t, data);
      if (r.ok) sent++;
      else { failed++; if (r.invalid) invalidTokens.push(t); }
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, tokens.length) }, worker));

  if (invalidTokens.length) {
    await admin.from("fcm_tokens").delete().in("token", invalidTokens);
  }

  return new Response(JSON.stringify({ ok: true, sent, failed, pruned: invalidTokens.length }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
  });
});
