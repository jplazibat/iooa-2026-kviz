<template>
    <q-page class="flex flex-center">
        <q-card class="q-pa-lg" style="min-width: 400px;">
            <q-card-section>
                <div class="text-h6">Registration</div>
            </q-card-section>
            <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-md">
                    <q-input
                        v-model="form.name"
                        label="Full Name"
                        outlined
                        required
                        :rules="[val => val && val.length > 0 || 'Name is required']"
                    />
                    <q-input
                        v-model="form.email"
                        label="Email"
                        type="email"
                        outlined
                        required
                        :rules="[val => val && val.includes('@') || 'Valid email is required']"
                    />
                    <q-input
                        v-model="form.password"
                        label="Password"
                        type="password"
                        outlined
                        required
                        :rules="[val => val && val.length >= 6 || 'Password must be at least 6 characters']"
                    />
                    <q-input
                        v-model="form.confirmPassword"
                        label="Confirm Password"
                        type="password"
                        outlined
                        required
                        :rules="[val => val === form.password || 'Passwords do not match']"
                    />
                    <q-btn
                        type="submit"
                        label="Register"
                        color="primary"
                        :loading="loading"
                    />
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
    name: 'RegisPage',
    setup() {
        const form = ref({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        })
        const loading = ref(false)

        const onSubmit = async () => {
            loading.value = true
            // ovdje saljemo podatke na backend, trenutno samo simuliramo sa timeoutom
            setTimeout(() => {
                console.log('Form submitted:', form.value)
                loading.value = false
                // ovdje možete dodati logiku za navigaciju ili prikaz poruke o uspjehu(to cu ja dodati kasnije)
            }, 1000)
        }

        return {
            form,
            loading,
            onSubmit
        }
    }
}
</script>

<style scoped>
/* to cu takoder ja*/
</style>