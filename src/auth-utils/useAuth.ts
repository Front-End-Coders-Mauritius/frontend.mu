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

            const result = await client.login(email, password);
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
        const res = await fetch(
            "https://directus.frontend.mu/auth/refresh",
            {
                method: "POST",
                credentials: "include", // this is required in order to send the refresh token cookie
            },
        );

        const data = await res.json();
        console.log(data);
        // document.cookie = `access_token=${data.data.access_token}`;
        //   }

        // const refresh_token = getCookieValue("directus_refresh_token");

        // const res = await client.request(refresh('json', refresh_token));

        // setCookie(res);
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
        loginWithToken,
    }
}