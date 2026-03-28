import pg from "pg";

/** Pooler uses *.pooler.supabase.com; direct DB uses *.supabase.co — both need SSL. */
function supabaseSsl(connectionString: string): pg.ClientConfig["ssl"] {
  return /supabase\.(co|com)/i.test(connectionString)
    ? { rejectUnauthorized: false }
    : undefined;
}

function safeConnectionTarget(connectionString: string): {
  host: string;
  port: string;
  user: string;
} {
  try {
    const u = new URL(connectionString.replace(/^postgresql:/i, "http:"));
    return {
      host: u.hostname,
      port: u.port || "5432",
      user: decodeURIComponent(u.username || ""),
    };
  } catch {
    return { host: "(unparseable URL)", port: "?", user: "" };
  }
}

export function createPgClient(connectionString: string): pg.Client {
  const { host, port, user } = safeConnectionTarget(connectionString);
  const sslOn = Boolean(supabaseSsl(connectionString));
  console.error(`[rag] Postgres: ${host}:${port} user=${user || "(empty)"} ssl=${sslOn}`);

  const pooler = /pooler\.supabase\.com/i.test(connectionString);
  if (pooler && port === "6543" && user === "postgres") {
    console.warn(
      "[rag] Transaction pooler expects user postgres.<project_ref> (from Connect), not plain postgres.",
    );
  }

  if (pooler && port === "5432") {
    console.warn(
      "[rag] Pooler on port 5432 (session mode). If you see ETIMEDOUT, switch Connect → Transaction pooler (port 6543).",
    );
  }

  return new pg.Client({
    connectionString,
    ssl: supabaseSsl(connectionString),
  });
}
