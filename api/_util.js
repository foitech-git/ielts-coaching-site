const crypto = require("crypto");

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function allowMethods(req, res, methods) {
  if (methods.includes(req.method)) return true;
  res.setHeader("Allow", methods.join(", "));
  sendJson(res, 405, { error: "Method Not Allowed" });
  return false;
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return null;
  return JSON.parse(text);
}

function base64UrlEncode(input) {
  return Buffer.from(input).toString("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(input) {
  const padded = String(input).replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function signToken(payload, secret) {
  const data = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", secret).update(data).digest("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  return `${data}.${signature}`;
}

function verifyToken(token, secret) {
  if (!token) return { ok: false, error: "Missing token" };
  const [data, signature] = String(token).split(".");
  if (!data || !signature) return { ok: false, error: "Invalid token" };
  const expected = crypto.createHmac("sha256", secret).update(data).digest("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  if (signature.length !== expected.length) return { ok: false, error: "Invalid token" };
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return { ok: false, error: "Invalid token" };
  const payload = JSON.parse(base64UrlDecode(data));
  if (payload?.exp && Date.now() > payload.exp) return { ok: false, error: "Token expired" };
  return { ok: true, payload };
}

function getBearerToken(req) {
  const header = req.headers?.authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(String(header));
  return match ? match[1] : null;
}

function requireAdminAuth(req, res) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    sendJson(res, 501, { error: "Admin auth is not configured" });
    return null;
  }

  const token = getBearerToken(req);
  const result = verifyToken(token, secret);
  if (!result.ok) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }

  return result.payload;
}

module.exports = {
  allowMethods,
  readJson,
  requireAdminAuth,
  sendJson,
  signToken,
};
