<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-positive text-white" height-hint="98">
      <q-toolbar>
        <!-- Gumb za otvaranje/zatvaranje liste na mobitelima -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

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

        <q-btn
          href="https://www.agroklub.com/sortna-lista/"
          label="Agro klub"
          color="white"
          flat
          icon="home"
        />
      </q-toolbar>
    </q-header>

    <!-- LIJEVA LISTA SA VRSTAMA -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-weight-bold">
          ODABERITE VRSTU:
        </q-item-label>

        <q-item 
          v-for="vrsta in globalStore.biljneVrste" 
          :key="vrsta" 
          clickable 
          v-ripple
          :active="globalStore.odabranaVrsta === vrsta"
          active-class="bg-green-2 text-dark text-weight-bold"
          @click="globalStore.odabranaVrsta = vrsta"
        >
          <q-item-section avatar>
            <q-icon name="eco" :color="globalStore.odabranaVrsta === vrsta ? 'positive' : 'grey'" />
          </q-item-section>
          <q-item-section>
            {{ vrsta }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
// Uvozimo zajedničko stanje (onaj state.js koji si napravio)
import { store as globalStore } from 'src/store/state.js';

export default defineComponent({
  name: "MainLayout",

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      globalStore, // Omogućuje HTML-u da vidi listu biljaka i koju smo kliknuli
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
