const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "kviz", component: () => import("pages/KvizPage.vue") },
      { path: "kviz1", component: () => import("pages/KvizPage1.vue") },
      { path: "kviz2", component: () => import("pages/KvizPage2.vue") },
      { path: "kviz3", component: () => import("pages/KvizPage3.vue") },
      { path: "kviz4", component: () => import("pages/KvizPage4.vue") },
      { path: "kviz5", component: () => import("pages/KvizPage5.vue") },
      { path: "registration", component: () => import("pages/RegistrationPage.vue") },
      { path: "leaderboard", component: () => import("pages/LeaderboardPage.vue") },
      { path: "login", component: () => import("pages/LoginForm.vue") },
      { path: "stats", component: () => import("pages/StatsPage.vue") },
      { path: "compare-stats", component: () => import("pages/ComparestatsPage.vue") }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
