<template>
  <section
    ref="root"
    class="marquee"
    :class="{ manual: reducedMotion }"
    aria-label="Photos of Jet and Nicole"
  >
    <div ref="track" class="track">
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
  // The gap counts too: a repeat measures `step` from one photo to the next,
  // but the painted track is a gap shorter than that, since the last copy has
  // no photo after it. Ignoring that leaves a sliver of background showing at
  // the right edge when the strip happens to be close to a whole number of
  // repeats wide.
  const gap =
    first.nextElementSibling.offsetLeft - first.offsetLeft - first.offsetWidth;
  const needed = Math.ceil((box.clientWidth + gap) / step) + 1;
  copies.value = Math.max(2, needed);
}

// The drift is driven from here rather than from a CSS animation. The distance
// is only known once the strip has been measured, and a keyframe that reads it
// from a custom property is not reliably re-resolved when that property later
// changes - WebKit in particular keeps the value the animation started with,
// which left the strip sitting still on a phone until a rotation happened to
// rebuild it. Passing the pixel value straight to the animation avoids the
// question entirely.
let animation = null;

function syncAnimation() {
  const el = track.value;

  // How far through the current loop the strip is, so that rebuilding the
  // animation after a resize picks up where it left off instead of snapping
  // back to the first photo.
  let progress = 0;
  if (animation?.effect) {
    const { duration } = animation.effect.getTiming();
    const elapsed = Number(animation.currentTime) || 0;
    if (duration > 0) progress = (elapsed / duration) % 1;
  }

  animation?.cancel();
  animation = null;

  if (!el || reducedMotion.value || advance.value <= 0) return;

  const duration = (advance.value / props.speed) * 1000;
  animation = el.animate(
    [
      { transform: "translateX(0px)" },
      { transform: `translateX(${-advance.value}px)` },
    ],
    { duration, iterations: Infinity, easing: "linear" },
  );
  animation.currentTime = progress * duration;
}

watch([advance, reducedMotion, () => props.speed], syncAnimation);

// A change in either of these rebuilds the strip, so it has to be measured
// again once the new photos are laid out.
watch([() => props.images, copies, reducedMotion], () => {
  requestAnimationFrame(measure);
});

let observer = null;
let motionQuery = null;

function onMotionChange(event) {
  reducedMotion.value = event.matches;
}

onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.value = motionQuery.matches;
  motionQuery.addEventListener("change", onMotionChange);

  observer = new ResizeObserver(() => measure());
  observer.observe(root.value);

  measure();
  // Measured again after the first paint: on a phone the viewport is often
  // still settling when a component mounts, and a strip measured against the
  // wrong width would drift by the wrong distance and show a seam.
  requestAnimationFrame(measure);
  syncAnimation();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  motionQuery?.removeEventListener("change", onMotionChange);
  animation?.cancel();
  animation = null;
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
  /* The drift itself is set up in script - see syncAnimation. */
  will-change: transform;
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
  will-change: auto;
}

.marquee.manual .photo {
  scroll-snap-align: center;
}
</style>
