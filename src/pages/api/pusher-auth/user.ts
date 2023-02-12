import { NextApiRequest, NextApiResponse } from "next";
import { persistedCookieVars } from "../../../configs/persistent-cookie-vars";
import { connectOnPusherServer } from "../../../lib/pusher";
import { peopleManagerService } from "../../../services/people-manager";
import { cookieStorageManager } from "../../../utils/cookie-storage-manager";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { socket_id } = request.body;

  const pusher = connectOnPusherServer();

  const userID = cookieStorageManager.getItem(persistedCookieVars.PEOPLE_ID, {
    req: request,
  });

  const people = await peopleManagerService.getPeopleBasicInfo({
    req: request,
    res: response,
  });

  let authResponse = pusher.authenticateUser(socket_id as string, {
    id: userID,
    user_info: people,
  });

  return response.send(JSON.stringify(authResponse));
};
