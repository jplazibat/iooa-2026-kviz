<template>
    <q-page class="flex flex-center">
        <q-card class="q-pa-lg" style="min-width: 400px;">
            <q-card-section>
                <div class="text-h6">Login</div>
            </q-card-section>

            
            <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-md">
                    <q-input
                        v-model="email"
                        label="Email"
                        type="email"
                        outlined
                        class="q-mb-md"
                    />
                    <q-input
                        v-model="password"
                        label="Password"
                        type="password"
                        outlined
                        class="q-mb-md"
                    />
                    

                    <q-btn
                        label="Prijavi se"
                        type="submit"
                        color="positive"
                        unelevated
                        :loading="loading"
                        class="register-btn"
                    />
                  
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const onSubmit = () => {
    console.log('Login:', { email: email.value, password: password.value })
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