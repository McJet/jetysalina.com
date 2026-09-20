import { createRouter, createWebHistory } from "vue-router";
import {
  boxRoulettePage,
  landingPage,
  weddingPage,
} from "@/shared/pageMeta.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: landingPage.route,
      name: "home",
      component: () => import("@/features/landing/views/LandingView.vue"),
      meta: {
        title: landingPage.title,
        favicon: landingPage.favicon,
      },
    },
    {
      path: boxRoulettePage.route,
      name: "box-roulette",
      component: () =>
        import("@/features/boxRoulette/views/BoxRouletteView.vue"),
      meta: {
        title: boxRoulettePage.title,
        favicon: boxRoulettePage.favicon,
        background: boxRoulettePage.background,
      },
    },
    {
      path: weddingPage.route,
      name: "Jet & Nicole",
      component: () =>
        import("@/features/nicoleOrmita/views/nicoleOrmitaView.vue"),
      meta: {
        title: weddingPage.title,
        favicon: weddingPage.favicon,
        background: weddingPage.background,
      },
    },
    {
      path: "/test-page",
      name: "test-page",
      component: () => import("@/features/test-page/views/TestPageView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/shared/components/NotFoundView.vue"),
      meta: {
        title: "404 Not Found",
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to, from, failure) => {
  if (failure) console.error(failure.message);

  document.title = to.meta.title ?? landingPage.title;

  // Set on the document rather than on the page's own element, so it also
  // covers what the element does not: the gap left under a view that asks for
  // 100dvh inside a body asking for 100vh, and the overscroll a phone shows
  // when a scroll is dragged past the end. Cleared when a page has no colour
  // of its own, which lets the landing page's stylesheet take it back.
  document.documentElement.style.backgroundColor = to.meta.background ?? "";

  const iconLinkElement = document.querySelector("link[rel='icon']");
  iconLinkElement?.setAttribute(
    "href",
    to.meta.favicon ?? landingPage.favicon,
  );
});

export default router;
