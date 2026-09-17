<template>
    <div class="view">
        <div class="inner-view">
            <h1 class="names">
                <span class="name">Jet Ysalina</span>
                <span class="and">and</span>
                <span class="name nicole">Nicole Ormita</span>
            </h1>
            <div class="footer">
                <p class="date">{{ dateString }}</p>
                <CountdownTimer :target="weddingDate" />
            </div>
        </div>
    </div>
</template>

<script setup>
import CountdownTimer from "../components/CountdownTimer.vue";
import { weddingDate, weddingTimeZone } from "../data.js";

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
    background-color: var(--color-background);
    color: var(--color-text);
    min-height: 100dvh;
    font-family: var(--font-body);
}

.inner-view {
    display: grid;
    justify-items: center;
    align-content: center;
    max-width: 90rem;
    min-height: 100dvh;
    margin: 0 auto;
    gap: var(--space-3xl);
    padding: var(--space-2xl) var(--space-md);
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
    text-wrap: balance;
}

.name.nicole {
    font-size: clamp(2rem, 11cqi, 4rem);
}

.and {
    font-size: clamp(0.875rem, 2cqi, 1.125rem);
    letter-spacing: 0.02em;
}

.footer {
    display: grid;
    justify-items: center;
    gap: var(--space-xl);
}

.date {
    margin: 0;
    font-size: clamp(1.5rem, 4.5cqi, 2.25rem);
    letter-spacing: 0.08em;
}
</style>
