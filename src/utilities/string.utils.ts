export function prettyPrintSnakeCase(input: string) {
  // Replace underscores with spaces
  const withSpaces = input.replace(/_/g, ' ');

  // Capitalize the first letter of each word
  const capitalized = withSpaces.replace(/\b\w/g, (match) =>
    match.toUpperCase()
  );

  return capitalized;
}
