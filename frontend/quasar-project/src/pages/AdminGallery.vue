<template>
  <div class="admin-container">
    <h3>Galerija slika</h3>

    <div class="top-bar">
    
      <button class="upload-btn">+ Učitaj novu sliku</button>
    </div>

  <div class="grid">
  <div class="card" v-for="img in images" :key="img">
    <img :src="img" class="real-image" />

    <div class="actions">
      <span>✏️</span>
      <span>🗑️</span>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const images = ref([])

async function loadImages() {
  images.value = []

  // probamo ID-eve 1–10
  for (let i = 1; i <= 20; i++) {
    try {
      const res = await axios.get(`http://localhost:3000/image/${i}`)

      if (res.data.data) {
        images.value.push(res.data.data.image_url)
      }
    } catch (e) {
      // ignoriramo greške
    }
  }
}

// automatski poziv kad se stranica učita
onMounted(() => {
  loadImages()
})
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
</style>

