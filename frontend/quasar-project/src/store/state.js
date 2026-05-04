import { reactive } from 'vue'

export const store = reactive({
  odabranaVrsta: null, // Za klik na listu lijevo
  searchName: '',      // Za tipkanje u "Unesi ime slike"
  biljneVrste: ['Malina', 'Jagoda', 'Kopriva', 'Hrast', 'Bor'],
  sveSlike: [
    { id: 1, vrsta: 'Malina', ime: 'Malina 1', url: 'https://images.unsplash.com/photo-1590005354167-6da97870c91d?w=200' },
    { id: 2, vrsta: 'Jagoda', ime: 'Jagoda divlja', url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=200' },
    { id: 3, vrsta: 'Kopriva', ime: 'Kopriva list', url: 'https://images.unsplash.com/photo-1601314167099-232775b3d6fd?w=200' },
    // Ovdje dodaj ostale slike iz svoje baze...
  ]
})
