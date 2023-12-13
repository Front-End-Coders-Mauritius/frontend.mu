import { ref, computed } from "vue";
import type { User } from "../utils/types";
import { createDirectus, rest, readMe, readProviders, staticToken } from '@directus/sdk';

const DIRECTUS_PROJECT_URL = 'https://directus.frontend.mu';

let isAuth = ref(false);
let user = ref<User | null>(null);
let responseFromServer = ref<any>(null);

const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

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
        const token = getCookieValue('access_token')

        const authClient = createDirectus(DIRECTUS_PROJECT_URL).with(staticToken(token)).with(rest());

        const result = await authClient.request(readMe({
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