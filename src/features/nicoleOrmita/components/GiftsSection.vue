<template>
  <section class="gifts">
    <header class="intro">
      <h2 class="heading">Gifts</h2>
      <div v-if="gifts.description.length" class="description">
        <p v-for="sentence in gifts.description" :key="sentence">{{ sentence }}</p>
      </div>
    </header>

    <ul class="options">
      <li v-for="option in options" :key="option.app">
        <a
          v-if="option.app === 'venmo'"
          class="option"
          :href="`https://venmo.com/u/${option.handle}`"
          target="_blank"
          rel="noopener"
        >
          <svg class="logo venmo" viewBox="0 9.6 24 4.8" role="img" aria-label="Venmo"><path :d="logos.venmo" /></svg>
          <span class="detail">@{{ option.handle }}</span>
          <span class="action">
            Open Venmo
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="icons.external" /></svg>
          </span>
        </a>

        <button
          v-else-if="option.app === 'zelle'"
          type="button"
          class="option"
          @click="copy(option.email)"
        >
          <svg class="logo zelle" viewBox="228 167 736 321" role="img" aria-label="Zelle">
            <g transform="translate(0,633) scale(0.1,-0.1)"><path v-for="d in logos.zelle" :key="d" :d="d" /></g>
          </svg>
          <span class="detail email">{{ option.email }}</span>
          <span v-if="option.shownAs" class="note">Shows as {{ option.shownAs }} in Zelle</span>
          <span v-if="copyState === 'failed'" class="note" role="alert">
            Press and hold the email to copy it
          </span>
          <span class="action" :class="{ done: copied }" aria-live="polite">
            {{ copied ? "Copied" : "Copy email" }}
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="copied ? icons.check : icons.copy" /></svg>
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { gifts } from "../data.js";

defineProps({
  options: { type: Array, required: true },
});

// Both are wordmarks, drawn in the text colour rather than the brands' own to
// sit with the rest of the palette. Venmo is from Simple Icons
// (simpleicons.org); Zelle is the Wikimedia Commons trace (Zelle_logo.svg)
// with its ® dropped, one path per letter.
const logos = {
  venmo:
    "M21.772 13.119c-.267 0-.381-.251-.38-.655 0-.533.121-1.575.712-1.575.267 0 .357.243.357.598 0 .533-.13 1.632-.689 1.632Zm.502-3.377c-1.677 0-2.405 1.285-2.405 2.658 0 1.042.421 1.874 1.693 1.874 1.717 0 2.438-1.406 2.438-2.763 0-1.025-.462-1.769-1.726-1.769Zm-3.833 0c-.558 0-.964.17-1.393.477-.154-.275-.462-.477-.932-.477-.542 0-.947.219-1.247.437l-.04-.364H13.54l-.688 4.354h1.506l.479-3.053c.129-.065.323-.154.518-.154.145 0 .267.049.267.267 0 .056-.016.145-.024.218l-.429 2.722h1.498l.478-3.053c.138-.073.324-.154.51-.154.146 0 .268.049.268.267 0 .056-.017.145-.025.218l-.429 2.722h1.499l.461-2.908c.025-.153.049-.388.049-.549 0-.582-.267-.97-1.037-.97Zm-6.871 0c-.575 0-.98.219-1.287.421l-.017-.348H8.962l-.689 4.354H9.78l.478-3.053c.13-.065.324-.154.518-.154.147 0 .268.049.268.242 0 .081-.024.227-.032.299l-.422 2.666h1.499l.462-2.908c.024-.153.049-.388.049-.549 0-.582-.268-.97-1.03-.97Zm-5.631 1.834c.041-.485.413-.824.697-.824.162 0 .299.097.299.291 0 .404-.713.533-.996.533Zm.843-1.834c-1.604 0-2.382 1.39-2.382 2.698 0 1.01.478 1.817 1.814 1.817.527 0 1.07-.113 1.418-.282l.186-1.26c-.494.25-.874.347-1.271.347-.365 0-.64-.194-.64-.687.826-.008 2.252-.347 2.252-1.453 0-.687-.494-1.18-1.377-1.18Zm-4.239.267c.089.186.146.412.146.743 0 .606-.429 1.494-.777 2.06l-.373-2.989L0 9.969l.705 4.2h1.757c.77-1.01 1.718-2.448 1.718-3.554 0-.347-.073-.622-.235-.889l-1.402.283Z",
  zelle: [
    "m 3030,4179.9975 -657.2625,6.0526 -7e-4,-436.0501 H 3462 L 2330.0025,2299 V 1929.9975 H 3030 V 1505 h 420 v 425 h 714 c 6,17 8.1053,62.8446 -29.8947,104.8446 -63,70 -113.1053,143.1579 -159.1053,235.1579 -21,41 -36.9474,90.1053 -42.9474,94.1053 C 3791.448,2370.55 2982.5639,2368.8831 2983,2374 l 1133,1459.8947 v 346.1028 H 3450 V 4610 h -420 z",
    "M6063 4383 c-10 -4 -13 -225 -13 -1062 0 -1131 -1 -1112 49 -1209 45 -87 155 -165 278 -197 68 -18 268 -20 345 -4 99 21 118 51 79 128 -25 48 -58 153 -66 211 -11 69 -25 80 -109 78 -40 -1 -78 2 -85 6 -41 26 -41 33 -41 1046 0 651 -3 978 -10 991 -10 18 -23 19 -213 18 -111 0 -208 -3 -214 -6z",
    "M6980 4380 c-13 -8 -15 -136 -15 -1052 0 -987 1 -1047 19 -1116 34 -136 111 -219 257 -280 56 -23 81 -27 194 -30 151 -4 228 7 305 46 76 37 78 63 13 158 -26 38 -66 103 -88 144 l-40 75 -73 1 c-91 2 -100 6 -117 49 -13 29 -15 178 -15 1005 0 651 -3 978 -10 991 -10 18 -23 19 -213 19 -111 0 -209 -5 -217 -10z",
    "M4805 3755 c-5 -2 -44 -11 -85 -20 -257 -59 -484 -256 -580 -506 -53 -138 -72 -245 -73 -404 -1 -223 44 -387 147 -543 116 -175 286 -294 506 -354 75 -20 108 -23 280 -23 170 0 205 3 276 22 176 49 326 130 447 245 77 72 76 92 -2 152 -32 25 -90 79 -128 121 -48 51 -77 75 -92 75 -14 0 -46 -20 -77 -50 -107 -97 -242 -143 -419 -142 -162 1 -280 43 -355 129 -38 43 -86 141 -96 196 l-6 37 623 0 c343 0 630 4 637 9 33 21 41 166 17 324 -57 378 -283 632 -638 717 -63 15 -115 20 -227 19 -80 0 -149 -2 -155 -4z m267 -386 c73 -15 163 -65 205 -113 39 -44 79 -123 89 -174 l7 -32 -408 0 -407 0 7 32 c30 135 146 248 290 284 64 16 150 17 217 3z",
    "m 8440,3746 c -355,-79 -595,-329 -670,-698 -45,-218 -20,-472 65,-654 116,-252 327,-415 615,-474 91,-19 127,-21 270,-17 121,4 186,11 242,26 171,45 321,127 436,237 88,85 88,89 -7,168 -44,36 -103,93 -131,126 -65,75 -82,76 -155,10 -109,-99 -239,-143 -420,-142 -254,1 -402,110 -450,330 l -7,25.95 h 1267 c 43,31 27,359.05 -25,511.05 -10,30 -37,90 -59,132 -117,224 -304,363 -564,418 -83,18 -328,18 -407,1 z m 312,-377 c 68,-15 138,-50 188,-95 42,-39 110,-162 110,-200 v -24 h -812 l 7,28 c 52,214 272,341 507,291 z",
  ],
};

