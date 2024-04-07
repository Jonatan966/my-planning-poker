import { NextApiRequest, NextApiResponse } from "next";

import { persistedCookieVars } from "../../configs/persistent-cookie-vars";
import { createId } from "../../lib/cuid";
import { eventVault } from "../../services/event-vault";
import { FreeVaultEvent } from "../../services/event-vault/types";
import { cookieStorageManager } from "../../utils/cookie-storage-manager";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    return response.status(405).end();
  }

  const newRoomID = createId();

  const peopleID = cookieStorageManager.getItem(persistedCookieVars.PEOPLE_ID, {
    req: request,
  });

  await eventVault[FreeVaultEvent.room_create]({
    room_id: newRoomID,
    people_id: peopleID,
  });

  return response.status(201).json({ id: newRoomID });
};
