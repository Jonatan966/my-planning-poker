import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  throw new Error("Sentry API Error");
};

export default withSentry(handler);
