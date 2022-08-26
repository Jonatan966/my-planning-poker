import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../../lib/pusher";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { people, room_id } = request.body;

  const pusher = connectOnPusherServer();

  await pusher.trigger(room_id, "PEOPLE_ENTER", people);

  return response.end();
};
