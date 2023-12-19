import { currentUser } from './../store/userStore';
import { getCookieValue, DIRECTUS_URL, mapToValidUser } from './../utils/helpers';
import { ref, computed } from "vue";
import type { User } from "../utils/types";
import { createDirectus, rest, readMe, staticToken, authentication, refresh } from '@directus/sdk';
import type { AuthenticationData } from '@directus/sdk';
import { is } from 'date-fns/locale';

const DIRECTUS_PROJECT_URL = DIRECTUS_URL()

let isAuth = ref(false);
let user = ref<User | null>(null);
let responseFromServer = ref<any>(null);





export default function useAuth() {

    let client = createDirectus(DIRECTUS_PROJECT_URL).with(rest());
    // const token = getCookieValue('access_token')
    // const client = createDirectus(DIRECTUS_PROJECT_URL).with(staticToken(token)).with(rest());

    async function logout() {
        // logout logic
        let loginClient = createDirectus(DIRECTUS_PROJECT_URL).with(authentication()).with(rest());
        // login using the authentication composable
        console.log('logging out')
        logoutCookie()
        user.value = null;
        isAuth.value = false;
        responseFromServer.value = null;
        // logout using the authentication composable
        const result = await loginClient.logout();
    }

    function handleError(error) {
        console.log(error)
        responseFromServer.value = error;
    }

    function setCookie(authData: AuthenticationData) {
        // set cookie logic
        document.cookie = `access_token=${authData.access_token}; expires=${new Date(authData.expires_at ?? '').toUTCString()}; path=/`;
    }

    function setCurrentUser(data: User) {
        user.value = data;
        responseFromServer.value = data;
    }

    function logoutCookie() {
        // set cookie logic
        document.cookie = `access_token=; expires=${new Date().toUTCString()}; path=/`;
    }

    async function loginWithUsernameAndPassword(email: string, password: string) {
        let loginClient = createDirectus(DIRECTUS_PROJECT_URL).with(authentication()).with(rest());
        // login using the authentication composable
        try {

            const result = await loginClient.login(email, password);
            responseFromServer.value = result;

            if (result.access_token && result.expires_at) {
                setCookie(result)
            }

            isAuth.value = true;
            return result

        } catch (error) {
            console.log(error)
        }
    }

    async function loginWithSSO() {
        const refresh_token = getCookieValue("directus_refresh_token");

        const res = await client.request(refresh('json', refresh_token));

        setCookie(res);
    }

    const isLoggedIn = computed(() => {
        return !!isAuth.value;
    })

    async function checkIfLoggedIn() {
        try {
            getCurrentUser()
        } catch (error) {
            isAuth.value = false;
            handleError(error)
        }
    }

    async function getCurrentUser() {
        try {

            const token = getCookieValue('access_token')

            client = client.with(staticToken(token));

            const result = await client.request(readMe({
                fields: ['id', 'first_name', 'last_name', 'email']
            }));

            isAuth.value = true;

            setCurrentUser(mapToValidUser(result));

        } catch (error) {
            handleError(error)
            throw new Error(error)
        }

    }

    return {
        loginWithUsernameAndPassword,
        logout,
        isLoggedIn,
        getCurrentUser,
        checkIfLoggedIn,
        user,
        responseFromServer,
        client,
        loginWithSSO,
    }
}