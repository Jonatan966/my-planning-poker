export function convertSecondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const finalSeconds = seconds % 60;

  return [hours, minutes, finalSeconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}
