import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../../lib/pusher";
import { cookieStorageManager } from "../../../utils/cookie-storage-manager";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { socket_id } = request.body;

  const pusher = connectOnPusherServer();

  const userID = cookieStorageManager.getItem("@planning:user-id", {
    req: request,
  });

  const userName = cookieStorageManager.getItem("@planning:people-name", {
    req: request,
  });

  let authResponse = pusher.authenticateUser(socket_id as string, {
    id: userID,
    user_info: {
      name: userName,
    },
  });

  return response.send(JSON.stringify(authResponse));
};
