<template>
  <q-page class="q-pa-xl" style="background-color: #e8f5e9;">
    <h2 class="text-h2 q-mb-xl">Galerija slika</h2>

    <!-- INPUT POLJA KAO NA SLICI image_9ceddd.jpg -->
    <div class="row q-col-gutter-md items-end q-mb-xl">
      <div class="col-12 col-md-3">
        <q-input standout square bg-color="white" v-model="noviUrl" label="Unesi URL slike" />
      </div>
      <div class="col-12 col-md-3">
        <!-- OVO POLJE POVEZUJEMO SA STORE-om ZA FILTRIRANJE -->
        <q-input standout square bg-color="white" v-model="globalStore.searchName" label="Unesi ime slike" />
      </div>
      <div class="col-auto">
        <q-btn label="+ Dodaj sliku" outline color="black" class="bg-white" />
      </div>
    </div>

    <!-- GRID SA SLIKAMA KOJI SE FILTRIRA -->
    <div class="row q-col-gutter-xl">
      <div 
        v-for="slika in filtriraneSlike" 
        :key="slika.id" 
        class="col-6 col-sm-4 col-md-2 text-center"
      >
        <q-card flat class="bg-transparent">
          <q-img :src="slika.url" class="rounded-borders" style="height: 150px; width: 150px;" />
          
          <!-- Ikonice za edit i delete kao na slici -->
          <div class="row justify-center q-mt-sm">
            <q-btn flat round dense icon="edit" color="orange-8" size="sm" />
            <q-btn flat round dense icon="delete" color="grey-9" size="sm" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { store as globalStore } from 'src/store/state.js';

const noviUrl = ref("");

// NAJVAŽNIJI DIO: Logika koja spaja lijevu listu i polje za ime
const filtriraneSlike = computed(() => {
  return globalStore.sveSlike.filter(s => {
    // 1. Gleda što je kliknuto lijevo (Hrast, Malina...)
    const matchesVrsta = !globalStore.odabranaVrsta || s.vrsta === globalStore.odabranaVrsta;
    // 2. Gleda što je upisano u polje "Unesi ime slike"
    const matchesName = s.ime.toLowerCase().includes(globalStore.searchName.toLowerCase());
    
    return matchesVrsta && matchesName;
  });
});
</script>
