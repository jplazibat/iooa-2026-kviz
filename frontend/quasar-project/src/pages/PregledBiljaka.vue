<template>
  <div class="row no-wrap full-width shadow-2" style="height: calc(100vh - 50px); overflow: hidden;">

    <div class="col-auto bg-green-10 text-white column" style="width: 280px;">
      <div class="q-pa-lg q-mb-md row items-center q-gutter-sm">
        <q-avatar icon="eco" color="green-2" text-color="green-10" size="40px" />
        <div>
          <div class="text-h6 text-weight-bolder" style="line-height: 1.2;">Biljni Kviz</div>
          <div class="text-caption text-green-2">Admin Panel</div>
        </div>
      </div>

      <q-list padding class="col">
        <q-item-label header class="text-green-2 text-weight-bold text-uppercase">Izbornik</q-item-label>

        <q-item clickable class="bg-green-8 text-white q-my-sm" style="border-radius: 0 30px 30px 0; margin-right: 10px;" @click="$router.push('/PregledBiljaka')">
          <q-item-section avatar>
            <q-icon name="list_alt" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Pregled biljaka</q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="white" />
          </q-item-section>
        </q-item>
        <q-item clickable class="text-white q-my-sm" style="border-radius: 0 30px 30px 0; margin-right: 10px;" @click="$router.push('/PregledPorodica')">
          <q-item-section avatar>
            <q-icon name="list_alt" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Pregled porodica</q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="white" />
          </q-item-section>
        </q-item>


      </q-list>

      <div class="q-pa-md">
        <q-item clickable class="rounded-borders text-green-2">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section>Odjava</q-item-section>
        </q-item>
      </div>
    </div>

    <div class="col bg-grey-1 column">


      <div class="q-pa-lg col overflow-auto">
        <q-table
          :rows="biljke"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          bordered
          class="bg-white shadow-2"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-description="props">
            <q-td :props="props">
              <div class="ellipsis" style="max-width: 250px;">
                {{ props.value }}
              </div>
              <q-tooltip>{{ props.value }}</q-tooltip>
            </q-td>
          </template>

          <template v-slot:body-cell-akcije="props">
            <q-td :props="props" class="q-gutter-x-sm text-center">
              <q-btn flat round color="blue-7" icon="edit" size="sm" />
              <q-btn flat round color="red-7" icon="delete" size="sm" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const biljke = ref([])
const loading = ref(true)

// Stupci mapirani točno prema tvojoj slici baze
const columns = [
  { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
  { name: 'croatian_name', align: 'left', label: 'Hrvatski naziv', field: 'croatian_name', sortable: true },
  { name: 'latin_name', align: 'left', label: 'Latinski naziv', field: 'latin_name', sortable: true },
  { name: 'synonym', align: 'left', label: 'Sinonim', field: 'synonym' },
  { name: 'description', align: 'left', label: 'Opis', field: 'description' },
  { name: 'genus', align: 'left', label: 'Rod', field: 'genus_name', sortable:'true' },


]

const fetchBiljke = async () => {
  loading.value = true
  try {

    const response = await axios.get('http://localhost:3000/api/PregledBiljaka')
    biljke.value = response.data
  } catch (error) {
    console.error('Greška pri dohvatu:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchBiljke)
</script>

<style scoped>
.bg-green-10 { background-color: #1b3a1a !important; }
.bg-green-8 { background-color: #2d5a27 !important; }
.opacity-70 { opacity: 0.7; }
</style>
