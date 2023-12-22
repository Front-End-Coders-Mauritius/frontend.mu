import { ref, computed } from "vue";
import { getCookieValue, DIRECTUS_URL, mapToValidUser } from './../utils/helpers';
import { createDirectus, rest, readMe, staticToken, authentication } from '@directus/sdk';

import type { User } from "../utils/types";
import type { AuthenticationData, DirectusClient, AuthenticationClient, RestClient } from '@directus/sdk';

const DIRECTUS_PROJECT_URL = DIRECTUS_URL()

let isAuth = ref(false);
let user = ref<User | null>(null);
let responseFromServer = ref<any>(null);
let isLoading = ref(false);

export function getClient() {
    return createDirectus(DIRECTUS_PROJECT_URL).with(authentication()).with(rest());
}


export default function useAuth(client: DirectusClient<any> & AuthenticationClient<any> & RestClient<any>) {

    async function logout() {
        logoutCookie()
        user.value = null;
        isAuth.value = false;
        responseFromServer.value = null;
    }

    function handleError(error) {
        responseFromServer.value = error;
    }

    function setCookie(authData: AuthenticationData) {
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
        try {
            const res = await fetch(
                "https://directus.frontend.mu/auth/refresh",
                {
                    method: "POST",
                    credentials: "include", // this is required in order to send the refresh token cookie
                },
            );

            const response: { data: AuthenticationData } = await res.json();

            setCookie(response.data);
            getCurrentUser()
            setAuth(true)

            return response.data;
        } catch (error) {
            console.log(error)
        }
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
        oAuthLogin,
        isLoading
    }
}