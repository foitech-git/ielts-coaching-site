const { insertLead } = require("./_db");
const { allowMethods, readJson, sendJson } = require("./_util");

module.exports = async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return;

  let body;
  try {
    body = (await readJson(req)) || {};
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return;
  }

  const lead = {
    page: typeof body.page === "string" ? body.page : "",
    source: typeof body.source === "string" ? body.source : "",
    name: typeof body.name === "string" ? body.name.trim() : "",
    phone: typeof body.phone === "string" ? body.phone.trim() : "",
    band: typeof body.band === "string" ? body.band.trim() : "",
    batch: typeof body.batch === "string" ? body.batch.trim() : "",
    message: typeof body.message === "string" ? body.message.trim() : "",
  };

  if (!lead.phone) {
    sendJson(res, 400, { error: "Phone is required" });
    return;
  }

  try {
    await insertLead(lead);
    sendJson(res, 200, { ok: true });
  } catch {
    sendJson(res, 500, { error: "Failed to save lead" });
  }
};

