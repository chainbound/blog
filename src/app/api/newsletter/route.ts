import { type NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = "https://n8n.chainbound.io/webhook/cb-newsletter";
const WEBHOOK_USER = "chainbound";

export async function POST(request: NextRequest) {
	try {
		const WEBHOOK_PASSWORD = process.env.N8N_WEBHOOK_PASSWORD;

		if (!WEBHOOK_PASSWORD) {
			console.error("N8N_WEBHOOK_PASSWORD environment variable is not set");
			return NextResponse.json(
				{ error: "Server configuration error" },
				{ status: 500 },
			);
		}

		const body = await request.json();
		const { email, referrer } = body;

		if (!email || typeof email !== "string") {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 },
			);
		}

		const basicAuth = btoa(`${WEBHOOK_USER}:${WEBHOOK_PASSWORD}`);

		const response = await fetch(WEBHOOK_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${basicAuth}`,
			},
			body: JSON.stringify({
				email: email.toLowerCase().trim(),
				referrer: referrer || "/",
				timestamp: new Date().toISOString(),
			}),
		});

		if (!response.ok) {
			console.error("Webhook error:", response.status, await response.text());
			return NextResponse.json(
				{ error: "Failed to subscribe" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Newsletter subscription error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
