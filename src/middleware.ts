import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { persistedCookieVars } from "./configs/persistent-cookie-vars";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const storagedPeopleID = request.cookies.get(persistedCookieVars.PEOPLE_ID);

  if (!storagedPeopleID) {
    const peopleID = crypto.randomUUID();

    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 1);

    response.cookies.set(persistedCookieVars.PEOPLE_ID, `"${peopleID}"`, {
      httpOnly: true,
      path: "/",
      expires: currentDate,
    });
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/visits", "/rooms/:path*"],
};
