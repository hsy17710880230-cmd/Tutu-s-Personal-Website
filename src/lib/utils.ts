export function underline2Capitalized(input: string) {
  const words = input.split("_");
  return words
    .map((it) => it.charAt(0).toUpperCase() + it.slice(1))
    .join(" ");
}
