import { SessionStorage } from "remix";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { Client } from "faunadb";

export type Context = {
  event: EventContext<any, any, any>;
  fauna: Client;
  sessionStorage: SessionStorage;
};

export type ActionFunction = (
  args: Omit<DataFunctionArgs, "context"> & { context: Context }
) => Promise<Response> | Response;

export type LoaderFunction = (
  args: Omit<DataFunctionArgs, "context"> & { context: Context }
) => Promise<Response> | Response;
