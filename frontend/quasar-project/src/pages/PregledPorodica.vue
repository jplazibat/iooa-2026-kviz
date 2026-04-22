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

        <q-item clickable class="text-white q-my-sm" style="border-radius: 0 30px 30px 0; margin-right: 10px;" @click="$router.push('/PregledBiljaka')">
          <q-item-section avatar><q-icon name="list_alt" /></q-item-section>
          <q-item-section class="text-weight-bold">Pregled biljaka</q-item-section>
          <q-item-section side><q-icon name="chevron_right" color="white" /></q-item-section>
        </q-item>
        <q-item clickable class="bg-green-8 text-white q-my-sm" style="border-radius: 0 30px 30px 0; margin-right: 10px;" @click="$router.push('/PregledPorodica')">
          <q-item-section avatar><q-icon name="list_alt" /></q-item-section>
          <q-item-section class="text-weight-bold">Pregled porodica</q-item-section>
          <q-item-section side><q-icon name="chevron_right" color="white" /></q-item-section>
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

        <div class="row items-center q-mb-md">
          <div class="text-h6 text-weight-bold col">Botaničke porodice</div>
          <q-btn color="green-8" icon="add" label="Dodaj porodicu" @click="openDodaj" />
        </div>

        <q-table
          :rows="porodice"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          bordered
          class="bg-white shadow-2"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-akcije="props">
            <q-td :props="props" class="q-gutter-x-sm text-center">
              <q-btn flat round color="blue-7" icon="edit" size="sm" @click="openUredi(props.row)" />
              <q-btn flat round color="red-7" icon="delete" size="sm" @click="openBrisi(props.row)" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>

  <!-- Dijalog za dodavanje / uređivanje -->
  <q-dialog v-model="dijalogOtvoren" persistent>
    <q-card style="min-width: 400px;">
      <q-card-section class="bg-green-8 text-white">
        <div class="text-h6">{{ dijalogNaslov }}</div>
      </q-card-section>

      <q-card-section class="q-gutter-md q-pt-lg">
        <q-input
          v-model="forma.croatian_name"
          label="Hrvatski naziv"
          outlined
          dense
          :rules="[val => !!val || 'Obavezno polje']"
        />
        <q-input
          v-model="forma.latin_name"
          label="Latinski naziv"
          outlined
          dense
          :rules="[val => !!val || 'Obavezno polje']"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-pr-md">
        <q-btn flat label="Odustani" color="grey-7" v-close-popup />
        <q-btn label="Spremi" color="green-8" @click="spremi" :loading="spremaLoading" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dijalog za brisanje -->
  <q-dialog v-model="dijalogBrisanje" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="red-7" text-color="white" />
        <span class="q-ml-sm">Jeste li sigurni da želite obrisati <strong>{{ odabranaPorodica?.croatian_name }}</strong>?</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Odustani" color="grey-7" v-close-popup />
        <q-btn label="Obriši" color="red-7" @click="obrisi" :loading="briseLoading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const porodice = ref([])
const loading = ref(true)
const dijalogOtvoren = ref(false)
const dijalogBrisanje = ref(false)
const spremaLoading = ref(false)
const briseLoading = ref(false)
const odabranaPorodica = ref(null)
const dijalogNaslov = ref('')
const forma = ref({ croatian_name: '', latin_name: '' })

const columns = [
  { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
  { name: 'croatian_name', align: 'left', label: 'Hrvatski naziv', field: 'croatian_name', sortable: true },
  { name: 'latin_name', align: 'left', label: 'Latinski naziv', field: 'latin_name', sortable: true },
  { name: 'akcije', align: 'center', label: 'Akcije', field: 'akcije' },
]

const fetchPorodice = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/PregledBotanskihPorodica')
    porodice.value = response.data
  } catch (error) {
    console.error('Greška pri dohvatu:', error)
  } finally {
    loading.value = false
  }
}

const openDodaj = () => {
  odabranaPorodica.value = null
  forma.value = { croatian_name: '', latin_name: '' }
  dijalogNaslov.value = 'Dodaj porodicu'
  dijalogOtvoren.value = true
}

const openUredi = (row) => {
  odabranaPorodica.value = row
  forma.value = { croatian_name: row.croatian_name, latin_name: row.latin_name }
  dijalogNaslov.value = 'Uredi porodicu'
  dijalogOtvoren.value = true
}

const openBrisi = (row) => {
  odabranaPorodica.value = row
  dijalogBrisanje.value = true
}

const spremi = async () => {
  if (!forma.value.croatian_name || !forma.value.latin_name) return
  spremaLoading.value = true
  try {
    if (odabranaPorodica.value) {
      await axios.put(`http://localhost:3000/api/botanical_family/${odabranaPorodica.value.id}`, forma.value)
    } else {
      await axios.post('http://localhost:3000/api/botanical_family', forma.value)
    }
    dijalogOtvoren.value = false
    await fetchPorodice()
  } catch (error) {
    console.error('Greška pri spremanju:', error)
  } finally {
    spremaLoading.value = false
  }
}

const obrisi = async () => {
  briseLoading.value = true
  try {
    await axios.delete(`http://localhost:3000/api/botanical_family/${odabranaPorodica.value.id}`)
    dijalogBrisanje.value = false
    await fetchPorodice()
  } catch (error) {
    console.error('Greška pri brisanju:', error)
  } finally {
    briseLoading.value = false
  }
}

onMounted(fetchPorodice)
</script>

<style scoped>
.bg-green-10 { background-color: #1b3a1a !important; }
.bg-green-8 { background-color: #2d5a27 !important; }
</style>
