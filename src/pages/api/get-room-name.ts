import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../lib/database";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { room_id } = request.query;

  const foundedRoom = await database.room.findUnique({
    where: {
      id: String(room_id),
    },
  });

  if (!foundedRoom) {
    return response.status(400).json({
      error: true,
      message: "Room not found",
    });
  }

  return response.json(foundedRoom);
};
