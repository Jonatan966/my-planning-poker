import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import { cookieStorageManager } from "../../utils/cookie-storage-manager";
import { persistedCookieVars } from "../../configs/persistent-cookie-vars";

export default async (_: NextApiRequest, response: NextApiResponse) => {
  const userId = randomUUID();

  cookieStorageManager.setItem(
    persistedCookieVars.PEOPLE_ID,
    userId,
    { res: response },
    {
      httpOnly: true,
    }
  );

  return response.end();
};
