import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../../lib/pusher";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { show, room_id } = request.body;

  const pusher = connectOnPusherServer();

  await pusher.trigger(room_id, "SHOW_POINTS", {
    show,
  });

  return response.end();
};
