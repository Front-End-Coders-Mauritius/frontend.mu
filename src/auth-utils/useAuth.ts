import { ref, computed } from "vue";
import type { User } from "../utils/types";
import { createDirectus, rest, readMe, readProviders } from '@directus/sdk';

const DIRECTUS_PROJECT_URL = 'https://directus.frontend.mu';

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
        const result = await client.request(readMe({
            fields: ['id', 'first_name', 'last_name', 'email']
        }));
        responseFromServer.value = result;
    }

    async function getAuthProviders() {
        const result = await client.request(readProviders());
        return result;
    }

    return {
        login,
        logout,
        isLoggedIn,
        getCurrentUser,
        user,
        responseFromServer,
        getAuthProviders,
    }
}