import { NextResponse } from "next/server";

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function notFound(message = "Not found") {
  return errorResponse(message, 404);
}

export function unauthorized(message = "Unauthorized") {
  return errorResponse(message, 401);
}
