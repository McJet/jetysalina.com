export const project = {
  title: "Jet & Nicole",
  summary: "A wedding site for Jet and Nicole.",
};

const PHOTO_DIR = "/features/nicoleOrmita";

// Each photo ships as a set of square WebPs so a phone is not made to download
// a desktop-sized one. `widths` lists what was exported for that photo, small
// to large; the largest doubles as the src for anything that ignores srcset.
//
// To add a photo, export it square at 800 and 1600 (or up to whatever the
// original allows) into public/features/nicoleOrmita/ as <file>-<width>.webp
// and add a line here. Larger than 1600 is wasted: the strip never shows a
// photo wider than 24rem, so nothing above that tier is ever the one picked.
function photo({ file, widths, alt, position }) {
  return {
    alt,
    position,
    src: `${PHOTO_DIR}/${file}-${widths.at(-1)}.webp`,
    srcset: widths.map((w) => `${PHOTO_DIR}/${file}-${w}.webp ${w}w`).join(", "),
  };
}

// The hero carousel, in order.
//
// `position` is the object-position used when the square photo is cropped into
// the wide hero band - nudge it up or down if a crop ever cuts off a face.
export const photos = [
  photo({
    file: "engagement-ring",
    widths: [800, 1600],
    alt: "Jet and Nicole cheek to cheek, smiling, with Nicole's engagement ring held up beside them.",
    position: "center 35%",
  }),
  photo({
    file: "engagement-faces",
    widths: [800, 1600],
    alt: "Nicole laughing with her hand on Jet's cheek as the two look at each other.",
    position: "center 40%",
  }),
  photo({
    // The original of this one is 1536px, so there is no 2400 variant.
    file: "engagement-crouched",
    widths: [800, 1536],
    alt: "Jet and Nicole crouched down and laughing in front of a flower-lined backdrop.",
    position: "center 45%",
  }),
];

// The ceremony as a fixed instant: 10:00 AM in California.
// The -07:00 offset is Pacific Daylight Time - if the date ever moves to
// November through mid-March, change it to -08:00 for Pacific Standard Time.
export const weddingDate = new Date("2027-07-07T10:00:00-07:00");

// Used so the displayed date reads the same everywhere, not in the
// viewer's own time zone.
export const weddingTimeZone = "America/Los_Angeles";

// Everything on the RSVP page is edited here. Each section disappears on its
// own when left empty, so an unused one can be emptied rather than deleted.
export const rsvp = {
  // Where the button sends guests. Until this is set, the page says the form
  // is on its way instead of showing a dead button.
  formUrl: "",

  // Leave as null to drop the deadline line.
  deadline: new Date("2027-05-07T23:59:00-07:00"),

  // Add, reorder or remove freely - the page follows this list.
  events: [
    {
      name: "Ceremony",
      time: "10:00 AM",
      venue: "Venue name",
      address: "Street address, City, State",
    },
    {
      name: "Reception",
      time: "12:00 PM",
      venue: "Venue name",
      address: "Street address, City, State",
    },
  ],

  // Same here - an empty list hides the whole section.
  faqs: [
    {
      question: "What should I wear?",
      answer: "Formal attire.",
    },
    {
      question: "Can I bring a guest?",
      answer:
        "Your invitation lists everyone we have saved a seat for.",
    },
  ],
};

// SHA-256 of the RSVP password, trimmed and lowercased. The hash is stored
// rather than the password so the password itself is not in the repo.
//
// The check runs in the browser, so this keeps out someone who happens on the
// URL - it is not proof against anyone willing to open devtools.
//
// To change the password, run this and paste the result below:
//   node --input-type=module -e "import {createHash} from 'node:crypto'; console.log(createHash('sha256').update(process.argv[1].trim().toLowerCase()).digest('hex'))" "newpassword"
export const rsvpPasswordHash =
  "220079a065a2234613c1f714e020f2b66df66e4a3c84ed218fb679d5b06f1c7e";
