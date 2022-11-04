import { Environment, FeedbackType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import { database } from "../../lib/database";
import { eventVault } from "../../services/event-vault";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { description, type } = request.body;

  const parsedFeedbackType = FeedbackType?.[type];

  if (!parsedFeedbackType) {
    return response.status(400).json({
      error: "Provide a valid feedback type",
    });
  }

  if (!description) {
    return response.status(400).json({
      error: "Provide a description",
    });
  }

  const createdFeedback = await database.feedback.create({
    data: {
      description,
      type: parsedFeedbackType,
      environment: process.env.VERCEL_ENV as Environment,
    },
  });

  if (!createdFeedback) {
    return response.status(400).json({
      error: "Could not create feedback",
    });
  }

  await eventVault.mpp_people_send_feedback({
    environment: createdFeedback.environment,
    feedback_type: createdFeedback.type,
  });

  return response.status(201).json(createdFeedback);
};
