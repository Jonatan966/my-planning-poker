import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../../lib/pusher";
import { cookieStorageManager } from "../../../utils/cookie-storage-manager";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { socket_id, channel_name } = request.body;

  const pusher = connectOnPusherServer();

  const userName = cookieStorageManager.getItem("@planning:people-name", {
    req: request,
  });

  let authResponse = pusher.authorizeChannel(
    socket_id as string,
    channel_name as string,
    {
      user_id: randomUUID(),
      user_info: {
        name: userName,
      },
    }
  );

  return response.send(JSON.stringify(authResponse));
};
