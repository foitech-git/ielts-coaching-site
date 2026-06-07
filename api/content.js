const { getSiteContent, setSiteContent } = require("./_db");
const { allowMethods, readJson, requireAdminAuth, sendJson } = require("./_util");

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ["GET", "POST"])) return;

  if (req.method === "GET") {
    try {
      const result = await getSiteContent();
      sendJson(res, 200, { data: result.data, updatedAt: result.updatedAt });
    } catch {
      sendJson(res, 500, { error: "Failed to load content" });
    }
    return;
  }

  const auth = requireAdminAuth(req, res);
  if (!auth) return;

  let body;
  try {
    body = (await readJson(req)) || {};
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return;
  }

  if (!body || typeof body !== "object") {
    sendJson(res, 400, { error: "Invalid payload" });
    return;
  }

  try {
    const updatedAt = await setSiteContent(body);
    sendJson(res, 200, { ok: true, updatedAt });
  } catch {
    sendJson(res, 500, { error: "Failed to save content" });
  }
};

