const MATCH_UUID_REGEX =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export function validateUUID(uuid = "") {
  const isValidUUID = uuid.match(MATCH_UUID_REGEX);

  return isValidUUID;
}
