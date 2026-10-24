<script setup>
import '@/features/landing/styles/main.css'
import { RouterLink } from 'vue-router'

const CONTACT_EMAIL = 'jethercy@gmail.com'
const LAST_UPDATED = 'October 24, 2026'
</script>

<template>
  <article class="privacy container">
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated {{ LAST_UPDATED }}</p>

    <p>
      jetysalina.com is a personal website run by Jet Ysalina. This page explains what
      information the site collects, why, and what you can do about it.<br />
      Questions or requests: <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>.
    </p>

    <h2>What the site collects</h2>

    <h3>Visiting any page</h3>
    <p>
      The site uses <strong>Google Analytics</strong> to understand how many people visit
      and which pages they view. Google Analytics uses cookies and collects things like
      the pages you visit within jetysalina.com, your browser and device type, and your approximate location.
      See
      <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">how Google uses
        this information</a>.
    </p>
    <p>
      The site is hosted on <strong>Cloudflare</strong>, which processes your IP address
      to deliver pages and protect the site from abuse.
    </p>

    <h3>Signing in with Google</h3>
    <p>Signing in is optional. Box Roulette can be played without it. If you sign in, the site receives from Google:</p>
    <ul>
      <li>your Google account ID (a number Google uses to identify your account)</li>
      <li>your email address</li>
    </ul>
    <p>
      It does <strong>not</strong> receive your name, photo, contacts or password.
    </p>

    <h3>Using your account</h3>
    <ul>
      <li>
        <strong>Display name.</strong> The name you choose. It is <strong>public</strong>:
        it is shown on Box Roulette leaderboards.
      </li>
      <li>
        <strong>Box Roulette runs.</strong> The score, rounds and outcome of games you
        play while signed in, and when you played them. These appear on leaderboards
        under your display name.
      </li>
    </ul>

    <h3>Cookies and browser storage</h3>
    <ul>
      <li>
        <strong>Session cookie.</strong> Keeps you signed in. It expires 30 days after you
        last use the site, or when you log out.
      </li>
      <li>
        <strong>Sign-in cookies.</strong> Two short-lived cookies that protect the sign-in
        process. They are deleted when sign-in finishes, or after 10 minutes.
      </li>
      <li>
        <strong>Browser storage.</strong> Some pages remember small things in your own
        browser (for example, that you have already unlocked a page). This stays on your
        device and is never sent to the site.
      </li>
      <li><strong>Google Analytics cookies</strong>, as described above.</li>
    </ul>

    <h2>How it is used</h2>
    <p>
      Your information is used only to sign you in, show leaderboards, prevent cheating
      and abuse, and understand how the site is used. It is <strong>never sold</strong>,
      and the site shows no ads. It is shared only with the services that run the site:
      Cloudflare (hosting and database) and Google (sign-in and analytics).
    </p>

    <h2>How long it is kept</h2>
    <ul>
      <li>Account information and runs are kept until you delete your account.</li>
      <li>Games played without signing in are discarded within about a day unless you sign in to save them.</li>
      <li>Google Analytics data is kept according to Google Analytics' retention settings.</li>
    </ul>

    <h2>Your choices</h2>
    <ul>
      <li>
        <strong>Delete your account</strong> at any time from Box Roulette (Change name,
        then Delete account). This immediately removes your email address, display name,
        runs and sessions.
      </li>
      <li>
        <strong>Ask</strong> what information the site holds about you, or for it to be
        corrected or deleted, by emailing
        <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>.
      </li>
      <li>
        <strong>Remove the site's access</strong> to your Google account at
        <a href="https://myaccount.google.com/connections" target="_blank"
          rel="noopener">myaccount.google.com/connections</a>.
      </li>
      <li>
        <strong>Block analytics</strong> with your browser's tracking protection or the
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics opt-out
          add-on</a>.
      </li>
    </ul>

    <h2>Children</h2>
    <p>The site is not directed at children under 13, and accounts are not intended for them.</p>

    <h2>Changes</h2>
    <p>
      If this policy changes, the date at the top will change with it.
    </p>

    <p>
      <RouterLink to="/">Back to jetysalina.com</RouterLink>
    </p>
  </article>
</template>

<style scoped>
.privacy {
  max-width: 42rem;
  padding-top: 3rem;
  padding-bottom: 4rem;
  line-height: 1.6;
}

.privacy h1 {
  font-size: 2.44rem;
}

.privacy h2 {
  font-size: 1.56rem;
  margin-top: 2.5rem;
}

.privacy h3 {
  font-size: 1.25rem;
  margin-top: 1.5rem;
}

.privacy p,
.privacy ul {
  margin-bottom: 1rem;
}

.privacy ul {
  padding-left: 1.25rem;
  list-style: disc;
}

.privacy li {
  margin-bottom: 0.5rem;
}

.privacy a {
  text-decoration: underline;
}

.updated {
  opacity: 0.7;
  font-style: italic;
}
</style>
