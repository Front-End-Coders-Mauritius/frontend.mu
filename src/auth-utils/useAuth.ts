import { ref, computed } from "vue";
import type { User } from "../utils/types";
import { createDirectus, rest, readMe } from '@directus/sdk';

const DIRECTUS_PROJECT_URL = 'http://localhost:8055';

let isAuth = ref(false);
let user = ref<User | null>(null);
let responseFromServer = ref<any>(null);

export default function useAuth() {

    const client = createDirectus(DIRECTUS_PROJECT_URL).with(rest());

    function login() {
        // login logic
        isAuth.value = true;
    }

    function logout() {
        // logout logic
        isAuth.value = false;
    }

    const isLoggedIn = computed(() => {
        return isAuth.value;
    })

    async function getCurrentUser() {
        const result = await client.request(readMe('*.*'));
        responseFromServer.value = result;
    }

    return {
        login,
        logout,
        isLoggedIn,
        user,
        responseFromServer
    }
}