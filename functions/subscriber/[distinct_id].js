async function hmac_rawurlsafe_base64_string(distinct_id, secret) {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    hash,
    new TextEncoder().encode(distinct_id)
  );
  const subscriberId = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replaceAll("+", "-")
    .replaceAll("/", "_");
  return subscriberId.slice(0, -1);
}

export async function onRequestGet(context) {
  const distinctId = context.params.distinct_id;
  const subscriberId = await hmac_rawurlsafe_base64_string(
    distinctId,
    context.env.INBOX_SECRET
  );
  return new Response(
    JSON.stringify({ distinct_id: distinctId, subscriber_id: subscriberId })
  );
}
