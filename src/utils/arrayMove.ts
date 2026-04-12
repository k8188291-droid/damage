export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const result = array.slice();
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}
