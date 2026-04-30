<template>
  <div class="admin-container">
    <h3>Galerija slika</h3>

   <div class="top-bar">
    
  <input v-model="newImageUrl" placeholder="Unesi URL slike" />
  <button @click="addImage">+ Dodaj sliku</button>
</div>

<div class="top-bar2">
<input v-model="newImageName" placeholder="Unesi ime slike" />
</div>

  <div class="grid">
  <div class="card" v-for="img in images" :key="img.id">
    <img 
  :src="img.image_url" 
  class="real-image"
  @error="e => e.target.src='https://via.placeholder.com/120'"
/>

    <div class="actions">
      <span>✏️</span>
      <span @click="deleteImage(img.id)">🗑️</span>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const images = ref([])

const newImageName = ref("")
const newImageUrl = ref("")

async function loadImages() {
  const res = await axios.get("http://localhost:3000/images")
  images.value = res.data.data
}

onMounted(() => {
  loadImages()
})


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
    })

    newImageUrl.value = "" // očisti input
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
  justify-content: space-between;
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

.top-bar input {
  padding: 5px;
  margin-right: 10px;
}

.top-bar2 input {
  padding: 5px;
  margin-right: 10px;
}

.top-bar {
  position: relative;
  z-index: 10;
}

.grid {
  position: relative;
  z-index: 1;
}


</style>

