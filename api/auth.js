const { allowMethods, readJson, sendJson, signToken } = require("./_util");

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return;

  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_TOKEN_SECRET;

  if (!password || !secret) {
    sendJson(res, 501, { error: "Admin auth is not configured" });
    return;
  }

  let body;
  try {
    body = (await readJson(req)) || {};
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return;
  }

  if (body.password !== password) {
    sendJson(res, 401, { error: "Invalid password" });
    return;
  }

  const token = signToken({ exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }, secret);
  sendJson(res, 200, { token });
};

