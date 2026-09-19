import { project as boxRoulette } from "../features/boxRoulette/data.js";
import { weddingDate, weddingTimeZone } from "../features/nicoleOrmita/data.js";

// Where the built site is served from. Link previews need absolute URLs: the
// scraper fetching the page has nothing to resolve a relative one against.
export const SITE_URL = "https://jetysalina.com";

const weddingDay = weddingDate.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: weddingTimeZone,
});

// This site is a single HTML file that routes in the browser, and the scrapers
// behind link previews - iMessage, Facebook, WhatsApp, Slack - do not run the
// JavaScript that would swap these tags in. So each page listed here is also
// written out as its own file at build time, with its tags already in the
// markup. See the routeMeta plugin in vite.config.js.
//
// `route` doubles as the directory the file is written to, so it matches the
// path in the router.
export const weddingPage = {
  route: "/and-nicoleormita",
  title: "Jet and Nicole\u2019s Wedding",
  description: `Jet Ysalina and Nicole Ormita are getting married on ${weddingDay}. Save the date.`,
  favicon: "/features/nicoleOrmita/jetnicole.svg",
  // 1200x630 is the frame every scraper crops a large preview to, so the image
  // is cut to it here rather than left to each of them to guess at.
  image: "/features/nicoleOrmita/og-wedding.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageType: "image/jpeg",
  imageAlt:
    "Nicole laughing with her hand on Jet\u2019s cheek, her engagement ring in view.",
};

export const landingPage = {
  route: "/",
  title: "Jet Ysalina",
  description:
    "Full-stack web developer. A home for my projects, the things I am building, and whatever I am tinkering with next.",
  favicon: "/features/landing/j-square.svg",
  image: "/features/landing/og-landing.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageType: "image/jpeg",
  imageAlt:
    "The jetysalina.com home page: “Full-Stack Web Developer” over a short introduction.",
};

export const boxRoulettePage = {
  route: "/box-roulette",
  title: boxRoulette.title,
  description: "Open boxes, press your luck, cash out before you bust. " +
    `${boxRoulette.summary}`,
  favicon: "/features/boxRoulette/box-roulette.svg",
  image: "/features/boxRoulette/og-box-roulette.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageType: "image/jpeg",
  imageAlt:
    "A row of Box Roulette boxes, one gold and one red, above the game’s name.",
};

// The order here is the order the files are written in; it does not matter.
export const pages = [landingPage, boxRoulettePage, weddingPage];
