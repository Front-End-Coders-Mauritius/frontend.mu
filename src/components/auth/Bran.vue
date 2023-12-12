<template>
    <div class="contain text-white border border-red-500">
        <h1>Bran</h1>
        <p>It's dark!</p>

        <pre v-if="isLoggedIn">
            {{ user }}
        </pre>
        <div v-else>
            <p>Not logged in</p>
        </div>

        <div class="flex gap-2">
            <button class="p-2 bg-slate-500" @click.prevent="login()">Login</button>
            <button class="p-2 bg-slate-500" @click.prevent="logout()">Logout</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import useAuth from '../../auth-utils/useAuth';
const { user, login, logout, isLoggedIn } = useAuth();
</script>