<template>
  <section
    ref="root"
    class="marquee"
    :class="{ manual: reducedMotion }"
    aria-label="Photos of Jet and Nicole"
  >
    <div
      ref="track"
      class="track"
      :style="{
        '--advance': `${advance}px`,
        '--duration': `${duration}s`,
      }"
    >
      <img
        v-for="(item, i) in strip"
        :key="i"
        class="photo"
        :src="item.src"
        :srcset="item.srcset"
        :sizes="SIZES"
        :alt="item.copy === 0 ? item.alt : ''"
        :aria-hidden="item.copy === 0 ? undefined : 'true'"
        :style="{ objectPosition: item.position ?? 'center' }"
        :loading="item.copy === 0 && i < 2 ? 'eager' : 'lazy'"
        :fetchpriority="i === 0 ? 'high' : 'auto'"
        decoding="async"
        draggable="false"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  images: { type: Array, required: true },
  // How fast the strip drifts, in CSS pixels per second. Low enough that it
  // reads as ambient rather than as something demanding to be watched.
  speed: { type: Number, default: 35 },
});

// Each photo is rendered as a square the height of the strip, so the width it
// occupies is the strip height. Mirrors the clamp in .marquee below - keep the
// two in step if that height ever changes.
const SIZES = "(max-width: 659px) 224px, (min-width: 1129px) 384px, 34vw";

const root = ref(null);
const track = ref(null);

// How many times the list is repeated. Two is the minimum that can loop; the
// real number is worked out from how many fit across once we can measure.
const copies = ref(2);
// The width of one repeat, including the gap that follows it. Sliding the
// track by exactly this much lands the next copy where the last one was, which
// is what makes the loop invisible.
const advance = ref(0);
const reducedMotion = ref(false);

const strip = computed(() => {
  if (reducedMotion.value) {
    return props.images.map((image) => ({ ...image, copy: 0 }));
  }
  return Array.from({ length: copies.value }, (_, copy) =>
    props.images.map((image) => ({ ...image, copy })),
  ).flat();
});

const duration = computed(() =>
  advance.value > 0 ? advance.value / props.speed : 0,
);

function measure() {
  const el = track.value;
  const box = root.value;
  if (!el || !box || reducedMotion.value) return;

  const count = props.images.length;
  const first = el.children[0];
  const next = el.children[count];
  if (!first || !next) return;

  // The distance between a photo and the same photo one copy later is the
  // repeat width, gap included - no need to add anything up by hand.
  const step = next.offsetLeft - first.offsetLeft;
  if (step <= 0) return;
  advance.value = step;

  // The track has to stay wider than the viewport for the whole slide, so it
  // needs enough copies to cover the strip plus the one it slides away by.
  const needed = Math.ceil(box.clientWidth / step) + 1;
  copies.value = Math.max(2, needed);
}

let observer = null;
let motionQuery = null;

function onMotionChange(event) {
  reducedMotion.value = event.matches;
}

watch([() => props.images, reducedMotion, copies], () => {
  requestAnimationFrame(measure);
});

onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.value = motionQuery.matches;
  motionQuery.addEventListener("change", onMotionChange);

  observer = new ResizeObserver(() => measure());
  observer.observe(root.value);
  measure();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  motionQuery?.removeEventListener("change", onMotionChange);
});
</script>

<style scoped>
.marquee {
  width: 100%;
  /* Squares side by side, so this height is also each photo's width - low
     enough that three or four are on screen at once and the names below the
     strip are still visible when the page opens. */
  height: clamp(14rem, 34cqi, 24rem);
  overflow: hidden;
  background-color: var(--color-surface);
  /* The nav above draws its own line; this closes the strip off below it. */
  border-bottom: 1px solid var(--color-border);
}

.track {
  display: flex;
  gap: var(--space-xs);
  height: 100%;
  width: max-content;
  animation: drift var(--duration) linear infinite;
  /* Without this the strip judders on every repaint in some browsers. */
  will-change: transform;
}

@keyframes drift {
  to {
    transform: translateX(calc(-1 * var(--advance)));
  }
}

.photo {
  flex: 0 0 auto;
  height: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

/* Nothing drifts if motion is turned down, so the strip becomes an ordinary
   thing you push sideways yourself, one photo at a time. */
.marquee.manual {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.marquee.manual .track {
  animation: none;
  will-change: auto;
}

.marquee.manual .photo {
  scroll-snap-align: center;
}
</style>
