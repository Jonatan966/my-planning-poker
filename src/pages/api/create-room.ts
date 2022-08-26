import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";

const ONE_DAY = 60 * 60 * 24;

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { name } = request.body;

  if (!name) {
    return response.status(400).json({
      error: true,
      message: "Room name is required",
    });
  }

  const roomId = randomUUID();

  await redis.set(roomId, name, {
    ex: ONE_DAY,
  });

  return response.status(201).json({
    name,
    id: roomId,
  });
};
