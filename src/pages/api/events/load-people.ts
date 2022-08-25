import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../../lib/pusher";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { recipient_id, room_id, people } = request.body;

  const pusher = connectOnPusherServer();

  await pusher.trigger(room_id, `LOAD_PEOPLE:${recipient_id}`, people);

  return response.end();
};
