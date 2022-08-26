import { NextApiRequest, NextApiResponse } from "next";
import { connectOnPusherServer } from "../../../lib/pusher";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  let requestBody = request.body;

  if (typeof requestBody === "string") {
    requestBody = JSON.parse(requestBody);
  }

  const { people_id, room_id } = requestBody;

  const pusher = connectOnPusherServer();

  await pusher.trigger(room_id, "PEOPLE_LEAVE", {
    id: people_id,
  });

  return response.end();
};
