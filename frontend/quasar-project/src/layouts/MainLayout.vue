<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-positive text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-btn href="/" label="Početna stranica" color="white" flat icon="directions" />
        <q-toolbar-title class="text-center">Kviz o biljkama</q-toolbar-title>
        <q-btn href="https://www.agroklub.com/sortna-lista/" label="Agro klub" color="white" flat icon="home" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-weight-bold">ODABERITE VRSTU:</q-item-label>
        
        <!-- Gumb za poništavanje filtera (da vidiš sve opet) -->
        <q-item clickable v-ripple @click="globalStore.odabranaVrsta = null" :active="!globalStore.odabranaVrsta">
          <q-item-section avatar><q-icon name="list" /></q-item-section>
          <q-item-section>Prikaži sve</q-item-section>
        </q-item>

        <q-item 
          v-for="vrsta in globalStore.biljneVrste" 
          :key="vrsta" 
          clickable v-ripple
          :active="globalStore.odabranaVrsta === vrsta"
          active-class="bg-green-2 text-dark text-weight-bold"
          @click="globalStore.odabranaVrsta = vrsta"
        >
          <q-item-section avatar>
            <q-icon name="eco" :color="globalStore.odabranaVrsta === vrsta ? 'positive' : 'grey'" />
          </q-item-section>
          <q-item-section>{{ vrsta }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { store as globalStore } from 'src/store/state.js';
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => { leftDrawerOpen.value = !leftDrawerOpen.value; };
</script>
