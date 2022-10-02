import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../lib/database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { roomId, countdownStartedAt = null } = req.body;

  if (!roomId) {
    return res.status(400).end();
  }

  await database.room.update({
    where: {
      id: roomId,
    },
    data: {
      countdown_started_at: countdownStartedAt
        ? String(countdownStartedAt)
        : null,
    },
  });

  return res.end();
};
