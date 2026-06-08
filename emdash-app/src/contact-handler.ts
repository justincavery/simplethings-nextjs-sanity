const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MIN_SUBMIT_MS = 2500;
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

export type ContactEnv = {
	DB?: D1Database;
	TURNSTILE_SECRET_KEY?: string;
	CONTACT_IP_SALT?: string;
};

type TurnstileResponse = {
	success: boolean;
	hostname?: string;
	action?: string;
	metadata?: {
		result_with_testing_key?: boolean;
	};
	"error-codes"?: string[];
};

function redirect(url: URL, params: Record<string, string>, status = 303) {
	const next = new URL("/contact", url.origin);
	for (const [key, value] of Object.entries(params)) {
		next.searchParams.set(key, value);
	}
	return Response.redirect(next.toString(), status);
}

function field(form: FormData, name: string) {
	const value = form.get(name);
	return typeof value === "string" ? value.trim() : "";
}

function validEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sha256(value: string) {
	const bytes = new TextEncoder().encode(value);
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function ensureContactTable(db: D1Database) {
	await db
		.prepare(`
		CREATE TABLE IF NOT EXISTS contact_submissions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			created_at TEXT NOT NULL,
			name TEXT NOT NULL,
			email TEXT NOT NULL,
			company TEXT,
			message TEXT NOT NULL,
			ip_hash TEXT NOT NULL,
			user_agent TEXT,
			referer TEXT,
			turnstile_hostname TEXT,
			turnstile_action TEXT,
			status TEXT NOT NULL DEFAULT 'new'
		)
	`)
		.run();
	await db
		.prepare(
			"CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions (created_at)",
		)
		.run();
	await db
		.prepare(
			"CREATE INDEX IF NOT EXISTS contact_submissions_ip_hash_idx ON contact_submissions (ip_hash, created_at)",
		)
		.run();
}

async function verifyTurnstile(
	token: string,
	secret: string,
	clientIp: string,
	expectedHost: string,
) {
	const payload = new FormData();
	payload.set("secret", secret);
	payload.set("response", token);
	if (clientIp) payload.set("remoteip", clientIp);

	const response = await fetch(SITEVERIFY_URL, {
		method: "POST",
		body: payload,
	});

	if (!response.ok) return null;

	const result = (await response.json()) as TurnstileResponse;
	if (!result.success) return null;
	if (result.action && result.action !== "contact") return null;
	if (
		result.hostname &&
		result.hostname !== expectedHost &&
		!result.metadata?.result_with_testing_key
	) {
		return null;
	}
	return result;
}

async function processContactPost(request: Request, env: ContactEnv, url: URL) {
	const db = env.DB;
	const secret = env.TURNSTILE_SECRET_KEY;

	if (!db || !secret) {
		return redirect(url, { error: "unavailable" });
	}

	const form = await request.formData();
	const honeypot = field(form, "website");
	if (honeypot) {
		return redirect(url, { sent: "1" });
	}

	const startedAt = Number(field(form, "form_started_at"));
	if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_SUBMIT_MS) {
		return redirect(url, { error: "again" });
	}

	const name = field(form, "name");
	const email = field(form, "email");
	const company = field(form, "company");
	const message = field(form, "message");
	const token = field(form, "cf-turnstile-response");

	if (
		name.length < 2 ||
		name.length > 120 ||
		!validEmail(email) ||
		company.length > 160 ||
		message.length < 20 ||
		message.length > MAX_MESSAGE_LENGTH ||
		!token
	) {
		return redirect(url, { error: "details" });
	}

	const clientIp = request.headers.get("cf-connecting-ip") || "";
	const turnstile = await verifyTurnstile(token, secret, clientIp, url.hostname);
	if (!turnstile) {
		return redirect(url, { error: "verify" });
	}

	await ensureContactTable(db);

	const salt = env.CONTACT_IP_SALT || secret;
	const ipHash = await sha256(`${salt}:${clientIp || "unknown"}`);
	const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
	const recent = await db
		.prepare(
			"SELECT COUNT(*) AS count FROM contact_submissions WHERE ip_hash = ? AND created_at >= ?",
		)
		.bind(ipHash, windowStart)
		.first<{ count: number }>();

	if ((recent?.count ?? 0) >= RATE_LIMIT_MAX) {
		return redirect(url, { error: "wait" });
	}

	await db
		.prepare(`
			INSERT INTO contact_submissions (
				created_at,
				name,
				email,
				company,
				message,
				ip_hash,
				user_agent,
				referer,
				turnstile_hostname,
				turnstile_action
			)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)
		.bind(
			new Date().toISOString(),
			name,
			email,
			company || null,
			message,
			ipHash,
			request.headers.get("user-agent") || null,
			request.headers.get("referer") || null,
			turnstile.hostname || null,
			turnstile.action || null,
		)
		.run();

	return redirect(url, { sent: "1" });
}

export async function handleContactPost(request: Request, env: ContactEnv) {
	const url = new URL(request.url);

	try {
		return await processContactPost(request, env, url);
	} catch (error) {
		console.error("Contact form error:", error);
		return redirect(url, { error: "unavailable" });
	}
}
