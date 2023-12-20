<script setup lang="ts">
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { onMounted, ref } from 'vue';

const { loginWithSSO } = useAuth(getClient());
const access_token = ref<string | null>(null)

onMounted(() => {
    loginWithSSO();
})

</script>

<template>
    <div>
        Refresh Token
    </div>
</template>

