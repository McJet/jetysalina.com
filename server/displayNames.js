// Display name rules. Uniqueness is NOT checked here: only the database can
// guarantee that (see the UNIQUE COLLATE NOCASE column on users).
const FORMAT = /^[A-Za-z0-9_-]{3,16}$/;

// Lowercase. A name is refused if it CONTAINS any of these, so keep entries
// specific: a short entry like "ass" would also block "Cassie" and "Bass".
// Add offensive terms here as they come up.
const BLOCKED = [
  // Names that could pass for the site speaking
  "admin",
  "moderator",
  "jetysalina",
];

// Returns an error message for the player, or null if the name is allowed.
export function displayNameProblem(name) {
  if (typeof name !== "string" || !FORMAT.test(name)) {
    return "Use 3-16 letters, numbers, _ or -";
  }
  const lower = name.toLowerCase();
  if (BLOCKED.some((word) => lower.includes(word))) {
    return "That name isn't allowed";
  }
  return null;
}
