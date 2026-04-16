<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="min-width: 400px;">
      
      <q-card-section>
        <div class="text-h6">Registration</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">

          <!-- NAME
          <q-input
            v-model="form.name"
            label="Full Name"
            outlined
            :rules="[val => !!val || 'Name is required']"
          />-->

          <!-- EMAIL -->
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
           :rules="[
            val => !!val || 'Email is required',
            val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Enter a valid email'
            ]"
          />

          <!-- PASSWORD -->
          <q-input
            v-model="form.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="[val => val && val.length >= 6 || 'Min 6 characters']"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- PASSWORD STRENGTH -->
          <div v-if="passwordStrength.label" class="text-caption q-mt-sm">
            Strength:
            <span :class="`text-${passwordStrength.color}`">
              {{ passwordStrength.label }}
            </span>
          </div>

          <!-- CONFIRM PASSWORD -->
          <q-input
            v-model="form.confirmPassword"
            label="Confirm Password"
            :type="showConfirmPassword ? 'text' : 'password'"
            outlined
            :rules="[val => val === form.password || 'Passwords do not match']"
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>

          <!-- BUTTON -->
          <q-btn
            type="submit"
            label="Register"
            color="positive"
            unelevated
            :loading="loading"
            :disable="!isFormValid"
            class="register-btn"
          >
            <q-tooltip v-if="!isFormValid">
              Popuni sva polja i provjeri lozinke
            </q-tooltip>
          </q-btn>

        </q-form>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'
export default {
  name: 'RegisPage',
  setup() {

    const form = ref({
      //name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const loading = ref(false)

    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    const isFormValid = computed(() => {
      return (
        // form.value.name &&
        form.value.email &&
        form.value.password &&
        form.value.confirmPassword &&
        form.value.password === form.value.confirmPassword
      )
    })

    const passwordStrength = computed(() => {
      const pass = form.value.password

      if (!pass) return { label: '', color: '' }

      let score = 0
      if (pass.length >= 6) score++
      if (/[A-Z]/.test(pass)) score++
      if (/[0-9]/.test(pass)) score++
      if (/[^A-Za-z0-9]/.test(pass)) score++

      if (score <= 1) return { label: 'Weak', color: 'negative' }
      if (score === 2) return { label: 'Medium', color: 'warning' }
      return { label: 'Strong', color: 'positive' }
    })
const onSubmit = async () => {
    loading.value = true

  try {
    const res = await axios.post('http://localhost:3000/register', {
      email: form.value.email,
      password: form.value.password
    })

    console.log(res.data)
    alert('Registracija uspješna!')

  } catch (err) {
    console.log('FULL ERROR:', err)
    console.log('RESPONSE:', err.response)

    alert(err.response?.data?.message || 'Greška na serveru')

  } finally {
    loading.value = false
  }
}


    return {
      form,
      loading,
      onSubmit,
      isFormValid,
      showPassword,
      showConfirmPassword,
      passwordStrength
    }
  }
}
</script>

<style scoped>
.register-btn {
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}
</style>
