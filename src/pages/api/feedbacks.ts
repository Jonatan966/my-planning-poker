import { Environment, FeedbackType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import { appConfig } from "../../configs/app";
import { persistedCookieVars } from "../../configs/persistent-cookie-vars";
import { database } from "../../lib/database";
import { eventVault } from "../../services/event-vault";
import { cookieStorageManager } from "../../utils/cookie-storage-manager";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    return response.status(405).end();
  }

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
      environment: appConfig.environment as Environment,
    },
  });

  if (!createdFeedback) {
    return response.status(400).json({
      error: "Could not create feedback",
    });
  }

  const peopleID = cookieStorageManager.getItem(persistedCookieVars.PEOPLE_ID, {
    req: request,
  });

  await eventVault.mpp_people_send_feedback({
    feedback_type: createdFeedback.type,
    people_id: peopleID,
  });

  return response.status(201).json(createdFeedback);
};
