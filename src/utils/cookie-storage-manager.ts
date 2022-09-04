import { NextPageContext, NextApiRequest, NextApiResponse } from "next";
import { parseCookies, setCookie, destroyCookie } from "nookies";

type ServerContext<T extends "req" | "res" = "req"> =
  | Pick<NextPageContext, T>
  | (T extends "req"
      ? Record<"req", NextApiRequest>
      : Record<"res", NextApiResponse>);

function getItem<V = string>(
  key: string,
  context?: ServerContext
): V | undefined {
  const parsedItems = parseCookies(context);
  const item = parsedItems[key];

  try {
    if (item) {
      return JSON.parse(item) as V;
    }

    return undefined;
  } catch {
    return undefined;
  }
}

function setItem<V = string>(
  key: string,
  value: V,
  context?: ServerContext<"res">
): boolean {
  const preparedValue = JSON.stringify(value);

  try {
    if (!preparedValue || preparedValue === '""') {
      destroyCookie(context, key);

      return true;
    }

    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 1);

    setCookie(context, key, preparedValue, {
      path: "/",
      expires: currentDate,
    });

    return true;
  } catch {
    return false;
  }
}

export const cookieStorageManager = { getItem, setItem };
