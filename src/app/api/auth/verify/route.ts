import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { consumeNonce, issueToken } from "@/lib/server/auth-session";

interface VerifyBody {
  message: string;
  signature: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as VerifyBody;
  if (!body?.message || !body?.signature) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  let siwe: SiweMessage;
  try {
    siwe = new SiweMessage(body.message);
  } catch {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  const nonceOk = consumeNonce(siwe.nonce);
  if (!nonceOk) {
    return NextResponse.json({ error: "invalid_nonce" }, { status: 401 });
  }

  try {
    await siwe.verify({ signature: body.signature, nonce: siwe.nonce, domain: siwe.domain });
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const token = issueToken(siwe.address);
  return NextResponse.json({ token, address: siwe.address.toLowerCase() });
}
