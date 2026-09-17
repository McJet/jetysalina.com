export const project = {
  title: 'Jet & Nicole',
  summary: 'A wedding site for Jet and Nicole.',
}

// The ceremony as a fixed instant: 10:00 AM in California.
// The -07:00 offset is Pacific Daylight Time — if the date ever moves to
// November through mid-March, change it to -08:00 for Pacific Standard Time.
export const weddingDate = new Date('2027-07-07T10:00:00-07:00')

// Used so the displayed date reads the same everywhere, not in the
// viewer's own time zone.
export const weddingTimeZone = 'America/Los_Angeles'
