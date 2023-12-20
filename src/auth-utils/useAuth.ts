import { currentUser } from './../store/userStore';
import { getCookieValue, DIRECTUS_URL, mapToValidUser } from './../utils/helpers';
import { ref, computed } from "vue";
import type { User } from "../utils/types";
import { createDirectus, rest, readMe, staticToken, authentication, refresh } from '@directus/sdk';
import type { AuthenticationData, DirectusClient, AuthenticationClient, RestClient } from '@directus/sdk';
import { is } from 'date-fns/locale';

const DIRECTUS_PROJECT_URL = DIRECTUS_URL()

let isAuth = ref(false);
let user = ref<User | null>(null);
let responseFromServer = ref<any>(null);
let isLoading = ref(false);

export function getClient() {
    return createDirectus(DIRECTUS_PROJECT_URL).with(authentication()).with(rest());
}


export default function useAuth(client: DirectusClient<any> & AuthenticationClient<any> & RestClient<any>) {

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
        // const result = await loginClient.logout();
    }

    function handleError(error) {
        // console.log(error)
        responseFromServer.value = error;
    }

    function setCookie(authData: AuthenticationData) {
        // set cookie logic
        document.cookie = `access_token=${authData.access_token}; expires=${new Date(authData.expires_at ?? '').toUTCString()}; path=/`;
    }

    function setCurrentUser(data: User) {
        user.value = data;
    }

    function logoutCookie() {
        // set cookie logic
        document.cookie = `access_token=; expires=${new Date().toUTCString()}; path=/`;
    }

    async function loginWithUsernameAndPassword(email: string, password: string) {
        // let loginClient = createDirectus(DIRECTUS_PROJECT_URL).with(authentication());
        // login using the authentication composable
        try {

            isLoading.value = true;
            const result = await client.login(email, password);
            isLoading.value = false;
            responseFromServer.value = result;

            if (result.access_token && result.expires_at) {
                setCookie(result)
            }

            getCurrentUser()

            setAuth(true)

            return result

        } catch (error) {
            console.log(error)
        }
    }

    async function loginWithSSO() {
        const res = await fetch(
            "https://directus.frontend.mu/auth/refresh",
            {
                method: "POST",
                credentials: "include", // this is required in order to send the refresh token cookie
            },
        );

        const response: { data: AuthenticationData } = await res.json();
        setCookie(response.data);
    }

    const isLoggedIn = computed(() => {
        return !!isAuth.value;
    })

    function setAuth(value: boolean) {
        if (value === false) {
            isLoading.value = false;
        }

        isAuth.value = value;
    }

    async function checkIfLoggedIn() {
        try {
            getCurrentUser()
        } catch (error) {
            setAuth(false)
            handleError(error)
        }
    }

    async function loginWithToken(email, password) {
        // login using the authentication composable
        try {

            const loginClient = createDirectus(DIRECTUS_PROJECT_URL).with(authentication());

            const result = await loginClient.login(email, password, {
                mode: 'cookie'
            })

            // let token = await loginClient.getToken()
            // console.log(result)
            setCookie(result)

        } catch (error) {
            console.log(error)
        }
    }

    async function getCurrentUser() {

        const ACCOUNT_SETTINGS_FIELDS = [
            "id",
            "first_name",
            "last_name",
            "email",
            "avatar",
            "meal",
        ]

        try {

            const token = getCookieValue('access_token')

            if (!token) {
                throw new Error('User is not logged in')
            }

            client = client.with(staticToken(token))

            const result = await client.request(readMe({
                fields: ACCOUNT_SETTINGS_FIELDS
            }));

            setAuth(true)
            setCurrentUser(mapToValidUser(result));

        } catch (error) {
            handleError(error)
            throw new Error(error)
        }

    }

    function oAuthLogin() {
        const currentPage = new URL(window.location.origin);
        return `${DIRECTUS_URL()}/auth/login/google?redirect=${currentPage}redirect`
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
        loginWithToken,
        oAuthLogin,
        isLoading
    }
}