import { NextApiRequest, NextApiResponse } from "next";

import { appConfig } from "../../configs/app";
import { createId } from "../../lib/cuid";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    return response.status(405).end();
  }

  const newRoom = {
    id: createId(),
    name: "Nova Sala",
    environment: appConfig.environment,
    created_at: new Date(),
  };

  return response.status(201).json(newRoom);
};
