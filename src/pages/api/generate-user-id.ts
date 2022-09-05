import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import { cookieStorageManager } from "../../utils/cookie-storage-manager";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const userId = randomUUID();

  cookieStorageManager.setItem(
    "@planning:user-id",
    userId,
    { res: response },
    {
      httpOnly: true,
    }
  );

  return response.end();
};
