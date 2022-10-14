import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../lib/pusher";
import { roomEvents } from "../../services/room-events";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse> => {
  const { senderPeople, targetPeopleID, countdownStartedAt } = req.body;

  const pusher = connectOnPusherServer();

  await roomEvents.onRoomSyncPeople(pusher, {
    people_id: senderPeople.id,
    selected_points: senderPeople.points,
    target_people_id: targetPeopleID,
    room_countdown_started_at: countdownStartedAt,
  });

  return res.end();
};
