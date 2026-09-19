<template>
  <RsvpGate>
    <section class="rsvp">
      <header class="intro">
        <h2 class="heading">RSVP</h2>
        <p v-if="deadlineString" class="deadline">
          Kindly reply by {{ deadlineString }}
        </p>
      </header>

      <ul v-if="rsvp.events.length" class="events">
        <li v-for="event in rsvp.events" :key="event.name" class="event">
          <h3 class="event-name">{{ event.name }}</h3>
          <p class="event-time">{{ event.time }}</p>
          <p class="event-place">
            <span class="venue">{{ event.venue }}</span>
            <a
              v-if="event.address"
              class="address"
              :href="mapUrl(event)"
              target="_blank"
              rel="noopener"
              :aria-label="`Open ${event.venue} in maps`"
            >{{ event.address }}</a>
          </p>
        </li>
      </ul>

      <a v-if="rsvp.formUrl" class="form-link" :href="rsvp.formUrl" target="_blank" rel="noopener">
        Reply to our invitation
      </a>
      <p v-else class="pending">Our reply form is on its way - please check back soon.</p>

      <section v-if="rsvp.faqs.length" class="faqs">
        <h3 class="faqs-heading">Good to know</h3>
        <dl class="faq-list">
          <div v-for="faq in rsvp.faqs" :key="faq.question" class="faq">
            <dt class="question">{{ faq.question }}</dt>
            <dd class="answer">{{ faq.answer }}</dd>
          </div>
        </dl>
      </section>
    </section>
  </RsvpGate>
</template>

<script setup>
import { computed } from "vue";
import RsvpGate from "./RsvpGate.vue";
import { rsvp, weddingTimeZone } from "../data.js";

// Matches how the home page writes its date, and in the wedding's time zone
// rather than the reader's.
// Google's universal maps URL, so the link resolves wherever it is opened:
// the Maps app on a phone that has it, a browser tab anywhere else.
// The venue name goes in front of the address to help Maps find the pin.
function mapUrl(event) {
  const query = [event.venue, event.address].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const deadlineString = computed(() =>
  rsvp.deadline?.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: weddingTimeZone,
  }),
);
</script>

<style scoped>
.rsvp {
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

.deadline {
  margin: 0;
  font-size: clamp(1rem, 2.5cqi, 1.25rem);
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.events {
  display: grid;
  gap: var(--space-xl);
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Side by side once there is room for two readable columns. */
@container view (width >= 640px) {
  .events {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
  }
}

.event {
  display: grid;
  justify-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.event-name {
  margin: 0;
  font-size: clamp(0.75rem, 1.8cqi, 0.9375rem);
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.event-time {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 5cqi, 2.25rem);
  line-height: 1;
}

.event-place {
  display: grid;
  gap: var(--space-xs);
  margin: 0;
  font-size: clamp(0.9375rem, 2.2cqi, 1.0625rem);
  line-height: 1.5;
}

.address {
  color: var(--color-text-muted);
  text-decoration: underline;
  text-decoration-color: var(--color-border);
  text-underline-offset: 0.25em;
}

.address:hover {
  color: var(--color-text);
  text-decoration-color: currentColor;
}

.form-link {
  padding: var(--space-md) var(--space-2xl);
  border: 1px solid var(--color-text);
  color: var(--color-text);
  font-size: clamp(0.75rem, 1.8cqi, 0.9375rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
}

.form-link:hover {
  background-color: var(--color-text);
  color: var(--color-background);
}

.pending {
  margin: 0;
  font-size: clamp(0.9375rem, 2.2cqi, 1.125rem);
  color: var(--color-text-muted);
}

.faqs {
  display: grid;
  justify-items: center;
  gap: var(--space-lg);
  width: 100%;
}

.faqs-heading {
  margin: 0;
  font-size: clamp(0.75rem, 1.8cqi, 0.9375rem);
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.faq-list {
  display: grid;
  gap: var(--space-lg);
  width: 100%;
  margin: 0;
}

.faq {
  display: grid;
  gap: var(--space-xs);
}

.question {
  font-family: var(--font-display);
  font-size: clamp(1.125rem, 3cqi, 1.375rem);
}

.answer {
  margin: 0;
  font-size: clamp(0.9375rem, 2.2cqi, 1.0625rem);
  line-height: 1.6;
  color: var(--color-text-muted);
}
</style>
