import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";

import { database } from "../../lib/database";
import { randomUUID } from "crypto";

// Temporary route to stay database alive
async function handler(_: NextApiRequest, response: NextApiResponse) {
  try {
    const temporaryRoomId = randomUUID();

    await database.$transaction([
      database.room.create({
        data: {
          name: "[TEST] stay alive",
          id: temporaryRoomId,
        },
      }),
      database.room.delete({
        where: {
          id: temporaryRoomId,
        },
      }),
    ]);

    return response.status(200).end();
  } catch {
    return response.status(400).end();
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
