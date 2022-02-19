import { createCookieSessionStorage } from "remix";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { Client } from "faunadb";
import invariant from "tiny-invariant";

import type { Context } from "./app/context";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (event): Context => {
    invariant(event.env.FAUNA_DOMAIN, "FAUNA_DOMAIN must be set");
    invariant(event.env.FAUNA_SECRET, "FAUNA_SECRET must be set");

    let fauna = new Client({
      domain: event.env.FAUNA_DOMAIN,
      secret: event.env.FAUNA_SECRET,
      port: event.env.FAUNA_PORT || "443",
      scheme: event.env.FAUNA_SCHEME || "https",
    });

    invariant(event.env.SESSION_SECRET, "SESSION_SECRET must be set");

    const sessionStorage = createCookieSessionStorage({
      cookie: {
        name: "__session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        sameSite: "lax",
        secrets: [event.env.SESSION_SECRET],
        secure: process.env.NODE_ENV === "production",
      },
    });

    return {
      event,
      fauna,
      sessionStorage,
    };
  },
});

export function onRequest(context: EventContext<any, any, any>) {
  return handleRequest(context);
}
