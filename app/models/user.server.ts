import type { Client, values } from "faunadb";
import { query as q, errors } from "faunadb";

type User = {
  id: string;
  email: string;
};

async function createUser(
  client: Client,
  email: string,
  password: string
): Promise<User | undefined> {
  try {
    const result = await client.query<{
      ref: values.Ref;
      data: { email: string };
    }>(q.Call("CreateUser", [email, password]));

    return {
      id: result.ref.id,
      email: result.data.email,
    };
  } catch (error) {
    if (error instanceof errors.BadRequest) {
      return undefined;
    }
    throw error;
  }
}

async function verifyLogin(
  client: Client,
  email: string,
  password: string
): Promise<User | undefined> {
  try {
    const result = await client.query<{
      instance: values.Ref;
    }>(q.Call("LoginUser", [email, password]));

    if (!result?.instance?.id) {
      return undefined;
    }

    return {
      id: result.instance.id,
      email,
    };
  } catch (error) {
    if (error instanceof errors.BadRequest) {
      return undefined;
    }
    throw error;
  }
}

export { createUser, verifyLogin };
