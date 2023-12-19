<script setup lang="ts">
import useAuth from '../../auth-utils/useAuth';
import { onMounted, ref } from 'vue';

const { loginWithSSO } = useAuth();
const access_token = ref<string | null>(null)

onMounted(() => {
    loginWithSSO();
})

</script>

<template>
    <div>
        Refresh Token {{ access_token }}
    </div>
</template>

