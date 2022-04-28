import type { SessionStorage } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";

const USER_SESSION_KEY = "userId";

async function getSession(sessionStorage: SessionStorage, request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

async function getUserId(sessionStorage: SessionStorage, request: Request) {
  const session = await getSession(sessionStorage, request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

async function requireUserId(
  sessionStorage: SessionStorage,
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(sessionStorage, request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

async function createUserSession(
  sessionStorage: SessionStorage,
  request: Request,
  userId: string,
  redirectTo: string
) {
  const session = await getSession(sessionStorage, request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

async function logout(sessionStorage: SessionStorage, request: Request) {
  const session = await getSession(sessionStorage, request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export { getSession, getUserId, requireUserId, createUserSession, logout };
