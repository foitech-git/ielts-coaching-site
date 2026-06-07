const { sql } = require("@vercel/postgres");

let schemaReady;

async function ensureSchema() {
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id integer PRIMARY KEY,
        data jsonb NOT NULL DEFAULT '{}'::jsonb,
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id bigserial PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        page text,
        source text,
        name text,
        phone text,
        band text,
        batch text,
        message text
      );
    `;

    await sql`
      INSERT INTO site_content (id, data)
      VALUES (1, '{}'::jsonb)
      ON CONFLICT (id) DO NOTHING;
    `;
  })();

  return schemaReady;
}

async function getSiteContent() {
  await ensureSchema();
  const result = await sql`SELECT data, updated_at FROM site_content WHERE id = 1;`;
  const row = result.rows?.[0];
  return row ? { data: row.data, updatedAt: row.updated_at } : { data: null, updatedAt: null };
}

async function setSiteContent(data) {
  await ensureSchema();
  const result = await sql`
    UPDATE site_content
    SET data = ${data}::jsonb, updated_at = now()
    WHERE id = 1
    RETURNING updated_at;
  `;
  return result.rows?.[0]?.updated_at || null;
}

async function insertLead(lead) {
  await ensureSchema();
  await sql`
    INSERT INTO leads (page, source, name, phone, band, batch, message)
    VALUES (
      ${lead.page || null},
      ${lead.source || null},
      ${lead.name || null},
      ${lead.phone || null},
      ${lead.band || null},
      ${lead.batch || null},
      ${lead.message || null}
    );
  `;
}

module.exports = {
  getSiteContent,
  insertLead,
  setSiteContent,
};

