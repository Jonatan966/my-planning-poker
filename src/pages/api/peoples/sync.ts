import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../../lib/pusher";
import { roomEvents } from "../../../services/room-events";

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<NextApiResponse> => {
  if (request.method !== "POST") {
    return response.status(405).end();
  }

  const { senderPeople, targetPeopleID, countdownStartedAt } = request.body;

  const pusher = connectOnPusherServer();

  await roomEvents.onRoomSyncPeople(pusher, {
    people_id: senderPeople.id,
    selected_points: senderPeople.points,
    target_people_id: targetPeopleID,
    room_countdown_started_at: countdownStartedAt,
  });

  return response.end();
};
