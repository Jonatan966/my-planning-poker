import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../lib/database";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { name } = request.body;

  if (!name) {
    return response.status(400).json({
      error: true,
      message: "Room name is required",
    });
  }

  const newRoom = await database.room.create({
    data: {
      name,
    },
  });

  return response.status(201).json(newRoom);
};
