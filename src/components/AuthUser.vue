<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { registerUser } from '../utils/api';

let user: any = ref(null);

onMounted(async () => {
    user.value = await registerUser();
});

</script>
<template>
    <div>
        <h1>AuthUser</h1>

        <pre>
            {{ user }}
        </pre>
    </div>
</template>