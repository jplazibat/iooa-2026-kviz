<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-positive text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          href="/"
          label="Početna stranica"
          color="white"
          flat
          icon="directions"
        />
        <q-toolbar-title class="text-weight-medium text-center text-h5">
          <q-avatar>
            <img
              src="https://ichef.bbci.co.uk/news/976/cpsprodpb/C130/production/_123665494_mediaitem123664184.jpg"
            />
          </q-avatar>
          Dobrodošli u kviz o biljnim vrstama
        </q-toolbar-title>

        <!-- <q-btn
          href="http://agro.veleri.hr/biljne-vrste/"
          label="Glavna stranica"
          color="white"
          flat
          icon="home"
        /> -->
        <q-btn
          v-if="!isLoggedIn"
          label="Prijava"
          color="white"
          flat
          icon="login"
          to="/login"
        />

        <q-btn
          v-else
          label="Odjava"
          color="white"
          flat
          icon="logout"
          @click="logout"
        />
        <q-btn
          href="https://www.agroklub.com/sortna-lista/"
          label="Agro klub"
          color="white"
          flat
          icon="home"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";//zvonimir
const linksList = [
  {
    title: "Link test",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
];
export default defineComponent({
  name: "MainLayout",

  setup() {
    const router = useRouter();

    const leftDrawerOpen = ref(false);
    const isLoggedIn = ref(false);

    // provjera auth stanja
    const checkAuth = () => {
      isLoggedIn.value = !!localStorage.getItem("token");
    };

    //logout funkcija zvonimir
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      isLoggedIn.value = false;

      router.push("/");
    };

    //  toggle drawer
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    onMounted(() => {
      checkAuth();

      //reagira na login/logout iz drugih komponenti
      window.addEventListener("storage", checkAuth);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("storage", checkAuth);
    });

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer,
      isLoggedIn,
      logout,
    };
  },
});
</script>
