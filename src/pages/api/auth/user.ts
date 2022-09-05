import { NextApiRequest, NextApiResponse } from "next";
import { persistedCookieVars } from "../../../configs/persistent-cookie-vars";
import { connectOnPusherServer } from "../../../lib/pusher";
import { cookieStorageManager } from "../../../utils/cookie-storage-manager";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { socket_id } = request.body;

  const pusher = connectOnPusherServer();

  const userID = cookieStorageManager.getItem(persistedCookieVars.PEOPLE_ID, {
    req: request,
  });

  const userName = cookieStorageManager.getItem(
    persistedCookieVars.PEOPLE_NAME,
    {
      req: request,
    }
  );

  let authResponse = pusher.authenticateUser(socket_id as string, {
    id: userID,
    user_info: {
      name: userName,
    },
  });

  return response.send(JSON.stringify(authResponse));
};
