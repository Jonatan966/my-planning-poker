import { NextApiRequest, NextApiResponse } from "next";
import { persistedCookieVars } from "../../../configs/persistent-cookie-vars";
import { connectOnPusherServer } from "../../../lib/pusher";
import { peopleManagerService } from "../../../services/people-manager";
import { cookieStorageManager } from "../../../utils/cookie-storage-manager";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { socket_id, channel_name } = request.body;

  const pusher = connectOnPusherServer();

  const userID = cookieStorageManager.getItem(persistedCookieVars.PEOPLE_ID, {
    req: request,
  });

  const people = await peopleManagerService.getPeopleBasicInfo({
    req: request,
    res: response,
  });

  const entered_at = new Date();

  let authResponse = pusher.authorizeChannel(
    socket_id as string,
    channel_name as string,
    {
      user_id: userID,
      user_info: {
        ...people,
        entered_at,
      },
    }
  );

  return response.send(JSON.stringify(authResponse));
};
