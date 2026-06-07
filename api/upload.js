const { put } = require("@vercel/blob");
const { allowMethods, readJson, requireAdminAuth, sendJson } = require("./_util");

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return;

  const auth = requireAdminAuth(req, res);
  if (!auth) return;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    sendJson(res, 501, { error: "Blob storage is not configured" });
    return;
  }

  let body;
  try {
    body = (await readJson(req)) || {};
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return;
  }

  const dataUrl = String(body.dataUrl || "");
  const filename = String(body.filename || "upload").replaceAll(/[^a-zA-Z0-9._-]/g, "_");
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);

  if (!match) {
    sendJson(res, 400, { error: "Invalid data URL" });
    return;
  }

  const contentType = match[1];
  const base64 = match[2];
  let buffer;
  try {
    buffer = Buffer.from(base64, "base64");
  } catch {
    sendJson(res, 400, { error: "Invalid base64" });
    return;
  }

  try {
    const result = await put(`uploads/${Date.now()}-${filename}`, buffer, {
      access: "public",
      contentType,
      token,
    });
    sendJson(res, 200, { url: result.url });
  } catch {
    sendJson(res, 500, { error: "Upload failed" });
  }
};

