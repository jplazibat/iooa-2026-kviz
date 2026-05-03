<template>
  <div class="admin-container">
    <h3>Galerija slika</h3>

   <div class="top-bar">
  <q-btn color="primary" icon="add" label="Dodaj sliku" @click="openAddDialog" />
</div>

  <div class="grid">
  <div class="card" v-for="img in images" :key="img.id">
    <img 
  :src="img.image_url" 
  class="real-image"
  @error="e => e.target.src='https://via.placeholder.com/120'"
/>

    <div class="actions">
      <span @click="openEditDialog(img)">✏️</span>
      <span @click="confirmDeleteImage(img.id)">🗑️</span>
    </div>
  </div>
</div>

<q-dialog v-model="editDialogOpen" persistent>
  <q-card class="edit-dialog">
    <q-card-section>
      <div class="text-h6">Uredi sliku</div>
    </q-card-section>

    <q-card-section class="edit-fields">
      <q-input v-model="editImageName" label="Ime slike" outlined dense />
      <q-input v-model="editImageUrl" label="URL slike" outlined dense />
      <q-input
        v-model="editImageDescription"
        label="Opis slike"
        outlined
        dense
        type="textarea"
      />

      <img
        v-if="editImageUrl"
        :src="editImageUrl"
        class="edit-preview"
        @error="e => e.target.src='https://via.placeholder.com/160'"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Odustani" color="primary" v-close-popup />
      <q-btn label="Spremi" color="primary" @click="updateImage" />
    </q-card-actions>
  </q-card>
</q-dialog>

<q-dialog v-model="addDialogOpen" persistent>
  <q-card class="edit-dialog">
    <q-card-section>
      <div class="text-h6">Dodaj sliku</div>
    </q-card-section>

    <q-card-section class="edit-fields">
      <q-input v-model="newImageName" label="Ime slike" outlined dense />
      <q-input v-model="newImageUrl" label="URL slike" outlined dense />
      <q-input
        v-model="newImageDescription"
        label="Opis slike"
        outlined
        dense
        type="textarea"
      />

      <img
        v-if="newImageUrl"
        :src="newImageUrl"
        class="edit-preview"
        @error="e => e.target.src='https://via.placeholder.com/160'"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Odustani" color="primary" @click="closeAddDialog" />
      <q-btn label="Dodaj" color="primary" @click="addImage" />
    </q-card-actions>
  </q-card>
</q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

const images = ref([])
const $q = useQuasar()

const newImageName = ref("")
const newImageUrl = ref("")
const newImageDescription = ref("")
const addDialogOpen = ref(false)
const editDialogOpen = ref(false)
const editImageId = ref(null)
const editImageName = ref("")
const editImageUrl = ref("")
const editImageDescription = ref("")

async function loadImages() {
  const res = await axios.get("http://localhost:3000/images")
  images.value = res.data.data
}

onMounted(() => {
  loadImages()
})


function confirmDeleteImage(id) {
  $q.dialog({
    title: 'Brisanje slike',
    message: 'Jeste li sigurni da zelite izbrisati ovu sliku?',
    cancel: true,
    persistent: true,
    ok: {
      label: 'Izbrisi',
      color: 'negative'
    },
    cancel: {
      label: 'Odustani',
      color: 'primary'
    }
  }).onOk(() => {
    deleteImage(id)
  })
}

function openEditDialog(img) {
  editImageId.value = img.id
  editImageName.value = img.name || ""
  editImageUrl.value = img.image_url || ""
  editImageDescription.value = img.description || ""
  editDialogOpen.value = true
}

function openAddDialog() {
  newImageName.value = ""
  newImageUrl.value = ""
  newImageDescription.value = ""
  addDialogOpen.value = true
}

function closeAddDialog() {
  addDialogOpen.value = false
  newImageName.value = ""
  newImageUrl.value = ""
  newImageDescription.value = ""
}

async function updateImage() {
  if (!editImageId.value || !editImageUrl.value) return

  try {
    await axios.put(`http://localhost:3000/image/${editImageId.value}`, {
      name: editImageName.value,
      image_url: editImageUrl.value,
      description: editImageDescription.value,
    })

    editDialogOpen.value = false
    loadImages()
  } catch (e) {
    console.error("Error updating image:", e)
  }
}

async function deleteImage(id) {
  await axios.delete(`http://localhost:3000/image/${id}`)
  loadImages() // refresh liste
}




async function addImage() {
  if (!newImageUrl.value) return

  try {
    await axios.post("http://localhost:3000/image", {
        name: newImageName.value,
      image_url: newImageUrl.value,
      description: newImageDescription.value,
    })

    closeAddDialog()
    loadImages() // refresh grid
  } catch (e) {
    console.error("Error adding image:", e)
  }
}
</script>

<style>
.admin-container {
  background: #e7f0e4;
  padding: 30px;
  border-radius: 30px;
  max-width: 900px;
  margin: auto;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.upload-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-placeholder {
  width: 120px;
  height: 120px;
  background: #ccc;
}

.real-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
}



.actions {
  margin-top: 5px;
  display: flex;
  gap: 10px;
  font-size: 18px;
  cursor: pointer;
}

.top-bar {
  position: relative;
  z-index: 10;
}

.grid {
  position: relative;
  z-index: 1;
}

.edit-dialog {
  width: 420px;
  max-width: 90vw;
}

.edit-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-preview {
  width: 160px;
  height: 160px;
  object-fit: cover;
  align-self: center;
}

</style>