// Simple line icons on a 24-unit grid, stroked in the text colour.
const icons = {
  // Venmo opens in a new tab or the app, so its button says it leaves the site.
  external: "M7 17 17 7M8 7h9v9",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  check: "M5 12.5 10 17.5 19 7",
};

// Some in-app browsers refuse the clipboard, so a failed copy points at the
// email, which stays selectable text for exactly this case.
const copyState = ref("idle");
const copied = computed(() => copyState.value === "copied");

let resetTimer;
async function copy(email) {
  try {
    await navigator.clipboard.writeText(email);
    copyState.value = "copied";
  } catch {
    copyState.value = "failed";
  }
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => (copyState.value = "idle"), 2500);
}
onBeforeUnmount(() => clearTimeout(resetTimer));
</script>

<style scoped>
.gifts {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: var(--space-2xl);
  width: 100%;
  max-width: 44rem;
}

.intro {
  display: grid;
  justify-items: center;
  gap: var(--space-md);
}

.heading {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8cqi, 4rem);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.description {
  display: grid;
  gap: var(--space-sm);
  max-width: 36rem;
  font-size: clamp(1rem, 2.5cqi, 1.25rem);
  line-height: 1.6;
  color: var(--color-text-muted);
}

.description p {
  margin: 0;
}

.options {
  display: grid;
  gap: var(--space-xl);
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Side by side once there is room for two readable columns - the same
   breakpoint as the RSVP page's event boxes. */
@container view (width >= 640px) {
  .options {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
  }
}

/* Each box is itself the link or button, so the whole box is the tap target. */
/* A column rather than a grid so the button can be pushed to the bottom: side
   by side, the boxes are as tall as the taller one, and the buttons line up
   whatever sits above them. */
.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

.option:hover {
  border-color: var(--color-text);
}

/* Phones have no hover, so a press has to answer on its own. */
.option:active {
  background-color: var(--color-border);
  transform: scale(0.98);
}

.option:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: no-preference) {
  .option {
    transition: transform 0.1s ease, background-color 0.1s ease;
  }
}

/* Both marks share one box height so the two cards line up; the widths are
   set so their lowercase letters come out about the same size - Zelle's
   capital Z is what makes it the taller of the two. */
.logo {
  height: 2.5rem;
  fill: currentColor;
}

.logo.venmo {
  width: 7.5rem;
}

.logo.zelle {
  width: 4.6rem;
}

.detail {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 3.5cqi, 1.625rem);
  line-height: 1.2;
  overflow-wrap: anywhere;
}

/* A button's text is unselectable by default; the email has to stay
   selectable for when copying is refused. */
.email {
  user-select: text;
}

.note {
  margin: 0;
  font-size: clamp(0.875rem, 2cqi, 1rem);
  color: var(--color-text-muted);
}

/* Drawn like the RSVP page's reply button so it reads as one. It is only a
   label - the whole box is the real link or button - so it fills in when the
   box is hovered or pressed rather than on its own. */
.action {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  /* Takes up any slack, pinning the button to the bottom of the box. */
  margin-top: auto;
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--color-text);
  font-size: clamp(0.75rem, 1.8cqi, 0.9375rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

/* The auto margin above shrinks to nothing when the box has no slack - on a
   phone, or in the taller of two boxes - so this keeps a little room between
   the button and whatever sits above it. */
.option > :has(+ .action) {
  margin-bottom: var(--space-md);
}

.option:hover .action,
.option:active .action,
.action.done {
  background-color: var(--color-text);
  color: var(--color-background);
}

.icon {
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
