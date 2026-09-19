<template>
  <form v-if="!unlocked" class="gate" @submit.prevent="submit">
    <h2 class="heading">RSVP</h2>
    <p class="note">This page is for our invited guests.<br />Please enter the password from your invitation.</p>
    <div class="field">
      <label class="label" for="rsvp-password">Password</label>
      <input id="rsvp-password" v-model="entry" class="input" type="password" autocomplete="off"
        @input="error = false" />
    </div>
    <p v-if="error" class="error" role="alert">That password doesn't match. Try again.</p>
    <button type="submit" class="submit">Enter</button>
  </form>
  <slot v-else />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { rsvpPasswordHash } from "../data.js";

// The unlocked flag is stored as the hash itself, so changing the password
// also sends everyone who already unlocked back to this form.
const STORAGE_KEY = "nicoleOrmita:rsvp";

const unlocked = ref(false);
const entry = ref("");
const error = ref(false);

onMounted(() => {
  // So a guest who has already entered the password is not asked again on
  // every visit. Reading storage can throw when the browser blocks it.
  try {
    unlocked.value = localStorage.getItem(STORAGE_KEY) === rsvpPasswordHash;
  } catch {
    unlocked.value = false;
  }
});

// Trimmed and lowercased so the password is forgiving to type on a phone.
async function hash(value) {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function submit() {
  if ((await hash(entry.value)) !== rsvpPasswordHash) {
    error.value = true;
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, rsvpPasswordHash);
  } catch {
    // Not being able to remember the unlock is fine - they just retype it.
  }

  unlocked.value = true;
}
</script>

<style scoped>
.gate {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: var(--space-lg);
  width: 100%;
  max-width: 26rem;
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

.note {
  margin: 0;
  font-size: clamp(0.9375rem, 2.2cqi, 1.125rem);
  line-height: 1.6;
  color: var(--color-text-muted);
}

.field {
  display: grid;
  justify-items: center;
  gap: var(--space-sm);
  width: 100%;
}

.label {
  font-size: clamp(0.625rem, 1.6cqi, 0.8125rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 1rem;
  letter-spacing: 0.12em;
  text-align: center;
}

.input:focus-visible {
  outline: 1px solid var(--color-text);
  outline-offset: 2px;
}

.error {
  margin: 0;
  font-size: clamp(0.8125rem, 1.9cqi, 0.9375rem);
  letter-spacing: 0.04em;
}

.submit {
  padding: var(--space-sm) var(--space-xl);
  border: 1px solid var(--color-text);
  background: none;
  color: var(--color-text);
  font: inherit;
  font-size: clamp(0.75rem, 1.8cqi, 0.9375rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
}

.submit:hover {
  background-color: var(--color-text);
  color: var(--color-background);
}
</style>
