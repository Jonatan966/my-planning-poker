import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { persistedCookieVars } from "../../configs/persistent-cookie-vars";
import { cookieStorageManager } from "../../utils/cookie-storage-manager";

async function getPeopleBasicInfo(
  context: Pick<GetServerSidePropsContext, "req" | "res">
) {
  const session = await getServerSession(context.req, context.res, {});

  const unauthenticatedPeopleName = cookieStorageManager.getItem(
    persistedCookieVars.PEOPLE_NAME,
    context
  );

  return {
    name: session?.user?.name || unauthenticatedPeopleName || null,
    avatar: session?.user?.image || null,
  };
}

export const peopleManagerService = {
  getPeopleBasicInfo,
};
