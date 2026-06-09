import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/features/landing/views/LandingView.vue"),
      meta: {
        title: "Jet Ysalina",
        favicon: "/features/landing/j-square.svg",
      },
    },
    {
      path: "/box-roulette",
      name: "box-roulette",
      component: () =>
        import("@/features/boxRoulette/views/BoxRouletteView.vue"),
      meta: {
        title: "Box Roulette",
        favicon: "/features/boxRoulette/box-roulette.svg",
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

  document.title = to.meta.title ?? "Jet Ysalina";

  const iconLinkElement = document.querySelector("link[rel='icon']");
  iconLinkElement?.setAttribute(
    "href",
    to.meta.favicon ?? "/features/landing/j-square.svg",
  );
});

export default router;
