export function filterDistinctObjects<T>(array: T[], key: keyof T) {
  const filteredObjects = new Map(
    array.map((item) => [item[key], item])
  ).values();

  return Array.from(filteredObjects);
}
