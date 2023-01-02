import { dayjs } from "../lib/dayjs";

enum TimeZone {
  AMERICA_SAO_PAULO = "America/Sao_Paulo",
  AMERICA_LIMA = "America/Lima",
}

export function getDateWithTimezone(
  date = new Date(),
  timeZone = TimeZone.AMERICA_SAO_PAULO
) {
  return dayjs(date).tz(timeZone).toDate();
}
