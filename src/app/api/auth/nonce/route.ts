import { NextResponse } from "next/server";
import { issueNonce } from "@/lib/server/auth-session";

export async function GET() {
  const nonce = issueNonce();
  return NextResponse.json({ nonce });
}
