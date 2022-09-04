import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../../lib/pusher";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { socket_id, channel_name } = request.body;

  const pusher = connectOnPusherServer();

  let authResponse = pusher.authorizeChannel(
    socket_id as string,
    channel_name as string,
    {
      user_id: randomUUID(),
      user_info: {
        name: "dia",
      },
    }
  );

  return response.send(JSON.stringify(authResponse));
};
