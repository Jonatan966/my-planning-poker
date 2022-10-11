import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../lib/pusher";
import { ClientRoomEvents } from "../../services/room-events";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse> => {
  const { senderPeople, targetPeopleID, countdownStartedAt } = req.body;

  const pusher = connectOnPusherServer();

  await pusher.sendToUser(targetPeopleID, ClientRoomEvents.ROOM_SYNC_PEOPLE, {
    id: senderPeople.id,
    points: senderPeople.points,
    countdownStartedAt,
  });

  return res.end();
};
