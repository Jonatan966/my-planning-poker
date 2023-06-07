import { Environment } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import { appConfig } from "../../configs/app";
import { database } from "../../lib/database";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    return response.status(405).end();
  }

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
      environment: appConfig.environment as Environment,
    },
  });

  return response.status(201).json(newRoom);
};
