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

  const iconLinkElement = document.querySelector("link[rel='icon']");
  iconLinkElement?.setAttribute(
    "href",
    to.meta.favicon ?? landingPage.favicon,
  );
});

export default router;
