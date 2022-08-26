import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { room_id } = request.query;

  const roomName = await redis.get(room_id as string);

  if (!roomName) {
    return response.status(400).json({
      error: true,
      message: "Room not found",
    });
  }

  return response.json({
    name: roomName,
  });
};
