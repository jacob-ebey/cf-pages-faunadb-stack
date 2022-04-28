import { redirect } from "@remix-run/cloudflare";
import type { ActionFunction, LoaderFunction } from "~/context";
import { logout } from "~/session.server";

export const action: ActionFunction = async ({
  request,
  context: { sessionStorage },
}) => {
  return logout(sessionStorage, request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
