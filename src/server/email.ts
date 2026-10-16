// GoDaddy Node.js Hosting provides this loopback-only transactional email gateway.
const EMAIL_GATEWAY_URL = "http://127.0.0.1:2525/api/email/send";
const REQUEST_TIMEOUT_MS = 30_000;

export type SendEmailInput = {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

export type SendEmailResult = {
  messageId: string;
};

type GatewayPayload = {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

type GatewayResponse = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const payload = buildPayload(input);

  let response: Response;
  let body: GatewayResponse;
  try {
    response = await fetch(EMAIL_GATEWAY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    body = await parseBody(response);
  } catch (error) {
    throw new Error(`email gateway unreachable: ${describeError(error)}`);
  }

  if (!response.ok || !body.success) {
    const detail = body.error ?? `HTTP ${response.status}`;
    const idSuffix = body.messageId ? ` (messageId=${body.messageId})` : "";
    throw new Error(`email send failed: ${detail}${idSuffix}`);
  }

  if (!body.messageId) {
    throw new Error("email send succeeded but gateway returned no messageId");
  }

  return { messageId: body.messageId };
}

function buildPayload(input: SendEmailInput): GatewayPayload {
  const payload: GatewayPayload = {
    to: toArray(input.to),
    subject: input.subject,
  };
  const cc = toArray(input.cc);
  if (cc.length > 0) payload.cc = cc;
  const bcc = toArray(input.bcc);
  if (bcc.length > 0) payload.bcc = bcc;
  if (input.text) payload.text = input.text;
  if (input.html) payload.html = input.html;
  if (input.replyTo) payload.replyTo = input.replyTo;
  return payload;
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

async function parseBody(response: Response): Promise<GatewayResponse> {
  try {
    return (await response.json()) as GatewayResponse;
  } catch (error) {
    if (isAbortLike(error)) throw error;
    return { success: false, error: `non-JSON response (HTTP ${response.status})` };
  }
}

function isAbortLike(error: unknown): boolean {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    if (isAbortLike(error)) return `timed out after ${REQUEST_TIMEOUT_MS}ms`;
    return error.message;
  }
  return String(error);
}
