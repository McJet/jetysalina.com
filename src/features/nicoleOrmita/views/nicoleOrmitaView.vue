<template>
    <div class="view">
        <SiteNav v-model="currentPage" :pages="pages" />
        <HeroMarquee v-if="currentPage === 'home'" :images="photos" />
        <div class="inner-view" :class="{ 'below-hero': currentPage === 'home' }">
            <template v-if="currentPage === 'home'">
                <header class="head">
                    <p v-if="saveTheDate" class="lead-title">{{ leadTitle }}</p>
                    <div class="title-block">
                        <p v-if="saveTheDate" class="lead-sub">{{ leadSub }}</p>
                        <h1 class="names">
                            <span class="name"><span class="part">Jet</span><span class="part">Ysalina</span></span>
                            <span class="lead-sub">and</span>
                            <span class="name"><span class="part">Nicole</span><span class="part">Ormita</span></span>
                        </h1>
                    </div>
                </header>
                <div class="footer">
                    <div class="when">
                        <p class="date">{{ dateString }}</p>
                    </div>
                    <CountdownTimer :target="weddingDate" />
                    <button v-if="invited" type="button" class="rsvp-link" @click="currentPage = 'rsvp'">
                        RSVP
                    </button>
                    <p v-else-if="saveTheDate" class="follow">Invitation to follow</p>
                </div>
            </template>
            <RsvpSection v-else />
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import CountdownTimer from "../components/CountdownTimer.vue";
import HeroMarquee from "../components/HeroMarquee.vue";
import RsvpSection from "../components/RsvpSection.vue";
import SiteNav from "../components/SiteNav.vue";
import { photos, weddingDate, weddingTimeZone } from "../data.js";

const route = useRoute();

// A flag reads as on at ?name=true, and at a bare ?name with no value,
// since that is the natural thing to type. Anything else is off.
function flagOn(value) {
    return value === null || String(value).toLowerCase() === "true";
}

// ?rsvp=true is the same announcement as ?savethedate=true, further along:
// the invitation has gone out, so the wording changes and the countdown is
// followed by a way in rather than a promise of one. It implies the
// save-the-date layout, so an invitation link needs only the one parameter.
const invited = computed(() => flagOn(route.query.rsvp));
const saveTheDate = computed(
    () => invited.value || flagOn(route.query.savethedate),
);
const leadTitle = computed(() =>
    invited.value ? "You’re invited!" : "Save the date",
);
// "You're invited! / to the wedding of" carries on from the line above it,
// where "Save the date" starts a new sentence.
const leadSub = computed(() =>
    invited.value ? "To the wedding of" : "The wedding of",
);

// Single page - the nav swaps sections in place rather than routing.
const pages = [
    { id: "home", label: "Home" },
    { id: "rsvp", label: "RSVP" },
];
const currentPage = ref("home");

const dateString = weddingDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: weddingTimeZone,
});
</script>

<style scoped>
@import '../styles/variables.css';

.view {
    container: view / inline-size;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
    color: var(--color-text);
    min-height: 100dvh;
    font-family: var(--font-body);
}

.inner-view {
    /* Takes the height left over below the nav, so a short section still
       centres itself in the window rather than clinging to the top. */
    flex: 1;
    min-height: 0;
    display: grid;
    justify-items: center;
    align-content: center;
    width: 100%;
    max-width: 90rem;
    margin: 0 auto;
    gap: var(--space-2xl);
    padding: var(--space-2xl) var(--space-md);
}

/* Centring only works when the leftover height is worth splitting. Below the
   photo strip it is not: the narrower the window, the smaller the names and
   the shorter the strip, so the space left over - and with it the gap under
   the strip - grows just as the thing it sits above gets smaller. Anchoring
   to the top instead keeps that distance at the padding, whatever the width. */
.inner-view.below-hero {
    align-content: start;
}

/* "Save the date" stands on its own as the page header, so the gap here is
   wide. The lead-in that belongs to the names is grouped with them below. */
.head {
    display: grid;
    justify-items: center;
    gap: var(--space-2xl);
}

.lead-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 4cqi, 2rem);
    line-height: 1.1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

/* Tighter than the gap between the name lines, so "The wedding of" reads as
   part of the names rather than as a line of its own. */
.title-block {
    display: grid;
    justify-items: center;
    gap: var(--space-md);
}

.lead-sub {
    margin: 0;
    font-size: clamp(0.75rem, 1.8cqi, 0.9375rem);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-text-muted);
}

.names {
    display: grid;
    justify-items: center;
    text-align: center;
    gap: var(--space-lg);
    margin: 0;
    font-weight: 400;
}

.name {
    font-family: var(--font-display);
    font-size: clamp(3rem, 11cqi, 5rem);
    line-height: 1.1;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    /* Never let a name wrap on its own - the breakpoint below is what decides,
       so that the two names always break together. */
    white-space: nowrap;
}

/* The parts sit flush together in the markup, so the space between a first and
   a last name is added here, and dropped once they are on separate lines. */
.part+.part::before {
    content: " ";
}

/* "NICOLE ORMITA" is the longer name: about 8.95em wide in Bodoni MT, and the
   font size tops out at 5rem, so it needs roughly 748px of container before it
   fits on one line. Below that both names stack, rather than the longer one
   breaking on its own while "JET YSALINA" still fits.
   Re-measure this if the names or the display font ever change. */
@container view (width < 768px) {
    .part {
        display: block;
    }

    .part+.part::before {
        content: none;
    }
}

.and {
    font-size: clamp(0.875rem, 2cqi, 1.125rem);
    letter-spacing: 0.02em;
}

.footer {
    display: grid;
    justify-items: center;
    gap: var(--space-xl);
    /* So the countdown inside can measure itself against the real column
       width instead of against its own content. */
    width: 100%;
}

.when {
    display: grid;
    justify-items: center;
    gap: var(--space-sm);
}

.connector {
    margin: 0;
    font-size: clamp(0.875rem, 2cqi, 1.125rem);
    letter-spacing: 0.02em;
    color: var(--color-text-muted);
}

/* Same treatment as the reply button on the RSVP page, so the two read as
   the same action in two places. */
.rsvp-link {
    padding: var(--space-md) var(--space-2xl);
    border: 1px solid var(--color-text);
    background: none;
    color: var(--color-text);
    font: inherit;
    font-size: clamp(0.75rem, 1.8cqi, 0.9375rem);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
}

.rsvp-link:hover {
    background-color: var(--color-text);
    color: var(--color-background);
}

.follow {
    margin: 0;
    font-size: clamp(0.75rem, 1.8cqi, 0.9375rem);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-text-muted);
}

.date {
    margin: 0;
    font-size: clamp(1.5rem, 4.5cqi, 2.25rem);
    letter-spacing: 0.08em;
}
</style>
