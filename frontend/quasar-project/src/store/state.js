import { reactive } from 'vue'

export const store = reactive({
  odabranaVrsta: null,
  biljneVrste: ['Hrast', 'Bukva', 'Bor'],
  sveSlike: [
    { id: 1, vrsta: 'Hrast', url: 'https://images.unsplash.com/photo-1590005354167-6da97870c91d?w=500' },
    { id: 2, vrsta: 'Hrast', url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500' },
    { id: 3, vrsta: 'Bukva', url: 'https://images.unsplash.com/photo-1601314167099-232775b3d6fd?w=500' },
    { id: 4, vrsta: 'Bor', url: 'https://images.unsplash.com/photo-1518131359149-82604073380d?w=500' }
  ]
})
