import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../lib/pusher";
import { MainRoomEvents } from "../../stores/room-store";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse> => {
  const { senderPeople, targetPeopleID } = req.body;

  const pusher = connectOnPusherServer();

  await pusher.sendToUser(targetPeopleID, MainRoomEvents.SYNC_PEOPLE_POINTS, {
    id: senderPeople.id,
    points: senderPeople.points,
  });

  return res.end();
};
