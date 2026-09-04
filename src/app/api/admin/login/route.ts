import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_USERNAME/ADMIN_PASSWORD no están configuradas en el servidor." },
      { status: 500 }
    );
  }

  let username: unknown;
  let password: unknown;
  try {
    ({ username, password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  // Se valida todo antes de decidir, y el mensaje de error es el mismo sin
  // importar cuál de los dos datos falló — así no le damos a quien intenta
  // entrar ninguna pista de si el usuario existe o de cuál de los dos campos
  // tiene que seguir probando.
  const usernameOk = typeof username === "string" && username === process.env.ADMIN_USERNAME;
  const passwordOk = typeof password === "string" && password === process.env.ADMIN_PASSWORD;

  if (!usernameOk || !passwordOk) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
