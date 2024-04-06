import { validate as isUUID } from "uuid";
import { isCuid } from "../lib/cuid";

export function validateRoomId(room_id?: string): boolean {
  if (!room_id?.trim()) {
    return false;
  }

  const isValidCuid = isCuid(room_id);
  const isValidUUID = isUUID(room_id);

  return isValidCuid || isValidUUID;
}
